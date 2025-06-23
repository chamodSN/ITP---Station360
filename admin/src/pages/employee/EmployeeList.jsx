import { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useLocation, useNavigate } from 'react-router-dom';

const EmployeeList = () => {
    const navigate = useNavigate();
    const { employees, loading, getAllEmployees } = useContext(AdminContext);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation(); // Get the current location object (URL, query params)

    useEffect(() => {
        // Fetch employees when component loads
        getAllEmployees();

        // Get search query from URL if it exists
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('search');
        if (query) {
            setSearchQuery(query);
        } else {
            setSearchQuery(''); // Reset search query if there's no query parameter
        }
    }, [location.search]); // Re-run when the URL search query changes

    const filteredEmployees = employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">
                {searchQuery
                    ? `Search results for "${searchQuery}"`
                    : 'Employee List'}
            </h1>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => (
                    <div
                        key={employee._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex"
                        onClick={() => navigate(`/employee/${employee._id}`)}
                    >
                        <div className="w-1/3">
                            <img
                                src={employee.image}
                                alt={employee.name}
                                className="w-full h-32 object-cover"
                            />
                        </div>
                        <div className="p-4 w-2/3">
                            <h2 className="text-xl font-semibold mb-2">{employee.name}</h2>
                            <p className="text-primary font-semibold">Tel: {employee.phone}</p>
                            <p className="text-primary font-semibold">Role: {employee.role}</p>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
};

export default EmployeeList;
