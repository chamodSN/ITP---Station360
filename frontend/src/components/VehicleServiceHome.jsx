import { assets } from '../assets/assets'

export default function VehicleServiceHome() {
    return (
        <div className="flex flex-col items-center justify-center p-10 bg-white">
            {/* Text Section */}
            <div className="text-center max-w-2xl">
                <h3 className="text-black-500 font-semibold uppercase">We Are Vehicle Experts</h3>
                <h1 className="text-4xl font-bold mt-2">
                    Best <span className="text-blue-600">Vehicle Service</span> For Your <span className="text-red-500">Car</span>
                </h1>
                <p className="text-gray-600 mt-4">
                    We provide professional vehicle service with advanced technology and skilled mechanics. Your safety and satisfaction are our priorities.
                </p>
            </div>

            {/* Image Sections */}
            <div className="flex gap-6 mt-10">
                <div className="w-40 h-64 bg-gray-200 rounded-xl shadow-md overflow-hidden">
                    <img src={assets.image1} className="w-full h-full object-cover rounded-sm" />
                </div>
                <div className="w-40 h-64 bg-gray-200 rounded-xl shadow-md overflow-hidden">
                    <img src={assets.image2} className="w-full h-full object-cover rounded-sm" />
                </div>
                <div className="w-40 h-64 bg-gray-200 rounded-xl shadow-md overflow-hidden">
                    <img src={assets.image3} className="w-full h-full object-cover rounded-sm" />
                </div>
            </div>


        </div>
    );
}