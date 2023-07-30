import { Outlet, Navigate } from 'react-router-dom';

const StripeLayout = ({ stripeApiKey }) => {
  return stripeApiKey
    ? <Outlet />
    : <Navigate to="/" replace />
};

export default StripeLayout;