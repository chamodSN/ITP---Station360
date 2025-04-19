import axios from "axios"
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const AllExpence = () => {

    const [Expence,setExpence] = useState([]);
    const navigate = useNavigate();



    const getAllExpence = async () => {
    
        try{
            const{data} = await axios.get('http://localhost:4200/api/admin/all-expence');

            console.log(data)
    
            if(data.success){
                setExpence(data.AllExpence)
            }else{
                 console.log("error fetching data")
            }
    
        }catch(error){
        console.log(error)
        }
    }

    useEffect(()=>{
        getAllExpence()
    }, [])



    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">All Expenses</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
                {Expence.map((item, index) => (
                    <div 
                        key={index} 
                        onClick={() => navigate(`/expence/${item._id}`)}
                        className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition"
                    >
                        <p className="text-gray-600"><span className="font-medium">Type:</span> {item.ExpenceType}</p>
                        <p className="text-gray-600"><span className="font-medium">Reason:</span> {item.Reason}</p>
                        <p className="text-gray-600"><span className="font-medium">Cost:</span> ${item.Cost}</p>
                        <p className="text-gray-600"><span className="font-medium">Date:</span> {item.Date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllExpence;
