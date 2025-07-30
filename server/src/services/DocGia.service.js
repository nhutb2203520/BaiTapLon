const userModel = require("../models/DocGia.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = class userService {
  async signUp(data) {
    try {
      // Validate input data
      if (!data.HoLot || !data.Ten || !data.NgaySinh || !data.GioiTinh || 
          !data.DiaChi || !data.SoDienThoai || !data.MatKhau) {
        throw new Error("Vui lòng nhập đầy đủ thông tin");
      }

      // Kiểm tra số điện thoại đã tồn tại
      const existingUser = await userModel.findOne({ SoDienThoai: data.SoDienThoai });
      
      if (existingUser) {
        throw new Error('Số điện thoại đã được sử dụng!');
      }

      // Parse date từ DD/MM/YYYY
      const parsedDate = this.parseDate(data.NgaySinh);

      // Tạo user mới
      const newUser = new userModel({
        HoLot: data.HoLot,
        Ten: data.Ten,
        NgaySinh: parsedDate,
        SoDienThoai: data.SoDienThoai,
        GioiTinh: data.GioiTinh,
        DiaChi: data.DiaChi,
        MatKhau: await bcrypt.hash(data.MatKhau, 10), // Dùng async/await thay vì sync
      });

      await newUser.save();
      
      return { 
        success: true,
        message: "Đăng ký thành công! Hãy đăng nhập vào tài khoản của bạn" 
      };

    } catch (error) {
      console.error('❌ SignUp Service Error:', error);
      
      // Xử lý lỗi MongoDB duplicate key
      if (error.code === 11000) {
        throw new Error('Số điện thoại đã được sử dụng!');
      }
      
      throw new Error(error.message || "Lỗi hệ thống khi đăng ký");
    }
  }

  // Hàm xử lý định dạng ngày DD/MM/YYYY
  parseDate(dateString) {
    try {
      const [day, month, year] = dateString.split('/');
      const date = new Date(`${year}-${month}-${day}`);
      
      // Kiểm tra date hợp lệ
      if (isNaN(date.getTime())) {
        throw new Error("Định dạng ngày sinh không hợp lệ");
      }
      
      return date;
    } catch (error) {
      throw new Error("Định dạng ngày sinh không hợp lệ (DD/MM/YYYY)");
    }
  }

  async signIn(user) {
    if (!user || !user.SoDienThoai || !user.MatKhau) {
      return { 
        success: false,
        message: "Thông tin đăng nhập không hợp lệ !"
      }
    }

    try {
      const userCheck = await userModel.findOne({ SoDienThoai: user.SoDienThoai });

      if (!userCheck) {
        return { 
          success: false,
          message: "Tài khoản không tồn tại !"
        }
      }

      const isPasswordValid = await bcrypt.compare(user.MatKhau, userCheck.MatKhau);

      if (!isPasswordValid) {
        return { 
          success: false,
          message: "Mật khẩu không chính xác !"
        }
      }

      const { MatKhau, ...userInfor } = userCheck._doc;

      // Tạo JWT token
      const token = jwt.sign(userInfor, process.env.JWT_SECRET || 'NHUTB2203520', { expiresIn: '1h' });

      return {
        success: true,
        data: { 
          user: userInfor, 
          token 
        },
        message: "Đăng nhập thành công !"
      }
      
    } catch (error) {
      console.error("DocGia signIn error:", error);
      return {
        success: false,
        message: "Có lỗi xảy ra trong quá trình đăng nhập"
      }
    }
  }
};