import serviceModel from '../models/serviceModel.js';
import bookingModel from '../models/bookingModel.js';

const displayTimeslots = async (req, res) => {
    try {
        const date = req.params.date;
        const serviceId = req.params.serviceId;

        const result = await serviceModel.find({ _id: serviceId, 'bookedSlots.date': date });
        const service = await serviceModel.findById(serviceId);

        // get all possible timeslots
        const allTimeSlots = service.timeSlots || [];

        // Extract booked time slots from result
        let bookedSlots = [];
        for (let i = 0; i < service.bookedSlots.length; i++) {
            const slot = service.bookedSlots[i];
            const slotDate = new Date(slot.date).toISOString().split('T')[0];
            if (slotDate === date) {
                bookedSlots.push(slot.timeSlot);  // Push the booked timeSlot to the array
            }
        }

        const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

        return res.json({ success: true, availableSlots });

    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
};

const bookService = async (req, res) => {
    try {

        //i need to remove this line after user authentication is implemented
        const { userId, date, timeSlot, vehicleNumPlate, serviceId } = req.body

        //const userId = req.user.id;

        const service = await serviceModel.findById(serviceId);

        if (!service) {
            return res.json({ success: false, message: "Service not found" })
        }

        if (!service.isBookable || !service.available) {
            return res.json({ success: false, message: "Service not available for booking" })
        }


        const existingBooking = await bookingModel.findOne({ serviceId, date, timeSlot });
        
        if (existingBooking) {
            return res.json({ success: false, message: "Time slot already booked" })
        }

        const booking = new bookingModel({
            userId: userId,
            serviceId,
            vehicleNumPlate,
            date,
            timeSlot: timeSlot
        });

        await booking.save();

        service.bookedSlots.push({ date, timeSlot });
        await service.save();

        return res.json({ success: true, message: "Booking successful", booking });

    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
};

const displayUserBookings = async (req, res) => {
    try {

        const userId = "67dd1a12e1485ca648678a8d";

        //const userId = req.user.id;

        const bookings = await bookingModel.find({ userId });

        return res.json({ success: true, bookings });

    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

export { bookService, displayTimeslots, displayUserBookings }