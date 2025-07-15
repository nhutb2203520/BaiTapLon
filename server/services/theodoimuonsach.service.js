const bookModel = require('../models/book.model')
const bookBorrowModel = require('../models/bookBorrow.model')

module.exports = class bookBorrowService {
    // for admin
     async getAllForAdmin () {
        const borrowList = await bookBorrowModel.find({}) 
                                                .populate('MaSach')
                                                .populate('MaNhanVien',["HoTenNV", "ChucVu", "SoDienThoai"])
                                                .populate('MaDocGia', ['HoLot', 'Ten', 'NgaySinh', 'GioiTinh', 'DiaChi', 'SoDienThoai'])
        return {
            borrows: borrowList,
            message:"Lấy thông tin mượn sách thành công!"
        }
    }
    
    async deleteBorrowForAdmin ( borrowId) {
        const borrow = await bookBorrowModel.findOneAndDelete({_id : borrowId})
        if(borrow) {
            if(borrow.TrangThai != 'paid') {
                const book = await bookModel.findById(borrow.MaSach)
                await bookModel.findByIdAndUpdate(borrow.MaSach,{$set: {SoLuongDaMuon: book.SoLuongDaMuon - borrow.SoLuongMuon}})
            }
        }
        return {
            borrow: borrow,
            message: "Xóa mượn sách thành công!"
        }
    }

     async updateBorrowForAdmin ( staffId, updateData) {
         if(updateData.TrangThai == 'borrow') {
            const borrow = await bookBorrowModel.findOneAndUpdate(
                {_id : updateData._id},
                {
                    TrangThai: updateData.TrangThai,
                    NgayMuon: Date.now(),
                    MaNhanVien: staffId
                },
                {new: true}
            )
            
           const borrowDetail = await bookBorrowModel.findOne(({_id : updateData._id}))
                                                    .populate('MaSach')
                                                    .populate('MaNhanVien',["HoTenNV", "ChucVu", "SoDienThoai"])
                                                    .populate('MaDocGia', ['HoLot', 'Ten', 'NgaySinh', 'GioiTinh', 'DiaChi', 'SoDienThoai'])
            return{
                borrow: borrowDetail,
                message: "Cập nhật thành công!"
            } 
         }

         else if( updateData.TrangThai == 'paid') {
            const borrow = await bookBorrowModel.findOne({_id: updateData._id})
            const book = await bookModel.findOne({_id: borrow.MaSach}) //ma sach o day la ID
            const returnDay = Date.now()
            borrow.TrangThai = updateData.TrangThai
            borrow.MaNhanVien = staffId
            borrow.NgayTra = returnDay
            await borrow.save()
            await bookModel.findByIdAndUpdate(borrow.MaSach,{ $set: {SoLuongDaMuon: book.SoLuongDaMuon - borrow.SoLuongMuon}})
            const savedBorrow = await bookBorrowModel.findOne({_id: updateData._id})
                                                    .populate('MaSach')
                                                    .populate('MaNhanVien',["HoTenNV", "ChucVu", "SoDienThoai"])
                                                    .populate('MaDocGia', ['HoLot', 'Ten', 'NgaySinh', 'GioiTinh', 'DiaChi', 'SoDienThoai'])
           return {
            borrow: savedBorrow,
            message: "Cập nhật thành công!"
           }
         }
    }

    //for user

    async getAllForUser(userId) {
        const borrowList = await bookBorrowModel.find({MaDocGia: userId}).populate('MaSach')
        return {
            borrows: borrowList,
            message: "Lấy dữ liệu mượn sách thành công!"
        }
    }

    async deleteBorrowForUser(idBorrow) {
        const deletedBorrow = await bookBorrowModel.findOneAndDelete({_id: idBorrow, TrangThai: 'pending'})
        if(deletedBorrow) {
            const book = await bookModel.findById(deletedBorrow.MaSach)
            await bookModel.findByIdAndUpdate(deletedBorrow.MaSach, {$set: {SoLuongDaMuon: book.SoLuongDaMuon -  deletedBorrow.SoLuongMuon}})
            return {
                borrow: deletedBorrow,
                message: "Hủy mượn sách thành công!"
            }
        }
        return {
            message:"Chỉ xóa được khi chưa nhận sách !"
        }
    }

    async addBorrow( data, userId ) {
        const newBorrow = new bookBorrowModel({
            MaDocGia: userId,
            MaSach: data.MaSach,
            SoLuongMuon:data.SoLuongMuon //
        })
        await newBorrow.save()
        if (newBorrow){
            //update so luong sach da muon
            const book = await bookModel.findById(data.MaSach)
            await bookModel.findByIdAndUpdate(data.MaSach,{ $set: {SoLuongDaMuon: book.SoLuongDaMuon + newBorrow.SoLuongMuon}})
            console.log(book.TenSach)
        }
        return{
            borrow: newBorrow,
            message: "Mượn sách thành công!"
        }
    }
} 