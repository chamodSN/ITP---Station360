import React from 'react'

const Header = () => {
    return (
        <header className="bg-gray-800 text-white font-sans">
          <div className="bg-gray-700 py-2 px-4 flex justify-end">
            <div className="flex items-center">
              <span className="mr-5">+1234567890</span>
              <a href="#" className="text-blue-500 hover:underline">Reservation Now</a>
            </div>
          </div>
          <div className="p-4 flex flex-col">
            <div className="flex items-center">
              <img src="/path/to/your/logo.png" alt="Vehicle Service Center Logo" className="h-12 mr-2" />
              <span className="text-xl">CARS</span>
            </div>
            <div className="flex items-center justify-between mt-5">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">CAR REPAIR SERVICES</h1>
                <p className="text-lg">SERVICES ARE NOW STARTING AT $24.99</p>
              </div>
              <div className="flex-1 text-right">
                <img src="/path/to/your/car.jpg" alt="Car" className="max-w-full h-auto" />
              </div>
            </div>
          </div>
        </header>
      );
}

export default Header
