import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, ArrowRight, Eye, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=200&fit=crop";

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { blogApi } = useApi();

  // Fetch published blogs
  const fetchBlogs = async (page = 1, resetData = false) => {
    setLoading(true);
    try {
      const filters = {
        page,
        limit: 6,
        search: searchTerm || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined
      };

      const response = await blogApi.getPublishedBlogs(filters);
      if (response.success) {
        if (resetData || page === 1) {
          setBlogs(response.data.blogs);
        } else {
          setBlogs(prev => [...prev, ...response.data.blogs]);
        }
        setTotalPages(response.data.pagination.pages);
        setHasMore(page < response.data.pagination.pages);
      } else {
        console.error('Failed to fetch blogs:', response.error);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await blogApi.getCategories();
      if (response.success) {
        setCategories(response.data.categories.map(cat => ({ name: cat, count: 0 })));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch featured blogs
  const fetchFeaturedBlogs = async () => {
    try {
      const response = await blogApi.getFeaturedBlogs(3);
      if (response.success) {
        setFeaturedBlogs(response.data.blogs);
      }
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchBlogs(1, true);
    fetchCategories();
    fetchFeaturedBlogs();
  }, [selectedCategory]);

  // Search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchBlogs(1, true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Load more blogs
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchBlogs(nextPage, false);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Truncate text helper
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const filteredPosts = blogs;

  const BlogCard = ({ post }) => (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img 
          src={getImageUrl(post.featured_image) || DEFAULT_IMAGE} 
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = DEFAULT_IMAGE;
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            {post.category}
          </span>
        </div>
        {post.is_featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{post.author_name || 'Admin'}</span>
          </div>
          {post.views_count > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{post.views_count} views</span>
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.excerpt || truncateText(post.content)}
        </p>
        
        <Link 
          to={`/blog/${post.slug || post.id}`}
          className="inline-flex items-center gap-2 text-red-600 font-medium text-sm hover:text-red-700 transition-colors"
        >
          Read More 
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     <ResponsiveHeader />    

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="bg-gray-800 rounded-lg p-6 text-white mb-6">
              <h3 className="text-lg font-semibold mb-4">By Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('All')}
                  className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedCategory === 'All' 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  All Posts
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedCategory === category.name 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="truncate">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main>
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
              <p className="text-gray-600">Stay Updated with Blog</p>
            </div>

            {/* Blog Grid */}
            {loading && blogs.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <span className="ml-3 text-gray-600">Loading blogs...</span>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No blogs found</h3>
                <p className="text-gray-600">
                  {searchTerm || selectedCategory !== 'All'
                    ? 'Try adjusting your search or category filters.'
                    : 'No published blogs available at the moment.'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && filteredPosts.length > 0 && (
              <div className="text-center mt-12">
                <button 
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    'Load More Posts'
                  )}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img 
                src="https://www.marriagepaper.com/image/logo2.png" 
                alt="MarriagePaper" 
                className="h-8 mb-4 brightness-0 invert"
              />
              <p className="text-sm">
                MarriagePaper.com is India's Only Newspaper Like Matrimonial AD Service On Internet. 
                It is an OPEN AD PLATFORM where you can post your ad along with contacting the Advertisers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Search By Gender</h4>
              <div className="space-y-2 text-sm">
                <div><a href="#" className="hover:text-white transition-colors">Bride</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Groom</a></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Search By Religion</h4>
              <div className="space-y-2 text-sm">
                <div><a href="#" className="hover:text-white transition-colors">Hindu</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Christian</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Muslim</a></div>
                <div><a href="#" className="hover:text-white transition-colors">View All</a></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Search By Community</h4>
              <div className="space-y-2 text-sm">
                <div><a href="#" className="hover:text-white transition-colors">Bengali</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Punjabi</a></div>
                <div><a href="#" className="hover:text-white transition-colors">View All</a></div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 All Rights Reserved © MarriagePaper.com [H24K] Regd No : LBA- VIN800007426]</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;
