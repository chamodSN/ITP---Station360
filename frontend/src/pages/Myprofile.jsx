import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import axios from 'axios';

const MyProfile = () => {
  const { user, updateProfile, deleteProfile } = useAuthStore();
  const { userVehicles, fetchUserVehicles, loading } = useAppContext();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');

  const [userData, setUserData] = useState({
    name: '',
    image: '',
    email: '',
    phone: '',
    gender: 'Not selected'
  });

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        image: user.image || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'Not selected'
      });
      fetchUserVehicles();
    }
  }, [user]);

  const isValidPhone = (phone) => {
    return /^\+?[0-9]{10,15}$/.test(phone);
  };

  const handleImageUpload = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG and PNG files are allowed');
      return;
    }
    setImage(file);
  };

  const handleUpdate = async () => {
    if (!userData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!isValidPhone(userData.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone || '');
      formData.append('gender', userData.gender || '');

      if (image) {
        formData.append('image', image);
      }

      const result = await updateProfile(formData);

      if (result.success) {
        setIsEdit(false);
        setImage(null);
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile!");
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        const result = await deleteProfile();
        if (result.success) {
          toast.success("Profile deleted successfully");
          navigate('/login');
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(error.response?.data?.message || "Failed to delete profile!");
      }
    }
  };

  const fetchServiceHistory = async (vehicleId) => {
    try {
      const response = await axios.get(`http://localhost:4200/api/vehicle-history/${vehicleId}`);
      if (response.data.success) {
        setServiceHistory(response.data.data);
        setShowHistoryModal(true);
      }
    } catch (error) {
      toast.error('Error fetching service history');
      console.error('Error:', error);
    }
  };

  const handleViewHistory = (vehicle) => {
    setSelectedVehicle(vehicle);
    fetchServiceHistory(vehicle._id);
  };

  const ServiceHistoryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Service History - {selectedVehicle?.brandName} {selectedVehicle?.modelName}
          </h2>
          <button
            onClick={() => setShowHistoryModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {serviceHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Service Name</th>
                  <th className="px-4 py-2">Technician</th>
                  <th className="px-4 py-2">Tasks Performed</th>
                </tr>
              </thead>
              <tbody>
                {serviceHistory.map((service, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{service.serviceName}</td>
                    <td className="px-4 py-2">{service.mechanicName}</td>
                    <td className="px-4 py-2">
                      <ul className="list-disc list-inside">
                        {service.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="text-sm text-gray-600">{task}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No service history found</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="w-64 min-h-screen bg-white shadow-lg">
          <div className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <img
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEdit && (
                  <label htmlFor="image" className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90">
                    <img src={assets.upload_icon} alt="Upload" className="w-5 h-5" />
                    <input
                      type="file"
                      id="image"
                      accept="image/png, image/jpeg"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </label>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{userData.name}</h2>
            </div>

            <div className="mt-8 space-y-2">
              <button
                onClick={() => setActiveSection('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeSection === 'profile' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveSection('vehicles')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeSection === 'vehicles' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                My Vehicles
              </button>
            </div>

            <div className="mt-8 space-y-2">
              <button
                onClick={() => {
                  if (isEdit) {
                    handleUpdate();
                  } else {
                    setIsEdit(true);
                  }
                }}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
              >
                {isEdit ? 'Save Changes' : 'Edit Profile'}
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8">
          {activeSection === 'profile' ? (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Profile Information</h3>
              <div className="space-y-6">
                <div className="flex flex-col items-center mb-8">
                  <div className="relative w-40 h-40 mb-4">
                    <img
                      src={image ? URL.createObjectURL(image) : userData.image}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    {isEdit && (
                      <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90">
                        <img src={assets.upload_icon} alt="Upload" className="w-5 h-5" />
                        <input
                          type="file"
                          id="profile-image"
                          accept="image/png, image/jpeg"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleImageUpload(file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">{userData.name}</h2>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Full Name</label>
                  {isEdit ? (
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="mt-1 text-gray-800">{userData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="mt-1 text-gray-800">{userData.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Phone</label>
                  {isEdit ? (
                    <input
                      type="text"
                      value={userData.phone}
                      onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="mt-1 text-gray-800">{userData.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Gender</label>
                  {isEdit ? (
                    <select
                      value={userData.gender}
                      onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Not selected">Not selected</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-gray-800">{userData.gender}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">My Vehicles</h3>
                <button
                  onClick={() => navigate('/add-vehicle')}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                >
                  Add Vehicle
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <p className="text-gray-600">Loading vehicles...</p>
                ) : userVehicles.length === 0 ? (
                  <p className="text-gray-600">No vehicles added yet</p>
                ) : (
                  userVehicles.map((vehicle) => (
                    <div
                      key={vehicle._id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate(`/vehicle/${vehicle._id}`)}
                    >
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={vehicle.Image}
                          alt={vehicle.brandName}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-800 text-lg mb-2">
                          {vehicle.brandName} {vehicle.modelName}
                        </h4>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Plate:</span> {vehicle.plateNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Fuel:</span> {vehicle.fuelType}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewHistory(vehicle);
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            View Service History
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {showHistoryModal && <ServiceHistoryModal />}
    </div>
  );
};

export default MyProfile;
