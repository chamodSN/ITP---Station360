import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'

const Service = () => {

    const { id } = useParams();
    const [service, setService] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);

    const fetchService = async () => {
        try {
            const { data } = await axios.get(`http://localhost:4200/api/admin/service/${id}`);
            if (data.success) {
                setService(data.service);
            }
        } catch (error) {
            console.error("Error fetching service details:", error);
        }
    };

    const deleteService = async () => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                await axios.delete(`http://localhost:4200/api/admin/service/${id}`);
            } catch (error) {
                console.error("Error deleting service:", error);
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
            } else {
                console.error(data.message);
            }

        } catch (error) {
            console.error("Error updating service:", error);
        }
    };


    useEffect(() => {
        fetchService();
    }, [id]);

    return service && (
        <div>
            <div>{!isEdit ? <h1>{service.serviceName}</h1> :
                <input type="text" value={service.serviceName} onChange={(e) => setService(prev => ({ ...prev, serviceName: e.target.value }))} />
            }</div>

            <p>Category:</p>
            {!isEdit ? (
                <p>{service.category}</p>
            ) : (
                <select value={service.category} onChange={(e) => setService(prev => ({ ...prev, category: e.target.value }))}>
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
            <p>Price:</p>
            {!isEdit
                ? <p>{service.price}</p> :
                <input type="number" value={service.price} onChange={(e) => setService(prev => ({ ...prev, price: e.target.value }))} />
            }
            <br />
            <p>Available:</p>
            {!isEdit
                ? <p>{service.available ? "Yes" : "No"}</p> :
                <input type="checkbox" checked={service.available} onChange={(e) => setService(prev => ({ ...prev, available: e.target.checked }))} />
            }
            <br />
            <p>Bookable:</p>
            {!isEdit
                ? <p>{service.isBookable ? "Yes" : "No"}</p> :
                <input type="checkbox" checked={service.isBookable} onChange={(e) => setService(prev => ({ ...prev, isBookable: e.target.checked }))} />
            }
            <br />
            <p>Description:</p>
            {!isEdit
                ? <p>{service.description}</p> :
                <textarea value={service.description} onChange={(e) => setService(prev => ({ ...prev, description: e.target.value }))}></textarea>
            }
            <br />
            <p>Specifications:</p>
            {!isEdit
                ? <p>{service.specifications}</p> :
                <textarea value={service.specifications} onChange={(e) => setService(prev => ({ ...prev, specifications: e.target.value }))}></textarea>
            }
            <br />
            {!isEdit
                ? '' :
                <>
                    <p>Interval:</p>
                    <input type="text" value={service.interval} onChange={(e) => setService(prev => ({ ...prev, interval: e.target.value }))} />
                </>
            }
            <br />
            {!isEdit ? <div>
                <p>Display Image:</p>
                <img src={service.displayImage} alt={service.serviceName} style={{ width: "300px" }} />
                <br /></div> : <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            }
            {isEdit ? (
                <button onClick={() => updateService()}>Save</button>
            ) : (
                <button onClick={() => setIsEdit(!isEdit)}>Edit</button>
            )}
            <br />
            <br />
            <button onClick={() => deleteService()}>Delete</button>
        </div >
    )
}

export default Service;