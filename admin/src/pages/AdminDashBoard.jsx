import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, Briefcase, CalendarClock, Package, DollarSign, Bell, Truck, CalendarCheck } from "lucide-react";

// Animation Variants
const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
        }
    }
};

const AdminDashboard = () => {
    const navigate = useNavigate();

    const cards = [
        { Icon: Users, title: "User Management", description: "Manage user accounts, roles, permissions, and profiles efficiently with advanced control options.", path: "/users" },
        { Icon: Briefcase, title: "Employee Management", description: "Handle employee records, attendance, payroll, and HR activities seamlessly from a central hub.", path: "/add-employee" },
        { Icon: Package, title: "Service Management", description: "Create, update, and manage services offered with pricing, availability, and categories.", path: "/service/all-services" },
        { Icon: CalendarClock, title: "Booking Management", description: "Simplify appointment, service, and resource bookings with smart scheduling features.", path: "/bookings-summary" },
        { Icon: Package, title: "Inventory Management", description: "Track stock levels, orders, deliveries, and warehouse inventory accurately in real-time.", path: "/all-inventory" },
        { Icon: DollarSign, title: "Finance Management", description: "Oversee budgets, expenses, transactions, and financial reports with powerful tools and insights.", path: "/all-expences" },
        { Icon: Bell, title: "Notification Management", description: "Configure alerts, reminders, and automated notifications across various communication channels.", path: "/all-notifications" },
        { Icon: Truck, title: "Vehicle Management", description: "Monitor vehicle fleets, schedule maintenance, track trips, and optimize transportation operations.", path: "/all-vehicles" },
        { Icon: CalendarCheck, title: "Schedule Management", description: "Organize meetings, events, and project timelines efficiently with robust scheduling capabilities.", path: "/tasks/assign" },
    ];

    return (
        <motion.div
            className="font-Poppins bg-white text-gray-800 min-h-screen p-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header */}
            <motion.div className="text-center py-5" variants={fadeIn}>
                <h1 className="text-4xl w-96 mx-auto leading-normal font-bold mb-5 text-primary">
                    ADMIN DASHBOARD
                </h1>
            </motion.div>

            {/* Cards */}
            <motion.div
                className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto group"
                variants={containerVariants}
            >
                {cards.map((card, index) => (
                    <motion.div
                        key={index}
                        className="relative bg-stone-100 cursor-pointer p-8 rounded-xl w-72 text-center 
                        group-hover:blur-sm hover:!blur-none 
                        group-hover:scale-[0.85] hover:!scale-100 
                        duration-500 transition-all shadow-md
                        border-2 border-transparent hover:border-primary"
                        variants={fadeIn}
                        onClick={() => navigate(card.path)} // 👈 Navigate on click
                    >
                        <motion.div
                            className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 hover:opacity-100 pointer-events-none transition-opacity duration-500"
                        />
                        <card.Icon className="h-16 w-16 mx-auto text-primary mb-4" />
                        <h4 className="uppercase text-xl font-black mb-2">{card.title}</h4>
                        <p className="text-sm leading-6 font-semibold text-gray-600">
                            {card.description}
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;
