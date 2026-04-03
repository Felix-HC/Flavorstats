export const getDefaultLayoutJSON = (topProject: Object) => {
    return (
        {
            projects: {
                1: "totalTimeSeconds",
                2: "avgTime",
                3: "totalProjects",
                4: "totalShips"
            },

            devlogs: {
                1: "totalDevlogs",
                2: "avgChars",
                3: "favWord",
                4: "totalLikes",
                5: "totalComments",
                6: "totalChars",
                7: "totalWords"
            },

            topProject: topProject
        }
    )
}

export const projectIDs = ["totalTimeSeconds", "avgTime", "cookies", "totalProjects", "totalShips", "shipPercentage", "aiPercentage"];
export const devlogIDs = ["totalDevlogs", "avgChars", "avgWords", "favWord", "totalLikes", "avgLikes", "totalComments", "avgComments", "totalChars", "totalWords"];