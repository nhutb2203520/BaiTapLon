const authenticationRouter = require("../routes/XacThuc.route")
const bookRouter = require("../routes/Sach.route")
const bookBorrwRouter = require("../routes/TheoDoiMuonSach.route")
const publisherRouter = require("../routes/NhaXuatBan.route")
module.exports = (app) =>{
    app.use('/authen', authenticationRouter)
    app.use('/book', bookRouter)
    app.use('/borrow', bookBorrwRouter)
    app.use('/publisher', publisherRouter)
}
