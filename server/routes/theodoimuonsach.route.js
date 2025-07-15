const express = require("express")
const router =  express.Router()

const bookBorrwoController = require("../../controllers/bookBorrow.controller")

router
    .get('/', bookBorrwoController.getAllForUser)
    .get('/admin', bookBorrwoController.getAllForAdmin)
    .post('/add', bookBorrwoController.addBorrow) //user
    .patch('/admin/update', bookBorrwoController.updateBorrowForAdmin)
    .delete('/user/delete/:borrowId', bookBorrwoController.deleteBorrowForUser)
    .delete('/admin/delete/:borrowId', bookBorrwoController.deleteBorrowForAdmin)
module.exports = router