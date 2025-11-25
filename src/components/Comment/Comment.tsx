import { CommentProps } from "../../types";
import { useState } from "react";
import ReplyList from "./ReplyList";
import ReplyInput from "./ReplyInput";
import Avatar from "../Shared/Avatar";
import TimeStamp from "../Shared/TimeStamp";

export default function Comment({
  comment,
  onLike,
  onDelete,
  onLikeReply,
  onDeleteReply,
  onToggleReplies,
  onToggleReplyInput,
  onPostReply,
}: CommentProps) {
  const [replyText, setReplyText] = useState("");

  const handlePostReply = () => {
    if (replyText.trim()) {
      onPostReply(replyText);
      setReplyText("");
    }
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex space-x-3">
        <Avatar src={comment.avatar} alt={comment.author} size="sm" />
        <div className="flex-1">
          <div className="bg-gray-100 rounded-2xl px-3 py-2">
            <h4 className="font-semibold text-sm text-gray-900">
              {comment.author}
            </h4>
            <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
          </div>

          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
            {comment.likes > 0 && (
              <span className="flex items-center space-x-1">
                <span>👍</span>
                <span>{comment.likes}</span>
              </span>
            )}
            <button
              onClick={onLike}
              className={`hover:underline ${
                comment.liked ? "text-blue-600 font-semibold" : ""
              }`}
            >
              Like
            </button>
            {(comment.canReply ?? false) && (
              <button onClick={onToggleReplyInput} className="hover:underline">
                Reply
              </button>
            )}
            {(comment.canDelete ?? false) && (
              <button onClick={onDelete} className="hover:underline">
                Delete
              </button>
            )}
            <TimeStamp time={comment.timestamp} />
          </div>

          {comment.showReplyInput && (
            <ReplyInput
              value={replyText}
              onChange={setReplyText}
              onSubmit={handlePostReply}
              placeholder="Write a reply..."
            />
          )}

          {comment.replies.length > 0 && (
            <ReplyList
              replies={comment.replies}
              showReplies={comment.showReplies}
              onToggleReplies={onToggleReplies}
              onLikeReply={onLikeReply}
              onDeleteReply={onDeleteReply}
            />
          )}
        </div>
      </div>
    </div>
  );
}
