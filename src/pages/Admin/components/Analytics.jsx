import React, { useState, useEffect } from 'react';
import adminApi from '../../../services/apis/adminApi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

function Analytics() {
    const [analytics, setAnalytics] = useState({ sales: [], totalViews: 0 });
    const [period, setPeriod] = useState('day');

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            const res = await adminApi.getSalesAnalytics(period);
            setAnalytics(res.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const chartData = {
        labels: analytics.sales.map((sale) => sale._id),
        datasets: [
            {
                label: 'Revenue ($)',
                data: analytics.sales.map((sale) => sale.totalRevenue),
                backgroundColor: 'rgba(34, 197, 94, 0.5)',
            },
        ],
    };

    return (
        <div className="font-nunito">
            <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
            <div className="mb-4">
                <label className="mr-2">Period:</label>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="p-2 border rounded-md"
                >
                    <option value="day">Daily</option>
                    <option value="month">Monthly</option>
                </select>
            </div>
            <p className="mb-4">Total Product Views: {analytics.totalViews}</p>
            <div className="bg-white p-6 rounded-lg shadow">
                <Bar data={chartData} options={{ responsive: true }} />
            </div>
        </div>
    );
}

export default Analytics;