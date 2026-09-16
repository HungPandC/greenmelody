import fs from "node:fs";
import readline from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Tự tính path dựa vào vị trí thật của file này, chạy từ đâu cũng đúng
// (không còn phụ thuộc bạn đang đứng ở cwd nào khi gõ lệnh npx tsx ...)
const dir = path.dirname(fileURLToPath(import.meta.url));
// profanityBench.jsonl nằm ở backend/, cách script 3 cấp thư mục:
// usernameModeration -> middlewares -> src -> backend
const input = path.join(dir, "../../../profanityBench.jsonl");
const output = path.join(dir, "profanityWords.generated.ts");

// word -> severity (4 hoặc 5). Trước đây chỉ lưu Set<string>, mất hết
// thông tin severity nên checkProfanity() không thể chấm điểm khác nhau
// giữa severity 4 (~70) và severity 5 (~85) như doc yêu cầu.
const words = new Map<string, 4 | 5>();

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

    const isSevere = item.severity >= 4 && (item.hate_speech || item.sexual || item.severity === 5);
    if (!isSevere) {
        continue;
    }

    // Nếu 1 từ xuất hiện nhiều dòng với severity khác nhau, giữ mức cao hơn.
    const existing = words.get(item.word);
    if (!existing || item.severity > existing) {
        words.set(item.word, item.severity);
    }
}

const content = `export const PROFANITY_WORDS: Record<string, 4 | 5> = ${JSON.stringify(
    Object.fromEntries(words),
    null,
    4
)};
`;

fs.writeFileSync(output, content);