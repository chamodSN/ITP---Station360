
import expencemodel from '../models/expencemodel.js';
import { generateAdminTokenAndSetCookie } from '../utils/generateAdminTokenAndSetCookie.js';

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

//API for admin login

// Updated admin login
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        generateAdminTokenAndSetCookie(res);

        return res.status(200).json({
            success: true,
            message: "Admin logged in successfully",
        });
    }

    return res.status(401).json({ success: false, message: "Invalid credentials" });
};

// Admin logout stays the same
const logoutAdmin = async (req, res) => {
    res.clearCookie("Atoken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};



export {addExpence, displayAllExpence,displaySingleExpence,deleteSingleExpence,updateExpence, loginAdmin,logoutAdmin }