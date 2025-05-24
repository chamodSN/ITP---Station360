import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import assets from "../../assets/assets";

const EmployeeProfile = () => {

  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const fetchEmployee = async () => {
    try {
      const { data } = await axios.get(`http://localhost:4200/api/admin/employee/${id}`, {
        withCredentials: true,
      }
      );
      if (data.success) {
        setEmployee(data.employee);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Failed to fetch employee details!");
    }
  };

  const deleteEmployee = async () => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:4200/api/admin/employee/${id}`, {
          withCredentials: true,
        });
        toast.success("Employee deleted successfully!");
        navigate('/employees');
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("Failed to delete employee!");
      }
    }
  };

  const updateEmployee = async () => {
    try {
      const formData = new FormData();

      formData.append('name', employee.name);
      formData.append('email', employee.email);
      formData.append('address', employee.address);
      formData.append('dob', employee.dob);
      formData.append('phone', employee.phone);
      formData.append('role', employee.role);

      // Add image if it exists
      if (image) {
        formData.append('image', image);
      }

      for (let [key, value] of formData.entries()) {
        console.log(` from frontend ${key}:`, value);
      }


      const { data } = await axios.put(
        `http://localhost:4200/api/admin/employee/${id}`,
        formData, {
        withCredentials: true,
      },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (data.success) {
        await fetchEmployee(); // Refresh the employee data
        setIsEdit(false);
        setImage(null); // Reset image state
        toast.success("Employee updated successfully!");
      } else {
        console.error(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee!");
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  return employee && (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <div>
          {!isEdit ? (
            <h1 className="text-2xl font-semibold text-center">{employee.name}</h1>
          ) : (
            <input
              type="text"
              value={employee.name}
              onChange={(e) => setEmployee(prev => ({ ...prev, name: e.target.value }))}
              className="border rounded p-2 w-full"
            />
          )}
        </div>

        <p className="font-semibold mt-4">Email:</p>
        {!isEdit ? (
          <p>{employee.email}</p>
        ) : (
          <input
            type="email"
            value={employee.email}
            onChange={(e) => setEmployee(prev => ({ ...prev, email: e.target.value }))}
            className="border rounded p-2 w-full"
          />
        )}

        <p className="font-semibold mt-4">Phone:</p>
        {!isEdit ? (
          <p>{employee.phone}</p>
        ) : (
          <input
            type="text"
            value={employee.phone}
            onChange={(e) => setEmployee(prev => ({ ...prev, phone: e.target.value }))}
            className="border rounded p-2 w-full"
          />
        )}

        <p className="font-semibold mt-4">Address:</p>
        {!isEdit ? (
          <p>{employee.address}</p>
        ) : (
          <input
            type="text"
            value={employee.address}
            onChange={(e) => setEmployee(prev => ({ ...prev, address: e.target.value }))}
            className="border rounded p-2 w-full"
          />
        )}

        <p className="font-semibold mt-4">Date of Birth:</p>
        {!isEdit ? (
          <p>{employee.dob}</p>
        ) : (
          <input
            type="text"
            value={employee.dob}
            onChange={(e) => setEmployee(prev => ({ ...prev, dob: e.target.value }))}
            className="border rounded p-2 w-full"
          />
        )}

        <p className="font-semibold mt-4">Role:</p>
        {!isEdit ? (
          <p>{employee.role}</p>
        ) : (
          <select
            value={employee.role}
            onChange={(e) => setEmployee(prev => ({ ...prev, role: e.target.value }))}
            className="border rounded p-2 w-full"
          >
            <option value="supervisor">Supervisor</option>
            <option value="worker">Worker</option>
            <option value="admin">Admin</option>
          </select>
        )}

        <br />

        {!isEdit ? (
          <img className='w-36 rounded' src={employee.image} alt="Employee" />
        ) : (
          <label htmlFor="image">
            <div className='inline-block relative cursor-pointer'>
              <p className="font-semibold mt-4">Profile Image:</p>
              <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : employee.image} alt="" />
              <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
            </div>
            <input type="file" onChange={(e) => { setImage(e.target.files[0]); }} id="image" hidden />
          </label>
        )}

        <div className="mt-6 flex justify-center gap-4">
          {isEdit ? (
            <button onClick={updateEmployee} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
          ) : (
            <button onClick={() => setIsEdit(true)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Edit</button>
          )}
          <button onClick={deleteEmployee} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;
