import { Link } from 'react-router-dom';
import { Trend } from '@/types/dashboard';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  to: string;
  trend?: Trend;
}

const trendColors = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-500'
};

export function StatCard({ title, value, icon, to, trend = 'neutral' }: StatCardProps) {
  return (
    <Link to={to} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {trend !== 'neutral' && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${trendColors[trend]}`}>
                    {trend === 'up' ? '↑' : '↓'} 12%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </Link>
  );
}
