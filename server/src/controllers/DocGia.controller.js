const userService = require('../services/DocGia.service');
const userModel = require('../models/DocGia.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ApiError = require('../ApiError');

// Helper function để verify token
function verifyToken(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized !');
  }
  
  const token = authHeader.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET || 'NHUTB2203520');
}

// [GET] [/readers/my-account] - Lấy thông tin tài khoản cá nhân
module.exports.getMyAccount = async (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    
    const user = await userModel.findById(decoded._id).select('-MatKhau');
    if (!user) {
      return next(new ApiError(404, "Không tìm thấy tài khoản!"));
    }
    
    res.json({
      success: true,
      user: user,
      message: 'Lấy thông tin tài khoản thành công!'
    });
  } catch (error) {
    console.error('❌ Error in getMyAccount:', error);
    if (error.message === 'Unauthorized !') {
      return next(new ApiError(401, error.message));
    }
    return next(new ApiError(500, "Có lỗi xảy ra khi lấy thông tin tài khoản"));
  }
};

// [PATCH] [/readers/my-account] - Cập nhật thông tin tài khoản
module.exports.updateMyAccount = async (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    
    const updateData = {
      HoLot: req.body.HoLot,
      Ten: req.body.Ten,
      NgaySinh: req.body.NgaySinh,
      GioiTinh: req.body.GioiTinh,
      DiaChi: req.body.DiaChi,
      SoDienThoai: req.body.SoDienThoai,
    };
    
    // Loại bỏ các field undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    const updatedUser = await userModel.findByIdAndUpdate(
      decoded._id,
      { $set: updateData },
      { new: true }
    ).select('-MatKhau');
    
    if (!updatedUser) {
      return next(new ApiError(404, "Không tìm thấy tài khoản!"));
    }
    
    res.json({
      success: true,
      user: updatedUser,
      message: 'Cập nhật thông tin thành công!'
    });
  } catch (error) {
    console.error('❌ Error in updateMyAccount:', error);
    if (error.message === 'Unauthorized !') {
      return next(new ApiError(401, error.message));
    }
    return next(new ApiError(500, "Có lỗi xảy ra khi cập nhật thông tin"));
  }
};

// [PATCH] [/readers/change-password] - Đổi mật khẩu
module.exports.changePassword = async (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return next(new ApiError(400, "Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới"));
    }
    
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return next(new ApiError(404, "Không tìm thấy tài khoản!"));
    }
    
    // Kiểm tra mật khẩu cũ
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.MatKhau);
    if (!isCurrentPasswordValid) {
      return next(new ApiError(400, "Mật khẩu hiện tại không chính xác"));
    }
    
    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    await userModel.findByIdAndUpdate(decoded._id, {
      MatKhau: hashedNewPassword
    });
    
    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công!'
    });
  } catch (error) {
    console.error('❌ Error in changePassword:', error);
    if (error.message === 'Unauthorized !') {
      return next(new ApiError(401, error.message));
    }
    return next(new ApiError(500, "Có lỗi xảy ra khi đổi mật khẩu"));
  }
};

// [DELETE] [/readers/my-account] - Xóa tài khoản
module.exports.deleteMyAccount = async (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    
    const deletedUser = await userModel.findByIdAndDelete(decoded._id);
    if (!deletedUser) {
      return next(new ApiError(404, "Không tìm thấy tài khoản!"));
    }
    
    res.json({
      success: true,
      message: 'Xóa tài khoản thành công.'
    });
  } catch (error) {
    console.error('❌ Error in deleteMyAccount:', error);
    if (error.message === 'Unauthorized !') {
      return next(new ApiError(401, error.message));
    }
    return next(new ApiError(500, "Có lỗi xảy ra khi xóa tài khoản"));
  }
};

// [POST] [/readers/signin] - Đăng nhập (existing)
module.exports.signIn = async (req, res, next) => {
  try {
    const userservice = new userService();
    const result = await userservice.signIn(req.body);
    res.json(result);
  } catch (error) {
    console.error('❌ SignIn error:', error);
    return next(new ApiError(500, "Có lỗi xảy ra khi đăng nhập"));
  }
};

// [POST] [/readers/signup] - Đăng ký (existing)
module.exports.signUp = async (req, res, next) => {
  try {
    const userservice = new userService();
    const result = await userservice.signUp(req.body);
    res.json(result);
  } catch (error) {
    console.error('❌ SignUp error:', error);
    return next(new ApiError(500, "Có lỗi xảy ra khi đăng ký"));
  }
};
// [GET] [/readers] - Lấy danh sách tất cả độc giả (cho admin)
module.exports.getAllReaders = async (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    
    console.log("📤 Đang lấy danh sách tất cả độc giả...");

    const readers = await userModel.find({}).select('-MatKhau').sort({ _id: -1 });
    
    console.log(`✅ Tìm thấy ${readers.length} độc giả`);

    res.json({
      success: true,
      userList: readers, // Khớp với tên trong store hiện tại
      countUser: readers.length,
      message: 'Lấy danh sách độc giả thành công!'
    });

  } catch (error) {
    console.error('❌ Error in getAllReaders:', error);
    if (error.message === 'Unauthorized !') {
      return next(new ApiError(401, error.message));
    }
    return next(new ApiError(500, "Có lỗi xảy ra khi lấy danh sách độc giả"));
  }
};

// [DELETE] [/readers/:id] - Xóa độc giả (cho admin)
module.exports.deleteReader = async (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    
    const readerId = req.params.id;
    
    if (!readerId) {
      return next(new ApiError(400, "ID độc giả không hợp lệ"));
    }

    console.log("📤 Đang xóa độc giả:", readerId);

    const deletedReader = await userModel.findByIdAndDelete(readerId);
    
    if (!deletedReader) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }

    console.log(`✅ Đã xóa độc giả: ${deletedReader.HoLot} ${deletedReader.Ten}`);

    res.json({
      success: true,
      message: `Xóa độc giả "${deletedReader.HoLot} ${deletedReader.Ten}" thành công`
    });

  } catch (error) {
    console.error('❌ Error in deleteReader:', error);
    if (error.message === 'Unauthorized !') {
      return next(new ApiError(401, error.message));
    }
    return next(new ApiError(500, "Có lỗi xảy ra khi xóa độc giả"));
  }
};