const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const staffModel = require('../models/NhanVien.model')

module.exports = class staffService {
  async signUp(data) {
    const staffTest = await staffModel.exists({ SoDienThoai: data.SoDienThoai });

    if (staffTest) {
      return { success: false, message: 'Tài khoản đã tồn tại!' };
    }

    const hashedPassword = await bcrypt.hash(data.MatKhau, 10);

    const newStaff = new staffModel({
      HoTenNV: data.HoTenNV,
      ChucVu: data.ChucVu,
      DiaChi: data.DiaChi,
      SoDienThoai: data.SoDienThoai,
      MatKhau: hashedPassword,
    });

    try {
      await newStaff.save();
      return { success: true, message: 'Đăng ký tài khoản Nhân viên thành công!' };
    } catch (error) {
      return { success: false, message: 'Lỗi hệ thống khi đăng ký!', error };
    }
  }

  async signIn(staff) {
    if (!staff || !staff.MatKhau || !staff.SoDienThoai) {
      return { success: false, message: "Thông tin đăng nhập không hợp lệ!" };
    }

    try {
      const staffCheck = await staffModel.findOne({ SoDienThoai: staff.SoDienThoai });
      if (!staffCheck) {
        return { success: false, message: "Tài khoản không tồn tại!" };
      }

      const isPasswordValid = await bcrypt.compare(staff.MatKhau, staffCheck.MatKhau);
      if (!isPasswordValid) {
        return { success: false, message: "Mật khẩu không chính xác!" };
      }

      const payload = {
        _id: staffCheck._id,
        SoDienThoai: staffCheck.SoDienThoai,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET || 'NHUTB2203520', { expiresIn: '1h' });
      
      // Tạo refreshToken (có thể giống token hoặc có thời hạn dài hơn)
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'REFRESH_NHUTB2203520', { expiresIn: '7d' });

      const { MatKhau, ...staffInfor } = staffCheck._doc;

      return {
        success: true,
        data: { 
          staff: staffInfor, 
          token,
          refreshToken // Thêm refreshToken vào response
        },
        message: "Đăng nhập thành công!"
      };

    } catch (error) {
      console.error("Staff login error:", error);
      return { success: false, message: "Có lỗi xảy ra trong quá trình đăng nhập", error };
    }
  }
}