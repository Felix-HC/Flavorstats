import type { StatsID } from '../../../../types'
import { statsInfo } from '../../../../utils';
import { useContext, type ReactElement } from 'react';
import { InformationContext } from '../../Stats';
import translation from "../../../../translations/en_us.json"

import './Card.css'

type Size = "small" | "large";

type Props = {
    id: StatsID,
    size?: Size,
    children?: ReactElement,
    className?: string,
    onClick?: any
}

export default function Card({ id, size, children, className, onClick } : Props) {
    const [information] = useContext(InformationContext);
    const trans: any = translation;

    return (
        <div className={`card ${className ? className : ""}`} onClick={onClick && onClick}>
            <span className="card-first">{size === "large" ? trans[id][0] : statsInfo(id, information)}</span>
            {size === "large" &&
                <>
                    <div className="divider" />
                    <span className="card-second">{statsInfo(id, information)}</span>
                </>
            }
            {children && children}
        </div>
    )
}