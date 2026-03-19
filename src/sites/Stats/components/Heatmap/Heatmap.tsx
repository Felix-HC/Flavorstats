import { useContext } from 'react'
import { calcTime, pluralize } from '../../../../utils'
import { TooltipContext } from '../../Stats'

import './Heatmap.css'

type Props = {
    information: any
    splice?: number
}

export default function Heatmap({ information, splice } : Props) {
    const [tooltip, setTooltip] = useContext(TooltipContext)
    const loggedTimeArray: any = [...information.loggedTimeArray.entries()];
    splice && loggedTimeArray.splice(0, (loggedTimeArray.length - splice));
    

    return (
        <div className="heatmap">
            <div className="heatmap-grid" onMouseLeave={() => setTooltip(undefined)}>
                {
                    [...loggedTimeArray].map((devlog, index) => {
                        return <div key={index} onMouseEnter={() => setTooltip(`${pluralize(devlog[1][0], "devlog")} (${calcTime(devlog[1][1]).join(" ")})`)} style={{ background: `color-mix(in srgb, var(--green) ${(devlog[1][0] / information.mostDevlogs[0]) * 100}%, transparent ${100 - (devlog[1][0] / information.mostDevlogs[0]) * 100}%)` }} />
                    })
                }
            </div>
        </div>
    )
}