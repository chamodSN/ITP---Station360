import scheduleModel from '../models/sheduleModel.js';

const addSchedule = async (req, res) => {
  try {
    
    const { employeeName, date, time, taskType, taskDetails, taskStatus } = req.body

    if (!employeeName || !date || !time || !taskType || !taskDetails) {
      return res.json({ success: false, message: "All fields are required..." });
    }

    const scheduleData = {
      employeeName,
      date,
      time,
      taskType,
      taskDetails,
      taskStatus
    };

    const newSchedule = new scheduleModel(scheduleData);
    await newSchedule.save();

    return res.json({ success: true, message: "Schedule added successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};




const displayAllShedules = async(req,res)=>{
  try{
     const AllShedules = await scheduleModel.find()

     return res.json({sucess:true, AllShedules})

  }catch (error){
    return res.json({sucess:false,message:error.message})
  }
}


const displayShedule = async(req,res)=>{
  try{
     const SheduleId = req.params.id;
     const Shedule = await scheduleModel.findById(SheduleId)

     return res.json({sucess:true, Shedule})

  }catch (error){
    return res.json({sucess:false,message:error.message})
  }
}

const updateShedule = async(req,res)=>{
  try{
     const SheduleId = req.params.id;
     const { employeeName, date, time, taskType, taskDetails, taskStatus } = req.body

     
    
     if (!employeeName || !date || !time || !taskType || !taskDetails) {
      return res.json({ success: false, message: "All fields are required..." });
    }

     await scheduleModel.findByIdAndUpdate(SheduleId,{$set: { employeeName, date, time, taskType, taskDetails, taskStatus }})
     return res.json({sucess:true, message:"Shedule updated successfully"})

  }catch (error){
    return res.json({sucess:false,message:error.message})
  }
}


const deleteShedule = async(req,res)=>{
  try{

    const SheduleId = req.params.id;

    await scheduleModel.findByIdAndDelete(SheduleId)
    return res.json({sucess:true,message:"Shedule deleted successfully"})

  }catch (error){
    return res.json({sucess:false,message:error.message})
  }
}


export {addSchedule,displayAllShedules,displayShedule,updateShedule,deleteShedule} ;