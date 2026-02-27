import ChefHat from "./assets/chef-hat.webp";

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
    console.log(information);
    console.log(extraInformation);

    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.height = 1000;
    canvas.width = 1000;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

    if (ctx !== null) {
        // Set background color
        const cssStyles = getComputedStyle(document.body);

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

            // Download
            const a: HTMLAnchorElement = document.createElement("a"); 
            a.download = `flavortown-${(information.displayName).toLowerCase()}.png`;
            a.href = canvas.toDataURL();
            a.click();
        }
    }    
}