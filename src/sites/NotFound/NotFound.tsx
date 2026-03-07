import { useNavigate } from 'react-router-dom'

import './NotFound.css'

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div id="not-found">
            <main>
                <h2>404 - Not Found ( ◕ ʖ̯ ◕ )</h2>
                <button onClick={() => navigate("/")}>Home</button>
            </main>
        </div>
    )
}