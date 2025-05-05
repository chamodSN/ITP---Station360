import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Vehicle = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);

  const fetchVehicle = async () => {
    try {
        const { data } = await axios.get(`http://localhost:4200/api/user/vehicle/${id}`);
      if (data.success) {
        setVehicle(data.vehicle);
      } else {
        toast.error(data.message || "Failed to fetch vehicle details!");
      }
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      toast.error("Failed to fetch vehicle details!");
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  return vehicle && (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-center mb-4">{vehicle.brandName} {vehicle.modelName}</h1>

        <div className="space-y-4">
          <div>
            <p className="font-semibold">Plate Number:</p>
            <p>{vehicle.plateNumber}</p>
          </div>

          <div>
            <p className="font-semibold">VIN Number:</p>
            <p>{vehicle.vinNumber}</p>
          </div>

          <div>
            <p className="font-semibold">Fuel Type:</p>
            <p>{vehicle.fuelType}</p>
          </div>

          <div>
            <p className="font-semibold">Owner Name:</p>
            <p>{vehicle.user?.name}</p>
          </div>

          <div>
            <p className="font-semibold">Owner Email:</p>
            <p>{vehicle.user?.email}</p>
          </div>

          <div>
            <p className="font-semibold">Owner Phone:</p>
            <p>{vehicle.user?.phone}</p>
          </div>

          <div className="mt-4">
            <img
              className="w-full h-64 object-cover rounded"
              src={vehicle.Image}
              alt={`${vehicle.brandName} ${vehicle.modelName}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vehicle;
