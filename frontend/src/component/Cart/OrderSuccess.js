import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './orderSuccess.css';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="orderSuccess">
        <CheckCircleIcon />

        <Typography>Your order has been Placed successfully</Typography>
        <Link to="/orders">View Order</Link>
    </div>
  )
}

export default OrderSuccess