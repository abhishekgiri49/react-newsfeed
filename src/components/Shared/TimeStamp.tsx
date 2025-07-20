import { PublicIcon } from "../Icon";

interface TimeStampProps {
  time: string;
}

export default function TimeStamp({ time }: TimeStampProps) {
  return (
    <div className="flex items-center space-x-1 text-xs text-gray-500">
      <span>{time}</span>
      <PublicIcon />
    </div>
  );
}
