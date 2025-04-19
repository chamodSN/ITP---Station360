import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import assets from "../../assets/assets";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Service = () => {

    const { id } = useParams();
    const [service, setService] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);

    const navigate = useNavigate();

    const fetchService = async () => {
        try {
            const { data } = await axios.get(`http://localhost:4200/api/admin/service/${id}`);
            if (data.success) {
                setService(data.service);
            }
        } catch (error) {
            console.error("Error fetching service details:", error);
            toast.error("Failed to fetch service details!");
        }
    };

    const deleteService = async () => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                await axios.delete(`http://localhost:4200/api/admin/service/${id}`);
                toast.success("Service deleted successfully!");
                navigate('/service/all-services');
            } catch (error) {
                console.error("Error deleting service:", error);
                toast.error("Failed to delete service!");
            }
        }
    };

    const updateService = async () => {
        try {
            const formData = new FormData();

            formData.append('serviceName', service.serviceName);
            formData.append('category', service.category);
            formData.append('displayImage', service.displayImage);
            formData.append('description', service.description);
            formData.append('specificationsString', service.specifications);
            formData.append('interval', service.interval);
            formData.append('price', service.price);
            formData.append('available', service.available);
            formData.append('isBookable', service.isBookable);

            if (image) {
                formData.append('image', image);
            }

            const { data } = await axios.put(`http://localhost:4200/api/admin/service/${id}`, formData);
            console.log("Response data:", data);
            if (data.success) {
                await fetchService();
                setIsEdit(false);
                toast.success("Service updated successfully!");
            } else {
                console.error(data.message);
                toast.error(data.message);
            }

        } catch (error) {
            console.error("Error updating service:", error);
            toast.error("Failed to update service!");
        }
    };


    useEffect(() => {
        fetchService();
    }, [id]);

    return service && (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
                <div>{!isEdit ? <h1 className="text-2xl font-semibold text-center">{service.serviceName}</h1> :
                    <input type="text" value={service.serviceName} onChange={(e) => setService(prev => ({ ...prev, serviceName: e.target.value }))} className="border rounded p-2 w-full" />
                }</div>

                <p className="font-semibold mt-4">Category:</p>
                {!isEdit ? (
                    <p>{service.category}</p>
                ) : (
                    <select value={service.category} onChange={(e) => setService(prev => ({ ...prev, category: e.target.value }))} className="border rounded p-2 w-full">
                        <option value="General Maintenance & Inspection">General Maintenance & Inspection</option>
                        <option value="Oil Change & Lubrication">Oil Change & Lubrication</option>
                        <option value="Brake Repair & Replacement">Brake Repair & Replacement</option>
                        <option value="Wheel Alignment & Balancing">Wheel Alignment & Balancing</option>
                        <option value="Vehicle Cleaning & Detailing">Vehicle Cleaning & Detailing</option>
                        <option value="Battery & Electrical System Services">Battery & Electrical System Services</option>
                        <option value="Engine Diagnostics & Repair">Engine Diagnostics & Repair</option>
                        <option value="Transmission Repair & Service">Transmission Repair & Service</option>
                        <option value="AC & Heating System Services">AC & Heating System Services</option>
                        <option value="Body & Paint Services">Body & Paint Services</option>
                    </select>
                )}
                <br />

                <p className="font-semibold mt-4">Price:</p>
                {!isEdit
                    ? <p>{service.price}</p> :
                    <input type="number" value={service.price} onChange={(e) => setService(prev => ({ ...prev, price: e.target.value }))} className="border rounded p-2 w-full" />
                }
                <br />

                <p className="font-semibold mt-4">Available:</p>
                {!isEdit
                    ? <p>{service.available ? "Yes" : "No"}</p> :
                    <input type="checkbox" checked={service.available} onChange={(e) => setService(prev => ({ ...prev, available: e.target.checked }))} />
                }
                <br />

                <p className="font-semibold mt-4">Bookable:</p>
                {!isEdit
                    ? <p>{service.isBookable ? "Yes" : "No"}</p> :
                    <input type="checkbox" checked={service.isBookable} onChange={(e) => setService(prev => ({ ...prev, isBookable: e.target.checked }))} />
                }
                <br />

                <p className="font-semibold mt-4">Description:</p>
                {!isEdit
                    ? <p>{service.description}</p> :
                    <textarea value={service.description} onChange={(e) => setService(prev => ({ ...prev, description: e.target.value }))} className="border rounded p-2 w-full"></textarea>
                }
                <br />

                <p className="font-semibold mt-4">Specifications:</p>
                {!isEdit
                    ? <p>{service.specifications}</p> :
                    <textarea value={service.specifications} onChange={(e) => setService(prev => ({ ...prev, specifications: e.target.value }))} className="border rounded p-2 w-full"></textarea>
                }
                <br />

                {!isEdit
                    ? '' :
                    <>
                        <p className="font-semibold mt-4">Interval:</p>
                        <input type="text" value={service.interval} onChange={(e) => setService(prev => ({ ...prev, interval: e.target.value }))} className="border rounded p-2 w-full" />
                    </>
                }
                <br />

                {!isEdit ?
                    <img className='w-36 rounded' src={service.displayImage} alt="Service" />
                    :
                    <label htmlFor="image">
                        <div className='inline-block relative cursor-pointer'>
                            <p className="font-semibold mt-4">Display Image:</p>
                            <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : service.displayImage} alt="" />
                            <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
                        </div>
                        <input type="file" onChange={(e) => { setImage(e.target.files[0]) }} id="image" hidden />
                    </label>
                }

                <div className="mt-6 flex justify-center gap-4">
                    {isEdit ? (
                        <button onClick={() => updateService()} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
                    ) : (
                        <button onClick={() => setIsEdit(!isEdit)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Edit</button>
                    )}
                    <button onClick={() => deleteService()} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                </div>
            </div>
        </div>
    )
}

export default Service;
