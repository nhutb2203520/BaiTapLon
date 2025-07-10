const mongoose = require('mongoose')

const connect = async (url) => {
    try {
        await mongoose.connect(url)
        console.log("Kết nối cơ sở dữ liệu thành công")
    } catch (err) {
        console.log("Kết nối cơ sở dữ liệu thất bại")
        process.exit(1) // Dừng ngay lập tức
    }
}
module.exports = connect