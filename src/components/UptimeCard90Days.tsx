import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

type StatusType = 'operational' | 'performaissue' | 'maintanance' | 'down';

interface UptimeData {
  date: string; // YYYY-MM-DD
  status: StatusType;
  responseTime: number;
}

const STATUS_COLOR: Record<StatusType, string> = {
  operational: '#22c55e',    // green
  performaissue: '#fde047',  // yellow
  maintanance: '#3b82f6',    // blue
  down: '#ef4444',           // red
};

const STATUS_LABEL: Record<StatusType, string> = {
  operational: 'Operational',
  performaissue: 'Performa Issue',
  maintanance: 'Maintenance',
  down: 'Down',
};

const UptimeCard90Days: React.FC = () => {
  const [data, setData] = useState<UptimeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUptime = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/server-status');
        const json = await res.json();
        setData(json.slice(-90)); // Ambil 90 hari terakhir
      } catch (err) {
        setData([]);
      }
      setLoading(false);
    };
    fetchUptime();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow border p-6 w-full">
      <h2 className="text-lg font-bold mb-4">Server Uptime 90 Hari</h2>
      {loading ? (
        <div className="text-gray-400 text-center py-8">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                // Tampilkan hanya setiap 15 hari agar tidak terlalu padat
                const idx = data.findIndex(d => d.date === date);
                return idx % 15 === 0 ? date.slice(5) : '';
              }}
              axisLine={false}
              tickLine={false}
              fontSize={10}
              height={20}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: '#222', color: '#fff', borderRadius: 8, fontSize: 13 }}
              formatter={(_, __, props) => {
                const { payload } = props as any;
                if (!payload || !payload[0]) return null;
                const { date, status, responseTime } = payload[0].payload;
                return [
                  `Status: ${STATUS_LABEL[status as StatusType]}`,
                  `Tanggal: ${date}`,
                  `Response: ${responseTime} ms`
                ];
              }}
              labelFormatter={() => ''}
            />
            <Bar
              dataKey="status"
              minPointSize={2}
              radius={[4, 4, 4, 4]}
              fill="#22c55e"
              isAnimationActive={false}
              shape={(props: any) => {
                const { x, y, width, height, payload } = props;
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={3}
                    fill={STATUS_COLOR[payload.status as StatusType] || '#d1d5db'}
                  />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
      <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
        <span>90 Days Ago</span>
        <span>Today</span>
      </div>
    </div>
  );
};

export default UptimeCard90Days;
