// src/validations/authValidation.ts
// Rule format-check phía client, đồng bộ với backend userValidation.ts (zod).
// KHÔNG check banned words / profanity ở đây nữa — 2 việc đó để backend
// quyết định (usernameModeration), vì frontend không thể mirror hết
// leetspeak/confusable/impersonation. Backend trả lỗi thì hiển thị ra form.

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
const specialCharRegex = /[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/;

export function validateUsername(value: string): string[] {
  const errors: string[] = [];
  const trimmed = value.trim();

  if (trimmed === "") {
    errors.push("Không được để trống");
    return errors;
  }
  if (trimmed.length < 3 || trimmed.length > 30) {
    errors.push("Tên phải từ 3-30 ký tự");
  }
  if (/[^A-Za-z0-9_ ]/.test(trimmed)) {
    errors.push("Ký tự không hợp lệ");
  }
  if (/^_/.test(trimmed)) errors.push("Không được bắt đầu bằng _");
  if (/_$/.test(trimmed)) errors.push("Không được kết thúc bằng _");
  if (/_{2,}/.test(trimmed)) errors.push("Không được có nhiều dấu _ liên tiếp");

  return errors;
}

export function validateEmail(value: string): string[] {
  const errors: string[] = [];
  const trimmed = value.trim().toLowerCase();

  if (trimmed === "") {
    errors.push("Không được để trống");
    return errors;
  }
  if (trimmed.length > 254) errors.push("Email quá dài");
  if (!emailRegex.test(trimmed)) errors.push("Sai định dạng email");
  if (/\s/.test(trimmed)) errors.push("Email không được chứa khoảng trắng");

  return errors;
}

// Dùng cho Register — check độ mạnh, khớp strongPasswordSchema backend
export function validatePassword(value: string): string[] {
  const errors: string[] = [];

  if (value.trim() === "") {
    errors.push("Không được để trống");
    return errors;
  }
  if (value.length < 8 || value.length > 64) {
    errors.push("Mật khẩu phải từ 8-64 ký tự");
  }
  if (!/[a-z]/.test(value)) errors.push("Phải có ít nhất 1 chữ thường");
  if (!/[A-Z]/.test(value)) errors.push("Phải có ít nhất 1 chữ hoa");
  if (!/[0-9]/.test(value)) errors.push("Phải có ít nhất 1 chữ số");
  if (!specialCharRegex.test(value)) errors.push("Phải có ít nhất 1 ký tự đặc biệt");
  if (/\s/.test(value)) errors.push("Mật khẩu không được chứa khoảng trắng");

  return errors;
}

export function validatePasswordAgain(value: string, password: string): string[] {
  const errors: string[] = [];

  if (value.trim() === "") {
    errors.push("Không được để trống");
    return errors;
  }
  if (value !== password) errors.push("Mật khẩu không khớp");

  return errors;
}

// Dùng cho Login — chỉ check tồn tại + max length, KHÔNG chặn khoảng trắng
// (khớp loginPasswordSchema backend, để tương thích mật khẩu cũ)
export function validateLoginPassword(value: string): string[] {
  const errors: string[] = [];

  if (value.trim() === "") {
    errors.push("Không được để trống");
    return errors;
  }
  if (value.length > 200) errors.push("Mật khẩu quá dài");

  return errors;
}
