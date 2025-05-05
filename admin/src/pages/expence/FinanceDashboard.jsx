import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Doughnut, Bar, Line } from "react-chartjs-2";
import axios from "axios";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const FinanceDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesRes, incomeRes] = await Promise.all([
          axios.get('http://localhost:4200/api/admin/all-expence'),
          axios.get('http://localhost:4200/api/admin/completed-bookings')
        ]);

        console.log('Expenses Response:', expensesRes.data);
        console.log('Income Response:', incomeRes.data);

        if (expensesRes.data.success) {
          setExpenses(expensesRes.data.AllExpence);
        }
        if (incomeRes.data) {
          // Filter for billed bookings and calculate total amount
          const billedBookings = incomeRes.data.filter(booking => {
            console.log('Booking Status:', booking.status);
            console.log('Booking Total Amount:', booking.totalAmount);
            return booking.status === 'billed' && booking.totalAmount;
          });
          console.log('Filtered Billed Bookings:', billedBookings);
          setIncome(billedBookings);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for the expense type pie chart
  const getExpenseTypeData = () => {
    const typeMap = {};
    expenses.forEach(expense => {
      typeMap[expense.ExpenceType] = (typeMap[expense.ExpenceType] || 0) + Number(expense.Cost);
    });

    return {
      labels: Object.keys(typeMap),
      datasets: [{
        label: "Expense by Type",
        data: Object.values(typeMap),
        backgroundColor: [
          "#FF6384", // Red
          "#36A2EB", // Blue
          "#FFCE56", // Yellow
          "#4BC0C0", // Teal
          "#9966FF", // Purple
          "#FF9F40", // Orange
          "#4D5360", // Dark Gray
          "#C9CBCF", // Light Gray
        ],
        borderWidth: 1,
      }],
    };
  };

  // Process data for the monthly expense and income charts
  const getMonthlyData = () => {
    const expenseMonthMap = {};
    const incomeMonthMap = {};

    // Process expenses
    expenses.forEach(expense => {
      const date = new Date(expense.Date);
      const month = date.toLocaleString('default', { month: 'short' });
      expenseMonthMap[month] = (expenseMonthMap[month] || 0) + Number(expense.Cost);
    });

    // Process income from billed bookings
    console.log('Processing income for charts:', income);
    income.forEach(booking => {
      console.log('Processing booking:', booking);
      if (booking.status === 'billed' && booking.totalAmount) {
        const date = new Date(booking.createdAt);
        const month = date.toLocaleString('default', { month: 'short' });
        incomeMonthMap[month] = (incomeMonthMap[month] || 0) + Number(booking.totalAmount);
      }
    });

    const labels = Object.keys({ ...expenseMonthMap, ...incomeMonthMap });
    const expenseData = labels.map(month => expenseMonthMap[month] || 0);
    const incomeData = labels.map(month => incomeMonthMap[month] || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Monthly Expenses',
          data: expenseData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        },
        {
          label: 'Monthly Income',
          data: incomeData,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ],
    };
  };

  // Calculate total income and expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.Cost), 0);
  const totalIncome = income.reduce((sum, booking) => {
    console.log('Calculating income for booking:', booking);
    if (booking.status === 'billed' && booking.totalAmount) {
      console.log('Adding amount:', booking.totalAmount);
      return sum + Number(booking.totalAmount);
    }
    return sum;
  }, 0);
  console.log('Total Income:', totalIncome);
  const netProfit = totalIncome - totalExpenses;

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Finance Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Net Profit</h3>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${netProfit.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Expense Type Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Expense Distribution by Type</h3>
          <div className="h-80">
            <Doughnut data={getExpenseTypeData()} />
          </div>
        </div>

        {/* Monthly Expense and Income Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Monthly Financial Overview</h3>
          <div className="h-80">
            <Bar data={getMonthlyData()} />
          </div>
        </div>

        {/* Monthly Expense and Income Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Monthly Financial Trend</h3>
          <div className="h-80">
            <Line 
              data={getMonthlyData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Amount ($)'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Month'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;