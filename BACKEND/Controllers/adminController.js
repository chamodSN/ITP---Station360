
import expencemodel from '../models/expencemodel.js';


const addExpence =async(req,res)=>{
    try{

        const { ExpenceType,Reason,Cost}=req.body

        if ( !ExpenceType || !Reason || !Cost) {
            return res.json({success: false, message: "All fields are required."});
        }

        const expenceData = {
            ExpenceType,
            Reason,
            Cost,
            Date: Date.now(),
        }
const newExpence = new expencemodel(expenceData);


    await newExpence.save()
    return res.json({ sucess: true, message: "Expence added successfully" })
    

    }catch (error){
        return res.json({ sucess: false, message: error.message })
        
    }


}
const displayAllExpence = async(req,res)=>{
    try{

        const AllExpence = await expencemodel.find()
        return res.json({success:true,AllExpence})

        }catch (error){
        return res.json({ sucess: false, message: error.message })
    }
}
const displaySingleExpence = async(req,res)=>{
    try{

        const expenceId=req.params.id;

        const expence = await expencemodel.findById(expenceId)

        return res.json({success:true,expence})

        }catch (error){
        return res.json({ sucess: false, message: error.message })
    }
}
const deleteSingleExpence = async (req, res) => {
    try{

        const expenceId = req.params.id;

        await expencemodel.findByIdAndDelete(expenceId)

        return res.json({success: true, message: " Expence deleted successfully."})

    }catch (error){
        return res.json({ sucess: false, message: error.message })
    }
}
const updateExpence = async(req,res) =>{
    try{

        const expenceId = req.params.id;

        const {ExpenceType,Reason,Cost}=req.body

        if ( !ExpenceType || !Reason || !Cost) {
            return res.json({success: false, message: "All fields are required."});
        }

        await expencemodel.findByIdAndUpdate(expenceId,{$set:{ ExpenceType,Reason,Cost}})
        
        return res.json({success:true,message:"Expence update successfully."})

    }catch(error){
        return res.json({success:false,message:error.message})
    }
    
}


export {addExpence, displayAllExpence,displaySingleExpence,deleteSingleExpence,updateExpence }