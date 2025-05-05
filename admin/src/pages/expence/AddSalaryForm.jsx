import React, { useState } from "react";

export default function AddSalaryForm() {
  const [formData, setFormData] = useState({
    employee: "",
    salary: "",
    allowances: "",
    deductions: "",
    payDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div>
      <h2>Add New Salary</h2>
      <form onSubmit={handleSubmit}>
        

        {/* Employee */}
        <label>Employee</label>
        <select name="employee" value={formData.employee} onChange={handleChange}>
          <option value="">Select Employee</option>
          
        </select>
        <br /><br />

        {/* Basic Salary */}
        <label>Basic Salary</label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Insert Salary"
        />
        <br /><br />

        {/* Allowances */}
        <label>Allowances</label>
        <input
          type="number"
          name="allowances"
          value={formData.allowances}
          onChange={handleChange}
          placeholder="Monthly Allowances"
        />
        <br /><br />

        {/* Deductions */}
        <label>Deductions</label>
        <input
          type="number"
          name="deductions"
          value={formData.deductions}
          onChange={handleChange}
          placeholder="Monthly Deductions"
        />
        <br /><br />

        {/* Pay Date */}
        <label>Pay Date</label>
        <input
          type="date"
          name="payDate"
          value={formData.payDate}
          onChange={handleChange}
        />
        <br /><br />

        {/* Submit Button */}
        <button type="submit">Add Salary</button>
      </form>
    </div>
  );
}
