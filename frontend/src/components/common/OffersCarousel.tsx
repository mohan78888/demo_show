"use client";

import React, { useState } from 'react';
import Carousel from '../ui/Carousel';
import OfferCard, { OfferItem } from '../ui/OfferCard';

interface OffersCarouselProps {
  offers: OfferItem[];
  title?: string;
  subtitle?: string;
  categories?: string[];
  activeCategory?: string;
  onCategoryChange?: (cat: string) => void;
}

export const OffersCarousel: React.FC<OffersCarouselProps> = ({
  offers,
  title = "Exclusive Travel Offers",
  subtitle = "Handpicked discount coupons and promo deals for your next trip.",
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  const [internalCategory, setInternalCategory] = useState<string>("All");
  const currentCategory = activeCategory !== undefined ? activeCategory : internalCategory;

  const handleCategoryClick = (cat: string) => {
    if (onCategoryChange) {
      onCategoryChange(cat);
    } else {
      setInternalCategory(cat);
    }
  };

  const filteredOffers = currentCategory === 'All'
    ? offers
    : offers.filter(o => o.tagline === currentCategory || o.discountBadge === currentCategory || o.id.includes(currentCategory.toLowerCase()));

  const headerRightTabs = categories && categories.length > 0 ? (
    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide mr-3">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => handleCategoryClick(cat)}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            currentCategory === cat
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <Carousel
      title={title}
      subtitle={subtitle}
      headerRightContent={headerRightTabs}
      scrollAmount={320}
    >
      {filteredOffers.map((offer) => (
        <div key={offer.id} className="snap-start shrink-0 w-[280px] sm:w-[320px]">
          <OfferCard offer={offer} />
        </div>
      ))}
    </Carousel>
  );
};

export default OffersCarousel;
