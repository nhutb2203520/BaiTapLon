const authenticationRouter = require("./XacThuc.route")
const bookRouter = require("./Sach.route")
const bookBorrwRouter = require("./TheoDoiMuonSach.route")
const publisherRouter = require("./NhaXuatBan.route")
module.exports = (app) =>{
    app.use('/authen', authenticationRouter)
    app.use('/book', bookRouter)
    app.use('/borrow', bookBorrwRouter)
    app.use('/publisher', publisherRouter)
}
