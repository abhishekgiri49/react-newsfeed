import { PostImage } from "../../types";
import { useState, useEffect, useRef } from "react";

interface PostImagesProps {
  images: PostImage[];
}

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Helper function to get YouTube thumbnail
const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export default function PostImages({ images }: PostImagesProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = "unset";
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;

      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  // Clean up body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (images.length === 0) return null;

  // Render media item based on type
  const renderMediaItem = (
    media: PostImage,
    index: number,
    className: string
  ) => {
    const baseClassName = `${className} cursor-pointer hover:opacity-95 transition-opacity`;

    if (media.type === "video") {
      return (
        <div key={media.id} className="relative">
          <video
            src={media.url || "/placeholder.svg"}
            className={baseClassName}
            onClick={() => openLightbox(index)}
            controls
            autoPlay
            muted
            playsInline
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black bg-opacity-60 rounded-full p-3">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    if (media.type === "youtube") {
      const videoId = getYouTubeVideoId(media.url || "");
      if (videoId) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&loop=1&controls=1&modestbranding=1`}
            className="w-full h-full max-w-4xl max-h-3xl"
            style={{ aspectRatio: "16/9" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }
    }

    // Default to image
    return (
      <img
        key={media.id}
        src={media.url || "/placeholder.svg"}
        alt={media.alt}
        className={baseClassName}
        onClick={() => openLightbox(index)}
      />
    );
  };

  // Render lightbox content based on media type
  const renderLightboxContent = (media: PostImage) => {
    if (media.type === "video") {
      return (
        <video
          src={media.url || "/placeholder.svg"}
          className="max-w-full max-h-full object-contain"
          controls
          autoPlay
        />
      );
    }

    if (media.type === "youtube") {
      const videoId = getYouTubeVideoId(media.url || "");
      if (videoId) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&loop=1&controls=1&modestbranding=1`}
            className="w-full h-full max-w-4xl max-h-3xl"
            style={{ aspectRatio: "16/9" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }
    }

    // Default to image
    return (
      <img
        src={media.url || "/placeholder.svg"}
        alt={media.alt}
        className="max-w-full max-h-full object-contain"
      />
    );
  };

  const renderImageGrid = () => {
    if (images.length === 1) {
      return (
        <div className="w-full">
          {renderMediaItem(images[0], 0, "w-full h-auto object-cover")}
        </div>
      );
    }

    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {images.slice(0, 2).map((media, index) => (
            <div key={media.id} className="aspect-square overflow-hidden">
              {renderMediaItem(media, index, "w-full h-full object-cover")}
            </div>
          ))}
        </div>
      );
    }

    if (images.length === 3) {
      return (
        <div className="grid grid-cols-2 gap-1">
          <div className="aspect-square overflow-hidden">
            {renderMediaItem(images[0], 0, "w-full h-full object-cover")}
          </div>
          <div className="grid grid-rows-2 gap-1">
            {images.slice(1, 3).map((media, index) => (
              <div key={media.id} className="aspect-square overflow-hidden">
                {renderMediaItem(
                  media,
                  index + 1,
                  "w-full h-full object-cover"
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // For 4 or more images
    const displayImages = images.slice(0, 4);
    const remainingCount = images.length - 4;

    return (
      <div className="grid grid-cols-2 gap-1">
        {displayImages.map((media, index) => (
          <div
            key={media.id}
            className="aspect-square overflow-hidden relative"
          >
            {renderMediaItem(media, index, "w-full h-full object-cover")}
            {index === 3 && remainingCount > 0 && (
              <div
                className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center cursor-pointer hover:bg-opacity-50 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(index);
                }}
              >
                <span className="text-white text-2xl font-bold">
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {renderImageGrid()}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition-colors z-10"
            aria-label="Close lightbox"
          >
            ×
          </button>

          {/* Media type indicator */}
          <div className="absolute top-4 left-4 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded z-10 flex items-center gap-2">
            <span>
              {currentImageIndex + 1} / {images.length}
            </span>
            {images[currentImageIndex].type && (
              <>
                <span>•</span>
                <span className="capitalize">
                  {images[currentImageIndex].type}
                </span>
              </>
            )}
          </div>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-gray-300/80 w-12 h-12 rounded-full flex items-center justify-center"
              aria-label="Previous image"
            >
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 7L10 12L15 17"
                  stroke="#000000"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-gray-300/80 w-12 h-12 rounded-full flex items-center justify-center"
              aria-label="Next image"
            >
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 7L15 12L10 17"
                  stroke="#000000"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Main content */}
          <div
            className="w-full h-full flex items-center justify-center p-8"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {renderLightboxContent(images[currentImageIndex])}
          </div>

          {/* Background overlay (click to close) */}
          <div className="absolute inset-0 -z-10" onClick={closeLightbox} />
        </div>
      )}
    </>
  );
}
