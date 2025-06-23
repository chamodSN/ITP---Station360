import serviceModel from '../models/serviceModel.js';
import bookingModel from '../models/bookingModel.js';
import { sendBookingCancellationEmail, sendBookingConfirmationEmail } from '../nodemailer/emails.js';
import { generateDailyAppointmentsPDF } from '../pdf/ReportGenerator.js';

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
        const { date, timeSlot, vehicleId, serviceId } = req.body;
        const userId = req.userId;

        const service = await serviceModel.findById(serviceId);

        if (!service) {
            return res.json({ success: false, message: "Service not found" });
        }

        if (!service.available) {
            return res.json({ success: false, message: "Service not available for booking" });
        }

        // Use the interval from the service model to calculate duration in minutes
        const duration = service.interval;

        if (!duration || duration <= 0) {
            return res.json({ success: false, message: "Invalid service interval" });
        }

        console.log("Selected timeSlot:", timeSlot);

        // Calculate the end time based on the selected timeSlot and the interval duration
        function calculateEndTime(startTime, duration) {
            const [startHour, startMinute] = startTime.split(".").map(Number);

            let endHour = startHour + Math.floor(duration / 60);
            let endMinute = startMinute + (duration % 60);

            if (endMinute >= 60) {
                endHour += Math.floor(endMinute / 60);
                endMinute = endMinute % 60;
            }

            // Format endHour and endMinute properly (pad zero)
            const formattedEndHour = String(endHour).padStart(2, "0");
            const formattedEndMinute = String(endMinute).padStart(2, "0");

            return `${formattedEndHour}:${formattedEndMinute}`;
        }

        const endTime = calculateEndTime(timeSlot, duration);

        const existingBooking = await bookingModel.findOne({ serviceId, date, timeSlot });

        if (existingBooking) {
            return res.json({ success: false, message: "Time slot already booked" });
        }

        const booking = new bookingModel({
            userId,
            serviceId,
            vehicleId,
            date,
            timeSlot: timeSlot,
            endTime: endTime,
        });

        await booking.save();

        service.bookedSlots.push({ date, timeSlot });
        await service.save();

        // Send confirmation email
        const populatedBooking = await bookingModel.findById(booking._id)
            .populate('userId', 'name email')
            .populate('serviceId', 'serviceName')
            .populate('vehicleId', 'brandName modelName plateNumber');

        await sendBookingConfirmationEmail(populatedBooking);

        return res.json({ success: true, message: "Booking successful", booking });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};



