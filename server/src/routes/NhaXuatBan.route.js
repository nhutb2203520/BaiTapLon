const express = require("express")
const router =  express.Router()

const publisherController = require("../controllers/NhaXuatBan.controller")


router
    .get('/', publisherController.getAll)
    .post('/add', publisherController.add)
    .patch('/update/:MaNXB', publisherController.update)
    .delete('/delete/:MaNXB', publisherController.delete)
    .delete('/deleteAll', publisherController.deleteAll)

module.exports  = router 