import { createContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, House } from 'lucide-react';
import { generateCard } from '../../utils';
import { getDefaultLayoutJSON } from '../../consts';
import { toast, ToastContainer } from 'react-toastify';
import type { InformationObject } from '../../types';
import sampleData from "../../assets/sample-data.json"
import Card from './components/Card/Card';
import ChefHat from '../../assets/chef-hat.webp';
import Preview from './components/Preview/Preview';
import Heatmap from './components/Heatmap/Heatmap';
import TopProject from './components/TopProject/TopProject';

import './Stats.css'

export const TooltipContext = createContext<any | undefined>(undefined);
export const InformationContext = createContext<any | undefined>(undefined);

export default function Stats() {
    const [error, setError] = useState<string | undefined>(undefined);
    const [tooltip, setTooltip] = useState<string | undefined>(undefined);
    const [mouseX, setMouseX] = useState<number>(0);
    const [mouseY, setMouseY] = useState<number>(0);
    const [showingPreview, showPreview] = useState(false);
    const [information, setInformation] = useState<InformationObject | undefined>(undefined);
    
    const params = new URLSearchParams(document.location.search);
    const demo = params.get("demo");
    const userID = params.get("user");

    const backendURL: string = import.meta.env.VITE_REACT_APP_BACKEND_URL || "http://localhost";
    const backendPort: string = import.meta.env.VITE_REACT_APP_BACKEND_PORT || "5000";

    const navigate = useNavigate();

    const hasMounted = useRef(false);
    useEffect(() => {
        window.addEventListener("mousemove", (ev: MouseEvent) => {
            setMouseX(ev.clientX);
            setMouseY(ev.clientY);
        });

        if (demo) {
            const extraInformation = getExtraInformation(sampleData);
            setInformation(Object.assign(sampleData, extraInformation));
            return;
        }

        if (!hasMounted.current) {
            fetch(`${backendURL}:${backendPort}/stats?user=${userID}`)
                .then(response => response.json())
                .then(data => {
                    const extraInformation = getExtraInformation(data);
                    setInformation(Object.assign(data, extraInformation));
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

        const earliestDevlogDate = new Date(allDevlogs[0]?.date);
        const latestDevlogDate = new Date(allDevlogs[allDevlogs.length - 1]?.date);
        const dayMillisec = 24 * 60 * 60 * 1000; // A day in milliseconds
        const allDates = [];
        for (let i = earliestDevlogDate; i < latestDevlogDate; i = new Date(i.getTime() + dayMillisec)) {
            allDates.push(i);
        }

        // Get devlog dates + logged time on that date
        const datesMap: Map<string, Array<number>> = new Map(); // The number is the time logged **ON** that date! (in seconds)
        projects.forEach((project: any) => {
            const dates = project.devlogs.dates;
            dates.forEach((date: any) => {
                const shortDate: string = date.date.split("T")[0];
                date.timeLogged !== 0 && datesMap.set(shortDate, [(datesMap.get(shortDate)?.[0] || 0) + 1, (datesMap.get(shortDate)?.[1] || 0) + date.timeLogged]);
            });
        });
        allDates.forEach((date: Date) => {
            const shortDate: string = date.toISOString().split("T")[0];
            datesMap.get(shortDate) === undefined && datesMap.set(shortDate, [0, 0]);
        });
        
        const sortedDatesMap = new Map([...datesMap.entries()].sort((a: any, b: any) => {
            return new Date(a[0]).getTime() - new Date(b[0]).getTime();
        }));

        // Get date with most amount of devlogs so I can colorize with that as 100% opacity
        const sortedDatesByAmount = [...datesMap.values()].sort((a: any, b: any) => {
            return b[0] - a[0];
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
            mostDevlogs: sortedDatesByAmount[0],

            avgTime: data.totalTimeSeconds / projects.length,
            avgChars: Math.floor(totalChars / devlogs),
            avgWords: Math.floor(totalWords / devlogs),
            avgLikes: Number((totalReceivedLikes / devlogs).toFixed(1)),
            avgComments: Number((totalReceivedComments / devlogs).toFixed(1)),
            favWord: data.mostUsedWords[0][0],
            shipPercentage: Math.round(ships / projects.length * 100),
            aiPercentage: Math.round(usedAI / projects.length * 100)
        }

        return extraInformation;
    }

    async function downloadCard() {
        const card: any = await generateCard(information, 2, getDefaultLayoutJSON(information?.topProject || {}));

        const a: HTMLAnchorElement = document.createElement("a");
        if (information !== undefined) {
            a.download = `flavortown-${(information.displayName).toLowerCase()}.png`;
            a.href = card.toDataURL();
            a.click();
            toast.info("Customization is currently unsupported on mobile");
        }
    }

    if (error !== undefined) {
        return (
            <div id="stats">
                <div id="stats-error-wrapper">
                    <h2>Oop.</h2>
                    <span id="stats-error">{error} :/</span>
                    <span>I might be getting rate-limited. Try again in ~1 minute or use pre-defined data using the "Demo" button below.</span>
                    <div>
                        <button onClick={() => {navigate("/stats?demo=true"); location.reload();}}>Demo</button>
                        <button onClick={() => navigate("/")}>Home</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <InformationContext value={[information, setInformation]}>
            <TooltipContext value={[tooltip, setTooltip]}>
                <div id="stats">
                    {(information === undefined && information === undefined) &&
                        <span id="stats-loading">Loading...</span>
                    }
                    {(information !== undefined && information !== undefined) &&
                        <>
                            <header>
                                <div className="stats-header-left">
                                    <div className="avatar">
                                        <img className="avatar-hat" src={ChefHat} />
                                        <img className="avatar-img" src={information.avatar} />
                                    </div>
                                    <div>
                                        <h1>{information.displayName}'s Flavortown</h1>
                                        <span>{information.earliestYear === information.latestYear ? information.earliestYear : information.earliestYear + "/" + information.latestYear}</span>
                                    </div>
                                </div>
                                <button onClick={() => navigate("/")}>
                                    <House
                                        size={60}
                                    />
                                </button>
                                
                            </header>
                            <main>
                                <div className="stats-row">
                                    <section id="stats-projects">
                                        <h2>Projects</h2>
                                        <div>
                                            <div>
                                                <Card
                                                    id="totalTimeSeconds"
                                                    size="large"
                                                />
                                                <Card
                                                    id="avgTime"
                                                    size="large"
                                                />
                                            </div>
                                            <div className="projects-grid">
                                                <Card
                                                    id="totalProjects"
                                                />
                                                <Card
                                                    id="totalShips"
                                                />
                                                <Card
                                                    id="shipPercentage"
                                                />
                                                <Card
                                                    id="cookies"
                                                />
                                            </div>
                                        </div>
                                    </section>
                                    <section id="top-project">
                                        <h2>Top Project</h2>
                                        <TopProject project={information.topProject} />
                                    </section>
                                </div>
                                <div className="stats-row">
                                    <section>
                                        <h2>Devlogs</h2>
                                        <div>
                                            <div>
                                                <Card
                                                    id="totalDevlogs"
                                                    size="large"
                                                />
                                                <Card
                                                    id="avgChars"
                                                    size="large"
                                                />
                                                <Card
                                                    id="avgWords"
                                                    size="large"
                                                />
                                                <Card
                                                    id="favWord"
                                                    size="large"
                                                />
                                            </div>
                                            <div>
                                                <Card
                                                    id="totalLikes"
                                                />
                                                <Card
                                                   id="totalComments"
                                                />
                                                <Card
                                                    id="totalChars"
                                                />
                                                <Card
                                                    id="totalWords"
                                                />
                                            </div>
                                        </div>
                                    </section>
                                    <section>
                                        <h2>Heatmap</h2>
                                        <Heatmap information={information} />
                                    </section>
                                </div>
                                <button id="download-card-btn" onClick={() => window.innerWidth > 700 ? showPreview(true) : downloadCard()}>
                                    <span>Download Card</span>
                                    <Download
                                        size={32}
                                        strokeWidth={2.2}
                                    />
                                </button>
                            </main>
                            {showingPreview && <Preview showModal={showPreview} information={information} />}
                            {tooltip !== undefined && <div id="tooltip" style={{left: mouseX + 10, top: mouseY - 30}}><span>{tooltip}</span></div>}
                        </>
                    }
                </div>
                <ToastContainer
                    position="top-right"
                    theme="light"
                    newestOnTop={true}
                    closeOnClick={true}
                    autoClose={3000}
                />
            </TooltipContext>
        </InformationContext>
    )
}