import { useState } from "react";
import { PostProps, Comment, Reply } from "../../types";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostImages from "./PostImages";
import PostActions from "./PostActions";
import PostComments from "./PostComments";

export default function Post({
  author,
  content,
  tags = [],
  images = [],
  options,
  initialLiked = false,
  initialLikeCount = 0,
  initialComments = [],
  showTranslation = false,
  onLikePost,
  onAddComment,
  onLikeComment,
  onAddReply,
  onLikeReply,
  onClickShare,
}: PostProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handlePostComment = () => {
    if (newComment.trim() && onAddComment) {
      const comment = onAddComment(newComment);
      if (comment) {
        setComments([comment, ...comments]);
        setNewComment("");
      }
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      // Optimistically update the UI first (for instant feedback)
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                liked: !comment.liked, // Toggle like status
                likes: comment.liked ? comment.likes - 1 : comment.likes + 1, // Update count
              }
            : comment
        )
      );

      // Call API to update like status (if `onLikeComment` is provided)
      if (onLikeComment) {
        await onLikeComment(commentId);
      }
    } catch (error) {
      console.error("Failed to like comment:", error);

      // Revert optimistic update if API fails
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                liked: comment.liked, // Revert like status
                likes: comment.likes, // Revert like count
              }
            : comment
        )
      );
    }
  };

  const handleLikeReply = async (commentId: string, replyId: string) => {
    try {
      // Optimistically update the UI first
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === replyId
                    ? {
                        ...reply,
                        liked: !reply.liked,
                        likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
                      }
                    : reply
                ),
              }
            : comment
        )
      );

      // Call API if provided (e.g., `onLikeReply?.(commentId, replyId, !reply.liked)`)
      if (onLikeReply) {
        await onLikeReply(commentId, replyId);
      }
    } catch (error) {
      console.error("Failed to like reply:", error);

      // Revert on error
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === replyId
                    ? {
                        ...reply,
                        liked: reply.liked, // Revert
                        likes: reply.likes, // Revert
                      }
                    : reply
                ),
              }
            : comment
        )
      );
    }
  };
  const handlePostReply = async (commentId: string, replyContent: string) => {
    // Early return if content is empty or callback doesn't exist
    if (!replyContent.trim() || !onAddReply) return;

    try {
      // Assuming onAddReply might be async (e.g., API call)
      const reply = await onAddReply(commentId, replyContent);

      // Optimistically update the UI
      setComments((prevComments: any) =>
        prevComments.map((comment: any) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [...comment.replies, reply],
                showReplies: true,
                showReplyInput: false,
              }
            : comment
        )
      );
    } catch (error) {
      // Handle any errors from onAddReply
      console.error("Failed to add reply:", error);
      // Optionally show error to user or revert optimistic update
    }
  };
  const toggleReplies = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, showReplies: !comment.showReplies }
          : comment
      )
    );
  };

  const toggleReplyInput = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, showReplyInput: !comment.showReplyInput }
          : comment
      )
    );
  };

  const handleLikePost = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);
    onLikePost?.(newLikedState);
  };
  const handleClickShareButton = () => {
    if (onClickShare) {
      // Check if onClickShare exists
      onClickShare(); // Only call if defined
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <PostHeader author={author} options={options} />

      <PostContent
        content={content}
        tags={tags}
        showTranslation={showTranslation}
      />
      {images?.length > 0 && <PostImages images={images} />}

      <PostActions
        liked={liked}
        likeCount={likeCount}
        commentCount={comments.length}
        showComments={showComments}
        onLike={handleLikePost}
        onToggleComments={() => setShowComments(!showComments)}
        onClickShare={handleClickShareButton}
      />

      {showComments && (
        <PostComments
          comments={comments}
          newComment={newComment}
          onCommentChange={setNewComment}
          onPostComment={handlePostComment}
          onLikeComment={handleLikeComment}
          onLikeReply={handleLikeReply}
          onToggleReplies={toggleReplies}
          onToggleReplyInput={toggleReplyInput}
          onPostReply={handlePostReply}
        />
      )}
    </div>
  );
}
