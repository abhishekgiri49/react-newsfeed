import { Comment } from "../../types";
import CommentList from "../Comment/CommentList";
import CommentInput from "../Comment/CommentInput";

interface PostCommentsProps {
  comments: Comment[];
  newComment: string;
  onCommentChange: (value: string) => void;
  onPostComment: () => void;
  onLikeComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onLikeReply: (commentId: string, replyId: string) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
  onToggleReplies: (commentId: string) => void;
  onToggleReplyInput: (commentId: string) => void;
  onPostReply: (commentId: string, content: string) => void;
}

export default function PostComments({
  comments,
  newComment,
  onCommentChange,
  onPostComment,
  onLikeComment,
  onDeleteComment,
  onLikeReply,
  onDeleteReply,
  onToggleReplies,
  onToggleReplyInput,
  onPostReply,
}: PostCommentsProps) {
  return (
    <div className="bg-gray-50">
      <CommentInput
        value={newComment}
        onChange={onCommentChange}
        onSubmit={onPostComment}
        placeholder="Write a comment..."
      />

      <CommentList
        comments={comments}
        onLikeComment={onLikeComment}
        onDeleteComment={onDeleteComment}
        onLikeReply={onLikeReply}
        onDeleteReply={onDeleteReply}
        onToggleReplies={onToggleReplies}
        onToggleReplyInput={onToggleReplyInput}
        onPostReply={onPostReply}
      />
    </div>
  );
}
