import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: { id: number; src: string; alt: string }[];
  variationImage?: string;
}

export default function ProductGallery({ images, variationImage }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use variation image if provided, otherwise use product images
  const displayImages = variationImage 
    ? [{ id: 0, src: variationImage, alt: 'Product' }, ...images.filter(img => img.src !== variationImage)]
    : images;

  if (displayImages.length === 0) {
    return (
      <div className="bg-[#F6F7F9] rounded-2xl p-8 flex items-center justify-center aspect-square">
        <div className="w-full max-w-[300px] aspect-square bg-gray-200 rounded-lg" />
      </div>
    );
  }

  const currentImage = displayImages[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-[#F6F7F9] rounded-2xl p-4 md:p-8">
      {/* Main Image */}
      <div className="relative aspect-square flex items-center justify-center mb-4">
        <img
          src={currentImage.src}
          alt={currentImage.alt || 'Product'}
          className="w-full max-w-[300px] h-auto object-contain"
        />
        
        {/* Navigation Arrows (only show if multiple images) */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#0B0D12]" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[#0B0D12]" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 justify-center overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentIndex
                  ? 'border-[#2E6FF6]'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={image.src}
                alt={image.alt || 'Thumbnail'}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
