import type { ReactElement } from 'react'

import './Model.css'

type Props = {
    children: ReactElement,
    showModal: Function,
    id: string,
    onClick?: Function
}

export default function Modal({ children, showModal, id, onClick } : Props) {
    return (
        <div className="modal" onClick={() => onClick ? onClick() : showModal()}>
            <div className="modal-content" id={id} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}