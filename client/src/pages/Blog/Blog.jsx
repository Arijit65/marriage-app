import React, { useState } from 'react';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import MainHeader from '../../Components/mainHeader';

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "Best matrimony site for Bengali",
    excerpt: "If you are tired of the fake profiles and the unprofessional behaviours and the expensive fees, when you register on a matrimonial site...",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=200&fit=crop",
    category: "Uncategorized",
    date: "2024-12-15",
    author: "Admin"
  },
  {
    id: 2,
    title: "The Bengali bride look is a classic and traditional bridal look",
    excerpt: "When you opt for an arranged marriage one of the things you need to prepare with utmost care is the biodata...",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=200&fit=crop",
    category: "Uncategorized", 
    date: "2024-12-10",
    author: "Admin"
  },
  {
    id: 3,
    title: "High bengali matrimonial",
    excerpt: "Whenever non-Indian people hear about arranged marriages, they have some repressive, backwards, and illicit thoughts...",
    image: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=400&h=200&fit=crop",
    category: "Uncategorized",
    date: "2024-12-05", 
    author: "Admin"
  },
  {
    id: 4,
    title: "Tags bengali bride, bengali groom, matrimonial",
    excerpt: "Jewellery is an important element of the Bengali matrimonial; it reflects the wealth, prosperity...",
    image: "https://images.unsplash.com/photo-1594736797933-d0f6a1bc8b18?w=400&h=200&fit=crop",
    category: "Uncategorized",
    date: "2024-11-28",
    author: "Admin"
  },
  {
    id: 5,
    title: "Tags marriage paper",
    excerpt: "The traditional Indian marriage is well-off of beautiful traditions and gorgeous rituals that the adherents hold...",
    image: "https://images.unsplash.com/photo-1520637836862-4d197d17c989?w=400&h=200&fit=crop",
    category: "Uncategorized",
    date: "2024-11-20",
    author: "Admin"
  },
  {
    id: 6,
    title: "Tags marriage paper matrimonial site in bengali",
    excerpt: "Recent surveys and data reveal that 47% of customers use matrimonial sites to search for the perfect life partner...",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&h=200&fit=crop",
    category: "Uncategorized",
    date: "2024-11-15",
    author: "Admin"
  }
];

const categories = [
  { name: "Best matrimony site for Bengali", count: 12 },
  { name: "Uncategorized", count: 48 }
];

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const BlogCard = ({ post }) => (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{post.author}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <button className="inline-flex items-center gap-2 text-red-600 font-medium text-sm hover:text-red-700 transition-colors">
          Read More 
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     <MainHeader />    

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="bg-gray-800 rounded-lg p-6 text-white mb-6">
              <h3 className="text-lg font-semibold mb-4">By Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('All')}
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
                    onClick={() => setSelectedCategory(category.name)}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedCategory === category.name 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="truncate">{category.name}</span>
                    <span className="ml-2 text-xs">({category.count})</span>
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
              <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                Load More Posts
              </button>
            </div>
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
