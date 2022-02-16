export const transValidation = {
  email_incorrect: "Email phải có dạng example@gmail.com",
  gender_incorrect: "Nhập đúng định dạng gender",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt",
  password_confirmation_incorrect: "Nhập lại mật khẩu chưa chính xác",
}

export const transErrors = {
  account_in_use: 'email này đã được sử dụng',
  account_removed:'tài khoản này đã được gỡ khỏi hệ thống, nếu tin điều này là sai, xin vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi',
  account_not_active:'email đã được đăng ký nhưng chưa active, xin vui lòng kiểm tra lại hoặc liên hệ với bộ phận hỗ trợ của chúng tôi',
  account_undefined: 'tài khoản nay không tồn tại',
}

export const transSuccess = {
  userCreated: (userEmail) => {
    return `tai khoan <strong>${userEmail}</strong> đã được tạo, xin vui lòng kiểm tra email để active trước khi đăng nhập. Xin cảm ơn.`
  },
}