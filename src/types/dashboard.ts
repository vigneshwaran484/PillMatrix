import { ReactNode } from 'react';

export type Trend = 'up' | 'down' | 'neutral';
export type UserRole = 'patient' | 'doctor' | 'pharmacist' | 'lab';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  to: string;
  trend?: Trend;
}

export interface NavItem {
  name: string;
  path: string;
  icon?: ReactNode;
}
