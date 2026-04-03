import type { ReactElement } from 'react'
import { pluralize } from '../../../../utils'
import './TopProject.css'

type Props = {
    project: any,
    children?: ReactElement,
    style?: any,
    onClick?: Function,
    className?: string
}

export default function TopProject({ project, children, style, onClick, className } : Props) {
    return (
        <div className={`top-project-card card ${className && className}`} style={style} onClick={() => {onClick !== undefined && onClick()}}>
            <span className="top-project-title"><span className="noto-emoji">✨</span> {project.title}</span>
            <span className="top-project-description">{project.description}</span>
            <div className="divider" />
            <span className="top-project-stats"><span>{pluralize(project.devlogs.totalLikes, "like")} – {pluralize(project.devlogs.total, "devlog")} – {Math.floor((project.devlogs.totalTimeLogged / (60 * 60)) % 60)}h {Math.floor(project.devlogs.totalTimeLogged / 60 % 60)}m {Math.floor(project.devlogs.totalTimeLogged % 60)}s</span></span>
            {children}
        </div>
    )
}