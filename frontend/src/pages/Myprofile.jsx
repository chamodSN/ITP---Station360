import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const TABS = [
  { key: 'personal', label: 'Personal Info' },
  { key: 'vehicles', label: 'My Vehicles' },
];

const MyProfile = () => {
  const { user, updateProfile, deleteProfile } = useAuthStore();
  const { userVehicles, fetchUserVehicles, loading } = useAppContext();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: '',
    image: '',
    email: '',
    phone: '',
    gender: 'Not selected'
  });

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

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

  const handleUpdate = async () => {
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

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-primary via-blue-400 to-green-400 relative flex items-end justify-center">
        <div className="absolute -bottom-16 flex flex-col items-center">
          <label htmlFor="image" className="cursor-pointer group">
            <div className="relative">
              <img
                className="w-40 h-40 rounded-full border-8 border-white object-cover shadow-lg group-hover:opacity-80 transition"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="Profile Preview"
              />
              <div className="absolute bottom-2 right-2 bg-primary text-white rounded-full p-2 border-4 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3zm0 0v3a2 2 0 002 2h3" />
                </svg>
              </div>
            </div>
            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <p className="font-bold text-lg mt-2 text-gray-800">{userData.name}</p>
        </div>
      </div>
      <div className="mt-16 px-6 pb-8">
        {/* Tabs */}
        <div className="flex justify-center border-b border-gray-200 mb-8 gap-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`px-6 py-2 font-semibold text-lg focus:outline-none transition-colors duration-200 ${activeTab === tab.key ? 'border-b-4 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        {activeTab === 'personal' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 rounded-lg shadow p-10">
              {isEdit ? (
                <input
                  className="bg-white text-3xl font-medium max-w-lg mt-4 border-b-2 border-primary focus:outline-none px-4 py-2"
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name}</p>
              )}
              <hr className="my-6 border-zinc-300" />
              <div>
                <p className="text-neutral-500 font-semibold mb-4 text-lg">Contact Information</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-4 text-neutral-700 text-lg">
                  <p className="font-medium">Email:</p>
                  <p className="text-blue-500">{userData.email}</p>
                  <p className="font-medium">Phone:</p>
                  {isEdit ? (
                    <input
                      className="bg-white border-b-2 border-primary max-w-md focus:outline-none px-4 py-2 text-lg"
                      type="text"
                      value={userData.phone}
                      onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  ) : (
                    <p className="text-blue-400">{userData.phone}</p>
                  )}
                </div>
              </div>
              <div className="mt-8">
                <p className="text-neutral-500 font-semibold mb-4 text-lg">Basic Information</p>
                <div className="grid grid-cols-[1fr_3fr] gap-y-4 text-lg">
                  <p className="font-medium">Gender:</p>
                  {isEdit ? (
                    <select
                      className="max-w-40 bg-white border-b-2 border-primary focus:outline-none px-4 py-2 text-lg"
                      value={userData.gender}
                      onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Not selected">Not selected</option>
                    </select>
                  ) : (
                    <p className="text-gray-400">{userData.gender}</p>
                  )}
                </div>
              </div>
              <div className="mt-12 flex gap-6">
                <button
                  className="border border-primary text-primary px-12 py-3 rounded-full text-lg hover:text-white hover:bg-primary transition-all font-semibold"
                  onClick={() => {
                    if (isEdit) {
                      handleUpdate();
                    } else {
                      setIsEdit(true);
                    }
                  }}
                >
                  {isEdit ? 'Save' : 'Edit'}
                </button>
                <button
                  className="border border-red-500 text-red-500 px-12 py-3 rounded-full text-lg hover:text-white hover:bg-red-500 transition-all font-semibold"
                  onClick={handleDelete}
                >
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'vehicles' && (
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold text-gray-800">My Vehicles</h2>
              <button
                onClick={() => navigate('/add-vehicle')}
                className="bg-primary text-white px-8 py-3 rounded text-lg hover:bg-primary/90 transition-all font-semibold shadow"
              >
                Add Vehicle
              </button>
            </div>
            <div className="space-y-6">
              {loading ? (
                <p className="text-lg">Loading vehicles...</p>
              ) : userVehicles.length === 0 ? (
                <p className="text-gray-500 text-lg">No vehicles added yet</p>
              ) : (
                userVehicles.map((vehicle) => (
                  <div
                    key={vehicle._id}
                    className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-all border border-gray-100 hover:border-primary"
                    onClick={() => navigate(`/vehicle/${vehicle._id}`)}
                  >
                    <img
                      src={vehicle.Image}
                      alt={vehicle.brandName}
                      className="w-full h-56 object-cover rounded-lg mb-6"
                    />
                    <h3 className="font-semibold text-2xl text-primary">{vehicle.brandName} {vehicle.modelName}</h3>
                    <p className="text-gray-600 text-lg">Plate: {vehicle.plateNumber}</p>
                    <p className="text-gray-600 text-lg">Fuel: {vehicle.fuelType}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile; 