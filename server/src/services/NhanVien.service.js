const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const staffModel = require('../models/NhanVien.model')
module.exports = class staffService {

    async signUp (data) {
        const staffTest = await staffModel.exists({ SoDienThoai: data.SoDienThoai });

        if(!staffTest) {
            
            const newStaff =  new staffModel({
                HoTenNV: data.HoTenNV,
                ChucVu: data.ChucVu,
                DiaChi: data.DiaChi,
                SoDienThoai: data.SoDienThoai,
                MatKhau: bcrypt.hashSync(data.MatKhau, 10),
            })

            try {
                await  newStaff.save()
                return { message: 'Đăng ký tài khoản Nhân viên thành công ! Hãy đăng nhập vào tài khoản của bạn !'}
            } catch (error) {
                return { message: error}
            }
        } else {
            return { message: 'Tài khoản đã tồn tại !'}
        }
    }

    async signIn(staff) {
    
        if(!staff || !staff.MatKhau || !staff.SoDienThoai) {
          return { message: "Thông tin đăng nhập không hợp lệ !"}
        }
    
        try {
    
            const staffCheck = await staffModel.findOne({SoDienThoai: staff.SoDienThoai})
    
            if(!staffCheck) {
              return { message: "Tài khoản không tồn tại !"}
            }
    
            const isPasswordValid = await bcrypt.compare(staff.MatKhau, staffCheck.MatKhau)
    
            if(!isPasswordValid) {
              return { message: "Mật khẩu không chính xác !"}
            }
    
            const { MatKhau, ...staffInfor } = staffCheck._doc
    
            //jwt.sign(payload, secretOrPrivateKey, [options])
            const token = jwt.sign(staffInfor, process.env.JWT_SECRET || 'B2203510_CT449_HKI2024-2025', { expiresIn:'1h'})
    
            return {
              data:{ staff: staffInfor, token},
              message:"Đăng nhập thành công !"
            }
          
        } catch (error) {
          return {message: "Có lỗi xảy ra trong quá trình đăng nhập"}
        }
      }
}