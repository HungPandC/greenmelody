import fs from "node:fs";
import readline from "node:readline";

const input = "./src/middlewares/usernameModeration/profanityBench.jsonl";
const output = "./src/middlewares/usernameModeration/profanityWords.generated.ts";

const words = new Set<string>();

const file = readline.createInterface({
    input: fs.createReadStream(input),
    crlfDelay: Infinity,
});

for await (const line of file) {

    if (!line.trim()) {
        continue;
    }

    const item = JSON.parse(line);

    if (!item.word) {
        continue;
    }

    words.add(item.word);
}

const content = `export const PROFANITY_WORDS = ${JSON.stringify(
    [...words],
    null,
    4
)} as const;
`;

fs.writeFileSync(output, content);