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
            ctx.fillText(`${information.displayName}'s Flavortown`, 275, 136);

            // Draw years
            ctx.font = "24px Jua";
            ctx.fillText(`${extraInformation.earliestYear === extraInformation.latestYear ? extraInformation.earliestYear : extraInformation.earliestYear}/${extraInformation.latestYear}`, 275, 179);

            /// Projects
            // Draw Total Time
            ctx.font = "32px Jua";
            ctx.fillText("Projects", 62.5, 280)
            drawCard(ctx, 62.5, 305, "Total Time", information.totalTimeSeconds >= 3600 ? `${(information.totalTimeSeconds / 60 / 60).toFixed(1)} hours` : `${(information.totalTimeSeconds / 60).toFixed(1)} minutes`);

            // Download
            const a: HTMLAnchorElement = document.createElement("a"); 
            a.download = `flavortown-${(information.displayName).toLowerCase()}.png`;
            a.href = canvas.toDataURL();
            a.click();
        }
    }    
}

function drawCard(ctx: CanvasRenderingContext2D, x: number, y: number, firstContent?: string, secondContent?: string) {
    console.log(x, y, firstContent, secondContent);
    const size = (firstContent && secondContent) ? "large" : "small";

    // Draw Rectangle
    ctx.shadowColor = "#00000040";
    ctx.shadowBlur = 2;
    ctx.fillStyle = cssStyles.getPropertyValue("--overlay-2");
    ctx.beginPath();
    ctx.roundRect(x, y, 225, size === "large" ? 116 : 63, 8);
    ctx.stroke();
    ctx.fill();

    // Draw Text
    ctx.fillStyle = cssStyles.getPropertyValue("--text-2");
    let textWidth;
    switch(size) {
        case "small":
            textWidth = ctx.measureText(firstContent || "").width;
            ctx.fillText(firstContent || "", x + (225 - textWidth) / 2, y + 31.5); // firstContent should never be undefined here, but I'm not gonna risk it for the biscuit (there is no biscuit)
            break;
        case "large":
            // Draw stroke in the middle
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = cssStyles.getPropertyValue("--text-2");
            ctx.moveTo(x + 20, y + 58);
            ctx.lineTo(x + 225 - 20, y + 58);
            ctx.stroke();

            // Draw firstContent
            textWidth = ctx.measureText(firstContent || "").width;
            ctx.fillText(firstContent || "", x + (225 - textWidth) / 2, y + 58 / 2);

            // Draw secondContent
            ctx.fillStyle = cssStyles.getPropertyValue("--text-3");
            textWidth = ctx.measureText(secondContent || "").width;
            ctx.fillText(secondContent || "", x + (225 - textWidth) / 2, y + 116 - 58 / 2)
    }
}