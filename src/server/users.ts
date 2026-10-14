import { UserProfile } from '../types/alphagen';

export interface UserEntity extends UserProfile {
  passwordHash: string; // bcrypt hash of password
}

// Pre-hashed passwords for 'alphagen2024' (bcrypt 10 rounds)
export const DEFAULT_PASSWORD_PLAIN = 'alphagen2024';
export const DEFAULT_PASSWORD_HASH = '$2b$10$uZB3gYVysgP0Sp5NjbmQqublihlCTQLhG6Kb6D59lYO.4PZ8V4OzG';

export const SEEDED_USERS: UserEntity[] = [
  {
    id: 'user-pm-101',
    name: 'Elena Rostova',
    email: 'pm@alphagen.internal',
    role: 'PORTFOLIO_MANAGER',
    title: 'Senior Portfolio Manager (Alpha Mandates)',
    department: 'Quantitative Equity Strategies',
    passwordHash: DEFAULT_PASSWORD_HASH
  },
  {
    id: 'user-risk-202',
    name: 'Marcus Vance',
    email: 'risk@alphagen.internal',
    role: 'RISK_ANALYST',
    title: 'Head of Market Risk & Stress Testing',
    department: 'Institutional Risk Oversight',
    passwordHash: DEFAULT_PASSWORD_HASH
  },
  {
    id: 'user-quant-303',
    name: 'Dr. Liam Thorne',
    email: 'quant@alphagen.internal',
    role: 'QUANT_RESEARCHER',
    title: 'Principal Quantitative Researcher',
    department: 'Multi-Asset Model Development',
    passwordHash: DEFAULT_PASSWORD_HASH
  }
];
