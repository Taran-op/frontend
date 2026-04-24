import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip);

function Usage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [animatedStats, setAnimatedStats] = useState({ calls: 0, limit: 0, percent: 0 });

  // Animated counter effect
  useEffect(() => {
    const targetCalls = 2140;
    const targetLimit = 5000;
    const duration = 1500;
    const steps = 60;
    const increment = targetCalls / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCalls) {
        setAnimatedStats({ calls: targetCalls, limit: targetLimit, percent: Math.round((targetCalls / targetLimit) * 100) });
        clearInterval(timer);
      } else {
        setAnimatedStats({ 
          calls: Math.floor(current), 
          limit: targetLimit, 
          percent: Math.floor((current / targetLimit) * 100) 
        });
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const dailyUsage = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'API Calls',
        data: [320, 450, 380, 520, 490, 280, 200],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const endpointUsage = {
    labels: ['/weather/current', '/payment/charge', '/analytics/report', '/geo/location', '/email/send'],
    datasets: [
      {
        label: 'Calls',
        data: [850, 620, 450, 320, 200],
        backgroundColor: ['#22c55e', '#3b82f6', '#eab308', '#8b5cf6', '#ef4444'],
        borderRadius: 8,
      },
    ],
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="flex bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <aside className="w-64 bg-slate-900/50 backdrop-blur-xl p-6 flex flex-col justify-between border-r border-white/5 relative z-10">
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
            <Link to="/" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </Link>
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
            <Link to="/usage" className="flex items-center gap-3 px-4 py-3 bg-green-500/10 text-green-400 rounded-xl">
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
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 text-sm mt-3 px-2 py-2 hover:bg-red-500/10 rounded-lg transition-all w-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">My Usage</h2>
            <p className="text-slate-400 mt-1">Track your API consumption and limits</p>
          </div>
        </div>

        {/* Usage Overview Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Monthly API Calls</h3>
              <p className="text-slate-400 text-sm mt-1">Billing period: April 1 - April 30</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-white">{animatedStats.calls.toLocaleString()}</p>
              <p className="text-slate-400">of {animatedStats.limit.toLocaleString()} calls</p>
            </div>
          </div>
          
          <div className="w-full bg-slate-700 rounded-full h-4 mb-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                animatedStats.percent > 80 ? 'bg-gradient-to-r from-yellow-500 to-red-500' :
                animatedStats.percent > 60 ? 'bg-gradient-to-r from-green-500 to-yellow-500' :
                'bg-gradient-to-r from-green-500 to-green-400'
              }`}
              style={{ width: `${animatedStats.percent}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-400">{animatedStats.percent}% used</span>
            <span className="text-slate-400">{(animatedStats.limit - animatedStats.calls).toLocaleString()} calls remaining</span>
          </div>

          {animatedStats.percent > 80 && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-yellow-400">You're approaching your limit. Consider upgrading your plan.</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-slate-400 text-sm">Success Rate</span>
            </div>
            <p className="text-2xl font-bold text-white">98.5%</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-slate-400 text-sm">Avg Response</span>
            </div>
            <p className="text-2xl font-bold text-white">45ms</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-slate-400 text-sm">Peak Time</span>
            </div>
            <p className="text-2xl font-bold text-white">2:00 PM</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <span className="text-slate-400 text-sm">Uptime</span>
            </div>
            <p className="text-2xl font-bold text-white">99.9%</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">Daily Usage</h3>
            <div className="h-64">
              <Line data={dailyUsage} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">Usage by Endpoint</h3>
            <div className="h-64">
              <Bar data={endpointUsage} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Usage;