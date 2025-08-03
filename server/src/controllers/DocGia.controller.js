const userService = require('../services/DocGia.service');
const userModel = require('../models/DocGia.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ApiError = require('../ApiError');

// Helper: Xác thực JWT
const verifyToken = (req) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) throw new Error('Unauthorized');
  return jwt.verify(token, process.env.JWT_SECRET || 'NHUTB2203520');
};

// [GET] /readers/my-account
module.exports.getMyAccount = async (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    const user = await userModel.findById(decoded._id).select('-MatKhau');
    if (!user) return next(new ApiError(404, "Không tìm thấy tài khoản!"));
    res.json({ success: true, user, message: 'Lấy thông tin thành công!' });
  } catch (err) {
    next(new ApiError(err.message === 'Unauthorized' ? 401 : 500, err.message));
  }
};

// [PATCH] /readers/my-account
module.exports.updateMyAccount = async (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    const fields = ['HoLot', 'Ten', 'NgaySinh', 'GioiTinh', 'DiaChi', 'SoDienThoai'];
    const updateData = Object.fromEntries(fields.map(f => [f, req.body[f]]).filter(([_, v]) => v !== undefined));
    const updated = await userModel.findByIdAndUpdate(decoded._id, { $set: updateData }, { new: true }).select('-MatKhau');
    if (!updated) return next(new ApiError(404, "Không tìm thấy tài khoản!"));
    res.json({ success: true, user: updated, message: 'Cập nhật thành công!' });
  } catch (err) {
    next(new ApiError(err.message === 'Unauthorized' ? 401 : 500, err.message));
  }
};

// [PATCH] /readers/change-password
module.exports.changePassword = async (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return next(new ApiError(400, "Vui lòng nhập đầy đủ mật khẩu cũ và mới"));

    const user = await userModel.findById(decoded._id);
    if (!user) return next(new ApiError(404, "Không tìm thấy tài khoản!"));

    const isMatch = await bcrypt.compare(currentPassword, user.MatKhau);
    if (!isMatch) return next(new ApiError(400, "Mật khẩu hiện tại không đúng"));

    const hashed = await bcrypt.hash(newPassword, 10);
    await userModel.findByIdAndUpdate(decoded._id, { MatKhau: hashed });
    res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    next(new ApiError(err.message === 'Unauthorized' ? 401 : 500, err.message));
  }
};

// [DELETE] /readers/my-account
module.exports.deleteMyAccount = async (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    const deleted = await userModel.findByIdAndDelete(decoded._id);
    if (!deleted) return next(new ApiError(404, "Không tìm thấy tài khoản!"));
    res.json({ success: true, message: 'Xóa tài khoản thành công.' });
  } catch (err) {
    next(new ApiError(err.message === 'Unauthorized' ? 401 : 500, err.message));
  }
};

// [POST] /readers/signin
module.exports.signIn = async (req, res, next) => {
  try {
    const result = await new userService().signIn(req.body);
    res.json(result);
  } catch (err) {
    next(new ApiError(500, "Đăng nhập thất bại"));
  }
};

// [POST] /readers/signup
module.exports.signUp = async (req, res, next) => {
  try {
    const result = await new userService().signUp(req.body);
    res.json(result);
  } catch (err) {
    next(new ApiError(500, "Đăng ký thất bại"));
  }
};

// [GET] /readers (admin)
module.exports.getAllReaders = async (req, res, next) => {
  try {
    verifyToken(req);
    const readers = await userModel.find().select('-MatKhau').sort({ _id: -1 });
    res.json({ success: true, userList: readers, countUser: readers.length });
  } catch (err) {
    next(new ApiError(err.message === 'Unauthorized' ? 401 : 500, err.message));
  }
};

// [DELETE] /readers/:id (admin)
module.exports.deleteReader = async (req, res, next) => {
  try {
    verifyToken(req);
    const id = req.params.id;
    if (!id) return next(new ApiError(400, "Thiếu ID độc giả"));

    const deleted = await userModel.findByIdAndDelete(id);
    if (!deleted) return next(new ApiError(404, "Không tìm thấy độc giả"));
    res.json({ success: true, message: `Đã xóa độc giả "${deleted.HoLot} ${deleted.Ten}"` });
  } catch (err) {
    next(new ApiError(err.message === 'Unauthorized' ? 401 : 500, err.message));
  }
};
