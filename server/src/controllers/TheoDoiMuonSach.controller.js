const bookBorrowService = require('../services/TheoDoiMuonSach.service')
const jwt = require('jsonwebtoken')
const ApiError = require('../ApiError')


function verifyTokenForUser (req, res) {
    const token = req.headers['authorization']
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET || 'B2203510_CT449_HKI2024-2025', (error, user) => {
            if( error ) {  //Khong quan tam den user.ChucVu
                return reject('Unauthorized !')
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
        jwt.verify(token, process.env.JWT_SECRET || 'B2203510_CT449_HKI2024-2025', (error, user) => {
            if( error || !user.ChucVu ) { 
                return reject('Unauthorized !')
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
        if(error == 'Unauthorized !') {
            return next( new ApiError(401, error))
        }
        return next( new ApiError(500,"An error occurred while getAllForUser !" ))
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
        if( error ==  'Unauthorized !') {
            return next(new ApiError(401, error))
        }
        return next( new ApiError(500, "An error occurred while getAllForUser !"))
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
        if(error == 'Unauthorized !') {
            return next( new ApiError(401, error))
        }
        return next(new ApiError(500,"An error occurred while deleteBorrowForUser !" ))
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
        if(error == 'Unauthorized !') {
            return next( new ApiError(401, error))
        }
        return next(new ApiError(500,"An error occurred while deleteBorrowForAdmin !" ))
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
        if(error == 'Unauthorized !') {
            return next( new ApiError(401, error))
        }
        return next(new ApiError(500,"An error occurred while updateBorrowForAdmin !" ))
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
        if(error == 'Unauthorized !') {
            return next( new ApiError(401, error))
        }
        return next(new ApiError(500,"An error occurred while getAllForAdmin !" ))
    }
}