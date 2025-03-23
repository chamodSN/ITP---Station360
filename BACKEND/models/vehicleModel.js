import mongoose from 'mongoose'

const vehicleSchema = new mongoose.Schema({
    //userId: { type: mongoose.Schema.Types.ObjectId, ref: 'customers', required: true },
    userId: { type:String,required:true},
    brandName:{type:String,required:true},
    modelName:{type:String,required:true},
    plateNumber:{type:String, required:true},
    vinNumber:{type:String,required:true},
    fuelType:{type:String,required:true},
    Image:{type:String,required:true}

})
const vehicleModel = mongoose.models.vehicle || mongoose.model('vehicle',vehicleSchema)

export default vehicleModel