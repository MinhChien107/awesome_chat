export const transValidation = {
  email_incorrect: "Email phải có dạng example@gmail.com",
  gender_incorrect: "Nhập đúng định dạng gender",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt",
  password_confirmation_incorrect: "Nhập lại mật khẩu chưa chính xác",
}

export const transErrors = {
  account_in_use: 'email này đã được sử dụng',
  account_removed: 'tài khoản này đã được gỡ khỏi hệ thống, nếu tin điều này là sai, xin vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi',
  account_not_active: 'email đã được đăng ký nhưng chưa active, xin vui lòng kiểm tra lại hoặc liên hệ với bộ phận hỗ trợ của chúng tôi',
  account_undefined: 'tài khoản nay không tồn tại',
  token_undefined: 'token không tồn tại, tài khoản đã active!',
  server_error: "có lỗi ở phía server, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi để báo cáo lỗi này. Xin cảm ơn",
}

export const transSuccess = {
  userCreated: (userEmail) => {
    return `tai khoan <strong>${userEmail}</strong> đã được tạo, xin vui lòng kiểm tra email để active trước khi đăng nhập. Xin cảm ơn.`
  },
  account_actived: 'kích hoạt tài khoản thành công bạn đã có thể dăng nhập vào ứng dụng',
}

export const transMail = {
  subject: "Awesome chat: xac nhan kich hoat tai khoan.",
  template: linkVerify => {
    return `
      <h2>B.ạn đã nhận được email này vì đã đăng ký tài khoản tren awesome chat</h2>
      <h3>Vui lòng click vào liên kết  vào link bên dưới để kich hoạt tài khoản</h3>
      <h3><a href=${linkVerify} target=${linkVerify}/>${linkVerify}</h3>
      <h4>Nếu tin rằng email là nhầm lẫn xin bỏ qua nó. Xin cảm ơn!</h4>
    `;
  },
  send_fail: 'Có lỗi trong quá trình gửi email, xin vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi'
};