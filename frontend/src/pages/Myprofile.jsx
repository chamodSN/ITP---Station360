import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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
    <div className="flex gap-6 p-6 max-w-7xl mx-auto">
      {/* Left side - Profile Information */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <label htmlFor="image">
            <div className='inline-block relative cursor-pointer'>
              <img
                className='w-36 rounded opacity-75'
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="Profile Preview"
              />

            </div>
            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          {isEdit ? (
            <input
              className='bg-gray-50 text-3xl font-medium max-w-60 mt-4'
              type="text"
              value={userData.name}
              onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
            />
          ) : (
            <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
          )}

          <hr className='bg-zinc-400 h-[1px] border-none' />

          <div>
            <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
            <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
              <p className='font-medium'>Email : </p>
              <p className='text-blue-500'>{userData.email}</p>
              <p className='font-medium'>Phone</p>
              {isEdit ? (
                <input
                  className='bg-gray-100 max-w-52'
                  type="text"
                  value={userData.phone}
                  onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                />
              ) : (
                <p className='text-blue-400'>{userData.phone}</p>
              )}
            </div>
          </div>

          <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3'>
            <p className='font-medium'>Gender : </p>
            {isEdit ? (
              <select
                className='max-w-20 bg-gray-100'
                value={userData.gender}
                onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Not selected">Not selected</option>
              </select>
            ) : (
              <p className='text-gray-400'>{userData.gender}</p>
            )}
          </div>

          <div className='mt-10 flex flex-col gap-4'>
            <div className='flex justify-between'>
              <div className='flex gap-4'>
                <button
                  className='border border-primary px-8 py-2 rounded-full hover:text-white hover:bg-primary transition-all'
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
                  className='border border-red-500 text-red-500 px-8 py-2 rounded-full hover:text-white hover:bg-red-500 transition-all'
                  onClick={handleDelete}
                >
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Vehicles */}
      <div className="w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Vehicles</h2>
          <button
            onClick={() => navigate('/add-vehicle')}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-all"
          >
            Add Vehicle
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p>Loading vehicles...</p>
          ) : userVehicles.length === 0 ? (
            <p>No vehicles added yet</p>
          ) : (
            userVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/vehicle/${vehicle._id}`)}
              >
                <img
                  src={vehicle.Image}
                  alt={vehicle.brandName}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-lg">{vehicle.brandName} {vehicle.modelName}</h3>
                <p className="text-gray-600">Plate: {vehicle.plateNumber}</p>
                <p className="text-gray-600">Fuel: {vehicle.fuelType}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;