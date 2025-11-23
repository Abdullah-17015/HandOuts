
import { ItemRequest, Category, UrgencyLevel } from './types';

export const INITIAL_ITEMS: ItemRequest[] = [
  {
    id: '1',
    title: 'Infant Formula (Enfamil)',
    description: 'We ran out of formula this week and payday isnt until Friday. Need 1 can.',
    category: Category.BABY,
    urgency: UrgencyLevel.HIGH,
    location: 'Downtown',
    createdAt: new Date().toISOString(),
    distanceKm: 1.2,
    type: 'NEED'
  },
  {
    id: '2',
    title: 'Winter Coat (Size M)',
    description: 'Offering a gently used North Face jacket. Very warm.',
    category: Category.CLOTHES_ADULT,
    urgency: UrgencyLevel.LOW,
    location: 'West End',
    createdAt: new Date().toISOString(),
    distanceKm: 3.5,
    type: 'OFFER'
  },
  {
    id: '3',
    title: 'Canned Vegetables Box',
    description: 'Need food for family of 4. Beans, corn, peas preferred.',
    category: Category.FOOD,
    urgency: UrgencyLevel.MEDIUM,
    location: 'North York',
    createdAt: new Date().toISOString(),
    distanceKm: 5.1,
    type: 'NEED'
  },
  {
    id: '4',
    title: 'Hygiene Kit (Women)',
    description: 'Unused soaps, shampoos, and sanitary products available.',
    category: Category.HYGIENE,
    urgency: UrgencyLevel.LOW,
    location: 'Downtown',
    createdAt: new Date().toISOString(),
    distanceKm: 0.8,
    type: 'OFFER'
  },
  {
    id: '5',
    title: 'Insulin Cooling Case',
    description: 'Urgent need for a travel case for insulin pens.',
    category: Category.MEDICAL,
    urgency: UrgencyLevel.CRITICAL,
    location: 'Scarborough',
    createdAt: new Date().toISOString(),
    distanceKm: 12.0,
    type: 'NEED'
  }
];
