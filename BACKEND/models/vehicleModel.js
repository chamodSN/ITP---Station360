import mongoose from 'mongoose'

const vehicleSchema = new mongoose.Schema({
    brandName:{type:String,required:true},
    modelName:{type:String,required:true},
    vinNumber:{type:String,required:true},
    fuelType:{type:String,required:true},
    Image:{type:String,required:true}

    

})
const vehicleModel = mongoose.models.vehicle || mongoose.model('vehicle',vehicleSchema)

export default vehicleModel