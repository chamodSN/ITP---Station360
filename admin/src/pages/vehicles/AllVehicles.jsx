import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllVehicles = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get('http://localhost:4200/api/user/all-vehicles', {
                    withCredentials: true,
                });
                if (response.data.success) {
                    setVehicles(response.data.allVehicles);
                    console.log(response.data.allVehicles);
                }
            } catch (error) {
                console.error('Failed to fetch vehicles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">All Vehicles</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                    <div
                        key={vehicle._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => navigate(`/vehicle/${vehicle._id}`)}
                    >
                        <img
                            src={vehicle.Image}
                            alt={`${vehicle.brandName} ${vehicle.modelName}`}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{vehicle.brandName} {vehicle.modelName}</h2>
                            <p className="text-primary font-semibold">Plate: {vehicle.plateNumber}</p>
                            <p className="text-primary font-semibold">Fuel: {vehicle.fuelType}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllVehicles;
