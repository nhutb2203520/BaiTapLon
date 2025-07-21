const publisherService = require('../services/publisher.service')
const jwt = require('jsonwebtoken')
const ApiError = require('../ApiError')
function verifyToken (req, res) {
    const token = req.headers['authorization']
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET || 'NhutB2203520', (error, user) => {
            if( error || !user.ChucVu ) { 
                return reject('Không được phép !')
            }
            else {
                resolve(user)
            }
        }) 
    })
}
// [POST] [publisher/add]
module.exports.add =  async (req, res, next ) =>{
    if(!req.body?.TenNXB) {
        return next ( new ApiError(400, "Tên nhà xuất bản không được để trống!"))
    }
    try {
        await verifyToken(req, res)
        const publisher = new publisherService()
        const result =  await publisher.add(req.body)
        res.json(result)

    } catch (error) {
        console.log(error)
        if (error == 'Không được phép !'){
            return next( new ApiError(401, error))
        }
        return next( new ApiError(500, "Lỗi khi thêm nhà xuất bản!"))
    }
}


//[PATCH] /publisher/update/:MaNXB
module.exports.update = async (req, res , next) =>{
    try {
        await verifyToken(req, res) 
        const publisher = new publisherService()
        const result = await publisher.update( req.body)
        if(!result) {
            return next ( new ApiError(404, "Không tìm thấy nhà xuất bản!") )
        }
        return res.json(result)
    } catch (error) {
        console.log(error)
        if(error == 'Không được phép !') {
            return next ( new ApiError(401, error))
        } else {
            return next( new ApiError(500, "Lỗi khi cập nhật nhà xuất bản !"))
        }
    }
}


//[DELETE] /publisher/delete/:MaNXB
module.exports.delete =  async (req, res, next ) =>{
    try {
        await verifyToken(req, res) 
        const publisher = new publisherService()
        const result = await publisher.delete(req.params.MaNXB)
        if(!result) {
            return next(new ApiError (404, "Không tìm thấy nhà xuất bản!"))
        }
        return res.json(result)
    } catch (error) {
        console.log(error)
        if(error == 'Không được phép !') {
            return next ( new ApiError(401, error))
        } else {
            return next( new ApiError(500, "Lỗi khi xóa nhà xuất bản !"))
        }
    }
}

//[GET] /publisher/
module.exports.getAll = async ( req, res, next) =>{
    try {
        await verifyToken(req, res)
        const publisher = new publisherService()
        const {TenNXB} = req.query
        if(!TenNXB) {
            const result = await publisher.find({})
            res.json(result)
        } else {
            const result = await publisher.findByName(TenNXB)
            res.json(result)
        }
    } catch (error) {
        console.log(error)
        if(error == 'Không được phép !') {
            return next ( new ApiError(401, error))
        } else {
            return next( new ApiError(500, "Đã xảy ra lỗi khi lấy tất cả. !"))
        }
    }
}

//[DELETE] publisher/deleteAll
module.exports.deleteAll = async ( req, res, next) =>{
    try {
        await verifyToken(req, res)
        const publisher = new publisherService()
        const deleteCount = await publisher.deleteAll()
        res.json({
            message: `${deleteCount} Nhà xuất bản được xóa thành công!`
        })
    } catch (error) {
        console.log(error)
        if(error == 'Không được phép !') {
            return next ( new ApiError(401, error))
        } else {
            return next( new ApiError(500, "Lỗi khi xóa tất cả !"))
        }
    }
} 