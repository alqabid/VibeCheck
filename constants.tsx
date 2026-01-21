
import { Event, User } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Vibe',
  avatar: 'https://picsum.photos/seed/user/200/200',
  role: 'host'
};

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Neon Nights Underground',
    description: 'The premier underground techno experience in the heart of downtown. Visuals by VJ Volt.',
    hostName: 'Pulse Events',
    hostAvatar: 'https://picsum.photos/seed/host1/100/100',
    location: 'Sector 7, Warehouse District',
    date: '2024-08-15',
    time: '22:00',
    price: 45,
    imageUrl: 'https://picsum.photos/seed/event1/800/1200',
    category: 'Music',
    capacity: 500,
    sold: 342
  },
  {
    id: 'e2',
    title: 'Rooftop Summer Bash',
    description: 'Chill vibes, golden hour views, and the city\'s best DJs. Open bar for the first hour.',
    hostName: 'Skyline Collective',
    hostAvatar: 'https://picsum.photos/seed/host2/100/100',
    location: 'The Heights Rooftop Lounge',
    date: '2024-08-20',
    time: '18:00',
    price: 30,
    imageUrl: 'https://picsum.photos/seed/event2/800/1200',
    category: 'Party',
    capacity: 200,
    sold: 188
  },
  {
    id: 'e3',
    title: 'Art & AI: Future Canvas',
    description: 'Explore the intersection of human creativity and machine intelligence. Live gallery.',
    hostName: 'Digital Arts Lab',
    hostAvatar: 'https://picsum.photos/seed/host3/100/100',
    location: 'Modern Art Museum',
    date: '2024-09-02',
    time: '14:00',
    price: 20,
    imageUrl: 'https://picsum.photos/seed/event3/800/1200',
    category: 'Workshop',
    capacity: 100,
    sold: 45
  }
];

export const APP_COLOR = {
  primary: '#00F0FF', // Neon Sky Blue
  background: '#000000',
  accent: '#00FF00', // Neon Green
  gray: '#1A1A1A',
};

export const COUNTRIES = [
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Nigeria', code: '+234', flag: '🇳🇬' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'France', code: '+33', flag: '🇫🇷' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦' },
  { name: 'Brazil', code: '+55', flag: '🇧🇷' },
  { name: 'Japan', code: '+81', flag: '🇯🇵' },
  { name: 'Mexico', code: '+52', flag: '🇲🇽' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
  { name: 'Ghana', code: '+233', flag: '🇬🇭' },
  { name: 'Kenya', code: '+254', flag: '🇰🇪' },
  { name: 'Spain', code: '+34', flag: '🇪🇸' },
  { name: 'Italy', code: '+39', flag: '🇮🇹' },
];
