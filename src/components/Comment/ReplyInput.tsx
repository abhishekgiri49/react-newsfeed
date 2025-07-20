import { useState } from "react";
import Avatar from "./../Shared/Avatar";
import { SendIcon } from "./../Icon";

interface ReplyInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

export default function ReplyInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Write a reply...",
}: ReplyInputProps) {
  return (
    <div className="flex space-x-2 mt-2">
      <div className="flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-1 bg-gray-100 rounded-full text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === "Enter" && onSubmit()}
        />
      </div>
      {value && (
        <button
          onClick={onSubmit}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          <SendIcon />
        </button>
      )}
    </div>
  );
}
