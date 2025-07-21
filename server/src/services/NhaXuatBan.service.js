const publisherModel = require('../models/NhaXuatBan.model')

module.exports = class publisherService {

    async add(data) {

            const newPublisher = new publisherModel(data)
            // const isValid = await publisherModel.exists({TenNXB : data.TenNXB})
            // const isMaNXBDuplicated = await publisherModel.exists({ MaNXB: data.MaNXB });

            // if(isMaNXBDuplicated){
            //     return { 
            //         message: "Mã nhà xuất bản không được trùng lặp!",
            //     }
            // }

            // if(isValid) {
            //     return {
            //         message: "Nhà xuất bản đã tồn tại !",
            //     }
            // }
                const result = await newPublisher.save()
                return {
                    publisher: newPublisher,
                    message:'Thêm nhà xuất bản thành công!'
                }
    }s


    async find(condition) {
            const publishers = await publisherModel.find(condition);
            return {
                publisher: publishers,
                message:'Lấy nhà xuất bản thành công!'
            }
    } 

    async findByName(name) {
         const publishers = await this.find({TenNXB: { $regex: new RegExp(new RegExp(name)), $options: "i"}})
         return {
            publisher: publishers,
            message:'Lấy nhà xuất bản thành công!'
         }
    }
    
    async update( data) {
            const updatePublisher = await publisherModel.findOneAndUpdate(
                {MaNXB:data.MaNXB},
                { $set:{ TenNXB: data.TenNXB, DiaChi: data.DiaChi }},
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

    async delete (publisherCode) {
            const deletedPublisher = await publisherModel.findOneAndDelete({MaNXB: publisherCode})
            return {
                publisher: deletedPublisher,
                message:'Xoắ nhà xuất bản thành công'
            }
    }
}