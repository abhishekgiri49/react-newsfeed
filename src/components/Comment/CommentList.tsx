import { Comment } from "../../types";
import CommentItem from "./Comment";

interface CommentListProps {
  comments: Comment[];
  onLikeComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onLikeReply: (commentId: string, replyId: string) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
  onToggleReplies: (commentId: string) => void;
  onToggleReplyInput: (commentId: string) => void;
  onPostReply: (commentId: string, content: string) => void;
}

export default function CommentList({
  comments,
  onLikeComment,
  onDeleteComment,
  onLikeReply,
  onDeleteReply,
  onToggleReplies,
  onToggleReplyInput,
  onPostReply,
}: CommentListProps) {
  return (
    <div className="max-h-96 overflow-y-auto">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onLike={() => onLikeComment(comment.id)}
          onDelete={() => onDeleteComment(comment.id)}
          onLikeReply={(replyId: any) => onLikeReply(comment.id, replyId)}
          onDeleteReply={(replyId: any) => onDeleteReply(comment.id, replyId)}
          onToggleReplies={() => onToggleReplies(comment.id)}
          onToggleReplyInput={() => onToggleReplyInput(comment.id)}
          onPostReply={(content: any) => onPostReply(comment.id, content)}
        />
      ))}
    </div>
  );
}
