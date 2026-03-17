import Modal from '../../../../../../components/Modal/Modal'

import './LayoutEditor.css'

type Props = {
    showModal: Function
}

export default function LayoutEditor({ showModal } : Props) {
    return (
        <Modal id="layout-editor" showModal={showModal}>
            <>
                <h2>Layout Editor</h2>
                <div id="layout-editor-content">
                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, at nostrum totam ullam alias molestiae ad veritatis accusamus rem eos quo facere molestias dicta non ipsa. Rerum amet deserunt fugit?</span>
                </div>
            </>
        </Modal>
    )
}