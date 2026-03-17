import type { ReactElement } from 'react'

import './Model.css'

type Props = {
    children: ReactElement,
    showModal: Function,
    id: string
}

export default function Modal({ children, showModal, id } : Props) {
    return (
        <div className="modal" onClick={() => showModal(false)}>
            <div className="modal-content" id={id} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}