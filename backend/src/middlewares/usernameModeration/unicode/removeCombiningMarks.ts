// removeCombiningMarks = Xóa các dấu kết hợp
//
// Combining mark = dấu Unicode được gắn vào một ký tự khác.
// Ví dụ: Ă
//         ↑
//       dấu kết hợp
//
// Mục đích:
// Loại bỏ các dấu kết hợp khỏi dạng dùng để kiểm tra username.

export function removeCombiningMarks(value: string): string {
    return value
        // NFD = Tách ký tự thành phần chữ và các dấu kết hợp
        .normalize("NFD")

        // \p{M} = nhóm Mark (dấu kết hợp) trong Unicode
        // g = tìm tất cả
        // u = bật chế độ Unicode
        .replace(/\p{M}/gu, "");
}