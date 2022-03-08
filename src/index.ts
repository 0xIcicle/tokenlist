import fs from 'fs/promises';
import {createCanvas, loadImage} from 'canvas';

interface TokenDef {
    address: string;
    chainId: number;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
}

interface TokenList {
    name: string;
    timestamp: string;
    version: {
        major: number;
        minor: number;
        patch: number;
    }
    keywords: string[];
    tokens: TokenDef[]
}

const logoSize = 512;

async function downloadLogo(url: string, outFile: string) {
    const canvas = createCanvas(logoSize, logoSize);
    const ctx = canvas.getContext('2d');
    ctx.quality = 'best';
    console.log(`Attempting to download ${url}`);
    const image = await loadImage(url);
    // If they're really small, treat them as pixel art and scale with nearest neighbour
    if (image.width < logoSize / 4 || image.height < logoSize / 4) {
        ctx.patternQuality = 'nearest';
    }
    ctx.drawImage(image, 0, 0, logoSize, logoSize);
    const output = canvas.toBuffer('image/png');
    await fs.writeFile(outFile, output);
}

async function main(): Promise<void> {
    const tokens: TokenList = JSON.parse((await fs.readFile('icicle.tokenlist.json')).toString());

    for (const token of tokens.tokens) {
        if (token.logoURI) {
            try {
            await downloadLogo(token.logoURI, `./assets/${token.address}.png`);
            } catch (e) {
                console.log(e);

            }

        }

    }
}

void main();
