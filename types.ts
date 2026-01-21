
export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'user' | 'host' | 'admin';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  hostName: string;
  hostAvatar: string;
  location: string;
  date: string;
  time: string;
  price: number;
  imageUrl: string;
  category: string;
  capacity: number;
  sold: number;
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  qrPayload: string;
  status: 'valid' | 'used' | 'expired';
  purchaseDate: string;
  tier: string;
}

export type ViewState = 'onboarding' | 'auth' | 'home' | 'scanner' | 'tickets' | 'dashboard' | 'eventDetail';
