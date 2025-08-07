const authenticationRouter = require("../routes/XacThuc.route")
const bookRouter = require("../routes/Sach.route")
const bookBorrwRouter = require("../routes/TheoDoiMuonSach.route")
const publisherRouter = require("../routes/NhaXuatBan.route")
const docGiaRouter = require("../routes/DocGia.route") // Thêm route độc giả

module.exports = (app) => {
    app.use('/authen', authenticationRouter)
    app.use('/books', bookRouter)
    app.use('/borrow', bookBorrwRouter)
    app.use('/publisher', publisherRouter)
    app.use('/readers', docGiaRouter) 
}