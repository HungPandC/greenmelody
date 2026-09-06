// normalizeUnicode = Chuẩn hóa Unicode
//
// NFKC = Normalization Form Compatibility Composition
//      = Chuẩn hóa Unicode theo dạng tương thích
//
// Mục đích:
// Đưa những ký tự Unicode "trang trí" nhưng thực chất
// đại diện cho cùng một ký tự về dạng dễ so sánh hơn.

export function normalizeUnicode(value: string): string {
    return value.normalize("NFKC");
}