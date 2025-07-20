import { PostImage } from "../../types";

interface PostImagesProps {
  images: PostImage[];
}

export default function PostImages({ images }: PostImagesProps) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="w-full">
        <img
          src={images[0].url || "/placeholder.svg"}
          alt={images[0].alt}
          className="w-full h-auto object-cover cursor-pointer hover:opacity-95 transition-opacity"
        />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-1">
        {images.slice(0, 2).map((image) => (
          <div key={image.id} className="aspect-square overflow-hidden">
            <img
              src={image.url || "/placeholder.svg"}
              alt={image.alt}
              className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
            />
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-1">
        <div className="aspect-square overflow-hidden">
          <img
            src={images[0].url || "/placeholder.svg"}
            alt={images[0].alt}
            className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
          />
        </div>
        <div className="grid grid-rows-2 gap-1">
          {images.slice(1, 3).map((image) => (
            <div key={image.id} className="aspect-square overflow-hidden">
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              />
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
      {displayImages.map((image, index) => (
        <div key={image.id} className="aspect-square overflow-hidden relative">
          <img
            src={image.url || "/placeholder.svg"}
            alt={image.alt}
            className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
          />
          {index === 3 && remainingCount > 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center cursor-pointer hover:bg-opacity-50 transition-all">
              <span className="text-white text-2xl font-bold">
                +{remainingCount}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
