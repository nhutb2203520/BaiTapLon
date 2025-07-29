const publisherModel = require('../models/NhaXuatBan.model')

module.exports = class publisherService {

    async add(data) {
        const newPublisher = new publisherModel(data)
        const result = await newPublisher.save()
        return {
            publisher: newPublisher,
            message:'Thêm nhà xuất bản thành công!'
        }
    }

    async find(condition) {
        
        try {
            const publishers = await publisherModel.find(condition);
            
            
            const result = {
                publisher: publishers,
                message:'Lấy nhà xuất bản thành công!'
            };
            
            return result;
        } catch (error) {
            throw error;
        }
    } 

    async findByName(name) {
    
        
        try {
            
            // ✅ FIXED: Gọi trực tiếp MongoDB
            const publishers = await publisherModel.find({
                TenNXB: { $regex: new RegExp(name, "i") }
            });
            
            
            return {
                publisher: publishers,
                message:'Lấy nhà xuất bản thành công!'
            };
        } catch (error) {
            console.error("❌ Error in findByName():", error);
            throw error;
        }
    }
    
    async update(data) {
        
        
        const updatePublisher = await publisherModel.findOneAndUpdate(
            {MaNXB: data.MaNXB},
            { $set: { TenNXB: data.TenNXB, DiaChi: data.DiaChi }},
            {returnDocument: "after"}
        )
        
        
        
        return {
            publisher: updatePublisher,
            message: "Cập nhật nhà xuất bản thành công"
        }
    }

    async deleteAll() {
        const result = await publisherModel.deleteMany({})
        return result.deletedCount
    }

    async delete(publisherCode) {
       
        
        const deletedPublisher = await publisherModel.findOneAndDelete({MaNXB: publisherCode})
        
        return {
            publisher: deletedPublisher,
            message:'Xóa nhà xuất bản thành công'
        }
    }
}