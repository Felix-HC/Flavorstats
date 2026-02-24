import { useEffect, useRef, useState } from 'react';
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
        
        // Sort dates
        creationDates.sort((a: any, b: any) => {
            return a - b;
        });

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
            latestYear: creationDates[creationDates.length - 1].getFullYear()
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
                        <section id="stats-projects">
                            <h2>Projects</h2>
                            <span>{user.totalTimeSeconds} seconds</span><br />
                            <span>{(user.totalTimeSeconds / extraInformation.totalProjects).toFixed(1)} seconds/avg</span><br />

                            <span>{extraInformation.totalProjects} projects</span><br />
                            <span>{extraInformation.totalAI === 0 ? 0 : extraInformation.totalAI / extraInformation.totalProjects * 100}% AI-Usage</span><br />
                            <span>{extraInformation.totalShips === 0 ? 0 : (extraInformation.totalShips / extraInformation.totalProjects * 100).toFixed(1)}% shipped</span>< br/>
                            <span><b>TODO:</b> Top project</span>
                        </section>
                        <section id="stats-devlogs">
                            <h2>Devlogs</h2>
                            <span>{extraInformation.totalDevlogs} devlogs</span>
                            <span>{(extraInformation.totalChars / extraInformation.totalDevlogs).toFixed(1)} chars/avg</span><br />
                            <span>{(extraInformation.totalWords / extraInformation.totalDevlogs).toFixed(1)} words/avg</span><br />
                            <span>Most used word: {user.mostUsedWords[0]}</span><br />

                            <span>{extraInformation.totalLikes} likes</span><br/>
                            <span>{extraInformation.totalChars} chars</span><br />
                            <span>{extraInformation.totalWords} words</span><br />
                            <span>{extraInformation.totalComments} comments</span><br />
                        </section>
                    </main>
                </>
            }
        </div>
    )
}