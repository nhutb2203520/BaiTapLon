const express = require("express")
const router =  express.Router()

const bookController = require('../../controllers/book.controller')

router
    .get('/', bookController.getAll)
    .post('/add', bookController.add)
    .patch('/update', bookController.update)
    .delete('/delete/:MaSach', bookController.delete)
    .delete('/delete', bookController.deleteAll)

module.exports = router