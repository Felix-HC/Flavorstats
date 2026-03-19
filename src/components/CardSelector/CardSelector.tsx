import { Replace } from "lucide-react";
import { devlogIDs, projectIDs } from "../../consts";
import Card from "../../sites/Stats/components/Card/Card";

import './CardSelector.css'

type Category = "devlogs" | "projects";
type Size = "large" | "small";

type Props = {
    category: Category,
    setState: Function,
    size: Size,
    showSelector: Function
}

export default function CardSelector({ category, setState, size, showSelector }: Props) {
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
                :
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
            }
        </div>
    )
}