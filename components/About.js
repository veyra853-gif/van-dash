"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

const About = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // صور افتراضية في حالة فشل API أو عدم وجود بيانات
  const fallbackImages = [
    {
      id: 1,
      image: '/images/about1.jpg',
      alt: 'About us image 1',
      title: 'Our Story'
    },
    {
      id: 2,
      image: '/images/about2.jpg',
      alt: 'About us image 2', 
      title: 'Our Mission'
    },
    {
      id: 3,
      image: '/images/about3.jpg',
      alt: 'About us image 3',
      title: 'Our Vision'
    }
  ];

  useEffect(() => {
    const fetchAboutImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/about');
        
        if (!response.ok) {
          throw new Error('Failed to fetch about images');
        }
        
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          // تحويل البيانات للتأكد من وجود الحقول المطلوبة
          const formattedImages = result.data.map(item => ({
            id: item.id,
            image: item.image || item.img || item.url,
            alt: item.alt || 'About image',
            title: item.title || '',
            order: item.order || 0
          }));
          setImages(formattedImages);
        } else {
          // استخدام الصور الافتراضية في حالة عدم وجود بيانات
          setImages(fallbackImages);
        }
      } catch (error) {
        console.error('Error fetching about images:', error);
        setError(error.message);
        // استخدام الصور الافتراضية في حالة الخطأ
        setImages(fallbackImages);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutImages();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-gray-300 rounded-lg h-64 animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our story, mission, and the passion that drives us to create exceptional experiences.
          </p>
        </div>

        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-8 text-center">
            <p>Note: Using fallback images due to: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              {item.title && (
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
