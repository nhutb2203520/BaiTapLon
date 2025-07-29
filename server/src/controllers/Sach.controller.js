const bookService = require('../services/Sach.service')
const bookModel = require('../models/Sach.model') // ✅ Import model để dùng trong getById
const jwt = require('jsonwebtoken')
const ApiError = require('../ApiError')

function verifyToken(req, res) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Promise.reject('Unauthorized !');
    }
       
    const token = authHeader.split(' ')[1];
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET || 'NHUTB2203520', (error, user) => {
        if (error || !user.ChucVu) {
          return reject('Unauthorized !');
        }
        resolve(user);
      });
    });
}

// [GET] [/books]
module.exports.getAll = async (req, res, next) => {
    try {
        const bookservice = new bookService()
        const result = await bookservice.getAll()
        res.json(result)
    } catch (error) {
        console.log(error)
        return next(new ApiError(500, "An error occurred while getAll books !"))
    }
}

// [GET] [/books/hot]
module.exports.getHot = async (req, res, next) => {
    try {
        const bookservice = new bookService()
        const result = await bookservice.getAll()
        
        // Sách hot = sách có SoLuongDaMuon cao nhất
        const hotBooks = result.danhsachsach
            .sort((a, b) => (b.SoLuongDaMuon || 0) - (a.SoLuongDaMuon || 0))
            .slice(0, 10)
        
        res.json({
            danhsachsach: hotBooks,
            message: 'Lấy sách hot thành công!'
        })
    } catch (error) {
        console.log(error)
        return next(new ApiError(500, "An error occurred while getting hot books !"))
    }
}

// [GET] [/books/new]  
module.exports.getNew = async (req, res, next) => {
    try {
        const bookservice = new bookService()
        const result = await bookservice.getAll()
        
        // Sách mới = sách được tạo gần đây nhất
        const newBooks = result.danhsachsach
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10)
        
        res.json({
            danhsachsach: newBooks,
            message: 'Lấy sách mới thành công!'
        })
    } catch (error) {
        console.log(error)
        return next(new ApiError(500, "An error occurred while getting new books !"))
    }
}

// [GET] [/books/:MaSach]
module.exports.getById = async (req, res, next) => {
    try {
        const book = await bookModel.findOne({MaSach: req.params.MaSach}).populate('MaNXB')
        if (!book) {
            return next(new ApiError(404, "Không tìm thấy sách!"))
        }
        res.json({
            sach: book,
            message: 'Lấy thông tin sách thành công!'
        })
    } catch (error) {
        console.log(error)
        return next(new ApiError(500, "An error occurred while getting book !"))
    }
}

// [POST] [/books]
module.exports.add = async (req, res, next) => {
    if(!req.body.TenSach) {
        return next(new ApiError(400, "Tên sách không được để trống!"))
    }
    try {
        await verifyToken(req, res)
         
        const bookservice = new bookService()
        const result = await bookservice.add(req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        if(error == 'Unauthorized !') {
            return next(new ApiError(401, error))
        }
        return next(new ApiError(500, "An error occurred while adding book !"))
    }

    module.exports.add = async (req, res, next) => {
  console.log('Payload received add book:', req.body);
  try {
    await verifyToken(req, res);
    const bookservice = new bookService();
    const result = await bookservice.add(req.body);
    console.log('Service result:', result);
    res.json(result);
  } catch (error) {
    console.error('❌ Error in add book controller:', error);
    if (error === 'Unauthorized !') {
      return next(new ApiError(401, error));
    }
    return next(new ApiError(500, "Error while adding book"));
  }
};

}

// [PATCH] [/books/:MaSach]
module.exports.update = async (req, res, next) => {
    try {
        await verifyToken(req, res)
        
        // ✅ Tìm sách theo MaSach trước
        const existingBook = await bookModel.findOne({MaSach: req.params.MaSach})
        if (!existingBook) {
            return next(new ApiError(404, "Không tìm thấy sách!"))
        }
        
        const bookservice = new bookService()
        // ✅ Truyền _id thay vì MaSach vì service.update() expect _id
        const dataToUpdate = {
            ...req.body,
            _id: existingBook._id
        }
        const result = await bookservice.update(dataToUpdate)
        res.json(result)
    } catch (error) {
        console.log(error)
        if(error == 'Unauthorized !') {
            return next(new ApiError(401, error))
        }
        return next(new ApiError(500, "An error occurred while updating book !"))
    }
}

// [DELETE] [/books/:MaSach]
module.exports.delete = async (req, res, next) => {
    try {
        await verifyToken(req, res)
        const bookservice = new bookService()
        const result = await bookservice.delete(req.params.MaSach)
        if(!result) {
            return next(new ApiError(404, "Không tìm thấy sách!"))
        }
        return res.json({
            result,
            message: "Xóa sách thành công!"
        })
    } catch (error) {
        console.log(error)
        if(error == 'Unauthorized !') {
            return next(new ApiError(401, error))
        }
        return next(new ApiError(500, "An error occurred while deleting book !"))
    }
}

// [DELETE] [/books]
module.exports.deleteAll = async (req, res, next) => {
    try {
        await verifyToken(req, res)
        const bookservice = new bookService()
        const deletedCount = await bookservice.deleteAll()
        res.json({
            message: `${deletedCount} sách được xóa thành công!`
        })
    } catch (error) {
        console.log(error)
        if(error == 'Unauthorized !') {
            return next(new ApiError(401, error))
        }
        return next(new ApiError(500, "An error occurred deleting all books !"))
    }
}