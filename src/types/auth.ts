export type UserRole = 'patient' | 'doctor' | 'pharmacist' | 'lab';

export interface User {
  uid: string;
  email: string | null;
  name: string | null;
  role: UserRole;
}
