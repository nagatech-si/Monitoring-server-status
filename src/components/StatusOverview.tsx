import { Server, Activity, AlertCircle, Wrench } from 'lucide-react';

interface StatusOverviewProps {
  totalServers: number;
  operationalServers: number;
  performaissueServers: number;
  downServers: number;
  maintenanceServers: number;
}

export default function StatusOverview({
  totalServers,
  operationalServers,
  performaissueServers,
  downServers,
  maintenanceServers,
}: StatusOverviewProps) {
  const stats = [
    {
      label: 'Total Servers',
      value: totalServers,
      icon: Server,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Operational',
      value: operationalServers,
      icon: Activity,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Performa Issue',
  value: performaissueServers,
      icon: AlertCircle,
      color: 'bg-yellow-100 text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Down',
      value: downServers,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Maintenance',
      value: maintenanceServers,
      icon: Wrench,
      color: 'bg-gray-100 text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 ${stat.color} rounded-lg`}>
                <Icon size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
