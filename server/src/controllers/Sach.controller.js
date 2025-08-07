const bookService = require('../services/Sach.service');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/books/';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'book-' + unique + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  cb(null, allowed.includes(file.mimetype));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Upload ảnh
module.exports.uploadImage = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: 'Không có file ảnh được upload' });

    const imageUrl = `/uploads/books/${req.file.filename}`;
    res.json({ success: true, imageUrl, message: 'Upload ảnh thành công!' });
  });
};

const handleRequest = async (res, func, errorMessage) => {
  try {
    const result = await func();
    res.json(result);
  } catch (error) {
    console.error(`❌ ${errorMessage}:`, error);
    res.status(500).json({ success: false, message: `Lỗi khi ${errorMessage.toLowerCase()}` });
  }
};

const bookservice = new bookService();

module.exports.getAll = (req, res) => handleRequest(res, () => bookservice.getAll(), 'lấy danh sách sách');
module.exports.getHot = (req, res) => handleRequest(res, () => bookservice.getHot(), 'lấy sách nổi bật');
module.exports.getNew = (req, res) => handleRequest(res, () => bookservice.getNew(), 'lấy sách mới');
module.exports.getById = (req, res) => handleRequest(res, () => bookservice.getById(req.params.MaSach), 'lấy thông tin sách');

module.exports.add = (req, res) => {
  handleRequest(res, () => bookservice.add(req.body), 'thêm sách');
};

module.exports.update = (req, res) => {
  handleRequest(res, () => bookservice.update({ MaSach: req.params.MaSach, ...req.body }), 'cập nhật sách');
};

module.exports.delete = async (req, res) => {
  try {
    const { MaSach } = req.params;
    const book = await bookservice.getById(MaSach);
    const result = await bookservice.delete(MaSach);
    if (book?.sach?.image) {
      const imagePath = path.join(__dirname, '..', book.sach.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    res.json(result ? { success: true, message: 'Xóa sách thành công' } : { success: false, message: 'Không tìm thấy sách' });
  } catch (error) {
    console.error('❌ Lỗi khi xóa sách:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi xóa sách' });
  }
};
module.exports.deleteAll = (req, res) => {
  handleRequest(res, async () => {
    const deleted = await bookservice.deleteAll();
    return { success: true, deletedCount: deleted, message: `Đã xóa ${deleted} sách` };
  }, 'xóa tất cả sách');
};
