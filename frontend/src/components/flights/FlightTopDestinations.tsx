"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TOP_DESTINATIONS } from '../../constants/flightData';

interface FlightTopDestinationsProps {
  onSelectDestination?: (destinationName: string) => void;
}

export const FlightTopDestinations: React.FC<FlightTopDestinationsProps> = ({ onSelectDestination }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-b border-slate-200/60 dark:border-slate-800/60"
    >
      <div className="text-left mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white"
        >
          Top Destinations
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mt-1.5 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium max-w-2xl"
        >
          Explore handpicked flight deals to world-famous cities with guaranteed best fares.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {TOP_DESTINATIONS.map((dest, idx) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5, delay: Math.min(idx * 0.06, 0.4), ease: "easeOut" }}
            whileHover={{ y: -5, scale: 1.01 }}
            onClick={() => onSelectDestination?.(dest.name)}
            className="group relative overflow-hidden rounded-2xl h-[175px] sm:h-[190px] md:h-[200px] shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-300 dark:border-slate-700"
          >
            {/* Background Image */}
            <Image
              src={dest.img}
              alt={dest.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Bottom Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

            {/* Bottom Card Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-4.5 flex items-end justify-between z-10">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-sm group-hover:text-amber-300 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">
                  {dest.dates}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  {dest.price}
                </span>
                <span className="text-xs font-bold text-slate-300 ml-0.5">
                  pp
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default FlightTopDestinations;
