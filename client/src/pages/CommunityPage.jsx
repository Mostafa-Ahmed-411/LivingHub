import React, { useState } from "react";
import {
  Image as ImgIcon,
  MapPin,
  MoreVertical,
  ThumbsUp,
  MessageCircle,
  Share2,
  Flag
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Btn from "../components/common/Btn";
import { communityPosts } from "../constants/staticData";

export default function CommunityPage({ onNavigate }) {
  const [posts, setPosts] = useState(communityPosts);
  const [draft, setDraft] = useState("");

  const toggleLike = (id) =>
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navbar onNavigate={onNavigate} currentPage="community" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Community
          </h1>
          <p className="text-gray-500">Connect with fellow students and share your housing experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Create Post */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex gap-3 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format"
                  alt="You"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <textarea
                  placeholder="Share something with the community..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  className="flex-1 resize-none bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <ImgIcon className="w-4 h-4" /> Photo
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <MapPin className="w-4 h-4" /> Location
                  </button>
                </div>
                <Btn variant="primary" size="sm" disabled={!draft.trim()}>
                  Post
                </Btn>
              </div>
            </div>

            {/* Posts List */}
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{post.author}</p>
                    <p className="text-xs text-gray-400">
                      {post.university} &middot; {post.time}
                    </p>
                  </div>
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <p className="text-gray-800 text-sm leading-relaxed mb-3">{post.content}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-5 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      post.liked ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${post.liked ? "fill-current" : ""}`} />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                    <MessageCircle className="w-4 h-4" /> {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                    <Share2 className="w-4 h-4" /> {post.shares}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors ml-auto">
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">Trending Topics</h3>
              <div className="space-y-1.5">
                {["#NewCairo", "#ZamalekLife", "#CairoUniversity", "#StudentTips", "#RoommateFinder"].map(
                  (tag, i) => (
                    <button
                      key={tag}
                      className="flex items-center justify-between w-full p-2.5 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <span className="text-sm text-blue-600 font-semibold">{tag}</span>
                      <span className="text-xs text-gray-400">{[124, 98, 87, 76, 65][i]} posts</span>
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="bg-blue-600 rounded-2xl p-5 text-white">
              <h3 className="font-semibold mb-2 text-sm">Looking for a roommate?</h3>
              <p className="text-blue-200 text-xs mb-4">
                Post in the community and find your perfect match.
              </p>
              <button className="w-full bg-white text-blue-700 font-semibold text-sm rounded-xl py-2.5 hover:bg-blue-50 transition-colors">
                Post Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
