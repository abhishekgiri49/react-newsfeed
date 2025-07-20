import { SendIcon } from "../Icon";
import { CommentInputProps } from "../../types";
import Avatar from "../Shared/Avatar";

export default function CommentInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Write a comment...",
}: CommentInputProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex space-x-3">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && onSubmit()}
            />
            {value && (
              <button
                onClick={onSubmit}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
              >
                <SendIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
