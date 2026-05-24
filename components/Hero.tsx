"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

type HeroItem = {
  id?: string;
  image: string;
  alt?: string;
  title?: string;
  order?: number;
};

const fallbackImages: HeroItem[] = [
  { image: '/images/hero1.jpg', alt: 'Hero image 1', title: '' },
  { image: '/images/hero2.jpg', alt: 'Hero image 2', title: '' },
  { image: '/images/hero3.jpg', alt: 'Hero image 3', title: '' },
];

export default function Hero() {
  const [items, setItems] = useState<HeroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchHero = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/hero');
        if (!res.ok) throw new Error('Failed to fetch hero');
        const json = await res.json();
        const data: HeroItem[] = (json?.data || []).map((item: any) => ({
          id: item.id,
          image: item.image || item.img || item.url,
          alt: item.alt || 'Hero image',
          title: item.title || '',
          order: item.order || 0,
        }));
        if (isMounted) setItems(data.length > 0 ? data : fallbackImages);
      } catch (e: any) {
        console.error(e);
        if (isMounted) {
          setError(e?.message || 'Error');
          setItems(fallbackImages);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchHero();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(id);
  }, [items.length]);

  const current = items[activeIndex] || fallbackImages[0];

  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
      {loading ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />)
        : (
        <div className="absolute inset-0">
          <Image
            src={current.image}
            alt={current.alt || 'Hero'}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/30" />
          {current.title && (
            <div className="absolute inset-x-0 bottom-16 text-center px-4">
              <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg">{current.title}</h1>
            </div>
          )}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${i === activeIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
          {error && (
            <div className="absolute top-4 right-4 text-xs text-white/80 bg-black/40 px-2 py-1 rounded">
              Using fallback: {error}
            </div>
          )}
        </div>
      )}
    </section>
  );
}


