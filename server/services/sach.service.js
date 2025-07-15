const bookModel = require('../models/book.model')

module.exports = class bookService {
     async  getAll() {
        const books = await bookModel.find().populate('MaNXB')
        return{
         books: books,
         message:'Lấy sách thành công!'
        }
     }

     async add(data) {
      const isValid =  await bookModel.findOne({
         $or: [{TenSach: data.TenSach}, {MaSach: data.MaSach}]
      })
      
      if(!isValid) {

         const newBook = new bookModel(data)
         const savedBook = await newBook.save()
         const returnBook =  await savedBook.populate('MaNXB')
         return {
            book: returnBook,
            message: 'Thêm sách thành công!'
         }
      }
      return {
         message: "Sách đã tồn tại !",
      }
     }

    async update( data) {
      const updatedBook = await bookModel.findOneAndUpdate(
         {_id: data._id},
         { $set: {
            TenSach: data.TenSach,
            DonGia: data.DonGia,
            SoQuyen: data.SoQuyen,
            NamXuatBan: data.NamXuatBan,
            TacGia: data.TacGia,
            MaNXB: data.MaNXB,
            image:data.image
         }
         },
         { new: true}
      )
      if(!updatedBook) {
         return{
            message:'Không tìm thấy sách !'
         }
      }
       await updatedBook.populate('MaNXB')
       return {
         book: updatedBook,
         message: 'Cập nhật sách thành công!'
       }
     }

     async delete (bookCode) {
      const deletedBook = await bookModel.findOneAndDelete({MaSach: bookCode})
      return deletedBook
   }

   async deleteAll() {
      const result = await bookModel.deleteMany({})
     return result.deletedCount
   }
}