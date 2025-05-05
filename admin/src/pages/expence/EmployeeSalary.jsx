import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:4200' 
  : '';

const EmployeeSalary = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    hourlyRate: 0,
    baseSalary: 0
  });
  const [showForm, setShowForm] = useState(false);
  const [month, setMonth] = useState('');
  const [bonuses, setBonuses] = useState([{ description: '', amount: 0 }]);
  const [deductions, setDeductions] = useState([{ description: '', amount: 0 }]);
  const [salaryResult, setSalaryResult] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [attendance, setAttendance] = useState({ totalHours: 0, totalDays: 0 });
  const [attendanceFetched, setAttendanceFetched] = useState(false);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/admin/employee/${id}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setEmployee(response.data.employee);
        setFormData({
          hourlyRate: response.data.employee.hourlyRate || 0,
          baseSalary: response.data.employee.baseSalary || 0
        });
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      toast.error('Failed to fetch employee details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/employee/${id}/salary`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Salary details updated successfully');
        fetchEmployeeDetails(); // Refresh the data
      } else {
        toast.error(response.data.message || 'Failed to update salary details');
      }
    } catch (error) {
      console.error('Error updating salary details:', error);
      toast.error('Failed to update salary details');
    }
  };

  const handleFetchAttendance = async (e) => {
    e.preventDefault();
    if (!month) {
      toast.error('Please select a month');
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/attendance/${id}?month=${month}`,
        { withCredentials: true }
      );
      if (response.data.totalHours !== undefined) {
        setAttendance({
          totalHours: response.data.totalHours,
          totalDays: response.data.totalDays
        });
        setAttendanceFetched(true);
        toast.success('Attendance fetched!');
      } else {
        setAttendance({ totalHours: 0, totalDays: 0 });
        setAttendanceFetched(false);
        toast.error('No attendance found for this month');
      }
    } catch (error) {
      setAttendance({ totalHours: 0, totalDays: 0 });
      setAttendanceFetched(false);
      toast.error('Error fetching attendance');
    }
  };

  const handleCalculateSalary = (e) => {
    e.preventDefault();
    if (!attendanceFetched) {
      toast.error('Please fetch attendance first');
      return;
    }
    const hourlyRate = formData.hourlyRate || 0;
    const baseSalary = formData.baseSalary || 0;
    const basePay = attendance.totalHours * hourlyRate + baseSalary;
    const totalBonuses = bonuses.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalDeductions = deductions.reduce((sum, d) => sum + (d.amount || 0), 0);
    const finalSalary = basePay + totalBonuses - totalDeductions;
    setSalaryResult({
      totalDays: attendance.totalDays,
      totalHours: attendance.totalHours,
      baseSalary,
      totalBonuses,
      totalDeductions,
      finalSalary
    });
  };

  const handleSaveSalary = async () => {
    if (!month) {
      toast.error('Please select a month');
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/api/admin/employee/${id}/salary/add`,
        {
          month,
          bonuses: bonuses.filter(b => b.description && b.amount),
          deductions: deductions.filter(d => d.description && d.amount)
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success('Salary saved to database!');
        setSalaryResult(response.data.salary); // Optionally update the UI with the saved salary
      } else {
        toast.error(response.data.message || 'Failed to save salary');
      }
    } catch (error) {
      toast.error('Error saving salary');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Employee not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Update Salary Details</h1>
        <button
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors mb-4"
          onClick={() => setShowForm((prev) => !prev)}
        >
          Update Salary Details
        </button>
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hourly Rate
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Salary
              </label>
              <input
                type="number"
                name="baseSalary"
                value={formData.baseSalary}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              Save
            </button>
          </form>
        )}
      </div>
      <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Calculate & Add Salary</h2>
        <form onSubmit={handleFetchAttendance} className="space-y-4">
          <div>
            <label className="block mb-1">Month</label>
            <input
              type="month"
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Fetch Attendance
          </button>
        </form>
        {attendanceFetched && (
          <div className="my-4">
            <p><b>Total Days:</b> {attendance.totalDays}</p>
            <p><b>Total Hours:</b> {attendance.totalHours}</p>
            <form onSubmit={handleCalculateSalary} className="space-y-4 mt-4">
              <div>
                <label className="block mb-1">Bonuses</label>
                {bonuses.map((b, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={b.description}
                      onChange={e => {
                        const arr = [...bonuses];
                        arr[i].description = e.target.value;
                        setBonuses(arr);
                      }}
                      className="border p-2 rounded flex-1"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={b.amount}
                      onChange={e => {
                        const arr = [...bonuses];
                        arr[i].amount = parseFloat(e.target.value) || 0;
                        setBonuses(arr);
                      }}
                      className="border p-2 rounded w-24"
                    />
                    <button type="button" onClick={() => setBonuses(bonuses.filter((_, idx) => idx !== i))}>🗑️</button>
                  </div>
                ))}
                <button type="button" onClick={() => setBonuses([...bonuses, { description: '', amount: 0 }])}>Add Bonus</button>
              </div>
              <div>
                <label className="block mb-1">Deductions</label>
                {deductions.map((d, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={d.description}
                      onChange={e => {
                        const arr = [...deductions];
                        arr[i].description = e.target.value;
                        setDeductions(arr);
                      }}
                      className="border p-2 rounded flex-1"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={d.amount}
                      onChange={e => {
                        const arr = [...deductions];
                        arr[i].amount = parseFloat(e.target.value) || 0;
                        setDeductions(arr);
                      }}
                      className="border p-2 rounded w-24"
                    />
                    <button type="button" onClick={() => setDeductions(deductions.filter((_, idx) => idx !== i))}>🗑️</button>
                  </div>
                ))}
                <button type="button" onClick={() => setDeductions([...deductions, { description: '', amount: 0 }])}>Add Deduction</button>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Calculate Salary
              </button>
            </form>
          </div>
        )}
        {salaryResult && (
          <div className="mt-6 p-4 bg-white rounded shadow">
            <h3 className="font-bold mb-2">Salary Summary for {month}</h3>
            <p>Total Days: {salaryResult.totalDays}</p>
            <p>Total Hours: {salaryResult.totalHours}</p>
            <p>Base Salary: {salaryResult.baseSalary}</p>
            <p>Bonuses: {salaryResult.totalBonuses}</p>
            <p>Deductions: {salaryResult.totalDeductions}</p>
            <p className="font-bold text-lg">Final Salary: {salaryResult.finalSalary}</p>
            <button
              className="mt-4 bg-primary text-white px-4 py-2 rounded"
              onClick={handleSaveSalary}
            >
              Save Salary to DB
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSalary; 