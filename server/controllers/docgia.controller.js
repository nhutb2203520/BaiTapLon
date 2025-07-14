const ApiError = require('../api-error')
const UserService = require('../service/user.service')
//lấy độc giả
module.exports.getAlldocgia = async (req, res, next) =>{
    try{
        const UserService = new UserService()
        const result = await userService.getAll()
        return res.status(200).json(result)
    } catch(err){
        console.log(err)
        return next(new ApiError(500,'Lỗi khi lấy danh sách độc giả'))
    }
}