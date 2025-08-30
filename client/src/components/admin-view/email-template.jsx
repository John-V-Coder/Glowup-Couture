import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmailTemplates, saveEmailTemplate, clearEmailStatus } from '@/store/email-slice'; 
import { toast } from 'react-toastify';

const EmailTemplatesManager = () => {
  const dispatch = useDispatch();
  const { isLoading, templates, successMessage, error } = useSelector(state => state.email);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    htmlContent: '',
    textContent: '',
    category: '',
    variables: []
  });
  const [editingTemplateId, setEditingTemplateId] = useState(null);

  useEffect(() => {
    dispatch(getEmailTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      // Clear form after successful save
      setFormData({
        name: '',
        subject: '',
        htmlContent: '',
        textContent: '',
        category: '',
        variables: []
      });
      setEditingTemplateId(null);
    }
    if (error) {
      toast.error(error);
    }
    dispatch(clearEmailStatus());
  }, [successMessage, error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleEdit = (template) => {
    setEditingTemplateId(template._id);
    setFormData({
      name: template.name,
      subject: template.subject,
      htmlContent: template.htmlContent,
      textContent: template.textContent,
      category: template.category,
      variables: template.variables || []
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(saveEmailTemplate({ ...formData, templateId: editingTemplateId }));
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Manage Email Templates 📋</h2>
      {isLoading && <p>Loading templates...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-disc pl-5 mb-4">
        {Array.isArray(templates) && templates.map(template => (
          <li key={template._id} className="mb-2">
            <span className="font-semibold">{template.name}</span> ({template.category})
            <button
              onClick={() => handleEdit(template)}
              className="ml-4 px-2 py-1 text-xs text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Template Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">HTML Content</label>
          <textarea name="htmlContent" value={formData.htmlContent} onChange={handleChange} rows="5" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Text Content</label>
          <textarea name="textContent" value={formData.textContent} onChange={handleChange} rows="5" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Saving...' : (editingTemplateId ? 'Update Template' : 'Add New Template')}
        </button>
      </form>
    </div>
  );
};

export default EmailTemplatesManager;