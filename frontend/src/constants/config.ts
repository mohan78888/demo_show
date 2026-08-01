export const CONTACT_INFO = {
  HOTLINE_NUMBER: '1888 791 8007',
  HOTLINE_TEL: 'tel:18887918007',
  HOTLINE_DISPLAY: '1888 791 8007',
  SUPPORT_EMAIL: 'info@TourHelpDesk.com',
  AVAILABILITY: '24/7 Booking Desk',
} as const;

export const SITE_CONFIG = {
  NAME: 'Tour Help Desk',
  TAGLINE: 'Cheap Flights & Travel Packages',
  DESCRIPTION: 'Find cheap unpublished offline flights and premium hotels. Call our booking desk for exclusive offline discounts.',
} as const;

export interface NavItem {
  label: string;
  href: string;
  viewKey: string;
  iconName?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Flights', href: '/', viewKey: 'home' },
  { label: 'Hotels', href: '/hotels', viewKey: 'hotels' },
  { label: 'Offers', href: '/offers', viewKey: 'offers' },
  { label: 'Buses', href: '/bus', viewKey: 'bus' },
  { label: 'Car Rental', href: '/car-rental', viewKey: 'car-rental' },
  { label: 'Cheap Flights', href: '/cheap-flights', viewKey: 'cheap-flights' },
  { label: 'Special Offer', href: '/special-offer', viewKey: 'special-offer' },
  { label: 'Customer Support', href: '/customer-service', viewKey: 'customer-service' },
  { label: 'About Us', href: '/about', viewKey: 'about' },
];
