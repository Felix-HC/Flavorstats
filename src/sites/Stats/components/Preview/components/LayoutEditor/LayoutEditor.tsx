import { useState } from "react"
import type { StatsID } from "../../../../../../types"
import ChefHat from "../../../../../../assets/chef-hat.webp"
import Modal from '../../../../../../components/Modal/Modal'
import Heatmap from "../../../Heatmap/Heatmap"
import TopProject from "../../../TopProject/TopProject"
import CustomizableCard from "./components/CustomizableCard/CustomizableCard"

import './LayoutEditor.css'

type Props = {
    showModal: Function,
    user: any,
    extraInformation: any,
    JSONLayout: any,
    setJSONLayout: Function
}

export default function LayoutEditor({ showModal, user, extraInformation, JSONLayout, setJSONLayout }: Props) {
    const [projects1, setProjects1] = useState<StatsID>(JSONLayout.projects["1"]);
    const [projects2, setProjects2] = useState<StatsID>(JSONLayout.projects["2"]);
    const [projects3, setProjects3] = useState<StatsID>(JSONLayout.projects["3"]);
    const [projects4, setProjects4] = useState<StatsID>(JSONLayout.projects["4"]);

    const [devlogs1, setDevlogs1] = useState<StatsID>(JSONLayout.devlogs["1"]);
    const [devlogs2, setDevlogs2] = useState<StatsID>(JSONLayout.devlogs["2"]);
    const [devlogs3, setDevlogs3] = useState<StatsID>(JSONLayout.devlogs["3"]);
    const [devlogs4, setDevlogs4] = useState<StatsID>(JSONLayout.devlogs["4"]);
    const [devlogs5, setDevlogs5] = useState<StatsID>(JSONLayout.devlogs["5"]);
    const [devlogs6, setDevlogs6] = useState<StatsID>(JSONLayout.devlogs["6"]);
    const [devlogs7, setDevlogs7] = useState<StatsID>(JSONLayout.devlogs["7"]);

    function generateJSON() {
        return {
            projects: {
                "1": projects1,
                "2": projects2,
                "3": projects3,
                "4": projects4
            },

            devlogs: {
                "1": devlogs1,
                "2": devlogs2,
                "3": devlogs3,
                "4": devlogs4,
                "5": devlogs5,
                "6": devlogs6,
                "7": devlogs7,
            }
        }
    }

    return (
        <Modal id="layout-editor" showModal={showModal}>
            <>
                <h2>Layout Editor</h2>
                <div id="layout-editor-content">
                    <div className="stats-header-left">
                        <div className="avatar">
                            <img className="avatar-hat" src={ChefHat} />
                            <img className="avatar-img" src={user.avatar} />
                        </div>
                        <div>
                            <h1>{user.displayName}'s Flavortown</h1>
                            <span>{extraInformation.earliestYear === extraInformation.latestYear ? extraInformation.earliestYear : extraInformation.earliestYear + "/" + extraInformation.latestYear}</span>
                        </div>
                    </div>
                    <div id="preview-main">
                        <div className="stats-row">
                            <section className="stats-projects">
                                <h2>Projects</h2>
                                <div>
                                    <div>
                                        <CustomizableCard
                                            size="large"
                                            category="projects"
                                            state={projects1}
                                            setState={setProjects1}
                                        />
                                        <CustomizableCard
                                            size="large"
                                            category="projects"
                                            state={projects2}
                                            setState={setProjects2}
                                        />
                                    </div>
                                    <div className="projects-grid">
                                        <CustomizableCard
                                            size="small"
                                            category="projects"
                                            state={projects3}
                                            setState={setProjects3}
                                        />
                                        <CustomizableCard
                                            size="small"
                                            category="projects"
                                            state={projects4}
                                            setState={setProjects4}
                                        />
                                    </div>
                                </div>
                            </section>
                            <section className="top-project">
                                <h2>‎ </h2>
                                <TopProject extraInformation={extraInformation} />
                            </section>
                        </div>
                        <div className="stats-row">
                            <section>
                                <h2>Devlogs</h2>
                                <div>
                                    <div>
                                        <CustomizableCard
                                            size="large"
                                            category="devlogs"
                                            state={devlogs1}
                                            setState={setDevlogs1}
                                        />
                                        <CustomizableCard
                                            size="large"
                                            category="devlogs"
                                            state={devlogs2}
                                            setState={setDevlogs2}
                                        />
                                        <CustomizableCard
                                            size="large"
                                            category="devlogs"
                                            state={devlogs3}
                                            setState={setDevlogs3}
                                        />
                                    </div>
                                    <div>
                                        <div className="devlogs-grid">
                                            <CustomizableCard
                                                size="small"
                                                category="devlogs"
                                                state={devlogs4}
                                                setState={setDevlogs4}
                                            />
                                            <CustomizableCard
                                                size="small"
                                                category="devlogs"
                                                state={devlogs5}
                                                setState={setDevlogs5}
                                            />
                                            <CustomizableCard
                                                size="small"
                                                category="devlogs"
                                                state={devlogs6}
                                                setState={setDevlogs6}
                                            />
                                            <CustomizableCard
                                                size="small"
                                                category="devlogs"
                                                state={devlogs7}
                                                setState={setDevlogs7}
                                            />
                                        </div>
                                        <Heatmap information={extraInformation} splice={11 * 5} />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                <button id="layout-editor-save" onClick={() => {showModal(false); setJSONLayout(generateJSON())}}>Save</button>
            </>
        </Modal>
    )
}