import "./styles/globals.css";
// Main components
export { default as Post } from "./components/Post/Post";
export { default as Comment } from "./components/Comment/Comment";
export { default as CommentList } from "./components/Comment/CommentList";
export { default as CommentInput } from "./components/Comment/CommentInput";
export { default as Reply } from "./components/Comment/Reply";
export { default as ReplyList } from "./components/Comment/ReplyList";
export { default as ReplyInput } from "./components/Comment/ReplyInput";

// Shared components
export { default as Avatar } from "./components/Shared/Avatar";
export { default as LikeButton } from "./components/Shared/LikeButton";
export { default as TimeStamp } from "./components/Shared/TimeStamp";
export * from "./components/Icon";

// Types
export * from "./types";
