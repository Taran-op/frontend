import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apisAPI } from '../services/api';
import { useToast } from '../components/Toast';

function ApiDocs() {
  const { id } = useParams();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [docContent, setDocContent] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['api', id],
    queryFn: () => apisAPI.getOne(id).then(res => res.data),
  });

  const updateDocMutation = useMutation({
    mutationFn: (documentation) => apisAPI.update(id, { documentation }),
    onSuccess: () => {
      addToast('Documentation saved successfully', 'success');
      queryClient.invalidateQueries(['api', id]);
      setIsEditing(false);
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Failed to save documentation', 'error');
    },
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const api = data?.api;
  const isOwner = api?.userId === user.id;

  // Sample documentation structure
  const defaultDocs = `# API Documentation

## Overview
${api?.description || 'API description goes here'}

## Authentication
All API requests require an API key in the header:
\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Endpoints

### Get Data
\`\`\`
GET /api/v1/data
\`\`\`

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| limit | number | Number of results (default: 10) |
| offset | number | Pagination offset |

**Response:**
\`\`\`json
{
  "success": true,
  "data": [...]
}
\`\`\`

### Create Record
\`\`\`
POST /api/v1/data
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "example",
  "value": 100
}
\`\`\`

## Rate Limits
- Free tier: 100 requests/hour
- Pro tier: 1000 requests/hour

## Error Codes
| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 429 | Rate Limit Exceeded |
| 500 | Server Error |
`;

  const handleSave = () => {
    updateDocMutation.mutate(docContent || defaultDocs);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 backdrop-blur-xl p-6 flex flex-col justify-between border-r border-white/5">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Link to={`/apis/${id}`} className="flex items-center gap-2 text-green-400 hover:text-green-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          </div>
          <h2 className="text-xl font-bold text-white">{api?.name}</h2>
          <p className="text-slate-400 text-sm mt-1">API Documentation</p>
        </div>
        <div className="border-t border-white/5 pt-4">
          <Link to={`/playground?api=${id}`} className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Try in Playground
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Documentation</h2>
            <p className="text-slate-400 mt-1">API reference and usage guide</p>
          </div>
          {isOwner && (
            <button
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setDocContent(api?.documentation || defaultDocs);
                  setIsEditing(true);
                }
              }}
              className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </>
              )}
            </button>
          )}
        </div>

        {/* Documentation Content */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl shadow-black/20 p-8">
          {isEditing ? (
            <textarea
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              className="w-full h-[600px] bg-slate-900/50 border border-white/10 rounded-xl text-white p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Write your API documentation in Markdown..."
            />
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap font-mono text-sm text-slate-300">
                {api?.documentation || defaultDocs}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ApiDocs;