import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNewsletterSubscribers } from '@/store/email-slice';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const NewsletterSubscribers = () => {
  const dispatch = useDispatch();
  const { isLoading, subscribers, error } = useSelector(state => state.email);

  useEffect(() => {
    dispatch(getNewsletterSubscribers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (isLoading) {
    return <p>Loading subscribers...</p>;
  }

  if (error) {
    return <p className="text-red-500">Failed to load subscribers.</p>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Newsletter Subscribers 👥</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferences</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(subscribers) && subscribers.length > 0 ? (
              subscribers.map(subscriber => (
                <tr key={subscriber._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subscriber.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subscriber.firstName} {subscriber.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subscriber.preferences && Object.entries(subscriber.preferences).filter(([, value]) => value).map(([key]) => (
                      <span key={key} className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                        {key}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(subscriber.createdAt), 'MMM d, yyyy')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No active subscribers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsletterSubscribers;