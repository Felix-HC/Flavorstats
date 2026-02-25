import { useEffect, useRef, useState } from 'react';
import Card from './components/Card/Card';
import ChefHat from '../../assets/chef-hat.webp';

import './Stats.css'

export default function Stats() {
    const [user, setUser] = useState<any | undefined>(undefined);
    const [extraInformation, setExtraInformation] = useState<any | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    const params = new URLSearchParams(document.location.search);
    const userID = params.get("user");

    const hasMounted = useRef(false);
    useEffect(() => {
        if (!hasMounted.current) {
            fetch(`http://localhost:5000/stats?user=${userID}`)
                .then(response => response.json())
                .then(data => {
                    setUser(data);
                    getExtraInformation(data);
                })
                .catch(error => {
                    console.error(error);
                    setError("Could not fetch user statistics");
                });
        }
        hasMounted.current = true;
    }, []);

    function getExtraInformation(data: any) {
        const projects = data.projects;
        let ships = 0;
        let usedAI = 0;
        let devlogs = 0;
        let totalReceivedLikes = 0;
        let totalReceivedComments = 0;
        let totalChars = 0;
        let totalWords = 0;

        const creationDates: Array<Date> = [];

        projects.forEach((project: any) => {
            project.shipped && ships++;
            project.usedAI && usedAI++;
            devlogs += project.devlogs.total || 0;
            totalReceivedLikes += project.devlogs.totalLikes || 0;
            totalReceivedComments += project.devlogs.totalComments || 0;
            totalChars += project.devlogs.totalChars || 0;
            totalWords += project.devlogs.totalWords || 0;

            creationDates.push(new Date(project.creationDate || 0));
        });

        const allDevlogs: Array<any> = [];
        projects.forEach((project: any) => {
            allDevlogs.push(...project.devlogs.dates)
        });
        allDevlogs.sort((a: any, b: any) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        allDevlogs.splice(allDevlogs.findIndex((e: any) => e.timeLogged === 0), 1);

        const earliestDevlogDate = new Date(allDevlogs[0].date);
        const latestDevlogDate = new Date(allDevlogs[allDevlogs.length - 1].date);
        const dayMillisec = 24 * 60 * 60 * 1000; // A day in milliseconds
        const allDates = [];
        for (let i = earliestDevlogDate; i < latestDevlogDate; i = new Date(i.getTime() + dayMillisec)) {
            allDates.push(i);
        }

        // Get devlog dates + logged time on that date
        const datesMap: Map<string, number> = new Map(); // The number is the time logged **ON** that date! (in seconds)
        projects.forEach((project: any) => {
            const dates = project.devlogs.dates;
            dates.forEach((date: any) => {
                const shortDate: string = date.date.split("T")[0];
                datesMap.set(shortDate, (datesMap.get(shortDate) || 0) + date.timeLogged);
            });
        });
        allDates.forEach((date: Date) => {
            const shortDate: string = date.toISOString().split("T")[0];
            datesMap.get(shortDate) === undefined && datesMap.set(shortDate, 0);
        });
        
        const sortedDatesMap = new Map([...datesMap.entries()].sort((a: any, b: any) => {
            return new Date(a[0]).getTime() - new Date(b[0]).getTime();
        }));
        // Get longest devlog (time) so I can colorize with that as 100% opacity
        const sortedDatesByTime = [...datesMap.values()].sort((a: any, b: any) => {
            return b - a;
        });
        
        // Sort dates
        creationDates.sort((a: any, b: any) => {
            return a - b;
        });

        // Get top project (sort -> get index 0)
        projects.sort((a: any, b: any) => b.devlogs.totalLikes - a.devlogs.totalLikes);
        const topProject = projects[0];

        const extraInformation = {
            totalProjects: projects.length,
            totalShips: ships,
            totalAI: usedAI,
            totalDevlogs: devlogs,
            totalLikes: totalReceivedLikes,
            totalComments: totalReceivedComments,
            totalChars: totalChars,
            totalWords: totalWords,
            earliestYear: creationDates[0].getFullYear(),
            latestYear: creationDates[creationDates.length - 1].getFullYear(),
            topProject: topProject,
            loggedTimeArray: sortedDatesMap,
            longestDevlog: sortedDatesByTime[0]
        }

        setExtraInformation(extraInformation);
    }

    if (error !== undefined) return <span>{error}</span>;

    return (
        <div id="stats">
            {(user === undefined && extraInformation !== undefined) && <span>Loading...</span>}
            {(user !== undefined && extraInformation !== undefined) &&
                <>
                    <header>
                        <div id="avatar">
                            <img id="avatar-hat" src={ChefHat} />
                            <img id="avatar-img" src={user.avatar} />
                        </div>
                        <div>
                            <h1>{user.displayName}'s Flavortown</h1>
                            <span>{extraInformation.earliestYear === extraInformation.latestYear ? extraInformation.earliestYear : extraInformation.earliestYear + "/" + extraInformation.latestYear}</span>
                        </div>
                    </header>
                    <main>
                        <div className="stats-row">
                            <section id="stats-projects">
                                <h2>Projects</h2>
                                <div>
                                    <div>
                                        <Card
                                            firstContent="Total Time"
                                            secondContent={
                                                user.totalTimeSeconds >= 3600 ?
                                                    `${(user.totalTimeSeconds / 60 / 60).toFixed(1)} hours`
                                                    :
                                                    `${(user.totalTimeSeconds / 60).toFixed(1)} minutes`
                                            }
                                        />
                                        <Card
                                            firstContent="Avg. Time"
                                            secondContent={
                                                user.totalTimeSeconds >= 3600 ?
                                                    `${(user.totalTimeSeconds / 60 / 60 / extraInformation.totalProjects).toFixed(1)} hours`
                                                    :
                                                    `${(user.totalTimeSeconds / 60 / extraInformation.totalProjects).toFixed(1)} minutes`
                                            }
                                        />
                                    </div>
                                    <div id="projects-grid">
                                        <Card
                                            firstContent={`${extraInformation.totalProjects} projects`}
                                        />
                                        <Card
                                            firstContent={`${extraInformation.totalAI === 0 ? 0 : extraInformation.totalAI / extraInformation.totalProjects * 100}% AI`}
                                        />
                                        <Card
                                            firstContent={`${extraInformation.totalShips} ships`}
                                        />
                                        <Card
                                            firstContent={`${extraInformation.totalShips === 0 ? 0 : (extraInformation.totalShips / extraInformation.totalProjects * 100)}% shipped`}
                                        />
                                    </div>
                                </div>
                            </section>
                            <section id="top-project">
                                <h2>Top Project</h2>
                                <div className="card">
                                    <span id="top-project-title"><span className="noto-emoji">✨</span> {extraInformation.topProject.title}</span>
                                    <span id="top-project-description">{extraInformation.topProject.description}</span>
                                    <div className="divider" />
                                    <span id="top-project-stats"><span>{extraInformation.topProject.devlogs.totalLikes} likes – {extraInformation.topProject.devlogs.total} devlogs – {Math.floor((extraInformation.topProject.devlogs.totalTimeLogged / (60 * 60)) % 60)}h {Math.floor(extraInformation.topProject.devlogs.totalTimeLogged / 60 % 60)}m {Math.floor(extraInformation.topProject.devlogs.totalTimeLogged % 60)}s</span></span>
                                </div>
                            </section>
                        </div>
                        <div className="stats-row">
                            <section>
                                <h2>Devlogs</h2>
                                <div>
                                    <div>
                                        <Card
                                            firstContent="Total Logs"
                                            secondContent={`${extraInformation.totalDevlogs} devlogs`}
                                        />
                                        <Card
                                            firstContent="Avg. Chars"
                                            secondContent={`${Math.floor(extraInformation.totalChars / extraInformation.totalDevlogs)} chars`}
                                        />
                                        <Card
                                            firstContent="Avg. Words"
                                            secondContent={`${Math.floor(extraInformation.totalWords / extraInformation.totalDevlogs)} words`}
                                        />
                                        <Card
                                            firstContent="Fav. Words"
                                            secondContent={`"${user.mostUsedWords[0][0]}"`}
                                        />
                                    </div>
                                    <div>
                                        <Card
                                            firstContent={`${extraInformation.totalLikes} likes`}
                                        />
                                        <Card
                                            firstContent={`${extraInformation.totalComments} comments`}
                                        />
                                        <Card
                                            firstContent={`${extraInformation.totalChars} chars`}
                                        />
                                        <Card
                                            firstContent={`${extraInformation.totalWords} words`}
                                        />
                                    </div>
                                </div>
                            </section>
                            <section>
                                <h2>Heatmap</h2>
                                <div id="heatmap">
                                    <div id="heatmap-grid">
                                        {
                                            [...extraInformation.loggedTimeArray.entries()].map((devlog, index) => {
                                                return <div className={devlog[0]} key={index} style={{background: `color-mix(in srgb, var(--green) ${(devlog[1] / extraInformation.longestDevlog) * 100}%, transparent ${100 - (devlog[1] / extraInformation.longestDevlog) * 100}%)`}} />
                                            })
                                        }
                                    </div>
                                </div>
                            </section>
                        </div>
                    </main>
                </>
            }
        </div>
    )
}