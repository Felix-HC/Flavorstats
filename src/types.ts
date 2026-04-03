export type StatsID = "totalTimeSeconds" | "avgTime" | "totalProjects" | "totalShips" | "shipPercentage" | "cookies" | "totalDevlogs" | "avgChars" | "avgWords" | "favWord" | "totalLikes" | "avgLikes" | "totalComments" | "avgComments" | "totalChars" | "totalWords";

export type ImageFormat = "image/webp" | "image/jpg" | "image/jpeg" | "image/png";

export type InformationObject = {
    aiPercentage: number,
    avatar: string,
    avgChars: number,
    avgComments: number,
    avgLikes: number,
    avgTime: number,
    avgWords: number,
    cookies: number,
    displayName: string,
    earliestYear: number,
    favWord: string,
    latestYear: number,
    likeCount: number,
    loggedTimeArray: Map<string, Array<number>>,
    mostDevlogs: Array<number>,
    mostUsedWords: Array<Array<any>>,
    projects: Array<ProjectObject>
    shipPercentage: number,
    topProject: Object,
    totalAI: number,
    totalChars: number,
    totalComments: number,
    totalDevlogs: number,
    totalLikes: number,
    totalProjects: number,
    totalShips: number,
    totalTimeSeconds: number,
    totalWords: number,
    voteCount: number
}

type ProjectObject = {
    title: string,
    description: string,
    creationDate: string,
    shipped: boolean,
    usedAI: boolean,
    devlogs: DevlogsObject
}

type DevlogsObject = {
    total: number,
    totalTimeLogged:number,
    totalLikes: number,
    totalComments: number,
    totalChars: number,
    totalWords: number,
    dates: Array<DateObject>
}

type DateObject = {
    date: string,
    timeLogged: number
}