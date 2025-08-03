const publisherModel = require('../models/NhaXuatBan.model');

module.exports = class PublisherService {
  async add(data) {
    const publisher = await new publisherModel(data).save();
    return { publisher, message: 'Thêm nhà xuất bản thành công!' };
  }

  async find(condition = {}) {
    const publisher = await publisherModel.find(condition);
    return { publisher, message: 'Lấy nhà xuất bản thành công!' };
  }

  async findByName(name) {
    const publisher = await publisherModel.find({
      TenNXB: { $regex: new RegExp(name, 'i') }
    });
    return { publisher, message: 'Lấy nhà xuất bản thành công!' };
  }

  async update(data) {
    const publisher = await publisherModel.findOneAndUpdate(
      { MaNXB: data.MaNXB },
      { TenNXB: data.TenNXB, DiaChi: data.DiaChi },
      { returnDocument: 'after' }
    );
    return { publisher, message: 'Cập nhật nhà xuất bản thành công' };
  }

  async deleteAll() {
    const { deletedCount } = await publisherModel.deleteMany({});
    return deletedCount;
  }

  async delete(MaNXB) {
    const publisher = await publisherModel.findOneAndDelete({ MaNXB });
    return { publisher, message: 'Xóa nhà xuất bản thành công' };
  }
};
