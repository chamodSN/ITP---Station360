import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    month: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{4}-\d{2}$/.test(v); // Format: YYYY-MM
            },
            message: props => `${props.value} is not a valid month format! Use YYYY-MM`
        }
    },
    
    totalHours: {
        type: Number,
        required: true,
        min: 0
    },
    totalDays: {
        type: Number,
        required: true,
        min: 0
    },
    
    deductions: [{
        description: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    bonuses: [{
        description: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    totalDeductions: {
        type: Number,
        required: true,
        min: 0
    },
    totalBonuses: {
        type: Number,
        required: true,
        min: 0
    },
    finalSalary: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'paid'],
        default: 'pending'
    },
    paymentDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
salarySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Salary = mongoose.model('Salary', salarySchema);

export default Salary; 