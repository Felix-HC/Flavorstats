import './Card.css'

type Props = {
    firstContent: string,
    secondContent?: string
}

export default function Card({ firstContent, secondContent } : Props) {
    return (
        <div className="card">
            <span className="card-first">{firstContent}</span>
            {secondContent &&
                <>
                    <div className="divider" />
                    <span className="card-second">{secondContent}</span>
                </>
            }
        </div>
    )
}