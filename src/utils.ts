export function calcTime(seconds: number) {
    const returnArray: Array<string> = [];
    
    seconds >= 31579165.44 && returnArray.push(Math.floor(seconds / (60 * 60 * 24 * 30.4583 * 12)) + "y");
    seconds >= 2631597.1200 && returnArray.push(Math.floor((seconds / (60 * 60 * 24 * 30.4583) % 12)) + "m");
    seconds >= 86400 && returnArray.push(Math.floor((seconds / (60 * 60 * 24)) % 30.4583) + "d");
    seconds >= 3600 && returnArray.push(Math.floor((seconds / (60 * 60)) % 24) + "h");
    seconds >= 60 && returnArray.push(Math.floor((seconds / 60) % 60) + "m")
    returnArray.push(Math.floor((seconds) % 60) + "s");
    
    return returnArray;
}