const publisherService = require('../services/NhaXuatBan.service')
const jwt = require('jsonwebtoken')
const ApiError = require('../ApiError')
function verifyToken(req, res) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("❌ Thiếu hoặc sai định dạng Bearer Token!");
        return Promise.reject('Unauthorized !');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.decode(token);
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET || 'NHUTB2203520', (error, user) => {
            if (error || !user) {
                return reject('Unauthorized !');
            }

            // Kiểm tra xem có ChucVu không
            if (!user.ChucVu) {
                return reject('Unauthorized !');
            }

            resolve(user);
        });
    });
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
        if (error == 'Unauthorized !'){
            return next( new ApiError(401, error))
        }
        return next( new ApiError(500, "An error occurred while Add Publisher !"))
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
        if(error == 'Unauthorized !') {
            return next ( new ApiError(401, error))
        } else {
            return next( new ApiError(500, "An error occurred while update !"))
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
        if(error == 'Unauthorized !') {
            return next ( new ApiError(401, error))
        } else {
            return next( new ApiError(500, "An error occurred while delete !"))
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
        console.log("❌ Error in getAll:", error)
        if(error == 'Unauthorized !') {
            return next ( new ApiError(401, error))
        } else {
            return next( new ApiError(500, "An error occurred while getAll !"))
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
        if(error == 'Unauthorized !') {
            return next ( new ApiError(401, error))
        } else {
            return next( new ApiError(500, "An error occurred while deleteAll !"))
        }
    }
}

