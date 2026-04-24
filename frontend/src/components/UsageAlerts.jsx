import { useState, useEffect } from 'react';
import { useToast } from '../components/Toast';

function UsageAlerts({ subscriptions = [] }) {
  const { addToast } = useToast();
  const [alerted, setAlerted] = useState(new Set());

  useEffect(() => {
    subscriptions.forEach((sub) => {
      const percent = (sub.calls / sub.limit) * 100;
      const alertKey = `${sub.id}-${Math.floor(percent / 10) * 10}`;

      // Alert at 80%, 90%, 100%
      if (percent >= 80 && percent < 90 && !alerted.has(`${sub.id}-80`)) {
        addToast(`⚠️ ${sub.name}: You've used 80% of your API limit!`, 'warning');
        setAlerted((prev) => new Set([...prev, `${sub.id}-80`]));
      } else if (percent >= 90 && percent < 100 && !alerted.has(`${sub.id}-90`)) {
        addToast(`🚨 ${sub.name}: You've used 90% of your API limit!`, 'error');
        setAlerted((prev) => new Set([...prev, `${sub.id}-90`]));
      } else if (percent >= 100 && !alerted.has(`${sub.id}-100`)) {
        addToast(`❌ ${sub.name}: You've reached your API limit!`, 'error');
        setAlerted((prev) => new Set([...prev, `${sub.id}-100`]));
      }
    });
  }, [subscriptions, addToast, alerted]);

  return null;
}

// Progress bar component with alerts
export function UsageProgressBar({ calls, limit, name, showAlert = true }) {
  const percent = limit > 0 ? Math.round((calls / limit) * 100) : 0;
  const { addToast } = useToast();
  const [notified, setNotified] = useState({});

  useEffect(() => {
    if (!showAlert) return;
    
    if (percent >= 80 && !notified['80']) {
      addToast(`⚠️ ${name}: ${percent}% used`, 'warning');
      setNotified(prev => ({ ...prev, '80': true }));
    }
    if (percent >= 90 && !notified['90']) {
      addToast(`🚨 ${name}: ${percent}% used - Approaching limit!`, 'error');
      setNotified(prev => ({ ...prev, '90': true }));
    }
    if (percent >= 100 && !notified['100']) {
      addToast(`❌ ${name}: Limit reached!`, 'error');
      setNotified(prev => ({ ...prev, '100': true }));
    }
  }, [percent, name, addToast, showAlert, notified]);

  const getColor = () => {
    if (percent >= 100) return 'bg-red-500';
    if (percent >= 90) return 'bg-yellow-500';
    if (percent >= 80) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusColor = () => {
    if (percent >= 100) return 'text-red-400';
    if (percent >= 90) return 'text-yellow-400';
    if (percent >= 80) return 'text-orange-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-400">{name}</span>
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {calls.toLocaleString()} / {limit.toLocaleString()} ({percent}%)
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default UsageAlerts;