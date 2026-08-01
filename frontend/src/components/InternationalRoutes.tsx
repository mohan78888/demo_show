import React from 'react';
import Image from 'next/image';

interface RouteItem {
  to: string;
  fromCode: string;
  toCode: string;
  image: string;
}

const INTERNATIONAL_ROUTES: RouteItem[] = [
  { to: 'France', fromCode: 'USA', toCode: 'CDG', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Turkey', fromCode: 'USA', toCode: 'IST', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Japan', fromCode: 'USA', toCode: 'NRT', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Italy', fromCode: 'USA', toCode: 'FCO', image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Poland', fromCode: 'USA', toCode: 'WAW', image: 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'South Korea', fromCode: 'USA', toCode: 'ICN', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Spain', fromCode: 'USA', toCode: 'MAD', image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Mexico', fromCode: 'USA', toCode: 'MEX', image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Austria', fromCode: 'USA', toCode: 'VIE', image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Canada', fromCode: 'USA', toCode: 'YYZ', image: 'https://images.unsplash.com/photo-1503197979108-c824168d51a8?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Thailand', fromCode: 'USA', toCode: 'BKK', image: 'https://plus.unsplash.com/premium_photo-1661963188068-1bac46e28727?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { to: 'New York', fromCode: 'USA', toCode: 'JFK', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Russia', fromCode: 'USA', toCode: 'SVO', image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Vietnam', fromCode: 'USA', toCode: 'SGN', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Denver', fromCode: 'USA', toCode: 'DEN', image: 'https://plus.unsplash.com/premium_photo-1694475371986-677909af604d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { to: 'Liverpool', fromCode: 'USA', toCode: 'LPL', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Indonesia', fromCode: 'USA', toCode: 'DPS', image: 'https://images.unsplash.com/photo-1555043722-4523972f07ee?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { to: 'China', fromCode: 'USA', toCode: 'PEK', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Germany', fromCode: 'USA', toCode: 'FRA', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Portugal', fromCode: 'USA', toCode: 'LIS', image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'India', fromCode: 'DXB', toCode: 'USA', image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Malaysia', fromCode: 'USA', toCode: 'KUL', image: 'https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Pakistan', fromCode: 'USA', toCode: 'LHE', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Las Vegas', fromCode: 'USA', toCode: 'LAS', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=100&h=100' },
  { to: 'Singapore', fromCode: 'USA', toCode: 'SIN', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=100&h=100' },
];

interface InternationalRoutesProps {
  onRouteClick: (from: string, to: string) => void;
}

const InternationalRoutes: React.FC<InternationalRoutesProps> = ({ onRouteClick }) => {
  return (
    <section className="py-20 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      {/* World Map Watermark Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')`,
          backgroundSize: '80%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex justify-center mb-12 border-b border-slate-100 dark:border-slate-800">
          <div className="flex">
            <h2 className="pb-4 text-2xl font-bold text-slate-900 dark:text-white relative">
              Top International Flight Routes
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-blue-600 rounded-full"></div>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
          {INTERNATIONAL_ROUTES.map((route, index) => (
            <button
              key={`${route.toCode}-${index}`}
              onClick={() => onRouteClick('New Delhi', route.to)}
              className="flex items-center gap-5 text-left group transition-all duration-300 hover:translate-x-1"
            >
              <div className="w-16 h-16 shrink-0 relative rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl dark:shadow-none transition-all border border-slate-50 dark:border-slate-800">
                <Image src={route.image} alt={route.to} fill sizes="64px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Flight to {route.to}
                  </span>
                </div>
                <span className="text-sm font-bold text-blue-500 dark:text-blue-400 tracking-wider uppercase">
                  {route.fromCode} - {route.toCode}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(InternationalRoutes);
