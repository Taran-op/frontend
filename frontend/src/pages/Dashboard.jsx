import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apisAPI, usageAPI } from '../services/api';
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

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [selectedApi, setSelectedApi] = useState(null);

  const { data: apisData } = useQuery({
    queryKey: ['apis'],
    queryFn: () => apisAPI.getAll().then(res => res.data),
  });

  const apis = apisData?.apis || [];

  useEffect(() => {
    if (apis.length > 0 && !selectedApi) {
      setSelectedApi(apis[0]);
    }
  }, [apis, selectedApi]);

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['stats', selectedApi?._id],
    queryFn: () =>
      selectedApi
        ? usageAPI.getStats(selectedApi._id).then(res => res.data)
        : null,
    enabled: !!selectedApi,
  });

  const chartData = {
    labels: statsData?.hourlyStats?.map(s => s._id) || [],
    datasets: [
      {
        data: statsData?.hourlyStats?.map(s => s.count) || [],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
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
            <Link className="flex items-center gap-3 px-4 py-3 bg-green-500/10 text-green-400 rounded-xl transition-all">
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
            <Link to="/billing" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all">
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

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Dashboard</h2>
            <p className="text-slate-400 mt-1">Monitor your API usage and performance</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-green-400 text-sm font-medium">Gateway Live</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <div className="group bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-green-500/30 transition-all hover:transform hover:-translate-y-1 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-slate-400 text-sm">Total Requests</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {statsData?.stats?.totalRequests?.toLocaleString() || 0}
            </h3>
          </div>

          <div className="group bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-blue-500/30 transition-all hover:transform hover:-translate-y-1 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-slate-400 text-sm">Active APIs</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {apis.length}
            </h3>
          </div>

          <div className="group bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-yellow-500/30 transition-all hover:transform hover:-translate-y-1 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-slate-400 text-sm">Success Rate</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {statsData?.stats?.totalRequests
                ? Math.round(
                    (statsData.stats.successCount /
                      statsData.stats.totalRequests) *
                      100
                  )
                : 0}%
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
            <p className="text-slate-400 text-sm">Avg Response</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {Math.round(statsData?.stats?.avgResponseTime || 0)}ms
            </h3>
          </div>

        </div>

        {/* Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Requests / Hour</h3>
              <p className="text-slate-400 text-sm mt-1">API call volume over time</p>
            </div>

            <select
              value={selectedApi?._id || ''}
              onChange={(e) =>
                setSelectedApi(apis.find(a => a._id === e.target.value))
              }
              className="bg-slate-900/50 border border-white/10 px-4 py-2 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {apis.map(api => (
                <option key={api._id} value={api._id}>
                  {api.name}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-3 text-slate-400">
                <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading chart data...
              </div>
            </div>
          ) : (
            <div className="h-64">
              <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

          <Link to="/apis" className="group bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all hover:transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-all">
                <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">Manage APIs</h3>
                <p className="text-slate-400 text-sm mt-1">Create and manage your API endpoints</p>
              </div>
            </div>
          </Link>

          <Link to="/billing" className="group bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all hover:transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">Billing</h3>
                <p className="text-slate-400 text-sm mt-1">Check usage and manage payments</p>
              </div>
            </div>
          </Link>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;
