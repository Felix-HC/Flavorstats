import { Replace } from "lucide-react";
import { devlogIDs, projectIDs } from "../../consts";
import { useContext } from "react";
import { InformationContext } from "../../sites/Stats/Stats";
import { pluralize } from "../../utils";
import type { InformationObject } from "../../types";
import Card from "../../sites/Stats/components/Card/Card";

import './CardSelector.css'

type Category = "devlogs" | "projects" | "topProject";
type Size = "large" | "small";

type Props = {
    category: Category,
    setState: Function,
    size: Size,
    showSelector: Function
}

export default function CardSelector({ category, setState, size, showSelector }: Props) {
    const [information] = useContext<Array<InformationObject>>(InformationContext);

    const cardChild = (
        <>
            <div className="customizable-card-edit-overlay">
                <Replace
                    size={32}
                    strokeWidth={2.5}
                />
            </div>
        </>
    )

    return (
        <div className="card-selector">
            {category === "projects" ?
                projectIDs.map((id: any, index) => {
                    return (
                        <Card
                            id={id}
                            size={size}
                            key={index}
                            children={cardChild}
                            className="card-selector-card"
                            onClick={() => {setState(id); showSelector(false)}}
                        />
                    );
                })
                : category === "devlogs" ?
                devlogIDs.map((id: any, index) => {
                    return (
                        <Card
                            id={id}
                            size={size}
                            key={index}
                            children={cardChild}
                            className="card-selector-card"
                            onClick={() => {setState(id); showSelector(false)}}
                        />
                    )
                })
                :
                information.projects.map((project, index) => {
                    return (
                        <div className={`card card-selector-card top-project-card`} onClick={() => {setState(project); showSelector(false)}} key={index}>
                             <span className="card-first">{project.title}</span>
                             <span className="card-selector-top-project-stats"><span>{pluralize(project.devlogs.totalLikes, "like")} – {pluralize(project.devlogs.total, "devlog")} – {Math.floor((project.devlogs.totalTimeLogged / (60 * 60)) % 60)}h {Math.floor(project.devlogs.totalTimeLogged / 60 % 60)}m {Math.floor(project.devlogs.totalTimeLogged % 60)}s</span></span>
                             {cardChild}
                        </div>
                    )
                })
            }
        </div>
    )
}