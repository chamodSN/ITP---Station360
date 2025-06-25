import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AllVehicles = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const searchQuery = searchParams.get('search');
                const url = searchQuery
                    ? `http://localhost:4200/api/user/all-vehicles?search=${encodeURIComponent(searchQuery)}`
                    : 'http://localhost:4200/api/user/all-vehicles';

                const response = await axios.get(url, { withCredentials: true });

                if (response.data.success) {
                    setVehicles(response.data.vehicles); // based on controller
                } else {
                    setVehicles([]); // no matches found
                }
            } catch (error) {
                console.error('Failed to fetch vehicles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, [location.search]);

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">
                {searchQuery
                    ? `Search results for "${searchQuery}"`
                    : 'All Vehicles'}
            </h1>
            {vehicles.length === 0 ? (
                <p className="text-center text-gray-600">No vehicles found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex"
                            onClick={() => navigate(`/vehicle/${vehicle._id}`)}
                        >
                            <div className="w-1/3">
                                <img
                                    src={vehicle.Image}
                                    alt={`${vehicle.brandName} ${vehicle.modelName}`}
                                    className="w-full h-32 object-cover"
                                />
                            </div>
                            <div className="p-4 w-2/3">
                                <h2 className="text-xl font-semibold mb-2">
                                    {vehicle.brandName} {vehicle.modelName}
                                </h2>
                                <p className="text-primary font-semibold">Plate: {vehicle.plateNumber}</p>
                                <p className="text-primary font-semibold">Fuel: {vehicle.fuelType}</p>
                            </div>
                        </div>


                    ))}
                </div>
            )}
        </div>
    );
};

export default AllVehicles;
