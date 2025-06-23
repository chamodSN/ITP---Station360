import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const BookingSummary = () => {
    const { bookings, getAllBookings, loading } = useContext(AdminContext);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    const [pieData, setPieData] = useState({
        labels: [],
        datasets: []
    });
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });
    const [summaryStats, setSummaryStats] = useState({
        totalBookings: 0,
        averageBookings: 0
    });
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        getAllBookings();
    }, []);

    useEffect(() => {
        if (bookings && bookings.length > 0) {
            console.log('Bookings data:', bookings);

            // Filter bookings based on date range
            const filteredBookings = bookings.filter(booking => {
                if (!dateRange.start && !dateRange.end) return true;
                const bookingDate = new Date(booking.date);
                const startDate = dateRange.start ? new Date(dateRange.start) : new Date(0);
                const endDate = dateRange.end ? new Date(dateRange.end) : new Date();
                return bookingDate >= startDate && bookingDate <= endDate;
            });

            // Get all unique service categories from bookings
            const categories = [...new Set(filteredBookings.map(booking => {
                console.log('Service category:', booking.serviceId?.category);
                return booking.serviceId?.category || 'Uncategorized';
            }))];

            console.log('Unique service categories:', categories);

            // Calculate summary statistics
            const totalBookings = filteredBookings.length;

            setSummaryStats({
                totalBookings,
                averageBookings: totalBookings / (categories.length || 1)
            });

            // Line chart data
            const groupedData = filteredBookings.reduce((acc, booking) => {
                const date = new Date(booking.date).toLocaleDateString();
                const category = booking.serviceId?.category || 'Uncategorized';

                if (!acc[date]) {
                    acc[date] = {};
                }
                if (!acc[date][category]) {
                    acc[date][category] = 0;
                }
                acc[date][category]++;
                return acc;
            }, {});

            const dates = Object.keys(groupedData).sort();
            const datasets = categories.map((category, index) => ({
                label: category,
                data: dates.map(date => groupedData[date][category] || 0),
                borderColor: `hsl(${index * 137.5}, 70%, 50%)`,
                backgroundColor: `hsla(${index * 137.5}, 70%, 50%, 0.5)`,
                tension: 0.4,
                fill: true
            }));

            setChartData({
                labels: dates,
                datasets
            });

            // Pie chart data
            const categoryCounts = categories.reduce((acc, category) => {
                acc[category] = filteredBookings.filter(b => (b.serviceId?.category || 'Uncategorized') === category).length;
                return acc;
            }, {});

            setPieData({
                labels: categories,
                datasets: [{
                    data: categories.map(category => categoryCounts[category]),
                    backgroundColor: categories.map((_, index) =>
                        `hsla(${index * 137.5}, 70%, 50%, 0.7)`)
                }]
            });
        } else {
            console.log('No bookings data available');
        }
    }, [bookings, dateRange]);

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#4B5563',
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: true,
                text: 'Booking Trends by Category',
                color: '#1F2937',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#E5E7EB'
                },
                ticks: {
                    color: '#4B5563'
                },
                title: {
                    display: true,
                    text: 'Number of Bookings',
                    color: '#4B5563'
                }
            },
            x: {
                grid: {
                    color: '#E5E7EB'
                },
                ticks: {
                    color: '#4B5563'
                },
                title: {
                    display: true,
                    text: 'Date',
                    color: '#4B5563'
                }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#4B5563',
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: true,
                text: 'Category Distribution',
                color: '#1F2937',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
        }
    };

    const handleGetAppointments = () => {
        setShowDatePicker(true);
    };

    const handleGeneratePDF = async () => {
        try {
            const response = await axios.get(`http://localhost:4200/api/daily-appointments`, {
                params: { date: selectedDate },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `daily-appointments-${selectedDate}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setShowDatePicker(false);
        } catch (error) {
            alert('Error generating PDF.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Booking Analytics Dashboard</h1>
                    <div className="flex gap-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="block w-48 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="block w-48 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-row gap-8">
                    <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Bookings</h3>
                        <p className="text-4xl font-bold text-blue-600">{summaryStats.totalBookings}</p>
                        <div className="mt-2 text-sm text-gray-500">
                            Total number of bookings
                        </div>
                    </div>
                    <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Bookings</h3>
                        <p className="text-4xl font-bold text-green-600">{summaryStats.averageBookings.toFixed(1)}</p>
                        <div className="mt-2 text-sm text-gray-500">
                            Average bookings per category
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="h-[400px]">
                            <Line options={lineOptions} data={chartData} />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="h-[400px]">
                            <Pie options={pieOptions} data={pieData} />
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <button
                        onClick={handleGetAppointments}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Get Appointments per Day
                    </button>
                </div>
                {showDatePicker && (
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '5px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        zIndex: 1000
                    }}>
                        <h3>Select Date</h3>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{
                                padding: '8px',
                                margin: '10px 0',
                                width: '100%'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <button
                                onClick={() => setShowDatePicker(false)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGeneratePDF}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Generate PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingSummary; 