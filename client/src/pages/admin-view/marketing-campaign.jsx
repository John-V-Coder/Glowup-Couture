// src/components/admin/MarketingCampaigns.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMarketingCampaign, getEmailTemplates, clearEmailStatus } from '../../store/email-slice';
import { toast } from 'react-toastify';

const MarketingCampaigns = () => {
  const [campaignData, setCampaignData] = useState({
    title: '',
    content: '',
    ctaText: 'Shop Now',
    ctaUrl: '',
    targetAudience: 'all',
  });
  const [activeTab, setActiveTab] = useState('create');
  const [previewMode, setPreviewMode] = useState(false);

  const dispatch = useDispatch();
  const { 
    isLoading, 
    campaignStatus, 
    templates, 
    successMessage, 
    error 
  } = useSelector(state => state.email);

  useEffect(() => {
    dispatch(getEmailTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (campaignStatus === 'success') {
      toast.success(successMessage || 'Marketing campaign sent successfully!');
      resetForm();
      dispatch(clearEmailStatus());
    }
    if (campaignStatus === 'failed') {
      toast.error(error || 'Failed to send marketing campaign');
      dispatch(clearEmailStatus());
    }
  }, [campaignStatus, successMessage, error, dispatch]);

  const resetForm = () => {
    setCampaignData({
      title: '',
      content: '',
      ctaText: 'Shop Now',
      ctaUrl: '',
      targetAudience: 'all',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampaignData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!campaignData.title || !campaignData.content) {
      toast.error('Please fill in required fields');
      return;
    }

    // Prepare payload according to backend expectations
    const payload = {
      title: campaignData.title,
      content: campaignData.content,
      ctaText: campaignData.ctaText,
      ctaUrl: campaignData.ctaUrl || `${window.location.origin}`,
      targetAudience: campaignData.targetAudience
    };

    dispatch(sendMarketingCampaign(payload));
  };

  const targetAudienceOptions = [
    { value: 'all', label: 'All Subscribers', count: '2,847' },
    { value: 'customers', label: 'Customers Only', count: '1,234' },
    { value: 'newsletter', label: 'Newsletter Subscribers', count: '1,613' },
    { value: 'recent', label: 'Recent Customers (30 days)', count: '456' },
    { value: 'inactive', label: 'Inactive Customers', count: '789' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Campaign
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Campaign History
            </button>
          </nav>
        </div>

        {activeTab === 'create' && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Marketing Campaign</h2>
              <p className="text-gray-600">Design and send targeted email campaigns to your subscribers.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <select
                    id="targetAudience"
                    name="targetAudience"
                    value={campaignData.targetAudience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {targetAudienceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label} ({option.count} recipients)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Content</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={campaignData.title}
                      onChange={handleInputChange}
                      placeholder="Main headline for your campaign"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Content *
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={campaignData.content}
                      onChange={handleInputChange}
                      rows="6"
                      placeholder="Write your campaign message here..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ctaText" className="block text-sm font-medium text-gray-700 mb-2">
                        Call-to-Action Text
                      </label>
                      <input
                        type="text"
                        id="ctaText"
                        name="ctaText"
                        value={campaignData.ctaText}
                        onChange={handleInputChange}
                        placeholder="Shop Now"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="ctaUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Call-to-Action Link
                      </label>
                      <input
                        type="url"
                        id="ctaUrl"
                        name="ctaUrl"
                        value={campaignData.ctaUrl}
                        onChange={handleInputChange}
                        placeholder="https://your-website.com/promotion"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {previewMode ? 'Edit' : 'Preview'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      isLoading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Campaign'
                    )}
                  </button>
                </div>
              </div>
            </form>

            {previewMode && (
              <div className="mt-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">Email Preview</h3>
                <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
                  <div className="text-center border-b pb-4 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">GlowUp Couture</h1>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {campaignData.title || 'Campaign Title'}
                  </h2>
                  
                  <div className="text-gray-700 mb-6 whitespace-pre-wrap">
                    {campaignData.content || 'Campaign content will appear here...'}
                  </div>
                  
                  {campaignData.ctaUrl && (
                    <div className="text-center mb-6">
                      <a
                        href={campaignData.ctaUrl}
                        className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                      >
                        {campaignData.ctaText}
                      </a>
                    </div>
                  )}
                  
                  <div className="text-center text-sm text-gray-500 border-t pt-4">
                    <p>© 2024 GlowUp Couture. All rights reserved.</p>
                    <p className="mt-1">
                      <a href="#" className="text-blue-600 hover:underline">Unsubscribe</a> | 
                      <a href="#" className="text-blue-600 hover:underline ml-2">Update Preferences</a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign History</h2>
              <p className="text-gray-600">View and manage your past marketing campaigns.</p>
            </div>
            
            <div className="bg-white border rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Recent Campaigns</h3>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                      Filter
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                      Export
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {/* Sample campaign history items */}
                <div className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Summer Sale 2024</h4>
                      <p className="text-sm text-gray-500">Sent to 2,847 subscribers • 3 days ago</p>
                      <div className="mt-2 flex space-x-4 text-sm text-gray-600">
                        <span>📧 Open Rate: 24.5%</span>
                        <span>👆 Click Rate: 5.2%</span>
                        <span>💰 Conversion: 2.1%</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Delivered
                      </span>
                      <button className="text-blue-600 hover:text-blue-700 text-sm">View Details</button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">New Arrivals Newsletter</h4>
                      <p className="text-sm text-gray-500">Sent to 1,613 subscribers • 1 week ago</p>
                      <div className="mt-2 flex space-x-4 text-sm text-gray-600">
                        <span>📧 Open Rate: 28.3%</span>
                        <span>👆 Click Rate: 7.1%</span>
                        <span>💰 Conversion: 3.4%</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Delivered
                      </span>
                      <button className="text-blue-600 hover:text-blue-700 text-sm">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingCampaigns;