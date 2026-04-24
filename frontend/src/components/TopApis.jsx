import Badge from './Badge';

const statusColors = {
  active: 'bg-blue-700',
  'near limit': 'bg-yellow-600',
  err: 'bg-red-700',
};

export default function TopApis({ apis }) {
  return (
    <div className="bg-[#232834] rounded-lg p-6 shadow mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">top apis by usage</h3>
        <button className="bg-[#181c23] text-gray-300 px-3 py-1 rounded text-xs border border-gray-700 hover:bg-[#232834]">Schema design →</button>
      </div>
      <div className="space-y-3">
        {apis.map(api => (
          <div key={api.name} className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${api.dotColor}`}></span>
            <span className="flex-1 text-white text-sm">{api.name}</span>
            <span className="font-mono text-xs bg-[#181c23] px-2 py-1 rounded text-gray-400">{api.key}</span>
            <div className="flex-1 h-2 bg-gray-700 rounded mx-2">
              <div className={`h-2 rounded ${api.barColor}`} style={{ width: api.usage + '%' }}></div>
            </div>
            <span className="text-white text-xs w-12 text-right">{api.usageCount}</span>
            <Badge color={statusColors[api.status] || 'bg-blue-700'}>{api.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
