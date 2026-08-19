export interface FlightOffer {
  id: string;
  category: 'International' | 'Domestic' | 'Business' | 'Student';
  badgeLabel: string;
  code: string;
  title: string;
  validity: string;
  bgClass: string;
}

export const FLIGHT_OFFERS: FlightOffer[] = [
  {
    id: "f1",
    category: "International",
    badgeLabel: "International Flight",
    code: "FLYHIGH",
    title: "Save up to $250 on transatlantic flights",
    validity: "Valid till 31 Aug",
    bgClass: "bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#C7D2FE]",
  },
  {
    id: "f2",
    category: "Business",
    badgeLabel: "Business Class",
    code: "BIZLUX",
    title: "Flat $500 Off on Business Class seats",
    validity: "Valid till 15 Aug",
    bgClass: "bg-gradient-to-br from-[#FEF08A] via-[#FACC15] to-[#EAB308]",
  },
  {
    id: "f3",
    category: "Domestic",
    badgeLabel: "Domestic Flight",
    code: "FLYUS50",
    title: "Save $50 on US domestic round trips",
    validity: "Valid till 31 Jul",
    bgClass: "bg-gradient-to-br from-[#DCFCE7] via-[#BBF7D0] to-[#FEF08A]",
  },
  {
    id: "f4",
    category: "Student",
    badgeLabel: "Student Special",
    code: "STUDENTX",
    title: "Extra 15% Off + 1 Free Extra Baggage",
    validity: "Valid till 30 Sep",
    bgClass: "bg-gradient-to-br from-[#FEE2E2] via-[#FCE7F3] to-[#FFEDD5]",
  },
  {
    id: "f5",
    category: "International",
    badgeLabel: "Europe Special",
    code: "EUROFLY",
    title: "Up to $300 Instant Discount to Europe",
    validity: "Valid till 31 Aug",
    bgClass: "bg-gradient-to-br from-[#E0F2FE] via-[#C7D2FE] to-[#DDD6FE]",
  }
];

export interface DestinationDeal {
  id: string;
  name: string;
  dates: string;
  price: string;
  img: string;
}

export const TOP_DESTINATIONS: DestinationDeal[] = [
  {
    id: '1',
    name: 'New York',
    dates: '25AUG26-18SEP26',
    price: '$474',
    img: '/Images/Flight/London Retun Fare.webp',
  },
  {
    id: '2',
    name: 'Las Vegas',
    dates: '25FEB27-04MAR27',
    price: '$577',
    img: '/Images/Flight/Dubai Retun Fare.webp',
  },
  {
    id: '3',
    name: 'Washington',
    dates: '05SEP26-17OCT26',
    price: '$469',
    img: '/Images/Flight/Capetown Retun Fare.webp',
  },
  {
    id: '4',
    name: 'Bangkok',
    dates: '04SEP26-30SEP26',
    price: '$557',
    img: '/Images/Flight/Singapore Retun Fare.webp',
  },
  {
    id: '5',
    name: 'Miami',
    dates: '24JAN27-01FEB27',
    price: '$508',
    img: '/Images/Flight/Cancun Retun Fare.webp',
  },
  {
    id: '6',
    name: 'Toronto',
    dates: '16SEP26-30SEP26',
    price: '$463',
    img: '/Images/Flight/Sydney Retun Fare.webp',
  },
  {
    id: '7',
    name: 'Mumbai',
    dates: '19DEC26-15JAN27',
    price: '$405',
    img: '/Images/Flight/Tokyo Retun Fare.webp',
  },
  {
    id: '8',
    name: 'Amritsar',
    dates: '06SEP26-20SEP26',
    price: '$565',
    img: '/Images/Flight/Beijing Retun Fare.webp',
  },
  {
    id: '9',
    name: 'Goa',
    dates: '04AUG26-31AUG26',
    price: '$368',
    img: '/Images/Flight/paris return fare.webp',
  },
];

export interface CheapFlightFaq {
  q: string;
  a: string;
}

export const CHEAP_FLIGHT_FAQS: CheapFlightFaq[] = [
  {
    q: "How can I book the cheapest flights on Tour Help Desk Inc?",
    a: "You can compare real-time airline fares directly on our search engine or call our 24/7 reservation hotline at 1888 791 8007 to unlock exclusive offline phone deals that are significantly cheaper than standard online rates."
  },
  {
    q: "What are unpublished airline phone deals?",
    a: "Unpublished deals are special discounted flight rates negotiated directly between Tour Help Desk Inc (tourhelpdeskinc) and top global airlines. Because of airline policy, these secret fares cannot be shown publicly online and are only available over the phone."
  },
  {
    q: "Can I cancel or modify my flight ticket?",
    a: "Yes, modifications and cancellations depend on the specific airline fare rules. Our dedicated team is available 24/7 to help you make changes or process eligible refunds quickly without long waiting times."
  },
  {
    q: "Are there any hidden fees during booking?",
    a: "No, never. We believe in 100% transparent pricing. The price you see or are quoted includes all mandatory government taxes and fees."
  },
  {
    q: "How far in advance should I book to get the lowest price?",
    a: "For international travel, booking 2 to 4 weeks in advance generally offers the lowest rates. You can also call us for last-minute emergency bookings and off-peak travel discounts."
  }
];

export const WHY_CHOOSE_US_ITEMS = [
  {
    title: "Competitive Airfares",
    desc: "Access great flight deals from leading airlines and trusted travel partners."
  },
  {
    title: "Worldwide Destinations",
    desc: "Explore thousands of domestic and international routes from one convenient platform."
  },
  {
    title: "Simple & Secure Booking",
    desc: "Search, compare, book, and receive your e-ticket instantly through our secure payment system."
  },
  {
    title: "24/7 Customer Assistance",
    desc: "Our travel experts are available around the clock to assist with bookings, cancellations, flight changes, and travel-related queries."
  },
  {
    title: "Exclusive Travel Deals",
    desc: "Enjoy seasonal promotions, special discounts, and last-minute offers to help you save more on every journey."
  },
  {
    title: "Trusted Travel Experience",
    desc: "We prioritize transparency, reliability, and customer satisfaction to ensure a seamless booking experience from start to finish."
  }
];

export const TOP_AIRLINE_ROUTES = [
  "American Airlines to Chicago",
  "Aero Mexico to Cancun",
  "Air Canada to Nassau",
  "Air New Zealand to Auckland",
  "Air Portugal to Lisbon",
  "Alaska Airlines to Anchorage",
  "British Airways to London",
  "Cathay Pacific to Hong Kong",
  "Delta Air Lines to Atlanta",
  "Emirates Air to Dubai",
  "Etihad Airways to Abu Dhabi",
  "Frontier Airlines to Miami",
];

export const GLOBAL_FLIGHTS = [
  "Hawaiian Airlines to Honolulu",
  "Iberia to Madrid",
  "Japan Airlines to Tokyo",
  "Korean Air to Seoul",
  "JetBlue Airways to Boston",
  "KLM to Paris",
  "Lufthansa to Berlin",
  "Qantas Airways to Sydney",
  "Singapore Airlines to Singapore",
  "Southwest Airlines to Los Angeles",
  "Spirit Airline to Austin",
  "United Airlines to Sint Maarten",
];

