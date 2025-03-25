import React,{ useState } from 'react'
import axios from 'axios';

const AddExpence = () => {

    const[ExpenceName,setExpenceName]=useState('');
    const[ExpenceType,setExpenceType]=useState('');
    const[Reason,setReason]=useState('');
    const[Cost,setCost]=useState('');
    const[Date,setDate]=useState('');

    const onSubmitHandaler = async(e)=>{
        e.preventDefault();

        try{

            const formData = {
                ExpenceName,
                ExpenceType,
                Reason,
                Cost,
                Date,
            };

            const { data } = await axios.post('http://localhost:4200/api/admin/add-expence', formData)

            if (data) {
                console.log("Expence added successfully");
            }

            console.log(data)


        }catch(error){
            console.error(error);

        };
        
    }

    return (
        <form onSubmit={onSubmitHandaler}>
            
        <label>Expense  Name</label>
        <br></br>
                <input type="text" placeholder="Expense Name" required onChange={ (e) => setExpenceName(e.target.value)} value={ExpenceName}/>
                <br>
                </br>
        <label>Expense  Type</label>
        <br></br>
                <input type="text" placeholder="Expense Type" required  onChange={ (e) => setExpenceType(e.target.value)} value={ExpenceType}/>
                <br>
                </br>
        <label>Reason</label>
        <br></br>
                <input type="text" placeholder="Reason" required onChange={ (e) => setReason(e.target.value)} value={Reason}/>
                <br>
                </br>
        <label>Cost</label>
        <br></br>
                <input type="number" placeholder="Cost" required onChange={ (e) => setCost(e.target.value)} value={Cost}/>
                <br>
                </br>
        <label>Date</label>
        <br></br>
                <input type="date" required onChange={ (e) => setDate(e.target.value)} value={Date}/>
                <br>
                </br>
                <button type="submit">Submit</button>
            </form>
      )
    }


export default AddExpence;