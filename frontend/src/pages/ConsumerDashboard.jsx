import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apisAPI } from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

function ConsumerDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch available APIs
  const { data: apisData, isLoading } = useQuery({
    queryKey: ['availableApis'],
    queryFn: () => apisAPI.getAll().then(res => res.data),
  });

  const apis = apisData?.apis || [];

  // Mock subscription data
  const subscriptions = [
    { name: 'Weather API', status: 'active', calls: 1250, limit: 5000 },
    { name: 'Payment Gateway', status: 'active', calls: 890, limit: 2000 },
  ];

  const usageChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'API Calls',
        data: [450, 520, 480, 610, 550, 320, 280],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const totalCalls = subscriptions.reduce((acc, sub) => acc + sub.calls, 0);
  const totalLimit = subscriptions.reduce((acc, sub) => acc + sub.limit, 0);
  const usagePercent = Math.round((totalCalls / totalLimit) * 100);

  return (
    <div className="flex bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white min-h-screen">
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

          <div className="px-3 py-1.5 rounded-full text-xs font-medium mb-6 bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Consumer
          </div>

          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-green-500/10 text-green-400 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </a>
            <Link to="/marketplace" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2c2 0 6 1 6 3V5a2 2 0 10-4 0v1c0 2 4 3 4 3z" />
              </svg>
              API Marketplace
            </Link>
            <Link to="/my-subscriptions" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Subscriptions
            </Link>
            <Link to="/usage" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              My Usage
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
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="flex items-center gap-2 text-red-400 text-sm mt-3 px-2 py-2 hover:bg-red-500/10 rounded-lg transition-all w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Consumer Dashboard</h2>
            <p className="text-slate-400 mt-1">Discover and manage your API subscriptions</p>
          </div>
        </div>

        {/* Usage Overview */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl shadow-black/20 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Monthly Usage</h3>
              <p className="text-slate-400 text-sm mt-1">{totalCalls.toLocaleString()} / {totalLimit.toLocaleString()} calls</p>
            </div>
            <span className="text-2xl font-bold text-blue-400">{usagePercent}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${usagePercent}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-blue-500/30 transition-all hover:transform hover:-translate-y-1 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-slate-400 text-sm">Active Subscriptions</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {subscriptions.length}
            </h3>
          </div>

          <div className="group bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-green-500/30 transition-all hover:transform hover:-translate-y-1 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-slate-400 text-sm">Total API Calls</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {totalCalls.toLocaleString()}
            </h3>
          </div>

          <div className="group bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-purple-500/30 transition-all hover:transform hover:-translate-y-1 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-slate-400 text-sm">Available APIs</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {apis.length}
            </h3>
          </div>
        </div>

        {/* Usage Chart */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl shadow-black/20 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Usage Trend</h3>
              <p className="text-slate-400 text-sm mt-1">Your API calls over the past week</p>
            </div>
          </div>
          <div className="h-64">
            <Line data={usageChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* My Subscriptions */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl shadow-black/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">My Subscriptions</h3>
            <Link to="/my-subscriptions" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {subscriptions.map((sub, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{sub.name}</h4>
                    <p className="text-sm text-slate-400">{sub.calls} / {sub.limit} calls</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(sub.calls / sub.limit) * 100}%` }}
                    ></div>
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    {sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ConsumerDashboard;