import { v2 as cloudinary } from 'cloudinary'
import vehicleModel from '../models/vehicleModel.js';
import User from '../models/userModel.js';
import { generateUserReportPDF } from '../pdf/ReportGenerator.js';
const addvehicle = async (req, res) => {
    try {
        const userId = req.userId;
        const { brandName, modelName, plateNumber, vinNumber, fuelType } = req.body;
        const imagefile = req.file;

        if (!brandName || !modelName || !plateNumber || !vinNumber || !fuelType || !imagefile) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const imageUpload = await cloudinary.uploader.upload(imagefile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const newVehicle = new vehicleModel({
            user,
            brandName,
            modelName,
            plateNumber,
            vinNumber,
            fuelType,
            Image: imageUrl
        });

        await newVehicle.save();

        return res.status(201).json({
            success: true,
            message: "Vehicle added successfully",
            vehicle: newVehicle
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error adding vehicle"
        });
    }
}

const getAllVehicles = async (req, res) => {
    try {
        const search = req.query.search || '';
        const regex = new RegExp(search, 'i'); // case-insensitive search

        const vehicles = await vehicleModel.find({
            $or: [
                { fuelType: { $regex: regex } },
                { brandName: { $regex: regex } },
                { modelName: { $regex: regex } },
                { plateNumber: { $regex: regex } },
                { vinNumber: { $regex: regex } }
            ]
        });

        if (vehicles.length === 0) {
            return res.json({ success: false, message: 'No matching vehicles found' });
        }

        return res.json({ success: true, vehicles });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

const getVehicle = async (req, res) => {
    try {

        const vehicleId = req.params.id;

        const vehicle = await vehicleModel.findById(vehicleId).populate('user');

        return res.json({ success: true, vehicle })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


const deleteVehicle = async (req, res) => {
    try {

        const vehicleId = req.params.id;

        await vehicleModel.findByIdAndDelete(vehicleId);

        return res.json({ success: true, message: "Vehicle deleted successfully" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

const updateVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const { plateNumber } = req.body;
        const imageFile = req.file;

        const updateData = {
            plateNumber
        };

        // Upload new image if provided
        if (imageFile) {
            const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image"
            });
            updateData.Image = uploadResult.secure_url;
        }

        const updatedVehicle = await vehicleModel.findByIdAndUpdate(vehicleId, updateData, { new: true });

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            vehicle: updatedVehicle
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, gender } = req.body;
        const imageFile = req.file;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await User.findByIdAndUpdate(userId, { name, phone, gender })

        // Handle image upload if new image provided
        if (imageFile) {
            const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image'
            });
            user.image = uploadedImage.secure_url;
        }

        // Save updated user
        await user.save();

        // Make sure to return the complete updated user object
        const updatedUser = await User.findById(userId).select('-password');

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error updating profile"
        });
    }
};


const getProfile = async (req, res) => {
    try {
        const user = req.user; // Get user from checkAuth middleware

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.json({
            success: false,
            message: error.message || "Error fetching profile"
        });
    }
};

const deleteProfile = async (req, res) => {
    try {
        // Get user ID from auth middleware
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No user found"
            });
        }

        // Find and delete the user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Clear authentication cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully"
        });

    } catch (error) {
        console.error("Profile deletion error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error deleting profile"
        });
    }
};

const deleteProfileByAdmin = async (req, res) => {
    try {
        const userId = req.params.id;

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting user", error });
    }
};

const getProfileByAdmin = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.json({
            success: false,
            message: error.message || "Error fetching profile"
        });
    }
};


const getMyVehicles = async (req, res) => {
    try {
        const userId = req.userId;

        const vehicles = await vehicleModel.find({ user: userId });

        return res.status(200).json({
            success: true,
            vehicles
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching vehicles"
        });
    }
};

const allUsers = async (req, res) => {
    try {
        const search = req.query.search || '';
        const regex = new RegExp(search, 'i'); // case-insensitive

        const users = await User.find({
            $or: [
                { name: { $regex: regex } },
                { email: { $regex: regex } }
                // Add other fields if needed
            ]
        }).select('-password');

        res.json({ success: true, users });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

const generateUserReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }

        // Convert dates to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Set to end of day

        // Validate dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        // Find users registered within the date range
        const users = await User.find({
            createdAt: {
                $gte: start,
                $lte: end
            }
        }).select('name email phone createdAt lastlogin');

        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'No users found in the specified date range' });
        }

        // Prepare data for PDF generation
        const pdfData = {
            users: users.map(user => ({
                name: user.name || 'N/A',
                email: user.email || 'N/A',
                phone: user.phone || 'N/A',
                registeredOn: user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A',
                lastLogin: user.lastlogin ? new Date(user.lastlogin).toLocaleString() : 'Never'
            })),
            startDate: start.toLocaleDateString(),
            endDate: end.toLocaleDateString(),
            generatedDate: new Date().toLocaleString(),
            currentYear: new Date().getFullYear()
        };

        // Generate PDF
        const pdf = await generateUserReportPDF(pdfData);
        
        if (!pdf) {
            throw new Error('Failed to generate PDF');
        }

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=user-report-${startDate}-to-${endDate}.pdf`);

        // Send PDF
        res.send(pdf);
    } catch (error) {
        console.error('Error generating user report:', error);
        res.status(500).json({ error: error.message });
    }
};

export { addvehicle, getAllVehicles, getVehicle, deleteVehicle, updateVehicle, updateProfile, getProfile, deleteProfile, getMyVehicles, allUsers, deleteProfileByAdmin, getProfileByAdmin, generateUserReport }