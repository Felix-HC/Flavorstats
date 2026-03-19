import { useEffect, useRef, useState } from 'react'
import { Palette } from 'lucide-react'
import { generateCard } from '../../../../utils'
import { defaultLayoutJSON } from '../../../../consts'
import Modal from '../../../../components/Modal/Modal'
import LayoutEditor from './components/LayoutEditor/LayoutEditor'

import './Preview.css'

type Props = {
    showModal: Function,
    information: any
}

export default function Preview({ showModal, information }: Props) {
    const canvas: any = useRef(null);
    const [showingLayoutEditor, showLayoutEditor] = useState(false);
    const [JSONLayout, setJSONLayout] = useState(defaultLayoutJSON);

    useEffect(() => {
        const getCard = async () => {
            const card = await generateCard(information, 1, JSONLayout);
            canvas.current.innerHTML = "";
            canvas.current.append(card);
        }

        getCard();
    }, [JSONLayout]);

    async function downloadCard() {
        const card: any = await generateCard(information, 2, JSONLayout);

        const a: HTMLAnchorElement = document.createElement("a");
        a.download = `flavortown-${(information.displayName).toLowerCase()}.png`;
        a.href = card.toDataURL();
        a.click();
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
                {showingLayoutEditor && <LayoutEditor showModal={showLayoutEditor} user={information} extraInformation={information} JSONLayout={JSONLayout} setJSONLayout={setJSONLayout} />}
            </>
        </Modal>
    )
}