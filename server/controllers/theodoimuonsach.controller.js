const bookBorrowService = require('../services/bookBorrow.service')
const jwt = require('jsonwebtoken')
const ApiError = require('../api-error')


function verifyTokenForUser (req, res) {
    const token = req.headers['authorization']
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET || 'NhutB2203520', (error, user) => {
            if( error ) {  //Khong quan tam den user.ChucVu
                return reject('Không được phép (user) !')
            }
            else {
                resolve(user) 
            }
        }) 
    })
}


function verifyTokenForAdmin (req, res) {
    const token = req.headers['authorization']
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET || 'NhutB2203520', (error, user) => {
            if( error || !user.ChucVu ) { 
                return reject('Không được phép (admin) !')
            }
            else {
                resolve(user)
            }
        }) 
    })
}

//for user
module.exports.getAllForUser = async (req, res, next) =>{
    try {
        const user = await verifyTokenForUser(req, res)
        const borrowService = new bookBorrowService()
        const result = await borrowService.getAllForUser(user._id)
        res.json(result)
    } catch (error) {
        console.log(error)
        if(error == 'Không được phép (user) !') {
            return next( new ApiError(401, error))
        }
        return next( new ApiError(500,"Lỗi khi lấy tất cả cho người dùng !" ))
    }
}

module.exports.addBorrow = async (req, res, next) =>{
    try {
       const user =  await verifyTokenForUser(req, res)
        const borrowService = new bookBorrowService()
        const result = await borrowService.addBorrow( req.body, user._id)
        if(result) {
            res.json(result)
        }
    } catch (error) {
        console.log(error)
        if( error ==  'Không được phép (user) !') {
            return next(new ApiError(401, error))
        }
        return next( new ApiError(500, "Lỗi khi lấy tất cả cho người dùng !"))
    }
}

module.exports.deleteBorrowForUser = async (req, res, next) =>{
    try {
        const borrowId = req.params.borrowId
        const user =  await verifyTokenForUser(req, res)
        const borrowService = new bookBorrowService()
        const result = await borrowService.deleteBorrowForUser(borrowId)
        if(result) {
            res.json(result)
        }
    } catch (error) {
        console.log(error)
        if(error == 'Không được phép (user) !') {
            return next( new ApiError(401, error))
        }
        return next(new ApiError(500,"Lỗi khi xóa mượn sách cho độc giả !" ))
    }
}

//for admin
module.exports.deleteBorrowForAdmin = async (req, res, next) =>{
    try {
        const borrowId = req.params.borrowId
        const user =  await verifyTokenForAdmin(req, res)
        const borrowService = new bookBorrowService()
        const result = await borrowService.deleteBorrowForAdmin(borrowId)
        if(result) {
            res.json(result)
        }
    } catch (error) {
        console.log(error)
        if(error == 'Không được phép (Admin) !') {
            return next( new ApiError(401, error))
        }
        return next(new ApiError(500,"Lỗi khi xóa mượn sách cho admin !" ))
    }
}

module.exports.updateBorrowForAdmin = async (req, res, next) =>{
    try {
        const user =  await verifyTokenForAdmin(req, res)
        const borrowService = new bookBorrowService()
        const result = await borrowService.updateBorrowForAdmin(user._id, req.body)
        if(result) {
            res.json(result)
        }
    } catch (error) {
        console.log(error)
        if(error == 'Không được phép (admin) !') {
            return next( new ApiError(401, error))
        }
        return next(new ApiError(500,"Lỗi khi cập nhật mượn sách cho admin!" ))
    }
}

module.exports.getAllForAdmin = async (req, res, next) =>{
    try {
        const user =  await verifyTokenForAdmin(req, res)
        const borrowService = new bookBorrowService()
        const result = await borrowService.getAllForAdmin()
        if(result) {
            res.json(result)
        }
    } catch (error) {
        console.log(error)
        if(error == 'Không được phép (admin) !') {
            return next( new ApiError(401, error))
        }
        return next(new ApiError(500,"Lỗi khi lấy cả cho admin !" ))
    }
}