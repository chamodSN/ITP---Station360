import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
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
        averageBookings: 0,
        mostPopularCategory: '',
        totalRevenue: 0
    });

    useEffect(() => {
        getAllBookings();
    }, []);

    useEffect(() => {
        if (bookings.length > 0) {
            // Filter bookings based on date range
            const filteredBookings = bookings.filter(booking => {
                if (!dateRange.start && !dateRange.end) return true;
                const bookingDate = new Date(booking.date);
                const startDate = dateRange.start ? new Date(dateRange.start) : new Date(0);
                const endDate = dateRange.end ? new Date(dateRange.end) : new Date();
                return bookingDate >= startDate && bookingDate <= endDate;
            });

            // Calculate summary statistics
            const totalBookings = filteredBookings.length;
            const categories = [...new Set(filteredBookings.map(booking => booking.category))];
            const categoryCounts = categories.reduce((acc, category) => {
                acc[category] = filteredBookings.filter(b => b.category === category).length;
                return acc;
            }, {});
            
            const mostPopularCategory = Object.entries(categoryCounts)
                .sort((a, b) => b[1] - a[1])[0][0];
            
            const totalRevenue = filteredBookings.reduce((sum, booking) => 
                sum + (booking.price || 0), 0);

            setSummaryStats({
                totalBookings,
                averageBookings: totalBookings / (categories.length || 1),
                mostPopularCategory,
                totalRevenue
            });

            // Line chart data
            const groupedData = filteredBookings.reduce((acc, booking) => {
                const date = new Date(booking.date).toLocaleDateString();
                if (!acc[date]) {
                    acc[date] = {};
                }
                if (!acc[date][booking.category]) {
                    acc[date][booking.category] = 0;
                }
                acc[date][booking.category]++;
                return acc;
            }, {});

            const dates = Object.keys(groupedData).sort();
            const datasets = categories.map((category, index) => ({
                label: category,
                data: dates.map(date => groupedData[date][category] || 0),
                borderColor: `hsl(${index * 137.5}, 70%, 50%)`,
                backgroundColor: `hsla(${index * 137.5}, 70%, 50%, 0.5)`,
                tension: 0.4
            }));

            setChartData({
                labels: dates,
                datasets
            });

            // Pie chart data
            setPieData({
                labels: categories,
                datasets: [{
                    data: categories.map(category => categoryCounts[category]),
                    backgroundColor: categories.map((_, index) => 
                        `hsla(${index * 137.5}, 70%, 50%, 0.7)`)
                }]
            });
        }
    }, [bookings, dateRange]);

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Booking Trends by Category',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Bookings'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Category Distribution',
            },
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Date Range Filter */}
            <div className="flex gap-4 p-4 bg-white rounded-lg shadow-md">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
                    <p className="text-2xl font-bold text-blue-600">{summaryStats.totalBookings}</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">Average per Category</h3>
                    <p className="text-2xl font-bold text-green-600">{summaryStats.averageBookings.toFixed(1)}</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">Most Popular</h3>
                    <p className="text-2xl font-bold text-purple-600">{summaryStats.mostPopularCategory}</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
                    <p className="text-2xl font-bold text-red-600">${summaryStats.totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <div className="h-[400px]">
                        <Line options={lineOptions} data={chartData} />
                    </div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <div className="h-[400px]">
                        <Pie options={pieOptions} data={pieData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSummary; 