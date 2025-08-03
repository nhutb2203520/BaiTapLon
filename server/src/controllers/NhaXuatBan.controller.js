const publisherService = require('../services/NhaXuatBan.service');
const jwt = require('jsonwebtoken');
const ApiError = require('../ApiError');

const verifyToken = async (req) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) throw 'Unauthorized !';

  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET || 'NHUTB2203520', (err, user) => {
      if (err || !user?.ChucVu) return reject('Unauthorized !');
      resolve(user);
    });
  });
};

// Khởi tạo 1 instance duy nhất để tránh lặp lại
const publisher = new publisherService();

// [POST] /publisher/add
module.exports.add = async (req, res, next) => {
  if (!req.body?.TenNXB) {
    return next(new ApiError(400, "Tên nhà xuất bản không được để trống!"));
  }

  try {
    await verifyToken(req);
    const result = await publisher.add(req.body);
    res.json(result);
  } catch (err) {
    next(new ApiError(err === 'Unauthorized !' ? 401 : 500, err));
  }
};

// [PATCH] /publisher/update/:MaNXB
module.exports.update = async (req, res, next) => {
  try {
    await verifyToken(req);
    const result = await publisher.update(req.body);
    if (!result) return next(new ApiError(404, "Không tìm thấy nhà xuất bản!"));
    res.json(result);
  } catch (err) {
    next(new ApiError(err === 'Unauthorized !' ? 401 : 500, err));
  }
};

// [DELETE] /publisher/delete/:MaNXB
module.exports.delete = async (req, res, next) => {
  try {
    await verifyToken(req);
    const result = await publisher.delete(req.params.MaNXB);
    if (!result) return next(new ApiError(404, "Không tìm thấy nhà xuất bản!"));
    res.json(result);
  } catch (err) {
    next(new ApiError(err === 'Unauthorized !' ? 401 : 500, err));
  }
};

// [GET] /publisher
module.exports.getAll = async (req, res, next) => {
  try {
    await verifyToken(req);
    const { TenNXB } = req.query;
    const result = TenNXB ? await publisher.findByName(TenNXB) : await publisher.find({});
    res.json(result);
  } catch (err) {
    next(new ApiError(err === 'Unauthorized !' ? 401 : 500, err));
  }
};

// [DELETE] /publisher/deleteAll
module.exports.deleteAll = async (req, res, next) => {
  try {
    await verifyToken(req);
    const deletedCount = await publisher.deleteAll();
    res.json({ message: `${deletedCount} Nhà xuất bản được xóa thành công!` });
  } catch (err) {
    next(new ApiError(err === 'Unauthorized !' ? 401 : 500, err));
  }
};
