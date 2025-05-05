import { FaTools, FaCar, FaLaptop } from "react-icons/fa";

export default function VehicleServiceFeatures() {
    return (
        <div className="bg-gray-900 text-white py-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-yellow-400 mb-4">
                    What Makes Us Different
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                    We provide professional vehicle services with expert mechanics, modern tools,
                    and a commitment to excellence. Your car’s performance and safety are our top priorities.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {/* Mechanical Services */}
                <div className="bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
                    <FaTools className="text-5xl text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2 text-white">
                        Mechanical Repairs
                    </h3>
                    <p className="text-gray-400">
                        Engine tuning, brake servicing, suspension repairs, and complete diagnostics.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg">
                        More
                    </button>
                </div>

                {/* Car Wash & Detailing */}
                <div className="bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
                    <FaCar className="text-5xl text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2 text-white">
                        Car Wash & Detailing
                    </h3>
                    <p className="text-gray-400">
                        Full exterior and interior detailing, ceramic coating, and waxing for a fresh look.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg">
                        More
                    </button>
                </div>

                {/* Digital Diagnostics */}
                <div className="bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
                    <FaLaptop className="text-5xl text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold mb-2 text-white">
                        Digital Diagnostics
                    </h3>
                    <p className="text-gray-400">
                        Computerized scanning to detect faults, check engine performance, and optimize efficiency.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg">
                        More
                    </button>
                </div>
            </div>
        </div>
    );
}
