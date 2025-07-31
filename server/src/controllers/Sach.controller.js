const bookService = require('../services/Sach.service')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// ✅ THÊM: Cấu hình multer để upload ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/books/'
    
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    // Tạo tên file unique: timestamp + random + extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'book-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// ✅ THÊM: Kiểm tra file type
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)'), false)
  }
}

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  }
})

// ✅ SỬA: Upload ảnh sách - syntax đã sai
module.exports.uploadImage = (req, res, next) => {
  // Sử dụng middleware upload trước
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Không có file ảnh được upload'
        });
      }

      // Trả về URL của ảnh
      const imageUrl = `/uploads/books/${req.file.filename}`;
      
      console.log('📸 Image uploaded successfully:', imageUrl);
      
      res.json({
        success: true,
        imageUrl: imageUrl,
        message: 'Upload ảnh thành công!'
      });
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi upload ảnh'
      });
    }
  });
};

// [GET] [/books] - Lấy tất cả sách
module.exports.getAll = async (req, res, next) => {
  try {
    const bookservice = new bookService()
    const result = await bookservice.getAll()
    res.json(result)
  } catch (error) {
    console.error('❌ Error in getAll:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sách'
    })
  }
}

// [GET] [/books/hot] - Lấy sách nổi bật
module.exports.getHot = async (req, res, next) => {
  try {
    const bookservice = new bookService()
    const result = await bookservice.getHot()
    res.json(result)
  } catch (error) {
    console.error('❌ Error in getHot:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy sách nổi bật'
    })
  }
}

// [GET] [/books/new] - Lấy sách mới
module.exports.getNew = async (req, res, next) => {
  try {
    const bookservice = new bookService()
    const result = await bookservice.getNew()
    res.json(result)
  } catch (error) {
    console.error('❌ Error in getNew:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy sách mới'
    })
  }
}

// [GET] [/books/:MaSach] - Lấy sách theo mã
module.exports.getById = async (req, res, next) => {
  try {
    const bookservice = new bookService()
    const result = await bookservice.getById(req.params.MaSach)
    res.json(result)
  } catch (error) {
    console.error('❌ Error in getById:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin sách'
    })
  }
}

// [POST] [/books] - Thêm sách mới
module.exports.add = async (req, res, next) => {
  try {
    console.log('📝 Adding new book with data:', req.body)
    console.log('📸 Image field:', req.body.image) // ✅ THÊM log debug
    
    const bookservice = new bookService()
    const result = await bookservice.add(req.body)
    
    console.log('✅ Book added successfully:', result)
    res.json(result)
  } catch (error) {
    console.error('❌ Error in add:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm sách'
    })
  }
}

// [PATCH] [/books/:MaSach] - Cập nhật sách
module.exports.update = async (req, res, next) => {
  try {
    console.log('✏️ Updating book:', req.params.MaSach, req.body)
    
    const bookservice = new bookService()
    const result = await bookservice.update({
      MaSach: req.params.MaSach,
      ...req.body
    })
    
    res.json(result)
  } catch (error) {
    console.error('❌ Error in update:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật sách'
    })
  }
}

// [DELETE] [/books/:MaSach] - Xóa sách
module.exports.delete = async (req, res, next) => {
  try {
    console.log('🗑️ Deleting book:', req.params.MaSach)
    
    const bookservice = new bookService()
    
    // ✅ THÊM: Lấy thông tin sách trước khi xóa để xóa ảnh
    const book = await bookservice.getById(req.params.MaSach)
    
    const result = await bookservice.delete(req.params.MaSach)
    
    // ✅ THÊM: Xóa file ảnh nếu có
    if (book && book.sach && book.sach.image) {
      const imagePath = path.join(__dirname, '..', book.sach.image)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
        console.log('🗑️ Deleted image file:', imagePath)
      }
    }
    
    if (result) {
      res.json({
        success: true,
        message: 'Xóa sách thành công'
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      })
    }
  } catch (error) {
    console.error('❌ Error in delete:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa sách'
    })
  }
}

// [DELETE] [/books] - Xóa tất cả sách
module.exports.deleteAll = async (req, res, next) => {
  try {
    const bookservice = new bookService()
    const result = await bookservice.deleteAll()
    
    res.json({
      success: true,
      deletedCount: result,
      message: `Đã xóa ${result} sách`
    })
  } catch (error) {
    console.error('❌ Error in deleteAll:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa tất cả sách'
    })
  }
}