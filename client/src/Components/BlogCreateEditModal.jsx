import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Save,
  Eye,
  Tag,
  FileText,
  Image as ImageIcon,
  Globe,
  Star,
  AlertCircle
} from 'lucide-react';
import { useApi } from '../context/ApiContext';

// Server configuration
const SERVER_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Utility function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
  return `${SERVER_URL}${imagePath}`;
};

const BlogCreateEditModal = ({ isOpen, onClose, onBlogSaved, blog = null, categories = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    status: 'draft',
    is_featured: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentTab, setCurrentTab] = useState('content');

  const { blogApi } = useApi();

  // Initialize form data when blog prop changes
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        category: blog.category || '',
        tags: blog.tags || [],
        status: blog.status || 'draft',
        is_featured: blog.is_featured || false,
        meta_title: blog.meta_title || '',
        meta_description: blog.meta_description || '',
        meta_keywords: blog.meta_keywords || ''
      });
      setImagePreview(getImageUrl(blog.featured_image));
      setAdditionalImagePreviews(blog.images ? blog.images.map(img => getImageUrl(img)) : []);
    } else {
      // Reset form for new blog
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        tags: [],
        status: 'draft',
        is_featured: false,
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
      });
      setImagePreview('');
      setAdditionalImagePreviews([]);
    }
    setImages([]);
    setTagInput('');
    setErrors({});
  }, [blog]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from title
    if (name === 'title' && !formData.slug) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isValidType) {
        console.warn(`File ${file.name} is not a valid image type`);
        return false;
      }
      if (!isValidSize) {
        console.warn(`File ${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      alert('Please select valid image files (max 10MB each)');
      return;
    }

    console.log(`Processing ${validFiles.length} valid image files`);
    setImages(validFiles);

    // Preview first image as featured
    if (validFiles[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('Featured image preview loaded');
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(validFiles[0]);
    }

    // Preview additional images
    if (validFiles.length > 1) {
      const additionalPreviews = [];
      let loadedCount = 0;
      
      validFiles.slice(1).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          additionalPreviews[index] = e.target.result;
          loadedCount++;
          
          if (loadedCount === validFiles.length - 1) {
            console.log(`Loaded ${additionalPreviews.length} additional image previews`);
            setAdditionalImagePreviews(additionalPreviews.filter(Boolean));
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setAdditionalImagePreviews([]);
    }

    // Reset file input
    e.target.value = '';
  };

  // Handle tag addition
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        setTagInput('');
      }
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (formData.content.trim().length < 50) {
      newErrors.content = 'Content must be at least 50 characters long';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setCurrentTab('content'); // Switch to content tab if there are errors
      return;
    }

    setLoading(true);
    try {
      const blogData = { ...formData, images };
      console.log('Submitting blog data:', {
        ...blogData,
        images: images.map(img => ({ name: img.name, size: img.size, type: img.type }))
      });

      let response;
      if (blog) {
        console.log('Updating blog with ID:', blog.id);
        response = await blogApi.updateBlog(blog.id, blogData);
      } else {
        console.log('Creating new blog');
        response = await blogApi.createBlog(blogData);
      }

      console.log('API response:', response);

      if (response.success) {
        console.log('Blog saved successfully');
        onBlogSaved();
      } else {
        console.error('Failed to save blog:', response.error);
        setErrors({ submit: response.error });
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  // Handle publish
  const handlePublish = async () => {
    const tempStatus = formData.status;
    setFormData(prev => ({ ...prev, status: 'published' }));
    
    // Submit with published status
    await handleSubmit(new Event('submit'));
    
    // Restore original status if failed
    if (errors.submit) {
      setFormData(prev => ({ ...prev, status: tempStatus }));
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'media', label: 'Media', icon: ImageIcon }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h3>
              <p className="text-sm text-gray-500">
                {blog ? 'Update your blog post content and settings' : 'Write and publish a new blog post'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      currentTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6 max-h-96 overflow-y-auto">
              {errors.submit && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Tab */}
              {currentTab === 'content' && (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter blog title..."
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="url-friendly-slug"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Enter category..."
                      list="categories"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.category ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <datalist id="categories">
                      {categories.map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Brief description of the blog post..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={12}
                      placeholder="Write your blog content here..."
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.content ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Type tag and press Enter or comma..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Settings */}
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Featured Post
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {currentTab === 'seo' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleInputChange}
                      placeholder="SEO title for search engines..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Brief description for search engine results..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      name="meta_keywords"
                      value={formData.meta_keywords}
                      onChange={handleInputChange}
                      placeholder="SEO keywords, separated by commas..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {currentTab === 'media' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Images (Multiple supported)
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      First image will be used as featured image. You can upload up to 10 images.
                    </p>
                    <div className="mt-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          {imagePreview ? (
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Featured Image:</h4>
                                <img
                                  src={imagePreview}
                                  alt="Featured preview"
                                  className="mx-auto h-40 w-auto rounded-lg shadow-sm"
                                />
                              </div>
                              
                              {additionalImagePreviews.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Images:</h4>
                                  <div className="flex flex-wrap gap-2 justify-center">
                                    {additionalImagePreviews.map((preview, index) => (
                                      <img
                                        key={index}
                                        src={preview}
                                        alt={`Additional preview ${index + 1}`}
                                        className="h-20 w-20 rounded-lg object-cover shadow-sm"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <p className="text-sm text-gray-600">Click to change images</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="text-sm text-gray-600">Click to upload images</p>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                    
                    {(imagePreview || additionalImagePreviews.length > 0) && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            setImages([]);
                            setImagePreview('');
                            setAdditionalImagePreviews([]);
                          }}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove all images
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
                >
                  Cancel
                </button>
                
                {formData.status === 'draft' && (
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none disabled:opacity-50"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {loading ? 'Publishing...' : 'Publish'}
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : blog ? 'Update' : 'Save Draft'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogCreateEditModal;