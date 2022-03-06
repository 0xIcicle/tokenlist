import fs from 'fs/promises';

interface TokenDef {
    address: string;
    chainId: number;
    name: string;
    symbol: string;
    decimals: number;
    logoUri: string;
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

async function main(): Promise<void> {
    const tokens = JSON.parse((await fs.readFile('output.json')).toString()).data;

    const tokenList: TokenList = {
        name: '@icicle/tokenlist',
        timestamp: new Date().toISOString(),
        version: {
            major: 1,
            minor: 0,
            patch: 0,
        },
        keywords: [
            'icicle',
            'finance',
            'amm',
        ],
        tokens,
    };

    await fs.writeFile('icicle.tokenlist.json', JSON.stringify(tokenList, undefined, 2));
}

void main();
