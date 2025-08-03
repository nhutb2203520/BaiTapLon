const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const staffModel = require('../models/NhanVien.model');

module.exports = class staffService {
  async signUp({ HoTenNV, ChucVu, DiaChi, SoDienThoai, MatKhau }) {
    if (await staffModel.exists({ SoDienThoai })) {
      return { success: false, message: 'Tài khoản đã tồn tại!' };
    }

    try {
      const hashedPassword = await bcrypt.hash(MatKhau, 10);
      await new staffModel({ HoTenNV, ChucVu, DiaChi, SoDienThoai, MatKhau: hashedPassword }).save();
      return { success: true, message: 'Đăng ký tài khoản nhân viên thành công!' };
    } catch {
      return { success: false, message: 'Lỗi hệ thống khi đăng ký!' };
    }
  }

  async signIn({ SoDienThoai, MatKhau }) {
    if (!SoDienThoai || !MatKhau) {
      return { success: false, message: 'Thông tin đăng nhập không hợp lệ!' };
    }

    const staff = await staffModel.findOne({ SoDienThoai });
    if (!staff || !(await bcrypt.compare(MatKhau, staff.MatKhau))) {
      return { success: false, message: 'Tài khoản hoặc mật khẩu không chính xác!' };
    }

    const payload = { _id: staff._id, SoDienThoai, ChucVu: staff.ChucVu };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'NHUTB2203520', { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'REFRESH_NHUTB2203520', { expiresIn: '7d' });

    const { MatKhau: _, ...staffInfo } = staff._doc;

    return {
      success: true,
      message: 'Đăng nhập thành công!',
      data: { staff: staffInfo, token, refreshToken }
    };
  }
};
