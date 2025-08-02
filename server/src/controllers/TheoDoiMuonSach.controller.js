const bookBorrowService = require('../services/TheoDoiMuonSach.service')
const jwt = require('jsonwebtoken')
const ApiError = require('../ApiError')

// ✅ Chuẩn hóa hàm verify token để hỗ trợ cả Bearer và non-Bearer
function verifyTokenForUser(req, res) {
    let token = req.headers['authorization']
    
    // Xử lý cả trường hợp có và không có Bearer prefix
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7) // Bỏ "Bearer " prefix
    }
    
    return new Promise((resolve, reject) => {
        if (!token) {
            return reject('No token provided!')
        }
        
        jwt.verify(token, process.env.JWT_SECRET || 'NHUTB2203520', (error, user) => {
            if (error) {
                console.error('❌ JWT verification failed:', error.message)
                return reject('Unauthorized !')
            } else {
                console.log('✅ Token verified for user:', user._id)
                resolve(user)
            }
        }) 
    })
}

// ✅ Chuẩn hóa hàm verify token cho admin
function verifyTokenForAdmin(req, res) {
    let token = req.headers['authorization']
    
    // Xử lý cả trường hợp có và không có Bearer prefix
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7) // Bỏ "Bearer " prefix
    }
    
    return new Promise((resolve, reject) => {
        if (!token) {
            return reject('No token provided!')
        }
        
        jwt.verify(token, process.env.JWT_SECRET || 'NHUTB2203520', (error, user) => {
            if (error || !user.ChucVu) { 
                console.error('❌ JWT verification failed for admin:', error?.message || 'No ChucVu')
                return reject('Unauthorized !')
            } else {
                console.log('✅ Token verified for admin:', user._id)
                resolve(user)
            }
        }) 
    })
}

//for user
module.exports.getAllForUser = async (req, res, next) => {
    try {
        console.log('📥 Controller: getAllForUser called')
        const user = await verifyTokenForUser(req, res)
        console.log('✅ Controller: User verified:', user._id)
        
        const borrowService = new bookBorrowService()
        const result = await borrowService.getAllForUser(user._id)
        
        console.log('✅ Controller: Retrieved borrows:', result.borrows?.length || 0)
        res.json(result)
    } catch (error) {
        console.error('❌ Controller: getAllForUser error:', error)
        if (error == 'Unauthorized !' || error == 'No token provided!') {
            return next(new ApiError(401, error))
        }
        return next(new ApiError(500, "An error occurred while getAllForUser !"))
    }
}

module.exports.addBorrow = async (req, res, next) => {
    try {
        console.log('📥 Controller: addBorrow called with body:', req.body)
        console.log('📥 Controller: Authorization header:', req.headers['authorization']?.substring(0, 30) + '...')
        
        const user = await verifyTokenForUser(req, res)
        console.log('✅ Controller: User verified for borrow:', user._id)
        
        const borrowService = new bookBorrowService()
        const result = await borrowService.addBorrow(req.body, user._id)
        
        if (result) {
            console.log('✅ Controller: Borrow added successfully:', result.borrow?._id)
            res.json(result)
        }
    } catch (error) {
        console.error('❌ Controller: addBorrow error:', error)
        if (error == 'Unauthorized !' || error == 'No token provided!') {
            return next(new ApiError(401, error))
        }
        
        // ✅ Trả về lỗi cụ thể từ service
        return next(new ApiError(400, error.message || "An error occurred while adding borrow !"))
    }
}

module.exports.deleteBorrowForUser = async (req, res, next) => {
    try {
        const borrowId = req.params.borrowId
        console.log('📥 Controller: deleteBorrowForUser called for:', borrowId)
        
        const user = await verifyTokenForUser(req, res)
        console.log('✅ Controller: User verified for delete:', user._id)
        
        const borrowService = new bookBorrowService()
        const result = await borrowService.deleteBorrowForUser(borrowId)
        
        if (result) {
            console.log('✅ Controller: Borrow deleted successfully')
            res.json(result)
        }
    } catch (error) {
        console.error('❌ Controller: deleteBorrowForUser error:', error)
        if (error == 'Unauthorized !' || error == 'No token provided!') {
            return next(new ApiError(401, error))
        }
        return next(new ApiError(500, "An error occurred while deleteBorrowForUser !"))
    }
}

