import fs from "node:fs";
import path from "node:path";


// __dirname = thư mục hiện tại của file script
const SCRIPT_DIR = import.meta.dirname;


// INPUT_FILE = đường dẫn tới file dữ liệu Unicode gốc
const INPUT_FILE = path.resolve(
    SCRIPT_DIR,
    "./confusables.txt"
);


// OUTPUT_FILE = đường dẫn tới file TypeScript được tự động tạo
const OUTPUT_FILE = path.resolve(
    SCRIPT_DIR,
    "./confusableMap.generated.ts"
);


// Kiểm tra file đầu vào có tồn tại không
if (!fs.existsSync(INPUT_FILE)) {
    throw new Error(
        `Không tìm thấy confusables.txt tại: ${INPUT_FILE}`
    );
}


// Đọc file confusables.txt
const content = fs.readFileSync(INPUT_FILE, "utf8");


// codePointsToString = chuyển mã Unicode thành ký tự thật
//
// Ví dụ:
// "0430" → "а"
// "0061" → "a"
// "0061 0062" → "ab"
function codePointsToString(codePoints: string): string {
    const values = codePoints
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    const result: string[] = [];

    for (const value of values) {
        // Không phải mã Unicode dạng hexadecimal
        if (!/^[0-9A-Fa-f]+$/.test(value)) {
            return "";
        }

        const codePoint = parseInt(value, 16);

        if (
            !Number.isInteger(codePoint) ||
            codePoint > 0x10FFFF
        ) {
            return "";
        }

        result.push(String.fromCodePoint(codePoint));
    }

    return result.join("");
}


// map = bảng ánh xạ ký tự dễ nhầm
const map = new Map<string, string>();


for (const line of content.split(/\r?\n/)) {

    // Bỏ dòng trống
    if (!line.trim()) {
        continue;
    }

    // Bỏ dòng comment (chú thích)
    if (line.trim().startsWith("#")) {
        continue;
    }


    // Bỏ phần comment phía sau dấu #
    //
    // Ví dụ:
    // 0430 ; 0061 ; MA # CYRILLIC SMALL LETTER A
    //
    // trở thành:
    // 0430 ; 0061 ; MA
    const data = line.split("#")[0].trim();


    // Tách các phần bằng dấu ;
    const parts = data
        .split(";")
        .map(part => part.trim());


    // Không đủ dữ liệu thì bỏ qua
    if (parts.length < 2) {
        continue;
    }


    const source = codePointsToString(parts[0]);
    const target = codePointsToString(parts[1]);


    // Đảm bảo source và target hợp lệ
    if (!source || !target) {
        continue;
    }


    map.set(source, target);
}


// Tạo TypeScript code
const output = `// AUTO-GENERATED FILE
// File này được tạo tự động từ Unicode confusables.txt.
// KHÔNG chỉnh sửa file này thủ công.

export const CONFUSABLE_MAP: Record<string, string> = ${JSON.stringify(
    Object.fromEntries(map),
    null,
    4
)};
`;


// Ghi file generated (file được tự động sinh)
fs.writeFileSync(
    OUTPUT_FILE,
    output,
    "utf8"
);


console.log(
    `Generated ${map.size} confusable mappings.`
);

console.log(
    `Output: ${OUTPUT_FILE}`
);
