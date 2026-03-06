import ChefHat from "./assets/chef-hat.webp";

const cssStyles = getComputedStyle(document.body);

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

export async function generateCard(information: any, extraInformation: any) {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.height = 1000;
    canvas.width = 1000;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

    if (ctx !== null) {
        // Set background color
        ctx.fillStyle = cssStyles.getPropertyValue("--base");
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        const avatar: HTMLImageElement = new Image();
        avatar.src = information.avatar;
        avatar.onload = () => {
            // Create circular clipping region
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 25;
            ctx.strokeStyle = cssStyles.getPropertyValue("--red");
            ctx.arc(150, 150, 75, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
            ctx.clip();

            // Draw profile picture
            const imageData = avatar;
            ctx.drawImage(imageData, 75, 75, 150, 150);
            ctx.restore();

            // Draw Chef Hat
            const image = new Image();
            image.src = ChefHat;
            ctx.drawImage(image, 20, -20, 200, 200);

            // Draw name
            ctx.fillStyle = cssStyles.getPropertyValue("--text-2");
            ctx.textBaseline = "middle";
            ctx.font = "54px Jua";
            ctx.fillText(`${information.displayName}'s Flavortown`, 275, 136, 650);

            // Draw years
            ctx.font = "24px Jua";
            ctx.fillText(`${extraInformation.earliestYear === extraInformation.latestYear ? extraInformation.earliestYear : extraInformation.earliestYear}/${extraInformation.latestYear}`, 275, 179);

            /// Projects
            ctx.font = "32px Jua";
            // Draw total time / avg. time / amount of projects / number of ships
            ctx.fillText("Projects", 62.5, 280)

            drawCard(ctx, 62.5, 305,
                "Total Time",
                information.totalTimeSeconds >= 3600 ? `${(information.totalTimeSeconds / 60 / 60).toFixed(1)} hours` : `${(information.totalTimeSeconds / 60).toFixed(1)} minutes`
            );

            drawCard(ctx, 62.5 + 225 + 20, 305,
                "Avg. Time",
                information.totalTimeSeconds >= 3600 ? 
                    `${(information.totalTimeSeconds / 60 / 60 / extraInformation.totalProjects).toFixed(1)} hours` 
                    :
                    `${(information.totalTimeSeconds / 60 / extraInformation.totalProjects).toFixed(1)} minutes`
            );

            drawCard(ctx, 62.5, 305 + 116 + 20,
                `${extraInformation.totalProjects} projects`
            );

            drawCard(ctx, 62.5 + 225 + 20, 305 + 116 + 20,
                `${extraInformation.totalAI === 0 ? 0 : Math.floor(extraInformation.totalAI / extraInformation.totalProjects * 100)}% AI`
            );

            /// Draw Top Project
            const topX = 552.5;
            const topY = 305;
            const topWidth = 375;
            // Description
            const topDescLines: Array<string> = [];
            const topDesc: Array<string> = (extraInformation.topProject.description).split(" ");
            let topDescLine: number = 0;
            topDesc.forEach(word => {
                const topDescLineWidth = ctx.measureText(topDescLines[topDescLine] + word).width;
                if (topDescLines[topDescLine] === undefined) {
                    topDescLines[topDescLine] = word;
                } else if (topDescLineWidth < topWidth - 20) {
                    topDescLines[topDescLine] = topDescLines[topDescLine] += ` ${word}`;
                } else {
                    topDescLine++;
                    topDescLines[topDescLine] = word;
                }
            });
            topDescLines.splice(3);

            const topHeight = 125 + (24 * topDescLines.length);
            drawCard(ctx, topX, topY, undefined, undefined, topWidth, topHeight);

            ctx.textBaseline = "middle";
            ctx.font = "24px Jua";
            ctx.fillStyle = cssStyles.getPropertyValue("--text-3");
            for (let i = 0; i < topDescLines.length; i++) {
                const lineText = i !== 2 ? topDescLines[i] : `${topDescLines[i].substring(0, topDescLines[i].length - 3)}...`;
                ctx.fillText(lineText, topX + 10, topY + 72 + i * 30, topWidth - 20);
            }

            // Title
            ctx.fillStyle = cssStyles.getPropertyValue("--text-2");
            ctx.font = "1000 32px Noto Emoji";
            ctx.fillText("✨", topX + 10, topY + 31);
            ctx.font = "32px Jua";
            
            let topProjectTitle: string = extraInformation.topProject.title;
            const topProjectTitleTextWidth: number = ctx.measureText(topProjectTitle).width;
            if (topProjectTitleTextWidth > topWidth - 20) {
                const charWidth: number = topProjectTitleTextWidth / topProjectTitle.length;
                topProjectTitle = `${topProjectTitle.substring(0, Math.floor(topWidth - 20 / charWidth) - 4)}...`;
            }
            ctx.fillText(topProjectTitle, topX + 40 + 20, topY + 32, topWidth - 10 - 60);

            // Divider
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(topX + 10, topY + topHeight - 45);
            ctx.lineTo(topX + topWidth - 10, topY + topHeight - 45);
            ctx.stroke();
            ctx.closePath();
            // Stats
            ctx.textBaseline = "hanging";
            ctx.font = "24px Jua";
            ctx.fillText(
                `${extraInformation.topProject.devlogs.totalLikes} likes – ${extraInformation.topProject.devlogs.total} devlogs – ${Math.floor((extraInformation.topProject.devlogs.totalTimeLogged / (60 * 60)) % 60)}h ${Math.floor(extraInformation.topProject.devlogs.totalTimeLogged / 60 % 60)}m ${Math.floor(extraInformation.topProject.devlogs.totalTimeLogged % 60)}s`,
                topX + 10,
                topY + topHeight - 30,
                topWidth - 20
            );
            ctx.textBaseline = "middle";

            /// Devlogs
            ctx.font = "32px Jua";
            // Draw total time / avg. time / amount of projects / number of ships
            ctx.fillText("Devlogs", 62.5, 550);
            drawCard(ctx, 62.5, 575,
                "Total Logs",
                `${extraInformation.totalDevlogs} devlogs`
            );

            drawCard(ctx, 62.5 + 225 + 20, 575,
                "Avg. Chars",
                `${Math.floor(extraInformation.totalChars / extraInformation.totalDevlogs)} chars`
            );

            drawCard(ctx, 62.5 + ((225 + 20) * 2), 575,
                "Fav. Word",
                `"${information.mostUsedWords[0][0]}"`
            );
            
            drawCard(ctx, 62.5, 575 + 116 + 20,
                `${extraInformation.totalLikes} likes`
            );

            drawCard(ctx, 62.5, 575 + 116 + 63 + 40,
                `${extraInformation.totalComments} comments`
            );

            drawCard(ctx, 62.5 + 225 + 20, 575 + 116 + 20,
                `${extraInformation.totalChars} chars`
            );

            drawCard(ctx, 62.5 + 225 + 20, 575 + 116 + 63 + 40,
                `${extraInformation.totalWords} words`
            );

            /// Heatmap
            drawHeatmap(ctx, extraInformation, 62.5 + ((225 + 20) * 2), 575 + 116 + 20);

            // Download
            const a: HTMLAnchorElement = document.createElement("a"); 
            a.download = `flavortown-${(information.displayName).toLowerCase()}.png`;
            a.href = canvas.toDataURL();
            a.click();
        }
    }
}

function drawHeatmap(ctx: CanvasRenderingContext2D, extraInformation: any, x: number, y: number) {
    const points: Array<number> = [];
    [...extraInformation.loggedTimeArray.entries()].forEach((date) => {
        points.push(date[1][0]);
    });
    if (points.length > 11 * 5) {
        points.splice(12, points.length - 11 * 5);
    }

    const rows = 5;
    const columns = Math.ceil(points.length / rows);
    const maxDevlogs = extraInformation.mostDevlogs[0];

    const width = 30 + (columns * 35) > 375 ? 30 + (columns * 35) : 375;
    drawCard(ctx, x, y, undefined, undefined, width, 200);

    ctx.strokeStyle = cssStyles.getPropertyValue("--overlay");
    ctx.lineWidth = .5;

    points.forEach((point, index) => {
        const pointX = (x + 15) + Math.floor(index / rows) * 35;
        const pointY = (y + 15) + Math.floor(index % rows) * 35;

        ctx.fillStyle = hexToRGBA(cssStyles.getPropertyValue("--green"), point / maxDevlogs);
        ctx.beginPath();
        ctx.roundRect(pointX, pointY, 30, 30, 4);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    });
}

function drawCard(ctx: CanvasRenderingContext2D, x: number, y: number, firstContent?: string, secondContent?: string, width?: number, height?: number) {
    const size = (firstContent && secondContent) ? "large" : (firstContent || secondContent) ? "small" : "custom";
    width = width || 225;
    height = height || 63;

    if (size === "large") height = 116; 

    // Draw Rectangle
    ctx.shadowColor = "#00000040";
    ctx.shadowBlur = 2;
    ctx.fillStyle = cssStyles.getPropertyValue("--overlay-2");
    ctx.textBaseline = "middle";
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 8);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    // Draw Text
    ctx.fillStyle = cssStyles.getPropertyValue("--text-2");
    let textWidth;
    switch(size) {
        case "small":
            textWidth = ctx.measureText(firstContent || "").width;
            ctx.fillText(firstContent || "", x + (225 - textWidth) / 2, y + 31.5, 255 - 10); // firstContent should never be undefined here, but I'm not gonna risk it for the biscuit (there is no biscuit)
            break;
        case "large":
            // Draw stroke in the middle
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = cssStyles.getPropertyValue("--text-2");
            ctx.moveTo(x + 20, y + 58);
            ctx.lineTo(x + 225 - 20, y + 58);
            ctx.stroke();
            ctx.closePath();

            // Draw firstContent
            textWidth = ctx.measureText(firstContent || "").width;
            ctx.fillText(firstContent || "", x + (225 - textWidth) / 2, y + 58 / 2, 255 - 10);

            // Draw secondContent
            ctx.fillStyle = cssStyles.getPropertyValue("--text-3");
            textWidth = ctx.measureText(secondContent || "").width;
            ctx.fillText(secondContent || "", x + (225 - textWidth) / 2, y + 116 - 58 / 2, 255 - 10)
    }
}

function hexToRGBA(hex: string, alpha?: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (alpha !== undefined) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else {
        return `rgba(${r}, ${g}, ${b})`;
    }
}