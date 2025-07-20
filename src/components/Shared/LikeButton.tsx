interface LikeButtonProps {
  liked: boolean;
  count: number;
  onClick: () => void;
}

export default function LikeButton({ liked, count, onClick }: LikeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 ${
        liked ? "text-blue-600 font-semibold" : ""
      }`}
    >
      <span>👍</span>
      {count > 0 && <span>{count}</span>}
      <span>Like</span>
    </button>
  );
}
