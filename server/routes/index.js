const authenticationRouter = require("./authen/auth.route")
const bookRouter = require("./book/book.route")
const bookBorrwRouter = require("./bookBorrow/bookBorrow.route")
const publisherRouter = require("./publisher/publisher.route")
module.exports = (app) =>{
    app.use('/authen', authenticationRouter)
    app.use('/book', bookRouter)
    app.use('/borrow', bookBorrwRouter)
    app.use('/publisher', publisherRouter)
}