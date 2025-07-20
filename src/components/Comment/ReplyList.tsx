import { Reply as ReplyTypes } from "../../types";
import { ChevronIcon } from "../Icon";
import Reply from "./Reply";

interface ReplyListProps {
  replies: ReplyTypes[];
  showReplies: boolean;
  onToggleReplies: () => void;
  onLikeReply: (replyId: string) => void;
}

export default function ReplyList({
  replies,
  showReplies,
  onToggleReplies,
  onLikeReply,
}: ReplyListProps) {
  return (
    <div className="mt-2">
      <button
        onClick={onToggleReplies}
        className="text-xs text-gray-500 hover:underline flex items-center space-x-1"
      >
        <ChevronIcon direction={showReplies ? "rotate-90" : ""} />
        <span>
          {replies.length} {replies.length === 1 ? "reply" : "replies"}
        </span>
      </button>

      {showReplies && (
        <div className="mt-2 space-y-2">
          {replies.map((reply) => (
            <Reply
              key={reply.id}
              reply={reply}
              onLike={() => onLikeReply(reply.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
