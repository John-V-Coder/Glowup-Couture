import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmailTemplates,
  saveEmailTemplate,
  sendMarketingCampaign,
  clearEmailStatus,
  clearError,
} from "@/store/email-slice";

export default function AdminNewsletterPage() {
  const dispatch = useDispatch();
  const {
    templates= [],
    isLoading,
    error,
    successMessage,
  } = useSelector((state) => state.email);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    htmlContent: "",
  });
  const [campaignData, setCampaignData] = useState({
    templateId: "",
    recipients: "",
    scheduledAt: "",
  });

  // Load templates when page loads
  useEffect(() => {
    dispatch(getEmailTemplates());
  }, [dispatch]);

  // Handle form input changes
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save or update template
  const handleSaveTemplate = (e) => {
    e.preventDefault();
    dispatch(saveEmailTemplate(formData));
  };

  // Select template for editing
  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      htmlContent: template.htmlContent,
    });
  };

  // Reset form for new template
  const handleNewTemplate = () => {
    setSelectedTemplate(null);
    setFormData({ name: "", subject: "", htmlContent: "" });
  };

  // Handle campaign form change
  const handleCampaignChange = (e) => {
    setCampaignData({ ...campaignData, [e.target.name]: e.target.value });
  };

  // Send marketing campaign
  const handleSendCampaign = (e) => {
    e.preventDefault();
    dispatch(sendMarketingCampaign(campaignData));
  };

  // Clear messages after a while
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearEmailStatus());
        dispatch(clearError());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">📨 Admin Newsletter Manager</h1>

      {/* Status Messages */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Email Template Form */}
      <section className="mb-8 p-4 border rounded-lg bg-white shadow">
        <h2 className="text-xl font-semibold mb-4">
          {selectedTemplate ? "Edit Template" : "Create New Template"}
        </h2>
        <form onSubmit={handleSaveTemplate} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Template Name"
            value={formData.name}
            onChange={handleFormChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Email Subject"
            value={formData.subject}
            onChange={handleFormChange}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="htmlContent"
            placeholder="HTML Content"
            value={formData.htmlContent}
            onChange={handleFormChange}
            rows={8}
            className="w-full p-2 border rounded font-mono"
            required
          ></textarea>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Template"}
            </button>
            {selectedTemplate && (
              <button
                type="button"
                onClick={handleNewTemplate}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                New Template
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Existing Templates */}
      {/* Existing Templates */}
<section className="mb-8 p-4 border rounded-lg bg-white shadow">
  <h2 className="text-xl font-semibold mb-4">Saved Templates</h2>
  
  {templates && templates.length > 0 ? (
    <ul className="space-y-2">
      {templates.map((template) => (
        <li
          key={template._id}
          className="p-3 border rounded flex justify-between items-center hover:bg-gray-50"
        >
          <div>
            <strong>{template.name}</strong> — {template.subject}
          </div>
          <button
            onClick={() => handleEditTemplate(template)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
        </li>
      ))}
    </ul>
  ) : (
    <p>No templates found.</p>
  )}
</section>

      {/* Send Marketing Campaign */}
      <section className="p-4 border rounded-lg bg-white shadow">
        <h2 className="text-xl font-semibold mb-4">Send Campaign</h2>
        <form onSubmit={handleSendCampaign} className="space-y-4">
          <select
            name="templateId"
            value={campaignData.templateId}
            onChange={handleCampaignChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Template</option>
            {templates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name}
              </option>
            ))}
          </select>
          <textarea
            name="recipients"
            placeholder="Recipient emails, comma separated"
            value={campaignData.recipients}
            onChange={handleCampaignChange}
            rows={3}
            className="w-full p-2 border rounded"
            required
          ></textarea>
          <input
            type="datetime-local"
            name="scheduledAt"
            value={campaignData.scheduledAt}
            onChange={handleCampaignChange}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Campaign"}
          </button>
        </form>
      </section>
    </div>
  );
}
