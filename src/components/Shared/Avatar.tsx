interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xs";
}

export default function Avatar({ src, alt, size = "md" }: AvatarProps) {
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <div className={`rounded-full overflow-hidden ${sizeClasses[size]}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}
