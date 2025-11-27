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

export default function PostImages({ images }: PostImagesProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Refs for intersection observer
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const youtubeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Initialize intersection observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target;

          if (element instanceof HTMLVideoElement) {
            if (entry.isIntersecting) {
              element.play().catch(console.error);
            } else {
              element.pause();
              element.currentTime = 0; // Reset to beginning
            }
          }

          if (
            element instanceof HTMLIFrameElement &&
            element.src.includes("youtube.com")
          ) {
            if (entry.isIntersecting) {
              // Enable autoplay for YouTube when visible
              const src = element.src;
              if (src.includes("autoplay=0")) {
                element.src = src.replace("autoplay=0", "autoplay=1");
              }
            } else {
              // Disable autoplay when not visible by reloading with autoplay=0
              const src = element.src;
              if (src.includes("autoplay=1")) {
                // Create a new iframe to properly stop the video
                const parent = element.parentElement;
                if (parent) {
                  const newIframe = element.cloneNode(
                    false
                  ) as HTMLIFrameElement;
                  newIframe.src = src.replace("autoplay=1", "autoplay=0");
                  parent.replaceChild(newIframe, element);
                  // Update the ref
                  const mediaId = Array.from(
                    youtubeRefs.current.entries()
                  ).find(([, ref]) => ref === element)?.[0];
                  if (mediaId) {
                    youtubeRefs.current.set(mediaId, newIframe);
                    // Re-observe the new iframe
                    if (observerRef.current) {
                      observerRef.current.observe(newIframe);
                    }
                  }
                }
              }
            }
          }
        });
      },
      {
        threshold: 0.7, // Trigger when 70% of the element is visible
        rootMargin: "100px", // Start loading when 100px away from viewport
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Observe grid videos and YouTube iframes when component mounts or images change
  useEffect(() => {
    if (!observerRef.current || isLightboxOpen) return;

    // Observe all video elements in grid
    videoRefs.current.forEach((videoElement) => {
      observerRef.current?.observe(videoElement);
    });

    // Observe all YouTube iframes in grid
    youtubeRefs.current.forEach((youtubeElement) => {
      observerRef.current?.observe(youtubeElement);
    });

    return () => {
      videoRefs.current.forEach((videoElement) => {
        observerRef.current?.unobserve(videoElement);
      });
      youtubeRefs.current.forEach((youtubeElement) => {
        observerRef.current?.unobserve(youtubeElement);
      });
    };
  }, [images, isLightboxOpen]);

  // Handle lightbox media observation
  useEffect(() => {
    if (!observerRef.current || !isLightboxOpen) return;

    // Observe the current media in lightbox
    const currentMedia = images[currentImageIndex];
    if (currentMedia.type === "video") {
      const videoElement = videoRefs.current.get(currentMedia.id);
      if (videoElement) {
        observerRef.current.observe(videoElement);
        // Auto-play lightbox videos
        videoElement.play().catch(console.error);
      }
    } else if (currentMedia.type === "youtube") {
      const youtubeElement = youtubeRefs.current.get(currentMedia.id);
      if (youtubeElement) {
        observerRef.current.observe(youtubeElement);
      }
    }

    // Cleanup when lightbox closes or media changes
    return () => {
      if (currentMedia.type === "video") {
        const videoElement = videoRefs.current.get(currentMedia.id);
        if (videoElement) {
          observerRef.current?.unobserve(videoElement);
          videoElement.pause();
          videoElement.currentTime = 0;
        }
      } else if (currentMedia.type === "youtube") {
        const youtubeElement = youtubeRefs.current.get(currentMedia.id);
        if (youtubeElement) {
          observerRef.current?.unobserve(youtubeElement);
        }
      }
    };
  }, [isLightboxOpen, currentImageIndex, images]);

  // Re-observe YouTube iframes when they are rendered
  useEffect(() => {
    if (!observerRef.current || isLightboxOpen) return;

    // Small delay to ensure iframes are rendered
    const timeoutId = setTimeout(() => {
      youtubeRefs.current.forEach((youtubeElement) => {
        observerRef.current?.observe(youtubeElement);
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [images, isLightboxOpen]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = "unset";

    // Reset all videos when lightbox closes
    videoRefs.current.forEach((videoElement) => {
      videoElement.pause();
      videoElement.currentTime = 0;
    });
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
      observerRef.current?.disconnect();
    };
  }, []);

  // Helper to set video ref
  const setVideoRef = (media: PostImage, element: HTMLVideoElement | null) => {
    if (element) {
      videoRefs.current.set(media.id, element);
    } else {
      videoRefs.current.delete(media.id);
    }
  };

  // Helper to set YouTube ref
  const setYoutubeRef = (
    media: PostImage,
    element: HTMLIFrameElement | null
  ) => {
    if (element) {
      youtubeRefs.current.set(media.id, element);
      // Observe the YouTube iframe after it's rendered
      setTimeout(() => {
        if (observerRef.current && !isLightboxOpen) {
          observerRef.current.observe(element);
        }
      }, 50);
    } else {
      youtubeRefs.current.delete(media.id);
    }
  };

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
        <div key={media.id} className="relative w-full h-full">
          <video
            ref={(el) => setVideoRef(media, el)}
            src={media.url || "/placeholder.svg"}
            className={`${baseClassName} object-cover`}
            onClick={() => openLightbox(index)}
            muted
            playsInline
            loop
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
          <div key={media.id} className="w-full h-full relative aspect-video">
            <iframe
              ref={(el) => setYoutubeRef(media, el)}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&playsinline=1&loop=1&controls=1&modestbranding=1`}
              className="w-full h-full absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onClick={() => openLightbox(index)}
            />
          </div>
        );
      }
    }

    // Default to image
    return (
      <img
        key={media.id}
        src={media.url || "/placeholder.svg"}
        alt={media.alt}
        className={`${baseClassName} object-cover`}
        onClick={() => openLightbox(index)}
      />
    );
  };

  // Render lightbox content based on media type
  const renderLightboxContent = (media: PostImage) => {
    if (media.type === "video") {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <video
            ref={(el) => setVideoRef(media, el)}
            src={media.url || "/placeholder.svg"}
            className="max-w-full max-h-full object-contain"
            controls
            autoPlay
            muted
            playsInline
          />
        </div>
      );
    }

    if (media.type === "youtube") {
      const videoId = getYouTubeVideoId(media.url || "");
      if (videoId) {
        return (
          <div className="flex items-center justify-center w-full h-full">
            <iframe
              ref={(el) => setYoutubeRef(media, el)}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&loop=1&controls=1&modestbranding=1`}
              className="w-full max-w-4xl h-auto aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
    }

    // Default to image
    return (
      <div className="flex items-center justify-center w-full h-full">
        <img
          src={media.url || "/placeholder.svg"}
          alt={media.alt}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  };

  const renderImageGrid = () => {
    if (images.length === 1) {
      return (
        <div className="w-full">
          {renderMediaItem(images[0], 0, "w-full h-auto")}
        </div>
      );
    }

    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {images.slice(0, 2).map((media, index) => (
            <div key={media.id} className="aspect-square overflow-hidden">
              {renderMediaItem(media, index, "w-full h-full")}
            </div>
          ))}
        </div>
      );
    }

    if (images.length === 3) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {/* First two items in the first row */}
          <div className="aspect-square overflow-hidden">
            {renderMediaItem(images[0], 0, "w-full h-full")}
          </div>
          <div className="aspect-square overflow-hidden">
            {renderMediaItem(images[1], 1, "w-full h-full")}
          </div>
          {/* Third item spans full width in second row */}
          <div className="col-span-2 aspect-square overflow-hidden">
            {renderMediaItem(images[2], 2, "w-full h-full")}
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
            {renderMediaItem(media, index, "w-full h-full")}
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
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Main content */}
          <div
            className="w-full h-full flex items-center justify-center p-4"
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
