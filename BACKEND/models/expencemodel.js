import mongoose from "mongoose"

const expenceSchema = new mongoose.Schema({

    ExpenceName:{type:String,required:true},
    ExpenceType:{type:String,required:true},
    Reason:{type:String,required:true},
    Cost:{type:String,required:true},
    Date:{type:Date,required:true},


})

const expencemodel = mongoose.models.Expence || mongoose.model('Expence', expenceSchema);


export default expencemodel
