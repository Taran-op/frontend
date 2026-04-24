import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apisAPI, usageAPI } from '../services/api';

function APIDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyForm, setKeyForm] = useState({ name: '', rateLimit: 1000 });

  const { data, isLoading } = useQuery({
    queryKey: ['api', id],
    queryFn: () => apisAPI.getOne(id).then(res => res.data),
  });

  const { data: logsData } = useQuery({
    queryKey: ['logs', id],
    queryFn: () => usageAPI.getLogs(id, { limit: 10 }).then(res => res.data),
  });

  const createKeyMutation = useMutation({
    mutationFn: (data) => apisAPI.createKey(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['api', id]);
      setShowKeyModal(false);
      setKeyForm({ name: '', rateLimit: 1000 });
    },
  });

  const revokeKeyMutation = useMutation({
    mutationFn: (keyId) => apisAPI.revokeKey(id, keyId),
    onSuccess: () => queryClient.invalidateQueries(['api', id]),
  });

  const rotateKeyMutation = useMutation({
    mutationFn: (keyId) => apisAPI.rotateKey(id, keyId),
    onSuccess: () => queryClient.invalidateQueries(['api', id]),
  });

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const api = data?.api;

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary">MeterFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex gap-4 mb-8">
          <Link to="/" className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100">
            Dashboard
          </Link>
          <Link to="/apis" className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100">
            APIs
          </Link>
          <Link to="/billing" className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100">
            Billing
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* API Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{api?.name}</h2>
                  <p className="text-gray-500 mt-1">{api?.description}</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded ${api?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {api?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="mb-4">
                <label className="text-sm text-gray-500">Base URL</label>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">{api?.baseUrl}</p>
              </div>
            </div>

            {/* Recent Logs */}
            <div className="bg-white rounded-lg shadow p-6 mt-4">
              <h3 className="text-lg font-semibold mb-4">Recent Requests</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Endpoint</th>
                      <th className="text-left py-2">Method</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logsData?.logs?.map(log => (
                      <tr key={log._id} className="border-b">
                        <td className="py-2 font-mono text-xs">{log.endpoint}</td>
                        <td className="py-2">{log.method}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-xs ${log.statusCode < 400 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {log.statusCode}
                          </span>
                        </td>
                        <td className="py-2">{log.responseTime}ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">API Keys</h3>
              <button
                onClick={() => setShowKeyModal(true)}
                className="text-sm text-primary hover:underline"
              >
                + Add Key
              </button>
            </div>
            <div className="space-y-3">
              {api?.apiKeys?.map(key => (
                <div key={key._id} className="border rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">{key.name}</span>
                    <span className={`px-2 py-1 text-xs rounded ${key.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {key.status}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-gray-500 bg-gray-100 p-2 rounded mb-2 break-all">
                    {key.key}
                  </p>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>Rate: {key.rateLimit}/hr</span>
                    {key.lastUsed && <span>Last: {new Date(key.lastUsed).toLocaleDateString()}</span>}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => rotateKeyMutation.mutate(key._id)}
                      className="text-xs text-primary hover:underline"
                    >
                      Rotate
                    </button>
                    {key.status === 'active' && (
                      <button
                        onClick={() => revokeKeyMutation.mutate(key._id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Create API Key</h3>
            <form onSubmit={(e) => { e.preventDefault(); createKeyMutation.mutate(keyForm); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={keyForm.name}
                  onChange={(e) => setKeyForm({ ...keyForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="My API Key"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit (per hour)</label>
                <input
                  type="number"
                  value={keyForm.rateLimit}
                  onChange={(e) => setKeyForm({ ...keyForm, rateLimit: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createKeyMutation.isPending}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
                >
                  {createKeyMutation.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default APIDetails;