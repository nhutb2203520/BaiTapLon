const userModel = require("../models/DocGia.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = class userService {
   async signUp(data) {
  const userTest = await userModel.exists({ SoDienThoai: data.SoDienThoai });

  if (!userTest) {
    // Chuyển "30/11/2003" => Date object
    const parsedDate = this.parseDate(data.NgaySinh); // <- xử lý tại đây

    const newUser = new userModel({
      HoLot: data.HoLot,
      Ten: data.Ten,
      NgaySinh: parsedDate,
      SoDienThoai: data.SoDienThoai,
      GioiTinh: data.GioiTinh,
      DiaChi: data.DiaChi,
      MatKhau: bcrypt.hashSync(data.MatKhau, 10),
    });

    try {
      await newUser.save();
      return { message: "Đăng ký thành công! Hãy đăng nhập vào tài khoản của bạn" };
    } catch (error) {
      return { message: error.message || "Lỗi hệ thống khi đăng ký" };
    }
  } else {
    return { message: 'Số điện thoại đã tồn tại!' };
  }
}

// Hàm xử lý định dạng ngày DD/MM/YYYY
parseDate(dateString) {
  const [day, month, year] = dateString.split('/');
  return new Date(`${year}-${month}-${day}`);
}


   async signIn(user) {
    
    if(!user || !user.SoDienThoai || !user.MatKhau) {
      return { message: "Thông tin đăng nhập không hợp lệ !"}
    }

    try {

        const userCheck = await userModel.findOne({SoDienThoai: user.SoDienThoai})

        if(!userCheck) {
          return { message: "Tài khoản không tồn tại !"}
        }

        const isPasswordValid = await bcrypt.compare(user.MatKhau, userCheck.MatKhau)

        if(!isPasswordValid) {
          return { message: "Mật khẩu không chính xác !"}
        }

        const { MatKhau, ...userInfor } = userCheck._doc

        //jwt.sign(payload, secretOrPrivateKey, [options])
        const token = jwt.sign(userInfor, process.env.JWT_SECRET || 'NHUTB2203520', { expiresIn:'1h'})

        return {
          data:{ user: userInfor, token},
          message:"Đăng nhập thành công !"
        }
      
    } catch (error) {
      return {message: "Có lỗi xảy ra trong quá trình đăng nhập"}
    }
  }
};
