import React, { useState } from 'react';
import profileImg from '../images/profile.png';

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "Edward Vincent",
    image: profileImg,
    email: 'richardjameswap@gmail.com',
    phone: '+1 123 456 7890',
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Church Road, London"
    },
    gender: 'Male',
    dob: '2000-01-20'
  });

  const [isEdit, setIsEdit] = useState(true);

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6 p-8 bg-white border rounded-lg shadow-lg">
      
      <img className='w-36 rounded-full mx-auto' src={userData.image} alt="Profile" />
      
      {
        isEdit
          ? <input 
              className='bg-gray-100 text-2xl font-medium w-full p-4 mt-4 rounded-md border border-gray-400 focus:ring-primary focus:ring-2' 
              type="text" 
              onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} 
              value={userData.name} 
            />
          : <p className='font-medium text-2xl text-neutral-800 mt-4'>{userData.name}</p>
      }

      <hr className='bg-zinc-400 h-[1px] border-none' />

      <div>
        <p className='text-neutral-500 font-semibold text-lg mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-4 mt-4 text-neutral-700'>
          <p className='font-medium text-lg'>Email: </p>
          <p className='text-blue-500'>{userData.email}</p>

          <p className='font-medium text-lg'>Phone: </p>
          {
            isEdit
              ? <input 
                  className='bg-gray-100 p-3 rounded-md border border-gray-400 focus:ring-primary focus:ring-2' 
                  type="text" 
                  onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} 
                  value={userData.phone} 
                />
              : <p className='text-blue-400'>{userData.phone}</p>
          }

          <p className='font-medium text-lg'>Address: </p>
          {
            isEdit
              ? (
                <div>
                  <input 
                    className='bg-gray-100 p-3 rounded-md border border-gray-400 focus:ring-primary focus:ring-2 w-full' 
                    type="text" 
                    onChange={e => setUserData(prev => ({ ...prev.address, line1: e.target.value }))} 
                    value={userData.address.line1} 
                  />
                  <br />
                  <input 
                    className='bg-gray-100 p-3 rounded-md border border-gray-400 focus:ring-primary focus:ring-2 w-full' 
                    type="text" 
                    onChange={e => setUserData(prev => ({ ...prev.address, line2: e.target.value }))} 
                    value={userData.address.line2} 
                  />
                </div>
              )
              : <p className='text-gray-500'>{userData.address.line1}<br />{userData.address.line2}</p>
          }
        </div>
      </div>

      <p className='text-neutral-500 font-semibold text-lg mt-3'>BASIC INFORMATION</p>
      <div className='grid grid-cols-[1fr_3fr] gap-y-4 mt-4'>
        <p className='font-medium text-lg'>Gender: </p>
        {
          isEdit
            ? <select 
                className='bg-gray-100 p-3 rounded-md border border-gray-400 focus:ring-primary focus:ring-2' 
                onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))} 
                value={userData.gender}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            : <p className='text-gray-400'>{userData.gender}</p>
        }

        <p className='font-medium text-lg'>Birthday: </p>
        {
          isEdit
            ? <input 
                className='bg-gray-100 p-3 rounded-md border border-gray-400 focus:ring-primary focus:ring-2' 
                type="date" 
                onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))} 
                value={userData.dob} 
              />
            : <p className='text-gray-400'>{userData.dob}</p>
        }
      </div>

      <div className='mt-6'>
        {
          isEdit
            ? <button 
                className='bg-primary text-white px-8 py-3 rounded-full hover:bg-primary-dark transition-all'
                onClick={() => setIsEdit(false)}
              >
                Save Information
              </button>
            : <button 
                className='bg-primary text-white px-8 py-3 rounded-full hover:bg-primary-dark transition-all'
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
        }
      </div>

    </div>
  );
};

export default MyProfile;
