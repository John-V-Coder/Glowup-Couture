import { subscribeToNewsletter } from '@/store/email-slice';
import { useDispatch, useSelector } from 'react-redux';


export const useEmail = () => {
  const dispatch = useDispatch();
  const { isLoading, message, error } = useSelector((state) => state.email);

  const subscribe = (email) => {
    dispatch(subscribeToNewsletter(email));
  };

  return {
    subscribe,
    isLoading,
    message,
    error
  };
};