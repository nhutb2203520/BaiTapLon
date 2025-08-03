const bookBorrowService = require('../services/TheoDoiMuonSach.service')
const jwt = require('jsonwebtoken')
const ApiError = require('../ApiError')

// ========== TOKEN HELPERS ==========
const extractToken = (req) => {
  let token = req.headers['authorization'] || ''
  return token.startsWith('Bearer ') ? token.slice(7) : token
}

const verifyToken = (req, checkAdmin = false) => {
  const token = extractToken(req)
  if (!token) throw new Error('No token provided!')

  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET || 'NHUTB2203520', (err, user) => {
      if (err || (checkAdmin && !user.ChucVu)) {
        return reject('Unauthorized !')
      }
      resolve(user)
    })
  })
}

// ========== USER CONTROLLERS ==========

// [GET] /borrow/user
module.exports.getAllForUser = async (req, res, next) => {
  try {
    const user = await verifyToken(req)
    const service = new bookBorrowService()
    const result = await service.getAllForUser(user._id)
    res.json(result)
  } catch (error) {
    next(new ApiError(401, error))
  }
}

// [POST] /borrow/user
module.exports.addBorrow = async (req, res, next) => {
  try {
    const user = await verifyToken(req)
    const service = new bookBorrowService()
    const result = await service.addBorrow(req.body, user._id)
    res.json(result)
  } catch (error) {
    next(new ApiError(400, error.message || 'Lỗi khi thêm mượn sách'))
  }
}

// [DELETE] /borrow/user/:borrowId
module.exports.deleteBorrowForUser = async (req, res, next) => {
  try {
    await verifyToken(req)
    const service = new bookBorrowService()
    const result = await service.deleteBorrowForUser(req.params.borrowId)
    res.json(result)
  } catch (error) {
    next(new ApiError(401, error))
  }
}

// ========== ADMIN CONTROLLERS ==========

// [GET] /borrow/admin
module.exports.getAllForAdmin = async (req, res, next) => {
  try {
    await verifyToken(req, true)
    const service = new bookBorrowService()
    const result = await service.getAllForAdmin()
    res.json(result)
  } catch (error) {
    next(new ApiError(401, error))
  }
}

// [DELETE] /borrow/admin/:borrowId
module.exports.deleteBorrowForAdmin = async (req, res, next) => {
  try {
    await verifyToken(req, true)
    const service = new bookBorrowService()
    const result = await service.deleteBorrowForAdmin(req.params.borrowId)
    res.json(result)
  } catch (error) {
    next(new ApiError(401, error))
  }
}

// [PATCH] /borrow/admin
module.exports.updateBorrowForAdmin = async (req, res, next) => {
  try {
    await verifyToken(req, true)
    const { borrowId, _id, TrangThai } = req.body
    if (!TrangThai || (!borrowId && !_id)) {
      return next(new ApiError(400, 'Thiếu borrowId/_id hoặc trạng thái'))
    }

    const service = new bookBorrowService()
    const result = await service.updateBorrowForAdmin(req.user?._id, {
      borrowId: borrowId || _id,
      TrangThai
    })
    res.json(result)
  } catch (error) {
    next(new ApiError(400, error.message || 'Lỗi khi cập nhật trạng thái'))
  }
}
