const bookModel = require('../models/Sach.model')

module.exports = class bookService {
    async getAll() {
        const books = await bookModel.find().populate({
            path: 'MaNXB',
            localField: 'MaNXB',
            foreignField: 'MaNXB'
        }).sort({ createdAt: -1 }) // ✅ THÊM: Sắp xếp theo thời gian tạo
        
        return {
            danhsachsach: books,
            message: 'Lấy sách thành công!'
        }
    }

    // ✅ THÊM: Method lấy sách nổi bật (nhiều lượt mượn nhất)
    async getHot() {
        const books = await bookModel.find()
            .populate({
                path: 'MaNXB',
                localField: 'MaNXB',
                foreignField: 'MaNXB'
            })
            .sort({ SoLuongDaMuon: -1 }) // Sắp xếp theo số lượng đã mượn giảm dần
            .limit(10) // Lấy 10 sách nổi bật nhất

        return {
            danhsachsach: books,
            message: 'Lấy sách nổi bật thành công!'
        }
    }

    // ✅ THÊM: Method lấy sách mới
    async getNew() {
        const books = await bookModel.find()
            .populate({
                path: 'MaNXB',
                localField: 'MaNXB',
                foreignField: 'MaNXB'
            })
            .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo giảm dần
            .limit(10) // Lấy 10 sách mới nhất

        return {
            danhsachsach: books,
            message: 'Lấy sách mới thành công!'
        }
    }

    // ✅ THÊM: Method lấy sách theo ID
    async getById(MaSach) {
        const book = await bookModel.findOne({ MaSach: MaSach }).populate({
            path: 'MaNXB',
            localField: 'MaNXB',
            foreignField: 'MaNXB'
        })

        if (!book) {
            return {
                success: false,
                message: 'Không tìm thấy sách!'
            }
        }

        return {
            success: true,
            sach: book,
            message: 'Lấy thông tin sách thành công!'
        }
    }

    async add(data) {
        console.log('📝 Service add data:', data);

        const isValid = await bookModel.findOne({
            $or: [{ TenSach: data.TenSach }, { MaSach: data.MaSach }]
        })

        if (!isValid) {
            // ✅ THÊM: Đảm bảo image được lưu đúng
            const bookData = {
                TenSach: data.TenSach,
                DonGia: data.DonGia,
                SoQuyen: data.SoQuyen,
                NamXuatBan: data.NamXuatBan,
                TacGia: data.TacGia,
                MaNXB: data.MaNXB,
                image: data.image || null, // ✅ Lưu URL ảnh hoặc null
                SoLuongDaMuon: data.SoLuongDaMuon || 0
            }

            const newBook = new bookModel(bookData)
            const savedBook = await newBook.save()

            const returnBook = await savedBook.populate({
                path: 'MaNXB',
                localField: 'MaNXB',
                foreignField: 'MaNXB'
            })

            console.log('✅ Book saved successfully:', returnBook);

            return {
                success: true,
                sach: returnBook,
                message: 'Thêm sách thành công!'
            }
        }
        return {
            success: false,
            message: "Sách đã tồn tại !",
        }
    }

    async update(data) {
        console.log('✏️ Service update data:', data);

        // ✅ THÊM: Tìm theo MaSach thay vì _id
        const updatedBook = await bookModel.findOneAndUpdate(
            { MaSach: data.MaSach },
            {
                $set: {
                    TenSach: data.TenSach,
                    DonGia: data.DonGia,
                    SoQuyen: data.SoQuyen,
                    NamXuatBan: data.NamXuatBan,
                    TacGia: data.TacGia,
                    MaNXB: data.MaNXB,
                    image: data.image, // ✅ Cập nhật ảnh
                    SoLuongDaMuon: data.SoLuongDaMuon
                }
            },
            { new: true }
        )

        if (!updatedBook) {
            return {
                success: false,
                message: 'Không tìm thấy sách !'
            }
        }

        await updatedBook.populate({
            path: 'MaNXB',
            localField: 'MaNXB',
            foreignField: 'MaNXB'
        })

        return {
            success: true,
            sach: updatedBook,
            message: 'Cập nhật sách thành công!'
        }
    }

    async delete(MaSach) {
        const deletedBook = await bookModel.findOneAndDelete({ MaSach: MaSach })
        return deletedBook
    }

    async deleteAll() {
        const result = await bookModel.deleteMany({})
        return result.deletedCount
    }
}