import { CommentIcon, LikeIcon, ShareIcon } from "../Icon";

interface PostActionsProps {
  liked: boolean;
  likeCount: number;
  commentCount: number;
  showComments: boolean;
  onLike: () => void;
  onToggleComments: () => void;
  onClickShare: () => void;
}

export default function PostActions({
  liked,
  likeCount,
  commentCount,
  showComments,
  onLike,
  onToggleComments,
  onClickShare,
}: PostActionsProps) {
  return (
    <>
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs">
                👍
              </div>
            </div>
            <span className="text-gray-600 text-sm ml-2">
              {likeCount} Likes
            </span>
          </div>
          <button
            onClick={onToggleComments}
            className="text-gray-600 text-sm hover:underline"
          >
            {commentCount} Comments
          </button>
        </div>
      </div>

      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex justify-around">
          <button
            onClick={onLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ${
              liked ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <LikeIcon filled={liked} />
            <span className="text-sm font-medium">Like</span>
          </button>

          <button
            onClick={onToggleComments}
            className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <CommentIcon />
            <span className="text-sm font-medium">Comment</span>
          </button>

          <button
            onClick={onClickShare}
            className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <ShareIcon />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    </>
  );
}
