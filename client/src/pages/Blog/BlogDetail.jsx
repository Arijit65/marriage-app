import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  Eye, 
  Tag, 
  Clock, 
  Share2, 
  ArrowLeft, 
  Facebook, 
  Twitter, 
  Linkedin,
  ChevronRight,
  Heart,
  MessageCircle
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useApi } from '../../context/ApiContext';
import ResponsiveHeader from '../../Components/ResponsiveHeader';

// Server configuration
const SERVER_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Utility function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
  return `${SERVER_URL}${imagePath}`;
};

// Default placeholder image
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=400&fit=crop";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const { blogApi } = useApi();

  // Fetch blog details
  const fetchBlog = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await blogApi.getPublishedBlog(slug);
      if (response.success) {
        setBlog(response.data.blog);
        fetchRelatedBlogs(response.data.blog.category);
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  }, [slug, blogApi]);

  // Fetch related blogs
  const fetchRelatedBlogs = React.useCallback(async (category) => {
    try {
      const response = await blogApi.getPublishedBlogs({ 
        category, 
        limit: 3 
      });
      if (response.success) {
        setRelatedBlogs(response.data.blogs.filter(b => b.slug !== slug).slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  }, [blogApi, slug]);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug, fetchBlog]);

  // Share functions
  const shareUrl = window.location.href;
  const shareTitle = blog?.title || '';

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    // You could add a toast notification here
  };

  // Toggle like
  const toggleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically call an API to save the like
  };

  // Format content with proper line breaks
  const formatContent = (content) => {
    if (!content) return '';
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ResponsiveHeader />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <span className="ml-3 text-gray-600">Loading blog post...</span>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ResponsiveHeader />
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-20 text-center">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'The blog post you are looking for does not exist or has been removed.'}
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ResponsiveHeader />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/blog" className="hover:text-red-600 transition-colors">Blog</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 truncate">{blog.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Content */}
          <main>
            <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Featured Image */}
              {blog.featured_image && (
                <div className="relative">
                  <img
                    src={getImageUrl(blog.featured_image) || DEFAULT_IMAGE}
                    alt={blog.title}
                    className="w-full h-64 md:h-80 object-cover"
                    onError={(e) => {
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {blog.category}
                    </span>
                  </div>
                  {blog.is_featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{blog.author_name || 'Admin'}</span>
                  </div>
                  {blog.views_count > 0 && (
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{blog.views_count} views</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{Math.ceil((blog.content?.length || 0) / 1000)} min read</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {blog.title}
                </h1>

                {/* Excerpt */}
                {blog.excerpt && (
                  <div className="text-xl text-gray-600 mb-8 font-light leading-relaxed border-l-4 border-red-500 pl-6">
                    {blog.excerpt}
                  </div>
                )}

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex items-center gap-2 mb-8">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  {formatContent(blog.content)}
                </div>

                {/* Additional Images */}
                {blog.images && blog.images.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Images</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {blog.images.map((image, index) => (
                        <img
                          key={index}
                          src={getImageUrl(image)}
                          alt={`Additional image ${index + 1}`}
                          className="rounded-lg w-full h-48 object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={toggleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isLiked 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{blog.likes_count || 0}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 mr-2">Share:</span>
                    <button
                      onClick={shareOnFacebook}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Share on Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </button>
                    <button
                      onClick={shareOnTwitter}
                      className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Share on Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </button>
                    <button
                      onClick={shareOnLinkedIn}
                      className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy link"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Author Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{blog.author_name || 'Admin'}</h4>
                  <p className="text-sm text-gray-600">Content Author</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Expert in matrimonial services and relationship guidance, sharing insights 
                about finding the perfect life partner.
              </p>
            </div>

            {/* Related Posts */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Posts</h3>
                <div className="space-y-4">
                  {relatedBlogs.map((relatedBlog) => (
                    <Link
                      key={relatedBlog.id}
                      to={`/blog/${relatedBlog.slug || relatedBlog.id}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <img
                          src={getImageUrl(relatedBlog.featured_image) || DEFAULT_IMAGE}
                          alt={relatedBlog.title}
                          className="w-20 h-20 rounded object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.src = DEFAULT_IMAGE;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                            {relatedBlog.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(relatedBlog.published_at || relatedBlog.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-red-600 text-sm font-medium mt-4 hover:text-red-700 transition-colors"
                >
                  View all posts
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
              <p className="text-sm text-gray-600 mb-4">
                Subscribe to get the latest blog posts and matrimonial tips.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;