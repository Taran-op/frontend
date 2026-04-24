export default function StatCard({ label, value, sub, color }) {
  return (
    <div className={`rounded-lg p-6 shadow bg-[#232834] flex flex-col gap-2 border-l-4 ${color || 'border-blue-500'}`}>
      <div className="text-xs uppercase text-gray-400 font-semibold">{label}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-green-400">{sub}</div>}
    </div>
  );
}
