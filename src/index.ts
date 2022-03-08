import fs from 'fs/promises';
import path from 'path';

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

function getLocalLogoPath(address: string): string {
    return path.join('.', 'assets', `${address}.png`);
}

async function doesLogoExist(address: string): Promise<boolean> {
    try {
        await fs.access(getLocalLogoPath(address));
        return true;
    } catch (err) {
        return false;
    }
}

async function main(): Promise<void> {
    const tokens: TokenList = JSON.parse((await fs.readFile('icicle.tokenlist.json')).toString());

    for (const token of tokens.tokens) {
        if (await doesLogoExist(token.address)) {
            token.logoURI = `https://raw.githubusercontent.com/0xicicle/tokenlist/main/assets/${token.address}.png`;

        }

    }

    await fs.writeFile('icicle.tokenlist.json', JSON.stringify(tokens, undefined, 2));
}

void main();
