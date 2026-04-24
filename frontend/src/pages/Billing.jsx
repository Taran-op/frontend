import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apisAPI, usageAPI } from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Billing() {
  const [selectedApi, setSelectedApi] = useState('');

  const { data: apisData, isLoading: apisLoading } = useQuery({
    queryKey: ['apis'],
    queryFn: () => apisAPI.getAll().then(res => res.data),
  });

  const apis = apisData?.apis || [];

  const { data: billingData, isLoading: billingLoading } = useQuery({
    queryKey: ['billing', selectedApi],
    queryFn: () => selectedApi ? usageAPI.getBilling(selectedApi).then(res => res.data) : null,
    enabled: !!selectedApi,
  });

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const chartData = {
    labels: ['Free', 'Charged'],
    datasets: [
      {
        label: 'Requests',
        data: billingData 
          ? [billingData.freeRequests, billingData.chargedRequests]
          : [1000, 0],
        backgroundColor: ['#10b981', '#3b82f6'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="flex bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white min-h-screen">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 backdrop-blur-xl p-6 flex flex-col justify-between border-r border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">MeterFlow</h1>
          </div>

          <nav className="space-y-2">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </Link>
            <Link to="/apis" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              APIs
            </Link>
            <Link to="/billing" className="flex items-center gap-3 px-4 py-3 bg-green-500/10 text-green-400 rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Billing
            </Link>
          </nav>
        </div>

        <div className="border-t border-white/5 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 text-sm mt-3 px-2 py-2 hover:bg-red-500/10 rounded-lg transition-all w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Billing & Usage</h2>
            <p className="text-slate-400 mt-1">Monitor your API usage and payments</p>
          </div>
        </div>

        {/* API Selection */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">Select API</label>
          <select
            value={selectedApi}
            onChange={(e) => setSelectedApi(e.target.value)}
            className="w-full md:w-64 px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select an API</option>
            {apis.map(api => (
              <option key={api._id} value={api._id}>{api.name}</option>
            ))}
          </select>
        </div>

        {apisLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-slate-400">
              <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          </div>
        ) : apis.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 text-center">
            <svg className="w-16 h-16 text-slate-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-400 mb-4">No APIs found. Create an API first to see billing information.</p>
            <Link to="/apis" className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create API
            </Link>
          </div>
        ) : !selectedApi ? (
          <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 text-center">
            <svg className="w-16 h-16 text-slate-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-slate-400">Select an API to view billing details.</p>
          </div>
        ) : billingLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-slate-400">
              <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading billing data...
            </div>
          </div>
        ) : (
          <>
            {/* Billing Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">Billing Period</p>
                </div>
                <p className="text-2xl font-bold text-white">{billingData?.billingPeriod}</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">Total Requests</p>
                </div>
                <p className="text-2xl font-bold text-white">{billingData?.totalRequests?.toLocaleString()}</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">Free Requests</p>
                </div>
                <p className="text-2xl font-bold text-green-400">{billingData?.freeRequests?.toLocaleString()}</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">Total Amount</p>
                </div>
                <p className="text-2xl font-bold text-white">₹{billingData?.totalAmount}</p>
              </div>
            </div>

            {/* Usage Chart */}
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Request Distribution</h3>
              <div className="h-64">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Pricing Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4">Pricing Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-xl">
                  <p className="text-sm text-slate-400 mb-1">Free Tier</p>
                  <p className="font-medium text-white">1,000 requests/month</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl">
                  <p className="text-sm text-slate-400 mb-1">Paid Tier</p>
                  <p className="font-medium text-white">₹0.50 per 100 requests</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl">
                  <p className="text-sm text-slate-400 mb-1">Charged Requests</p>
                  <p className="font-medium text-white">{billingData?.chargedRequests?.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl">
                  <p className="text-sm text-slate-400 mb-1">Status</p>
                  <p className="font-medium text-green-400 capitalize">{billingData?.status}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Billing;