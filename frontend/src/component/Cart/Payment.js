import React, { Fragment, useEffect, useRef, useState } from 'react'
import CheckoutSteps from './CheckoutSteps'
import Metadata from '../layout/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { Typography } from '@mui/material'
import { useAlert } from 'react-alert'
import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'
import './Payment.css'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useNavigate } from 'react-router-dom'
import {clearErrors, createOrder} from '../../actions/orderAction';



const Payment = () => {
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
    const payBtn = useRef(null);
    const dispatch = useDispatch(); 
    const alert = useAlert(); 
    const stripe = useStripe(); 
    const Element = useElements();
    const navigate = useNavigate();

    const {shippingInfo, cartItems}=useSelector((state) => state.cart);
    const {user} = useSelector((state) => state.user)
    const {error} = useSelector((state) => state.newOrder)

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100), 
    }

    const order = {
        shippingInfo, 
        orderItem: cartItems, 
        itemsPrice: orderInfo.subtotal, 
        taxPrice: orderInfo.tax, 
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice, 

    }

    const submitHandler = async (e) => {
        e.preventDefault();
        payBtn.current.disabled = false; 
        try {
            const config = {
                headers: {
                    "Content-Type" : "application/json",

                }
            }
            const {data} = await axios.post(
                "/api/v1/payment/process",
                paymentData, 
                config
            )

            const client_secret = await data.client_secret; 
            if(!stripe || !Element) return; 
            
            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: Element.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name, 
                        email: user.email, 
                        address: {
                            line1: shippingInfo.address, 
                            city: shippingInfo.city, 
                            state: shippingInfo.state, 
                            postal_code: shippingInfo.pinCode, 
                            country: shippingInfo.country
                        }
                    }
                }
            });

            if(result.error){
                {
                    payBtn.current.disabled = false; 
                    alert.error(result.error.message);
                }
            }else{
                if(result.paymentIntent.status === "succeeded"){
                    order.paymentInfo={
                        id: result.paymentIntent.id, 
                        status: result.paymentIntent.status
                    }
                    dispatch(createOrder(order))
                    navigate('/success');
                }else{
                    alert.error(`There is some issue while processing payment`);
                }
            }

            
        } catch (error) {
            console.log(error)
            payBtn.current.disabled = false; 
            alert.error(error.message)
        }        
    }

    useEffect(() => {
      if(error){
        alert.error(error)
        dispatch(clearErrors())
      }
    }, [dispatch, error, alert])
    

    return (
        <Fragment>
            <Metadata title="payment" />
            <CheckoutSteps activeStep={2} />
            <div className="paymentContainer">
                <form className='paymentForm' onSubmit={(e) => submitHandler(e)} >
                    <Typography>Card Info</Typography>
                    <div>
                        <CreditCardIcon />
                        <CardNumberElement name="cardNumber" className="paymentInput" />
                    </div>
                    <div>
                        <EventIcon />
                        <CardExpiryElement name="cardExpiry" className='paymentInput' />
                    </div>
                    <div>
                        <VpnKeyIcon />
                        <CardCvcElement name="cardCvc" className='paymentInput' />
                    </div>
                    <input
                        type="submit"
                        value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                        ref={payBtn}
                        className='paymentFormBtn'
                    />


                </form>
            </div>
        </Fragment>
    )
}

export default Payment