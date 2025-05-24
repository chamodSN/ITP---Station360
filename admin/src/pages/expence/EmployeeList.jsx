import { useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
    const navigate = useNavigate();
    const { employees, employeesLoading, getAllEmployees } = useContext(AdminContext);

    useEffect(() => {
        getAllEmployees();
        console.log(employees);
    }, []);

    if (employeesLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Employee List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((employee) => (
                    <div
                        key={employee._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => navigate(`/employee-salary/${employee._id}`)}
                    >
                        <img
                            src={employee.image}
                            alt={employee.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{employee.name}</h2>
                            <p className="text-primary font-semibold">Tel : {employee.phone}</p>
                            <p className="text-primary font-semibold">Role : {employee.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeeList;