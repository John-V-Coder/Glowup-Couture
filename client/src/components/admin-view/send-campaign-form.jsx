import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMarketingCampaign, clearEmailStatus } from '@/store/email-slice';
import { toast } from 'react-toastify';

const SendCampaignForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    ctaText: 'Shop Now',
    ctaUrl: '/shop/listing?category=products', // Example
  });
  const dispatch = useDispatch();
  const { isLoading, campaignStatus, successMessage, error } = useSelector(state => state.email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.content) {
      dispatch(sendMarketingCampaign(formData));
    }
  };

  useEffect(() => {
    if (campaignStatus === 'success') {
      toast.success(successMessage);
      setFormData({ title: '', content: '', ctaText: 'Shop Now', ctaUrl: `${import.meta.env.VITE_API_URL}` });
    } else if (campaignStatus === 'failed') {
      toast.error(error);
    }
    dispatch(clearEmailStatus());
  }, [campaignStatus, successMessage, error, dispatch]);

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Send Marketing Campaign 📢</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="5"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Call to Action Text</label>
          <input
            type="text"
            name="ctaText"
            value={formData.ctaText}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Call to Action URL</label>
          <input
            type="url"
            name="ctaUrl"
            value={formData.ctaUrl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Sending...' : 'Send Campaign'}
        </button>
      </form>
    </div>
  );
};

export default SendCampaignForm;