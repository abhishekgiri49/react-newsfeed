export interface Reply {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
}
export interface DropdownOption {
  title: string;
  action: () => void;
  icon?: React.ReactNode; // Optional icon for each option
}
export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
  replies: Reply[];
  showReplies: boolean;
  showReplyInput: boolean;
}

export interface PostImage {
  id: string;
  url: string;
  alt: string;
}
export interface Author {
  name: string;
  avatar: string;
  timeAgo: string;
}
export interface PostProps {
  author: Author;
  content: string;
  tags?: string[];
  options?: DropdownOption[];
  images?: PostImage[];
  initialLiked?: boolean;
  initialLikeCount?: number;
  initialComments?: Comment[];
  showTranslation?: boolean;
  onLikePost?: (liked: boolean) => void;
  onAddComment?: (content: string) => Comment | void;
  onLikeComment?: (commentId: string) => void;
  onAddReply?: (commentId: string, content: string) => Reply | void;
  onLikeReply?: (commentId: string, replyId: string) => void;
  onClickShare?: () => void;
}

export interface CommentProps {
  comment: Comment;
  onLike: () => void;
  onLikeReply: (replyId: string) => void;
  onToggleReplies: () => void;
  onToggleReplyInput: () => void;
  onPostReply: (content: string) => void;
}

export interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

export interface ReplyProps {
  reply: Reply;
  onLike: () => void;
}