//for admin
module.exports.deleteBorrowForAdmin = async (req, res, next) => {
    try {
        const borrowId = req.params.borrowId
        console.log('📥 Controller: deleteBorrowForAdmin called for:', borrowId)
        
        const user = await verifyTokenForAdmin(req, res)
        console.log('✅ Controller: Admin verified for delete:', user._id)
        
        const borrowService = new bookBorrowService()
        const result = await borrowService.deleteBorrowForAdmin(borrowId)
        
        if (result) {
            console.log('✅ Controller: Admin borrow deleted successfully')
            res.json(result)
        }
    } catch (error) {
        console.error('❌ Controller: deleteBorrowForAdmin error:', error)
        if (error == 'Unauthorized !' || error == 'No token provided!') {
            return next(new ApiError(401, error))
        }
        return next(new ApiError(500, "An error occurred while deleteBorrowForAdmin !"))
    }
}

// ✅ FIXED: Cải thiện updateBorrowForAdmin
module.exports.updateBorrowForAdmin = async (req, res, next) => {
    try {
        console.log('📥 Controller: updateBorrowForAdmin called')
        console.log('📥 Controller: Request body:', req.body)
        console.log('📥 Controller: Request headers:', {
            authorization: req.headers['authorization']?.substring(0, 30) + '...',
            contentType: req.headers['content-type']
        })
        
        const user = await verifyTokenForAdmin(req, res)
        console.log('✅ Controller: Admin verified for update:', user._id)
        
        // ✅ Validate request body
        if (!req.body.borrowId && !req.body._id) {
            return next(new ApiError(400, "borrowId hoặc _id là bắt buộc"))
        }
        
        if (!req.body.TrangThai) {
            return next(new ApiError(400, "TrangThai là bắt buộc"))
        }

        // ✅ Chuẩn hóa dữ liệu request
        const updateData = {
            borrowId: req.body.borrowId || req.body._id,
            TrangThai: req.body.TrangThai
        }

        console.log('📝 Controller: Normalized update data:', updateData)
        
        const borrowService = new bookBorrowService()
        const result = await borrowService.updateBorrowForAdmin(user._id, updateData)
        
        if (result) {
            console.log('✅ Controller: Admin borrow updated successfully')
            res.json(result)
        } else {
            return next(new ApiError(500, "Không thể cập nhật trạng thái mượn sách"))
        }
        
    } catch (error) {
        console.error('❌ Controller: updateBorrowForAdmin error:', error)
        
        if (error == 'Unauthorized !' || error == 'No token provided!') {
            return next(new ApiError(401, error))
        }
        
        // ✅ Trả về lỗi cụ thể từ service
        const statusCode = error.name === 'ValidationError' ? 400 : 500
        return next(new ApiError(statusCode, error.message || "An error occurred while updateBorrowForAdmin !"))
    }
}

module.exports.getAllForAdmin = async (req, res, next) => {
    try {
        console.log('📥 Controller: getAllForAdmin called')
        
        const user = await verifyTokenForAdmin(req, res)
        console.log('✅ Controller: Admin verified:', user._id)
        
        const borrowService = new bookBorrowService()
        const result = await borrowService.getAllForAdmin()
        
        if (result) {
            console.log('✅ Controller: Retrieved admin borrows:', result.borrows?.length || 0)
            res.json(result)
        }
    } catch (error) {
        console.error('❌ Controller: getAllForAdmin error:', error)
        if (error == 'Unauthorized !' || error == 'No token provided!') {
            return next(new ApiError(401, error))
        }
        return next(new ApiError(500, "An error occurred while getAllForAdmin !"))
    }
}