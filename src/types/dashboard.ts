import type { ReactNode } from 'react';

export type Trend = 'up' | 'down' | 'neutral';

export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: Trend;
  icon?: ReactNode;
  to?: string;
  change?: string | number;
}

export interface NavItem {
  name: string;
  path: string;
  icon?: ReactNode;
}

export interface DashboardItem {
  name: string;
  frequency?: string;
  nextDue?: string;
  daysLeft?: string;
  lastVisit?: string;
  status?: string;
  uploadedAt?: string;
}

export interface DashboardSection {
  title: string;
  items: DashboardItem[];
}

export interface UserDashboard {
  title: string;
  icon: ReactNode;
  sections: DashboardSection[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
