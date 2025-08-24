import "./App.css";
import { Post } from "react-newsfeed";
import { useState } from "react";
import { BookmarkCheck, Bug, Share } from "lucide-react";
import ApplyFollowRow from "./ApplyFollowRow";

interface PostData {
  id: string;
  author: {
    name: string;
    avatar: string;
    timeAgo: string;
  };
  content: string;
  tags: string[];
  images: Array<{
    id: string;
    url: string;
    alt: string;
    type?: "image" | "video" | "youtube";
  }>;
  liked: boolean;
  likeCount: number;
  comments: Array<{
    id: string;
    author: string;
    avatar: string;
    content: string;
    timestamp: string;
    likes: number;
    liked: boolean;
    canDelete?: boolean;
    canReply?: boolean;
    replies: any[];
    showReplies: boolean;
    showReplyInput: boolean;
  }>;
}

function App() {
  const [posts, setPosts] = useState<PostData[]>([
    {
      id: "1",
      author: {
        name: "Panda Media",
        avatar:
          "https://images.unsplash.com/profile-1749556385385-1235419e91caimage?w=32&dpr=1&crop=faces&bg=%23fff&h=32&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
        timeAgo: "20h",
      },
      content: "Check out these amazing pandas!",
      tags: ["panda", "nature", "photography"],
      images: [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Image 1",
          type: "image",
        },
        {
          id: "2",
          url: "https://plus.unsplash.com/premium_photo-1675882505334-382d4cb3d718?q=80&w=1165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Image 2",
          type: "image",
        },
      ],
      liked: false,
      likeCount: 124,
      comments: [
        {
          id: "1",
          author: "User 1",
          avatar: "https://img.icons8.com/color/48/user-male-circle--v5.png",
          content: "Great post!",
          timestamp: "2h",
          likes: 5,
          liked: false,

          replies: [],
          showReplies: false,
          showReplyInput: false,
        },
      ],
    },
    {
      id: "2",
      author: {
        name: "Wildlife Photography",
        avatar:
          "https://images.unsplash.com/photo-1564564244660-5d73c057f2d2?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        timeAgo: "5h",
      },
      content:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
      tags: ["nature", "photography", "hiking"],
      images: [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1548347480-50e99d864837?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Nature shot",
          type: "image",
        },
      ],
      liked: true,
      likeCount: 89,
      comments: [],
    },
    // Example with video
    {
      id: "3",
      author: {
        name: "Video Creator",
        avatar: "https://img.icons8.com/color/48/user-male-circle--v5.png",
        timeAgo: "1h",
      },
      content: "Check out this amazing video!",
      tags: ["video", "content"],
      images: [
        {
          id: "1",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Sample video URL
          alt: "Sample video",
          type: "video",
        },
      ],
      liked: false,
      likeCount: 45,
      comments: [],
    },
    // Example with YouTube video
    {
      id: "4",
      author: {
        name: "YouTube Content",
        avatar: "https://img.icons8.com/color/48/user-male-circle--v5.png",
        timeAgo: "3h",
      },
      content: "Amazing YouTube video!",
      tags: ["youtube", "video"],
      images: [
        {
          id: "1",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Example YouTube URL
          alt: "YouTube video",
          type: "youtube",
        },
      ],
      liked: false,
      likeCount: 67,
      comments: [],
    },
    // Example with mixed media types
    {
      id: "5",
      author: {
        name: "Mixed Media",
        avatar: "https://img.icons8.com/color/48/user-male-circle--v5.png",
        timeAgo: "6h",
      },
      content: "Mixed media post with image, video, and YouTube!",
      tags: ["mixed", "media"],
      images: [
        {
          id: "1",
          url: "https://images.unsplash.com/photo-1548347480-50e99d864837?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Image",
          type: "image",
        },
        {
          id: "2",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          alt: "Video",
          type: "video",
        },
        {
          id: "3",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          alt: "YouTube",
          type: "youtube",
        },
      ],
      liked: true,
      likeCount: 156,
      comments: [],
    },
  ]);

  const handleLikePost = (postId: string, liked: boolean) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked,
              likeCount: liked ? post.likeCount + 1 : post.likeCount - 1,
            }
          : post
      )
    );
  };

  const handleAddComment = (postId: string, content: string) => {
    const newComment = {
      id: Date.now().toString(),
      author: "Current User",
      avatar: "https://img.icons8.com/color/48/user-male-circle--v5.png",
      content,
      timestamp: "Just now",
      likes: 0,
      liked: false,
      canDelete: true,
      replies: [],
      showReplies: false,
      showReplyInput: false,
    };

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [newComment, ...post.comments],
            }
          : post
      )
    );
    return newComment;
  };

  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      liked: !comment.liked,
                      likes: comment.liked
                        ? comment.likes - 1
                        : comment.likes + 1,
                    }
                  : comment
              ),
            }
          : post
      )
    );
  };
  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter(
                (comment) => comment.id !== commentId
              ),
            }
          : post
      )
    );
  };

  const handleAddReply = (
    postId: string,
    commentId: string,
    content: string
  ) => {
    const newReply = {
      id: `${commentId}-${Date.now()}`,
      author: "Current User",
      avatar: "https://img.icons8.com/color/48/user-male-circle--v5.png",
      content,
      timestamp: "Just now",
      canDelete: true,
      likes: 0,
      liked: false,
    };

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      replies: [...comment.replies, newReply],
                    }
                  : comment
              ),
            }
          : post
      )
    );
    return newReply;
  };

  const handleLikeReply = (
    postId: string,
    commentId: string,
    replyId: string
  ) => {
    console.log(postId, commentId, replyId);

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      replies: comment.replies.map((reply) =>
                        reply.id === replyId
                          ? {
                              ...reply,
                              liked: !reply.liked,
                              likes: reply.liked
                                ? reply.likes - 1
                                : reply.likes + 1,
                            }
                          : reply
                      ),
                    }
                  : comment
              ),
            }
          : post
      )
    );
  };
  const handleDeleteReply = (
    postId: string,
    commentId: string,
    replyId: string
  ) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      replies: comment.replies.filter(
                        (reply) => reply.id !== replyId
                      ),
                    }
                  : comment
              ),
            }
          : post
      )
    );
  };

  const handleShareClick = (postId: string) => {
    const postToShare = posts.find((post) => post.id === postId);

    if (postToShare) {
      if (navigator.share) {
        // Web Share API
        navigator
          .share({
            title: `Post by ${postToShare.author.name}`,
            text: postToShare.content,
            url: window.location.href,
          })
          .catch((err) => {
            console.error("Error sharing:", err);
          });
      } else {
        // Fallback for browsers without Share API
        console.log("Shared post:", postId);
        alert(
          `Sharing: "${postToShare.content}" by ${postToShare.author.name}`
        );
      }
    }
  };
  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      {posts.map((post) => (
        <Post
          key={post.id}
          author={post.author}
          content={post.content}
          tags={post.tags}
          extraComponent={
            <ApplyFollowRow
              onQuickApply={async () => {
                // call your API here
                // await fetch("/api/apply", { method: "POST", body: ... });
              }}
              onFollow={async (isFollowing) => {
                // call your API to follow/unfollow
                // await fetch(`/api/follow?follow=${isFollowing}`, { method: "POST" });
              }}
            />
          }
          options={[
            {
              title: "Share",
              action: () => console.log("Sharing post..."),
              icon: <Share />,
            },
            {
              title: "Report",
              action: () => alert("Reported!"),
              icon: <Bug />,
            },
            {
              title: "Save",
              action: () => console.log("Sharing post..."),
              icon: <BookmarkCheck />,
            },
          ]}
          images={post.images}
          initialLiked={post.liked}
          initialLikeCount={post.likeCount}
          initialComments={post.comments}
          onLikePost={(liked) => handleLikePost(post.id, liked)}
          onAddComment={(content) => handleAddComment(post.id, content)}
          onLikeComment={(commentId) => handleLikeComment(post.id, commentId)}
          onDeleteComment={(commentId) =>
            handleDeleteComment(post.id, commentId)
          }
          onAddReply={(commentId, content) =>
            handleAddReply(post.id, commentId, content)
          }
          onLikeReply={(commentId, replyId) =>
            handleLikeReply(post.id, commentId, replyId)
          }
          onDeleteReply={(commentId, replyId) =>
            handleDeleteReply(post.id, commentId, replyId)
          }
          onClickShare={() => handleShareClick(post.id)}
        />
      ))}
    </div>
  );
}

export default App;
