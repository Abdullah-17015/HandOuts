
export enum UrgencyLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
  EMERGENCY = 5
}

export enum Category {
  FOOD = 'Food',
  CLOTHES_ADULT = 'Clothes (Adult)',
  CLOTHES_KIDS = 'Clothes (Kids)',
  BABY = 'Baby Supplies',
  HYGIENE = 'Hygiene',
  MEDICAL = 'Medical/First Aid',
  HOUSEHOLD = 'Household',
  BEDDING = 'Bedding',
  SCHOOL = 'School Supplies',
  PETS = 'Pet Food',
  TECH = 'Electronics',
  FURNITURE = 'Furniture',
  TOYS = 'Toys/Books',
  OTHER = 'Other'
}

export interface ItemRequest {
  id: string;
  title: string;
  description: string;
  category: Category;
  urgency: UrgencyLevel;
  location: string;
  createdAt: string; // ISO date
  distanceKm: number; // Mocked distance
  type: 'NEED' | 'OFFER';
}

export interface Stats {
  activeNeeds: number;
  totalOffers: number;
  matchesMade: number;
}

export type UserRole = 'GIVER' | 'NEEDER' | null;

export interface Badge {
  id: string;
  name: string;
  icon: any; // Changed from string to any to support Lucide components
  unlocked: boolean;
  description: string;
}

export interface UserStats {
  needsSubmitted: number;
  offersCreated: number;
  matchesMade: number;
  impactScore: number; // 0-100
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  badges: Badge[];
}

export interface ActivityLog {
  id: string;
  action: 'CREATED_NEED' | 'CREATED_OFFER' | 'MATCHED';
  title: string;
  date: string;
}

export interface User {
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  householdSize?: number;
  helpFrequency?: string;
  preferences?: string[];
  joinedAt?: string;
  stats?: UserStats;
  history?: ActivityLog[];
}

export type ViewState = 'HERO' | 'LOGIN' | 'SIGNUP' | 'ONBOARDING' | 'MARKETPLACE' | 'INTAKE' | 'DASHBOARD' | 'PROFILE' | 'INFO';
