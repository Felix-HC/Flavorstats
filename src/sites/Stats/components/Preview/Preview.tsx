import { useEffect, useRef, useState } from 'react'
import { Palette } from 'lucide-react'
import { generateCard } from '../../../../utils'
import Modal from '../../../../components/Modal/Modal'
import LayoutEditor from './components/LayoutEditor/LayoutEditor'

import './Preview.css'

type Props = {
    showModal: Function,
    information: any,
    extraInformation: any
}

export default function Preview({ showModal, information, extraInformation }: Props) {
    const canvas: any = useRef(null);
    const [showingLayoutEditor, showLayoutEditor] = useState(false);

    useEffect(() => {
        const getCard = async () => {
            const card = await generateCard(information, extraInformation, 1);
            canvas.current.innerHTML = "";
            canvas.current.append(card);
        }

        getCard();
    }, []);

    async function downloadCard() {
        const card: any = await generateCard(information, extraInformation, 2);

        const a: HTMLAnchorElement = document.createElement("a");
        a.download = `flavortown-${(information.displayName).toLowerCase()}.png`;
        a.href = card.toDataURL();
        a.click();

        // TODO: Alt Text, keep it rather short though!
    }

    return (
        <Modal id="preview" showModal={showModal}>
            <>
                <h2>Preview</h2>
                <div id="preview-content">
                    <div id="preview-canvas-container">
                        <div id="preview-canvas" ref={canvas} />
                        <div id="preview-canvas-image-format">PNG</div> {/* TODO: Make the format changable maybe? */}
                    </div>
                    <div id="preview-canvas-buttons">
                        <button id="preview-download-btn" onClick={() => downloadCard()}>Download</button>
                        <button id="preview-layout-btn" onClick={() => showLayoutEditor(true)}>
                            <span>Layout</span>
                            <Palette
                                size={32}
                                strokeWidth={2}
                            />
                        </button>
                    </div>
                </div>
                {showingLayoutEditor && <LayoutEditor showModal={showLayoutEditor} />}
            </>
        </Modal>
    )
}