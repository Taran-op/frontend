export default function Badge({ children, color = 'bg-green-700' }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${color}`}>{children}</span>
  );
}
