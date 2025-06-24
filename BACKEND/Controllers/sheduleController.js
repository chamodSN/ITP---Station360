import scheduleModel from '../models/sheduleModel.js';
import bookingModel from '../models/bookingModel.js';
import employeeModel from '../models/employeeModel.js';
import leaveModel from '../models/leaveModel.js';

const addSchedule = async (req, res) => {
  try {
    const { employeeId, date, time, endTime, taskType, taskDetails, taskStatus } = req.body;

    if (!employeeId || !date || !time || !endTime || !taskType || !taskDetails) {
      return res.json({ success: false, message: "All fields are required..." });
    }

    const scheduleData = {
      employeeId,
      date,
      time,
      endTime,
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

const displayAllShedules = async(req, res) => {
  try {
    const AllShedules = await scheduleModel.find()
      .populate('employeeId', 'name email phone')
      .populate('bookingId', 'serviceId vehicleId status')
      .populate('vehicleId', 'brandName modelName plateNumber');

    return res.json({ success: true, AllShedules });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const displayShedule = async(req, res) => {
  try {
    const SheduleId = req.params.id;
    const Shedule = await scheduleModel.findById(SheduleId)
      .populate('employeeId', 'name email phone')
      .populate('bookingId', 'serviceId vehicleId status')
      .populate('vehicleId', 'brandName modelName plateNumber');

    return res.json({ success: true, Shedule });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const updateShedule = async(req, res) => {
  try {
    const SheduleId = req.params.id;
    const { employeeId, date, time, endTime, taskType, taskDetails, taskStatus } = req.body;

    if (!employeeId || !date || !time || !endTime || !taskType || !taskDetails) {
      return res.json({ success: false, message: "All fields are required..." });
    }

    await scheduleModel.findByIdAndUpdate(SheduleId, {
      $set: { employeeId, date, time, endTime, taskType, taskDetails, taskStatus }
    });
    return res.json({ success: true, message: "Schedule updated successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const deleteShedule = async(req, res) => {
  try {
    const SheduleId = req.params.taskId;

    console.log(SheduleId); 

    // Find the schedule first to get the bookingId
    const schedule = await scheduleModel.findById(SheduleId);
    if (!schedule) {
      return res.json({ success: false, message: "Schedule not found" });
    }

    // If there's an associated booking, update it
    if (schedule.bookingId) {
      await bookingModel.findByIdAndUpdate(schedule.bookingId, {
        $set: {
          technicianId: null,
          status: "Pending"
        }
      });
    }

    // Delete the schedule
    await scheduleModel.findByIdAndDelete(SheduleId);

    return res.json({ 
      success: true, 
      message: "Schedule deleted successfully" 
    });

  } catch (error) {
    console.error('Error deleting schedule:', error);
    return res.json({ 
      success: false, 
      message: error.message 
    });
  }
};

const assignEmployeeToBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: "Employee ID is required" }); // 400 Bad Request
    }

    // Check if booking exists
    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" }); // 404 Not Found
    }

    // Check if employee exists
    const employee = await employeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" }); // 404 Not Found
    }

    // Check if employee has approved leave on the booking date
    const approvedLeave = await leaveModel.findOne({
      employee: employeeId,
      leaveDate: booking.date,
      status: 'Approved'
    });

    if (approvedLeave) {
      return res.status(409).json({ // 409 Conflict
        success: false,
        message: "Employee has approved leave on this date"
      });
    }

    // Remove previous schedule if exists
    if (booking.technicianId) {
      await scheduleModel.findOneAndDelete({
        bookingId: bookingId,
        employeeId: booking.technicianId
      });
    }

    // Check for overlapping schedule
    const existingSchedule = await scheduleModel.findOne({
      employeeId: employeeId,
      date: booking.date,
      $or: [
        {
          $and: [
            { time: { $lte: booking.timeSlot } },
            { endTime: { $gt: booking.timeSlot } }
          ]
        },
        {
          $and: [
            { time: { $lt: booking.endTime } },
            { endTime: { $gte: booking.endTime } }
          ]
        },
        {
          $and: [
            { time: { $gte: booking.timeSlot } },
            { endTime: { $lte: booking.endTime } }
          ]
        },
        {
          $and: [
            { time: { $lte: booking.timeSlot } },
            { endTime: { $gte: booking.endTime } }
          ]
        }
      ]
    });

    if (existingSchedule) {
      return res.status(409).json({ // 409 Conflict
        success: false,
        message: "Employee is already assigned to another task during this time period"
      });
    }

    // Create new schedule entry
    const scheduleData = {
      employeeId: employeeId,
      date: booking.date,
      time: booking.timeSlot,
      endTime: booking.endTime,
      taskType: "Service",
      taskDetails: `Service booking for vehicle ${booking.vehicleId}`,
      taskStatus: "assigned",
      bookingId: bookingId,
      vehicleId: booking.vehicleId
    };

    const newSchedule = new scheduleModel(scheduleData);
    await newSchedule.save();

    // Update booking
    booking.technicianId = employeeId;
    booking.status = "Assigned";
    await booking.save();

    return res.status(200).json({ // 200 OK
      success: true,
      message: "Employee assigned to booking successfully",
      schedule: newSchedule,
      booking: booking
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ // 500 Internal Server Error
      success: false,
      message: "An error occurred while assigning the employee"
    });
  }
};


const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.find()
      .populate('userId', 'name email phone')
      .populate('serviceId', 'serviceName price')
      .populate('technicianId', 'name email phone')
      .populate('vehicleId', 'plateNumber')
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return res.json({ success: false, message: error.message });
  }
};

const getEmployeeTasks = async (req, res) => {
  try {
    const employeeId = req.employeeId;
    console.log('Fetching tasks for employee:', employeeId);

    const bookings = await bookingModel.find({ technicianId: employeeId })
      .populate('userId', 'name email phone')
      .populate('serviceId', 'serviceName price category')
      .populate('vehicleId', 'brandName modelName plateNumber')
      .sort({ createdAt: -1 });

    console.log('Found bookings:', bookings);

    if (!bookings) {
      return res.json({ 
        success: false, 
        message: "No tasks found for this employee" 
      });
    }

    return res.json({ 
      success: true, 
      bookings,
      message: "Tasks fetched successfully"
    });
  } catch (error) {
    console.error('Error fetching employee tasks:', error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch tasks",
      error: error.message 
    });
  }
};

const updateTasksPerformed = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { task } = req.body;
    const employeeId = req.employeeId; // From authEmployee middleware

    if (!task) {
      return res.status(400).json({ success: false, message: "Task description is required" });
    }

    // Find the booking and update it
    const booking = await bookingModel.findOne({ 
      _id: bookingId,
      technicianId: employeeId
    });

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found or not assigned to you" 
      });
    }

    // Add the new task
    booking.tasksPerformed.push({
      task,
      timestamp: new Date()
    });

    // Update the booking status to 'done'
    booking.status = 'done';

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Tasks updated successfully",
      booking
    });
  } catch (error) {
    console.error("Error updating tasks:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update tasks",
      error: error.message 
    });
  }
};

export {
  addSchedule,
  displayAllShedules,
  displayShedule,
  updateShedule,
  deleteShedule,
  assignEmployeeToBooking,
  getAllBookings,
  getEmployeeTasks,
  updateTasksPerformed
}