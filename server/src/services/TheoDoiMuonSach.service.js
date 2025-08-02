const bookModel = require('../models/Sach.model')
const bookBorrowModel = require('../models/TheoDoiMuonSach.model')

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
            if(borrow.TrangThai != 'paid' && borrow.TrangThai != 'returned') {
                const book = await bookModel.findById(borrow.MaSach)
                if (book) {
                    await bookModel.findByIdAndUpdate(borrow.MaSach,{$set: {SoLuongDaMuon: book.SoLuongDaMuon - borrow.SoLuongMuon}})
                }
            }
        }
        return {
            borrow: borrow,
            message: "Xóa mượn sách thành công!"
        }
    }

    // ✅ FIXED: Cập nhật để xử lý tất cả trạng thái từ frontend
    async updateBorrowForAdmin(staffId, updateData) {
        console.log('📥 Service: updateBorrowForAdmin called with:', { staffId, updateData })
        
        try {
            const { borrowId, TrangThai } = updateData
            
            if (!borrowId || !TrangThai) {
                throw new Error('borrowId và TrangThai là bắt buộc')
            }

            // ✅ Xử lý mapping trạng thái từ frontend sang backend
            let mappedStatus = TrangThai
            let updateFields = { TrangThai: mappedStatus, MaNhanVien: staffId }

            switch (TrangThai) {
                case 'approved':
                    // Duyệt yêu cầu mượn
                    mappedStatus = 'approved'
                    updateFields.NgayMuon = new Date()
                    break
                    
                case 'borrowed':
                    // Đã cho mượn (tương đương 'borrow' cũ)
                    mappedStatus = 'borrowed'
                    updateFields.NgayMuon = new Date()
                    break
                    
                case 'returned':
                    // Đã trả sách (tương đương 'paid' cũ)
                    mappedStatus = 'returned'
                    updateFields.NgayTra = new Date()
                    break
                    
                case 'rejected':
                    // Từ chối yêu cầu
                    mappedStatus = 'rejected'
                    break
                    
                default:
                    mappedStatus = TrangThai
            }

            updateFields.TrangThai = mappedStatus
            console.log('📝 Service: Update fields:', updateFields)

            // ✅ Cập nhật record
            const updatedBorrow = await bookBorrowModel.findOneAndUpdate(
                { _id: borrowId },
                { $set: updateFields },
                { new: true }
            )

            if (!updatedBorrow) {
                throw new Error('Không tìm thấy record mượn sách')
            }

            // ✅ Xử lý logic nghiệp vụ cho trạng thái 'returned'
            if (mappedStatus === 'returned') {
                const book = await bookModel.findById(updatedBorrow.MaSach)
                if (book) {
                    await bookModel.findByIdAndUpdate(
                        updatedBorrow.MaSach,
                        { $set: { SoLuongDaMuon: Math.max(0, book.SoLuongDaMuon - updatedBorrow.SoLuongMuon) } }
                    )
                }
            }

            // ✅ Populate dữ liệu để trả về
            const borrowDetail = await bookBorrowModel.findById(borrowId)
                                                    .populate('MaSach')
                                                    .populate('MaNhanVien', ["HoTenNV", "ChucVu", "SoDienThoai"])
                                                    .populate('MaDocGia', ['HoLot', 'Ten', 'NgaySinh', 'GioiTinh', 'DiaChi', 'SoDienThoai'])

            console.log('✅ Service: Borrow updated successfully:', borrowDetail?._id)
            
            return {
                success: true,
                borrow: borrowDetail,
                message: "Cập nhật trạng thái thành công!"
            }

        } catch (error) {
            console.error('❌ Service: updateBorrowForAdmin error:', error)
            throw error
        }
    }

    // ✅ LEGACY: Giữ lại logic cũ để backward compatibility (nếu cần)
    async updateBorrowForAdminLegacy(staffId, updateData) {
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
        console.log('📥 Service: getAllForUser called for userId:', userId)
        
        const borrowList = await bookBorrowModel.find({MaDocGia: userId})
                                               .populate('MaSach')
                                               .sort({ createdAt: -1 }) // Sắp xếp mới nhất trước
        
        console.log('✅ Service: Found', borrowList.length, 'borrows for user')
        
        return {
            borrows: borrowList,
            message: "Lấy dữ liệu mượn sách thành công!"
        }
    }

    async deleteBorrowForUser(idBorrow) {
        console.log('📥 Service: deleteBorrowForUser called for:', idBorrow)
        
        const deletedBorrow = await bookBorrowModel.findOneAndDelete({
            _id: idBorrow, 
            TrangThai: 'pending'  // Chỉ cho phép xóa khi đang pending
        })
        
        if(deletedBorrow) {
            console.log('✅ Service: Borrow deleted, updating book quantity')
            const book = await bookModel.findById(deletedBorrow.MaSach)
            if (book) {
                await bookModel.findByIdAndUpdate(
                    deletedBorrow.MaSach, 
                    { $set: { SoLuongDaMuon: Math.max(0, book.SoLuongDaMuon - deletedBorrow.SoLuongMuon) } }
                )
            }
            return {
                borrow: deletedBorrow,
                message: "Hủy mượn sách thành công!"
            }
        }
        
        return {
            success: false,
            message: "Chỉ có thể hủy yêu cầu đang chờ duyệt!"
        }
    }

    async addBorrow(data, userId) {
        console.log('📥 Service: addBorrow called:', { data, userId })
        
        try {
            // ✅ Kiểm tra sách tồn tại và còn đủ số lượng
            const book = await bookModel.findById(data.MaSach)
            if (!book) {
                throw new Error('Sách không tồn tại')
            }
            
            const availableQuantity = book.SoLuong - (book.SoLuongDaMuon || 0)
            if (availableQuantity < (data.SoLuongMuon || 1)) {
                throw new Error('Sách không đủ số lượng để mượn')
            }

            // ✅ Tạo record mượn mới
            const newBorrow = new bookBorrowModel({
                MaDocGia: userId,
                MaSach: data.MaSach,
                SoLuongMuon: data.SoLuongMuon || 1,
                TrangThai: 'pending' // Mặc định là chờ duyệt
            })
            
            await newBorrow.save()
            console.log('✅ Service: New borrow created:', newBorrow._id)

            // ✅ Cập nhật số lượng sách đã mượn
            await bookModel.findByIdAndUpdate(
                data.MaSach,
                { $set: { SoLuongDaMuon: (book.SoLuongDaMuon || 0) + newBorrow.SoLuongMuon } }
            )

            // ✅ Populate dữ liệu để trả về
            const populatedBorrow = await bookBorrowModel.findById(newBorrow._id)
                                                         .populate('MaSach')

            return {
                success: true,
                borrow: populatedBorrow,
                message: "Gửi yêu cầu mượn sách thành công!"
            }
            
        } catch (error) {
            console.error('❌ Service: addBorrow error:', error)
            throw error
        }
    }
}