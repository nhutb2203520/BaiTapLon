const express = require("express")
const router = express.Router()

const bookController = require('../controllers/Sach.controller')

// ✅ Routes khớp với frontend calls
router
    .get('/', bookController.getAll)              // GET /books
    .get('/hot', bookController.getHot)           // GET /books/hot
    .get('/new', bookController.getNew)           // GET /books/new
    .get('/:MaSach', bookController.getById)      // GET /books/:MaSach
    .post('/', bookController.add)                // POST /books
    .patch('/:MaSach', bookController.update)     // PATCH /books/:MaSach
    .delete('/:MaSach', bookController.delete)    // DELETE /books/:MaSach
    .delete('/', bookController.deleteAll)        // DELETE /books

module.exports = router