const userModel = require("../models/DocGia.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports = class userService {
  async signUp(data) {
    const { HoLot, Ten, NgaySinh, GioiTinh, DiaChi, SoDienThoai, MatKhau } = data
    if (!HoLot || !Ten || !NgaySinh || !GioiTinh || !DiaChi || !SoDienThoai || !MatKhau)
      throw new Error("Vui lòng nhập đầy đủ thông tin")

    const existingUser = await userModel.findOne({ SoDienThoai })
    if (existingUser) throw new Error("Số điện thoại đã được sử dụng!")

    const parsedDate = this.parseDate(NgaySinh)
    const hashedPassword = await bcrypt.hash(MatKhau, 10)

    await new userModel({
      HoLot, Ten, NgaySinh: parsedDate, GioiTinh, DiaChi, SoDienThoai, MatKhau: hashedPassword
    }).save()

    return { success: true, message: "Đăng ký thành công! Hãy đăng nhập vào tài khoản của bạn" }
  }

  parseDate(dateString) {
    const [day, month, year] = dateString.split('/')
    const date = new Date(`${year}-${month}-${day}`)
    if (isNaN(date)) throw new Error("Định dạng ngày sinh không hợp lệ (DD/MM/YYYY)")
    return date
  }

  async signIn({ SoDienThoai, MatKhau }) {
    if (!SoDienThoai || !MatKhau)
      return { success: false, message: "Thông tin đăng nhập không hợp lệ!" }

    const user = await userModel.findOne({ SoDienThoai })
    if (!user) return { success: false, message: "Tài khoản không tồn tại!" }

    const isValid = await bcrypt.compare(MatKhau, user.MatKhau)
    if (!isValid) return { success: false, message: "Mật khẩu không chính xác!" }

    const { MatKhau: _, ...userData } = user._doc
    const token = jwt.sign(userData, process.env.JWT_SECRET || 'NHUTB2203520', { expiresIn: '1h' })

    return { success: true, message: "Đăng nhập thành công!", data: { user: userData, token } }
  }
}
