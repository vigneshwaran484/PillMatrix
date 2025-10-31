import { Link } from 'react-router-dom';
import { type StatCardProps, type Trend } from '@/types/dashboard';

const trendColors: Record<Trend, string> = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-600'
};

export function StatCard({ title, value, icon, to = '#', trend = 'neutral', change }: StatCardProps) {
  const content = (
    <div className="p-5">
      <div className="flex items-center">
        {icon && (
          <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
            {icon}
          </div>
        )}
        <div className={`${icon ? 'ml-5' : ''} w-0 flex-1`}>
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {trend !== 'neutral' && change && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${trendColors[trend]}`}>
                  {trend === 'up' ? '↑' : '↓'} {change}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );

  return to ? (
    <Link to={to} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      {content}
    </Link>
  ) : (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      {content}
    </div>
  );
}
