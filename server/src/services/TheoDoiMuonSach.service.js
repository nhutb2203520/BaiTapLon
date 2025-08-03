const bookModel = require('../models/Sach.model');
const bookBorrowModel = require('../models/TheoDoiMuonSach.model');

module.exports = class bookBorrowService {
  async getAllForAdmin() {
    const borrowList = await bookBorrowModel.find({})
      .populate('MaSach')
      .populate('MaNhanVien', ['HoTenNV', 'ChucVu', 'SoDienThoai'])
      .populate('MaDocGia', ['HoLot', 'Ten', 'NgaySinh', 'GioiTinh', 'DiaChi', 'SoDienThoai']);
    return { borrows: borrowList, message: 'Lấy thông tin mượn sách thành công!' };
  }

  async deleteBorrowForAdmin(borrowId) {
    const borrow = await bookBorrowModel.findOneAndDelete({ _id: borrowId });
    if (borrow && !['paid', 'returned'].includes(borrow.TrangThai)) {
      const book = await bookModel.findById(borrow.MaSach);
      if (book) {
        await bookModel.findByIdAndUpdate(borrow.MaSach, {
          $set: { SoLuongDaMuon: book.SoLuongDaMuon - borrow.SoLuongMuon }
        });
      }
    }
    return { borrow, message: 'Xóa mượn sách thành công!' };
  }

  async updateBorrowForAdmin(staffId, updateData) {
    const { borrowId, TrangThai } = updateData;
    if (!borrowId || !TrangThai) throw new Error('Thiếu borrowId hoặc trạng thái!');

    const updateFields = { TrangThai, MaNhanVien: staffId };
    if (TrangThai === 'approved' || TrangThai === 'borrowed') {
      updateFields.NgayMuon = new Date();
    } else if (TrangThai === 'returned') {
      updateFields.NgayTra = new Date();
    }

    const updatedBorrow = await bookBorrowModel.findOneAndUpdate(
      { _id: borrowId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedBorrow) throw new Error('Không tìm thấy yêu cầu mượn sách!');

    if (TrangThai === 'returned') {
      const book = await bookModel.findById(updatedBorrow.MaSach);
      if (book) {
        await bookModel.findByIdAndUpdate(updatedBorrow.MaSach, {
          $set: { SoLuongDaMuon: Math.max(0, book.SoLuongDaMuon - updatedBorrow.SoLuongMuon) }
        });
      }
    }

    const borrowDetail = await bookBorrowModel.findById(borrowId)
      .populate('MaSach')
      .populate('MaNhanVien', ['HoTenNV', 'ChucVu', 'SoDienThoai'])
      .populate('MaDocGia', ['HoLot', 'Ten', 'NgaySinh', 'GioiTinh', 'DiaChi', 'SoDienThoai']);

    return { success: true, borrow: borrowDetail, message: 'Cập nhật trạng thái thành công!' };
  }

  // Legacy method (giữ nguyên nếu cần)
  async updateBorrowForAdminLegacy(staffId, updateData) {
    if (updateData.TrangThai === 'borrow') {
      const borrow = await bookBorrowModel.findOneAndUpdate(
        { _id: updateData._id },
        { TrangThai: updateData.TrangThai, NgayMuon: Date.now(), MaNhanVien: staffId },
        { new: true }
      );
      const detail = await bookBorrowModel.findById(updateData._id)
        .populate('MaSach')
        .populate('MaNhanVien', ['HoTenNV', 'ChucVu', 'SoDienThoai'])
        .populate('MaDocGia', ['HoLot', 'Ten', 'NgaySinh', 'GioiTinh', 'DiaChi', 'SoDienThoai']);
      return { borrow: detail, message: 'Cập nhật thành công!' };
    }

    if (updateData.TrangThai === 'paid') {
      const borrow = await bookBorrowModel.findById(updateData._id);
      const book = await bookModel.findById(borrow.MaSach);
      borrow.TrangThai = updateData.TrangThai;
      borrow.MaNhanVien = staffId;
      borrow.NgayTra = Date.now();
      await borrow.save();
      await bookModel.findByIdAndUpdate(borrow.MaSach, {
        $set: { SoLuongDaMuon: book.SoLuongDaMuon - borrow.SoLuongMuon }
      });
      const detail = await bookBorrowModel.findById(updateData._id)
        .populate('MaSach')
        .populate('MaNhanVien', ['HoTenNV', 'ChucVu', 'SoDienThoai'])
        .populate('MaDocGia', ['HoLot', 'Ten', 'NgaySinh', 'GioiTinh', 'DiaChi', 'SoDienThoai']);
      return { borrow: detail, message: 'Cập nhật thành công!' };
    }
  }

  async getAllForUser(userId) {
    const borrowList = await bookBorrowModel.find({ MaDocGia: userId })
      .populate('MaSach')
      .sort({ createdAt: -1 });
    return { borrows: borrowList, message: 'Lấy dữ liệu mượn sách thành công!' };
  }

  async deleteBorrowForUser(idBorrow) {
    const borrow = await bookBorrowModel.findOneAndDelete({
      _id: idBorrow,
      TrangThai: 'pending'
    });

    if (borrow) {
      const book = await bookModel.findById(borrow.MaSach);
      if (book) {
        await bookModel.findByIdAndUpdate(borrow.MaSach, {
          $set: { SoLuongDaMuon: Math.max(0, book.SoLuongDaMuon - borrow.SoLuongMuon) }
        });
      }
      return { borrow, message: 'Hủy mượn sách thành công!' };
    }

    return { success: false, message: 'Chỉ có thể hủy yêu cầu đang chờ duyệt!' };
  }

  async addBorrow(data, userId) {
    const book = await bookModel.findById(data.MaSach);
    if (!book) throw new Error('Sách không tồn tại!');

    const available = book.SoLuong - (book.SoLuongDaMuon || 0);
    if (available < (data.SoLuongMuon || 1)) {
      throw new Error('Không đủ số lượng sách để mượn!');
    }

    const newBorrow = new bookBorrowModel({
      MaDocGia: userId,
      MaSach: data.MaSach,
      SoLuongMuon: data.SoLuongMuon || 1,
      TrangThai: 'pending'
    });

    await newBorrow.save();

    await bookModel.findByIdAndUpdate(data.MaSach, {
      $set: { SoLuongDaMuon: (book.SoLuongDaMuon || 0) + newBorrow.SoLuongMuon }
    });

    const populated = await bookBorrowModel.findById(newBorrow._id).populate('MaSach');
    return { success: true, borrow: populated, message: 'Gửi yêu cầu mượn sách thành công!' };
  }
};
