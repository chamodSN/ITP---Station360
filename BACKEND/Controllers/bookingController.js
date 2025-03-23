import serviceModel from '../models/serviceModel.js';
import bookingModel from '../models/bookingModel.js';

const displayTimeslots = async (req, res) => {
    try {
        const date = req.params.date;
        const serviceId = req.params.serviceId;

        const result = await serviceModel.find({ 'bookedSlots.date': date });
        const service = await serviceModel.findById(serviceId);

        // get all possible timeslots
        const allTimeSlots = service.timeSlots || [];

        // Extract booked time slots from result
        let bookedSlots = [];
        result.forEach(service => {
            service.bookedSlots.forEach(slot => {
                const slotDate = new Date(slot.date).toISOString().split('T')[0];
                if (slotDate === date) {
                    bookedSlots.push(slot.timeSlot); // Ensure `timeSlot` is correct
                }
            });
        });

        const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

console.log("bookedSlots dates:", result.map(service => service.bookedSlots.map(slot => slot.date)));


        return res.json({ success: true, availableSlots });

    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
};

const bookService = async (req, res) => {
    try {

        //remove this line after user authentication is implemented
        const { userId, date, timeSlot, vehicleNumPlate, serviceId } = req.body

        //const userId = req.user.id;

        const service = await serviceModel.findById(serviceId);

        if (!service) {
            console.log("Service not found for ID:", serviceId);
            return res.json({ sucess: false, message: "Service not found" })
        }

        if (!service.isBookable || !service.available) {
            return res.json({ sucess: false, message: "Service not available for booking" })
        }


        const existingBooking = await bookingModel.findOne({ serviceId, date, timeSlot });
        if (existingBooking) {
            return res.json({ sucess: false, message: "Time slot already booked" })
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

        return res.json({ sucess: true, message: "Booking successful", booking });

    } catch (err) {
        return res.json({ sucess: false, message: err.message })
    }
};

export { bookService, displayTimeslots }