const displayUserBookings = async (req, res) => {
    try {
        const userId = req.userId;

        console.log("Fetching bookings for user ID: ", userId);

        const bookings = await bookingModel.find({ userId })
            .populate('userId', 'name email phone')
            .populate('serviceId', 'displayImage serviceName price')
            .populate('technicianId', 'name email phone')
            .populate('vehicleId', 'plateNumber');

        console.log("My Bookings backend " + bookings);
        console.log("user id " + userId);

        return res.json({ success: true, bookings });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find()
            .populate('userId', 'name email phone')
            .populate('serviceId', 'displayImage serviceName price category')
            .populate('technicianId', 'name email phone')
            .populate('vehicleId', 'plateNumber')
            .sort({ createdAt: -1 });

        return res.json({ success: true, bookings });
    } catch (err) {
        console.error('Error fetching all bookings:', err);
        return res.json({ success: false, message: err.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        console.log("Booking ID to cancel: " + bookingId);

        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        // Check if booking date is today
        const today = new Date();
        const bookingDate = new Date(booking.date);

        today.setHours(0, 0, 0, 0);
        bookingDate.setHours(0, 0, 0, 0);

        if (today.getTime() === bookingDate.getTime()) {
            return res.json({ success: false, message: "Cannot cancel booking on the booking date" });
        }

        // Remove the booking from service's bookedSlots
        const service = await serviceModel.findById(booking.serviceId);
        if (service) {
            service.bookedSlots = service.bookedSlots.filter(slot => {
                const slotDate = new Date(slot.date).toISOString().split('T')[0];
                const bookingDate = new Date(booking.date).toISOString().split('T')[0];
                return !(slotDate === bookingDate && slot.timeSlot === booking.timeSlot);
            });
            await service.save();
        }

        // Delete the booking
        await bookingModel.findByIdAndDelete(bookingId);

        return res.json({ success: true, message: "Booking cancelled successfully" });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

const cancelBookingByAdmin = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const { cancellationReason } = req.body;

        if (!cancellationReason) {
            return res.json({ success: false, message: "Cancellation reason is required" });
        }

        const booking = await bookingModel.findById(bookingId)
            .populate('userId', 'name email')
            .populate('serviceId', 'serviceName')
            .populate('vehicleId', 'brandName modelName plateNumber');

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        // Remove the booking from service's bookedSlots
        const service = await serviceModel.findById(booking.serviceId);
        if (service) {
            service.bookedSlots = service.bookedSlots.filter(slot => {
                const slotDate = new Date(slot.date).toISOString().split('T')[0];
                const bookingDate = new Date(booking.date).toISOString().split('T')[0];
                return !(slotDate === bookingDate && slot.timeSlot === booking.timeSlot);
            });
            await service.save();
        }

        // Send cancellation email
        await sendBookingCancellationEmail(booking, cancellationReason);

        // Delete the booking
        await bookingModel.findByIdAndDelete(bookingId);

        return res.json({ success: true, message: "Booking cancelled successfully" });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};

const getDailyAppointments = async (req, res) => {
    try {
        const { date } = req.query;
        
        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }

        console.log("Requested date:", date);

        // Convert date string to start and end of day
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);

        // Find all appointments for the given date
        const appointments = await bookingModel.find({
            date: {
                $gte: startDate.toISOString().split('T')[0],
                $lte: endDate.toISOString().split('T')[0]
            }
        })
        .populate('userId', 'name email')
        .populate('serviceId', 'serviceName')
        .populate('vehicleId', 'brandName modelName plateNumber')
        .sort({ timeSlot: 1 });

        console.log("Found appointments:", appointments);

        // Format appointments for PDF
        const formattedAppointments = appointments.map(appointment => ({
            timeSlot: appointment.timeSlot,
            endTime: appointment.endTime,
            customerName: appointment.userId.name,
            serviceName: appointment.serviceId.serviceName,
            vehicleDetails: `${appointment.vehicleId.brandName} ${appointment.vehicleId.modelName} (${appointment.vehicleId.plateNumber})`,
            status: appointment.status || 'Scheduled'
        }));

        console.log("Formatted appointments:", formattedAppointments);

        // Generate PDF
        const pdfBuffer = await generateDailyAppointmentsPDF(formattedAppointments, date);

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=daily-appointments-${date}.pdf`);
        
        // Send PDF
        res.end(pdfBuffer);
    } catch (error) {
        console.error('Error generating daily appointments PDF:', error);
        res.status(500).json({ message: 'Failed to generate daily appointments PDF' });
    }
};

export const getVehicleServiceHistory = async (req, res) => {
    try {
        const { vehicleId } = req.params;

        // Find all bookings for the vehicle with status 'done' or 'billed'
        const serviceHistory = await bookingModel.find({
            vehicleId: vehicleId,
            status: { $in: ['done', 'billed'] }
        })
        .populate('serviceId', 'serviceName')
        .populate('technicianId', 'name')
        .sort({ createdAt: -1 })
        .select('serviceId technicianId tasksPerformed');

        if (!serviceHistory) {
            return res.status(404).json({ message: 'No service history found for this vehicle' });
        }

        // Format the response data
        const formattedHistory = serviceHistory.map(booking => ({
            serviceName: booking.serviceId.serviceName,
            mechanicName: booking.technicianId?.name || 'Not assigned',
            tasks: booking.tasksPerformed.map(task => task.task)
        }));

        res.status(200).json({
            success: true,
            data: formattedHistory
        });

    } catch (error) {
        console.error('Error fetching vehicle service history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vehicle service history',
            error: error.message
        });
    }
};

export { bookService, displayTimeslots, displayUserBookings, getAllBookings, cancelBooking, cancelBookingByAdmin,getDailyAppointments }