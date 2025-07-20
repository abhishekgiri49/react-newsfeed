import { useState } from "react";

interface PostContentProps {
  content: string;
  tags: string[];
  showTranslation?: boolean;
  maxLength?: number; // Optional custom max length
}

export default function PostContent({
  content,
  tags,
  showTranslation,
  maxLength = 200, // Default to 200 characters
}: PostContentProps) {
  const [showFullContent, setShowFullContent] = useState(false);

  // Determine if we need to truncate
  const needsTruncation = content.length > maxLength;
  const displayedContent = showFullContent
    ? content
    : `${content.substring(0, maxLength)}${needsTruncation ? "..." : ""}`;

  return (
    <div className="px-4 pb-3">
      <p className="text-gray-900 text-sm leading-relaxed">
        {displayedContent}
        {needsTruncation && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-blue-600 hover:underline ml-1"
          >
            {showFullContent ? "Show less" : "Show more"}
          </button>
        )}
      </p>

      <div className="flex flex-wrap gap-1 mt-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="text-blue-600 text-sm hover:underline cursor-pointer"
          >
            #{tag}
          </span>
        ))}
      </div>

      {showTranslation && (
        <button className="text-blue-600 text-sm hover:underline mt-2">
          See translation
        </button>
      )}
    </div>
  );
}
