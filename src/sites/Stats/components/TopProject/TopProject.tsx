import { pluralize } from '../../../../utils'
import './TopProject.css'

type Props = {
    extraInformation: any
}

export default function TopProject({ extraInformation } : Props) {
    return (
        <div className="top-project-card card">
            <span className="top-project-title"><span className="noto-emoji">✨</span> {extraInformation.topProject.title}</span>
            <span className="top-project-description">{extraInformation.topProject.description}</span>
            <div className="divider" />
            <span className="top-project-stats"><span>{pluralize(extraInformation.topProject.devlogs.totalLikes, "like")} – {pluralize(extraInformation.topProject.devlogs.total, "devlog")} – {Math.floor((extraInformation.topProject.devlogs.totalTimeLogged / (60 * 60)) % 60)}h {Math.floor(extraInformation.topProject.devlogs.totalTimeLogged / 60 % 60)}m {Math.floor(extraInformation.topProject.devlogs.totalTimeLogged % 60)}s</span></span>
        </div>
    )
}