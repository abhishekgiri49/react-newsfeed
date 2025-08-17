import { Author, DropdownOption } from "../../types";
import { MoreOptionsIcon } from "../Icon";
import Avatar from "../Shared/Avatar";
import TimeStamp from "../Shared/TimeStamp";
import { useState, useRef, useEffect, ReactNode } from "react";

interface PostHeaderProps {
  author: Author;
  options?: DropdownOption[]; // Dynamic dropdown options
  extraComponent?: ReactNode; // 👈 Allow passing a whole component
}

export default function PostHeader({
  author,
  options = [],
  extraComponent,
}: PostHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between p-4 relative">
      <div className="flex items-center space-x-3">
        <Avatar src={author.avatar} alt={author.name} size="md" />
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{author.name}</h3>
          <TimeStamp time={author.timeAgo} />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* 👈 Render dynamic component before dropdown */}
        {extraComponent && <div>{extraComponent}</div>}

        {/* Dropdown Toggle Button */}
        {options?.length > 0 && (
          <>
            <button
              className="text-gray-400 hover:text-gray-600 relative"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <MoreOptionsIcon />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && options.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute right-4 top-12 bg-white shadow-lg rounded-md py-1 w-48 z-10 border border-gray-200"
              >
                {options.map((option, index) => (
                  <button
                    key={index}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      option.action();
                      setIsDropdownOpen(false); // Close dropdown after selection
                    }}
                  >
                    {option.icon && <span className="mr-2">{option.icon}</span>}
                    {option.title}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
