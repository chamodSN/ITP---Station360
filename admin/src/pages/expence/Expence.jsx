import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom';


function Expence() {

    const{id} = useParams();
    const[Expence,setExpence]= useState(null);

    const fetchExpence = async () => {

        try{
            const{data}= await axios.get(`http://localhost:4200/api/admin/expence/${id}`);
            if(data.success){
                setExpence(data.expence);
                }else{
                    console.log("Error ", data.error)
                }
            
        }catch(error){
            console.error("Error", error)
        }
    };

    useEffect(()=>{
        fetchExpence();
    }, [id]);



  return Expence && (
    <>
    <div>Expence</div>
         <div>
        <h2>{Expence.ExpenceName}</h2>
    <p>Expence Type:{Expence.ExpenceType}</p>
    <p>Reason:{Expence.Reason}</p>
    <p>Cost:{Expence.Cost}</p>
    <p>Date:{Expence.Date}</p>
    
 </div>
 
</>

  )
}

export default Expence