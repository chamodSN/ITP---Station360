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
    <div>
        <h1>AllExpence</h1>
        {Expence.map((item,index)=>(
             <div key = {index}onClick={() => navigate(`/expence/${item._id}`)}>
                <h2>{item.ExpenceName}</h2>
                <p>{item.ExpenceType}</p>
                <p>{item.Reason}</p>
                <p>{item.Cost}</p>
                <p>{item.Date}</p>
                
             </div>

        ))

        }
       

    </div>
    
  )
}

export default AllExpence

