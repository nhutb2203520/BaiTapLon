const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const bookBorrowSchema = mongoose.Schema(
    {
        MaMuonSach: Number,
        MaDocGia: { type: mongoose.Schema.ObjectId, ref: 'userSchema', require: true },
        MaSach: { type: mongoose.Schema.ObjectId, ref: 'bookSchema', require: true },
        MaNhanVien: { type: mongoose.Schema.ObjectId, ref: 'staffSchema' },
        NgayMuon: {type: Date},
        NgayTra: {type: Date},
        SoLuongMuon: { type: Number, required: true, default: 1 },
        TrangThai: { type: String, required: true, default: 'pending' }, 
        //pending / borrow / paid
    },
    { timestamps: true, minimize: false, collection:'MuonSach' },
)

bookBorrowSchema.plugin(AutoIncrement, { inc_field: "MaMuonSach", start_seq: 1000 });

module.exports = mongoose.models?.bookBorrowSchema || mongoose.model('bookBorrowSchema', bookBorrowSchema);