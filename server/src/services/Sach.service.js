const bookModel = require('../models/Sach.model')

module.exports = class bookService {
    async getAll() {
        // ✅ Populate với Number field
        const books = await bookModel.find().populate({
            path: 'MaNXB',
            localField: 'MaNXB',
            foreignField: 'MaNXB'
        })
        return {
            danhsachsach: books,
            message: 'Lấy sách thành công!'
        }
    }

    async add(data) {
        console.log('📝 Service add data:', data);
        
        const isValid = await bookModel.findOne({
            $or: [{ TenSach: data.TenSach }, { MaSach: data.MaSach }]
        })

        if (!isValid) {
            const newBook = new bookModel(data)
            const savedBook = await newBook.save()
            
            // ✅ Populate với Number field
            const returnBook = await savedBook.populate({
                path: 'MaNXB',
                localField: 'MaNXB',
                foreignField: 'MaNXB'
            })
            
            console.log('✅ Book saved successfully:', returnBook);
            
            return {
                sach: returnBook,
                message: 'Thêm sách thành công!'
            }
        }
        return {
            message: "Sách đã tồn tại !",
        }
    }

    async update(data) {
        const updatedBook = await bookModel.findOneAndUpdate(
            { _id: data._id },
            {
                $set: {
                    TenSach: data.TenSach,
                    DonGia: data.DonGia,
                    SoQuyen: data.SoQuyen,
                    NamXuatBan: data.NamXuatBan,
                    TacGia: data.TacGia,
                    MaNXB: data.MaNXB,
                    image: data.image
                }
            },
            { new: true }
        )

        if (!updatedBook) {
            return {
                message: 'Không tìm thấy sách !'
            }
        }

        // ✅ Populate với Number field
        await updatedBook.populate({
            path: 'MaNXB',
            localField: 'MaNXB',
            foreignField: 'MaNXB'
        })

        return {
            sach: updatedBook,
            message: 'Cập nhật sách thành công!'
        }
    }

    async delete(bookCode) {
        const deletedBook = await bookModel.findOneAndDelete({ MaSach: bookCode })
        return deletedBook
    }

    async deleteAll() {
        const result = await bookModel.deleteMany({})
        return result.deletedCount
    }
}