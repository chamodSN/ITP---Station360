import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom';


function Expence() {

    const{id} = useParams();
    const[Expence,setExpence]= useState(null);
<<<<<<< Updated upstream
    const [isEdit, setIsEdit] = useState(false);

=======
>>>>>>> Stashed changes

    const fetchExpence = async () => {

        try{
            const{data}= await axios.get(`http://localhost:4200/api/admin/expence/${id}`);
<<<<<<< Updated upstream

            if(data.success){
                setExpence(data.expence);
                }
            
        }catch(error){
            console.error("Error fetching Expense details:", error)
        }
    };
    
    const deleteExpence = async () =>{
        if(window.confirm("Are you sure you want to delete this expense? ")){
            try{
                await axios.delete(`http://localhost:4200/api/admin/expence/${id}`);
            }catch(error){
                console.error("Error deleting expense:",error);
            }
        }
    };
    const updateExpence = async () => {
        try {

            const updatedExpence = {
                ExpenceName: Expence.ExpenceName,
                ExpenceType: Expence.ExpenceType,
                Reason: Expence.Reason,
                Cost: Expence.Cost,
                Date: Expence.Date
            };
           
            const { data } = await axios.put(`http://localhost:4200/api/admin/expence/${id}`, updatedExpence);
            console.log("Response data:", data);
            if (data.success) {
                await fetchExpence();
                setIsEdit(false);
            } else {
                console.error(data.message);
            }

        } catch (error) {
            console.error("Error updating expense:", error);

=======
            if(data.success){
                setExpence(data.expence);
                }else{
                    console.log("Error ", data.error)
                }
            
        }catch(error){
            console.error("Error", error)
>>>>>>> Stashed changes
        }
    };

    useEffect(()=>{
        fetchExpence();
    }, [id]);



  return Expence && (
    <>
<<<<<<< Updated upstream

    <h1>Expence</h1>
         <div>
         <p>Expense  Name:</p>
        
            {!isEdit
                ? <p>{Expence.ExpenceName}</p> :
                <input type="text" value={Expence.ExpenceName} onChange={(e) => setExpence (prev => ({ ...prev, ExpenceName: e.target.value }))} />
            }
        <br></br>
        <p>Expense  Type:</p>
        
        {!isEdit
            ? <p>{Expence.ExpenceType}</p> :
            <input type="text" value={Expence.ExpenceType} onChange={(e) => setExpence (prev => ({ ...prev, ExpenceType: e.target.value }))} />
        }
    <br></br>
              
    <p>Reason:</p>
        
        {!isEdit
            ? <p>{Expence.Reason}</p> :
            <input type="text" value={Expence.Reason} onChange={(e) => setExpence (prev => ({ ...prev, Reason: e.target.value }))} />
        }
    <br></br>
    <p>Cost:</p>
        
        {!isEdit
            ? <p>{Expence.Cost}</p> :
            <input type="text" value={Expence.Cost} onChange={(e) => setExpence (prev => ({ ...prev, Cost: e.target.value }))} />
        }
    <br></br>

    <p>Date:{Expence.Date}</p>
    <br></br>
    {isEdit ? (
                <button onClick={() => updateExpence()}>Save</button>
            ) : (
                <button onClick={() => setIsEdit(!isEdit)}>Edit</button>
            )}
            <br>
            </br>
            <button onClick={() => deleteExpence()}>Delete</button>

=======
    <div>Expence</div>
         <div>
        <h2>{Expence.ExpenceName}</h2>
    <p>Expence Type:{Expence.ExpenceType}</p>
    <p>Reason:{Expence.Reason}</p>
    <p>Cost:{Expence.Cost}</p>
    <p>Date:{Expence.Date}</p>
>>>>>>> Stashed changes
    
 </div>
 
</>

  )
}

export default Expence