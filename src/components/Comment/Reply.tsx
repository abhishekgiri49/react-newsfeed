import { ReplyProps } from "../../types";
import Avatar from "./../Shared/Avatar";
import LikeButton from "./../Shared/LikeButton";
import TimeStamp from "./../Shared/TimeStamp";

export default function Reply({ reply, onLike, onDelete }: ReplyProps) {
  return (
    <div className="flex space-x-2">
      <Avatar src={reply.avatar} alt={reply.author} size="sm" />
      <div className="flex-1">
        <div className="bg-gray-100 rounded-2xl px-3 py-2">
          <h5 className="font-semibold text-xs text-gray-900">
            {reply.author}
          </h5>
          <p className="text-xs text-gray-800 mt-1">{reply.content}</p>
        </div>
        <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
          {(reply.canLike ?? false) && (
            <LikeButton
              liked={reply.liked}
              count={reply.likes}
              onClick={onLike}
            />
          )}
          {(reply.canDelete ?? false) && (
            <button onClick={onDelete} className="hover:underline">
              Delete
            </button>
          )}
          <TimeStamp time={reply.timestamp} />
        </div>
      </div>
    </div>
  );
}
