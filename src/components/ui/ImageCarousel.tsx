import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CAROUSEL_IMAGES = [
  {
    url: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Énergie Olympique',
    subtitle: 'Athlètes en action',
  },
  {
    url: 'https://images.pexels.com/photos/3594615/pexels-photo-3594615.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Esprit Sportif',
    subtitle: 'Union et solidarité',
  },
  {
    url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Performance',
    subtitle: 'Excellence sportive',
  },
  {
    url: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Dakar en Fête',
    subtitle: 'Cérémonie d\'ouverture',
  },
  {
    url: 'https://images.pexels.com/photos/3862620/pexels-photo-3862620.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Victoire',
    subtitle: 'Sur les podiums',
  },
];

interface ImageCarouselProps {
  autoPlay?: boolean;
  interval?: number;
}

export default function ImageCarousel({ autoPlay = true, interval = 5000 }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval]);

  const prev = () => setCurrent((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  const next = () => setCurrent((prev) => (prev + 1) % CAROUSEL_IMAGES.length);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {CAROUSEL_IMAGES.map((image, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 via-transparent to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
        <div />

        <div className="text-white">
          <h2 className="text-4xl font-display font-bold mb-2">
            {CAROUSEL_IMAGES[current].title}
          </h2>
          <p className="text-xl text-gold-300 font-semibold">
            {CAROUSEL_IMAGES[current].subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={prev}
            className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-2">
            {CAROUSEL_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === current
                    ? 'w-8 bg-gold-400'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
