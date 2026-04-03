import { Pen } from "lucide-react";
import type { StatsID } from "../../../../../../../../types";
import { statsInfo } from "../../../../../../../../utils";
import { useState } from "react";
import translation from "../../../../../../../../translations/en_us.json";
import CardSelector from "../../../../../../../../components/CardSelector/CardSelector";

import './CustomizableCard.css'
import TopProject from "../../../../../TopProject/TopProject";

type Category = "projects" | "devlogs" | "topProject";
type Sizes = "small" | "large";

type Props = {
    category: Category,
    size: Sizes,
    state: StatsID,
    setState: Function
}

export default function CustomizableCard({ state, setState, category, size }: Props) {
    const [showingCardSelector, showCardSelector] = useState(false);
    const trans: any = translation;

    const overlay =
        <>
            <div className="customizable-card-edit-overlay">
                <Pen
                    size={32}
                    strokeWidth={2.5}
                />
            </div>
        </>;

    return (
        <>
            {category === "topProject" &&
                <TopProject
                    project={state}
                    children={overlay}
                    style={{ zIndex: showingCardSelector ? 2 : 0 }}
                    onClick={() => showCardSelector(true)}
                    className="customizable-card"
                />
            }
            {category !== "topProject" &&
                <div className="customizable-card card" style={{ zIndex: showingCardSelector ? 2 : 0 }} onClick={() => showCardSelector(true)}>
                    <span className="card-first">{size === "large" ? trans[state][0] : statsInfo(state)}</span>
                    {size === "large" &&
                        <>
                            <div className="divider" />
                            <span className="card-second">{statsInfo(state)}</span>
                        </>
                    }
                    {overlay}
                </div>
            }
            {showingCardSelector &&
                <>
                    <div className="card-selector-bg" onClick={() => showCardSelector(false)} />
                    <CardSelector
                        category={category}
                        setState={setState}
                        size="large"
                        showSelector={showCardSelector}
                    />
                </>
            }
        </>
    )
}