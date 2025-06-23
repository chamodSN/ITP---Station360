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
        `${API_URL}/api/admin/update-salary/${id}`,
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
        `${API_URL}/api/admin/employee-attendance?month=${month}&employeeId=${id}`,
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
        `${API_URL}/api/admin/add-salary/${id}`,
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

  const handleDownloadSalarySlip = async (employeeId, month, year) => {
    try {
        console.log('Downloading salary slip with data:', { employeeId, month, year });

        // Validate date
        const selectedDate = new Date(year, month - 1);
        const currentDate = new Date();
        if (selectedDate > currentDate) {
            toast.error('Cannot generate salary slip for future date');
            return;
        }

        // Validate required data
        if (!employeeId || !month || !year) {
            toast.error('Missing required data for salary slip generation');
            return;
        }

        // Validate salary data
        if (!salaryResult) {
            toast.error('Please calculate salary first');
            return;
        }

        // Format month to ensure it's two digits
        const formattedMonth = month.toString().padStart(2, '0');
        console.log('Formatted month:', formattedMonth);

        // Prepare salary data
        const salaryData = {
            month: formattedMonth,
            year,
            basicSalary: salaryResult.baseSalary,
            allowances: salaryResult.totalBonuses,
            overtime: 0, // Add if you have overtime calculation
            deductions: salaryResult.totalDeductions,
            netSalary: salaryResult.finalSalary,
            totalHours: salaryResult.totalHours,
            totalDays: salaryResult.totalDays
        };

        console.log('Sending salary data:', salaryData);

        const response = await axios.get(
            `${API_URL}/api/admin/salary-slip/${employeeId}`,
            {
                params: salaryData,
                responseType: 'blob',
                withCredentials: true
            }
        );

        console.log('Response received:', response);

        // Check if the response is actually a PDF
        if (response.data.type !== 'application/pdf') {
            // Try to read the error message from the blob
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const errorData = JSON.parse(reader.result);
                    toast.error(errorData.error || 'Failed to generate salary slip');
                } catch (e) {
                    toast.error('Failed to generate salary slip');
                }
            };
            reader.readAsText(response.data);
            return;
        }

        // Create blob and download
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `salary-slip-${employeeId}-${formattedMonth}-${year}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.success('Salary slip downloaded successfully');
    } catch (error) {
        console.error('Error downloading salary slip:', error);
        if (error.response?.data) {
            // Try to read the error message from the blob
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const errorData = JSON.parse(reader.result);
                    toast.error(errorData.error || 'Failed to generate salary slip');
                } catch (e) {
                    toast.error('Failed to generate salary slip');
                }
            };
            reader.readAsText(error.response.data);
        } else {
            toast.error('Failed to generate salary slip');
        }
    }
};

  // Add this function to get max month value
  const getMaxMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}`;
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
              max={getMaxMonth()}
              className="border p-2 rounded w-full"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Select a month up to the current month
            </p>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Fetch Attendance
          </button>
        </form>

        {attendanceFetched && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Attendance Summary</h3>
            <p>Total Days: {attendance.totalDays}</p>
            <p>Total Hours: {attendance.totalHours}</p>
          </div>
        )}

        {attendanceFetched && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Bonuses</h3>
            {bonuses.map((bonus, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Description"
                  value={bonus.description}
                  onChange={e => {
                    const newBonuses = [...bonuses];
                    newBonuses[index].description = e.target.value;
                    setBonuses(newBonuses);
                  }}
                  className="border p-2 rounded flex-1"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={bonus.amount}
                  onChange={e => {
                    const newBonuses = [...bonuses];
                    newBonuses[index].amount = parseFloat(e.target.value) || 0;
                    setBonuses(newBonuses);
                  }}
                  className="border p-2 rounded w-32"
                />
              </div>
            ))}
            <button
              onClick={() => setBonuses([...bonuses, { description: '', amount: 0 }])}
              className="text-blue-600 hover:text-blue-800"
            >
              + Add Bonus
            </button>
          </div>
        )}

        {attendanceFetched && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Deductions</h3>
            {deductions.map((deduction, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Description"
                  value={deduction.description}
                  onChange={e => {
                    const newDeductions = [...deductions];
                    newDeductions[index].description = e.target.value;
                    setDeductions(newDeductions);
                  }}
                  className="border p-2 rounded flex-1"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={deduction.amount}
                  onChange={e => {
                    const newDeductions = [...deductions];
                    newDeductions[index].amount = parseFloat(e.target.value) || 0;
                    setDeductions(newDeductions);
                  }}
                  className="border p-2 rounded w-32"
                />
              </div>
            ))}
            <button
              onClick={() => setDeductions([...deductions, { description: '', amount: 0 }])}
              className="text-blue-600 hover:text-blue-800"
            >
              + Add Deduction
            </button>
          </div>
        )}

        {attendanceFetched && (
          <div className="mt-4">
            <button
              onClick={handleCalculateSalary}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Calculate Salary
            </button>
          </div>
        )}

        {salaryResult && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Salary Calculation Result</h2>
            <div className="space-y-2">
              <p>Total Days: {salaryResult.totalDays}</p>
              <p>Total Hours: {salaryResult.totalHours}</p>
              <p>Base Salary: ${salaryResult.baseSalary}</p>
              <p>Total Bonuses: ${salaryResult.totalBonuses}</p>
              <p>Total Deductions: ${salaryResult.totalDeductions}</p>
              <p className="font-bold">Final Salary: ${salaryResult.finalSalary}</p>
            </div>
            
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleSaveSalary}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Salary
              </button>
              
              <button
                onClick={() => {
                  if (!month) {
                    toast.error('Please select a month first');
                    return;
                  }
                  if (!salaryResult) {
                    toast.error('Please calculate salary first');
                    return;
                  }
                  const [year, monthNum] = month.split('-');
                  const selectedDate = new Date(year, monthNum - 1);
                  const currentDate = new Date();
                  if (selectedDate > currentDate) {
                    toast.error('Cannot generate salary slip for future date');
                    return;
                  }
                  handleDownloadSalarySlip(id, monthNum, year);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Salary Slip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSalary; 