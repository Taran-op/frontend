import { useState } from 'react';
import { Link } from 'react-router-dom';

const sampleAPIs = [
  { id: '1', name: 'Weather API', baseUrl: 'https://api.weather.com/v1', endpoints: ['/current', '/forecast', '/history'] },
  { id: '2', name: 'Payment Gateway', baseUrl: 'https://api.payment.com/v1', endpoints: ['/charge', '/refund', '/verify'] },
  { id: '3', name: 'Analytics Pro', baseUrl: 'https://api.analytics.com/v1', endpoints: ['/report', '/metrics', '/events'] },
];

const methodColors = {
  GET: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  POST: 'bg-green-500/20 text-green-400 border border-green-500/30',
  PUT: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border border-red-500/30',
  PATCH: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
};

function ApiPlayground() {
  const [selectedApi, setSelectedApi] = useState(sampleAPIs[0]);
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('/current');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer YOUR_API_KEY"\n}');
  const [body, setBody] = useState('{\n  "param1": "value1",\n  "param2": "value2"\n}');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('headers');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleSendRequest = async () => {
    setLoading(true);
    setResponse(null);

    // Simulate API call
    setTimeout(() => {
      setResponse({
        status: 200,
        time: Math.floor(Math.random() * 500) + 50,
        size: Math.floor(Math.random() * 5000) + 500,
        data: {
          success: true,
          message: 'Request completed successfully',
          data: {
            id: '12345',
            timestamp: new Date().toISOString(),
            result: {
              temperature: 24,
              humidity: 65,
              condition: 'Partly Cloudy'
            }
          }
        }
      });
      setLoading(false);
    }, 1000);
  };

  const generateCodeSnippet = (lang) => {
    const code = {
      curl: `curl -X ${method} ${selectedApi.baseUrl}${endpoint} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '${body}'`,
      javascript: `fetch('${selectedApi.baseUrl}${endpoint}', {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify(${body})
})
.then(res => res.json())
.then(data => console.log(data));`,
      python: `import requests

url = "${selectedApi.baseUrl}${endpoint}"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
data = ${body}

response = requests.${method.toLowerCase()}(url, headers=headers, json=data)
print(response.json())`,
    };
    return code[lang];
  };

  const [codeLang, setCodeLang] = useState('curl');

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
            <Link to="/playground" className="flex items-center gap-3 px-4 py-3 bg-green-500/10 text-green-400 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              API Playground
            </Link>
            <Link to="/my-subscriptions" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Subscriptions
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
            <h2 className="text-3xl font-bold text-white">API Testing Playground</h2>
            <p className="text-slate-400 mt-1">Test and explore APIs in real-time</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* API Selection & Method */}
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
              <div className="flex gap-3 mb-4">
                <select
                  value={selectedApi.id}
                  onChange={(e) => setSelectedApi(sampleAPIs.find(a => a.id === e.target.value))}
                  className="flex-1 px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {sampleAPIs.map(api => (
                    <option key={api.id} value={api.id}>{api.name}</option>
                  ))}
                </select>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className={`px-4 py-3 rounded-xl font-medium text-sm ${methodColors[method]}`}
                >
                  {Object.keys(methodColors).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{selectedApi.baseUrl}</span>
                  <input
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    className="w-full pl-[180px] pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  onClick={handleSendRequest}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : 'Send'}
                </button>
              </div>
            </div>

            {/* Tabs for Headers/Body/Code */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden">
              <div className="flex border-b border-white/5">
                {['headers', 'body', 'code'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-green-400 border-b-2 border-green-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {activeTab === 'headers' && (
                  <textarea
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                    className="w-full h-40 bg-slate-900/50 border border-white/10 rounded-xl text-white font-mono text-sm p-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter headers as JSON..."
                  />
                )}
                {activeTab === 'body' && (
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full h-40 bg-slate-900/50 border border-white/10 rounded-xl text-white font-mono text-sm p-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter request body as JSON..."
                  />
                )}
                {activeTab === 'code' && (
                  <div>
                    <div className="flex gap-2 mb-4">
                      {['curl', 'javascript', 'python'].map(lang => (
                        <button
                          key={lang}
                          onClick={() => setCodeLang(lang)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            codeLang === lang
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-700/50 text-slate-400 hover:text-white'
                          }`}
                        >
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </button>
                      ))}
                    </div>
                    <pre className="bg-slate-900/50 border border-white/10 rounded-xl text-green-400 font-mono text-sm p-4 overflow-x-auto">
                      {generateCodeSnippet(codeLang)}
                    </pre>
                    <button
                      onClick={() => navigator.clipboard.writeText(generateCodeSnippet(codeLang))}
                      className="mt-3 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy to clipboard
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Response */}
            {response && (
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Response</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-3 py-1 rounded-full ${response.status === 200 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      Status: {response.status}
                    </span>
                    <span className="text-slate-400">{response.time}ms</span>
                    <span className="text-slate-400">{response.size} bytes</span>
                  </div>
                </div>
                <pre className="bg-slate-900/50 border border-white/10 rounded-xl text-green-400 font-mono text-sm p-4 overflow-x-auto max-h-96">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Endpoints Sidebar */}
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">Available Endpoints</h3>
            <div className="space-y-2">
              {selectedApi.endpoints.map(ep => (
                <button
                  key={ep}
                  onClick={() => setEndpoint(ep)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    endpoint === ep
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-slate-900/50 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs text-slate-500 block mb-1">GET</span>
                  <span className="font-mono text-sm">{ep}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <h4 className="text-sm font-medium text-slate-400 mb-3">Quick Tips</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  Use valid JSON in body
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  Include API key in headers
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  Check response time
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ApiPlayground;