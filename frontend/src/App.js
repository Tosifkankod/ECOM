import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import "./App.css";
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import webFont, { load } from "webfontloader";
import LoginSignUp from "./component/User/LoginSignUp";
import UserOptions from "./component/layout/Header/UserOptions.js";
import Profile from "./component/User/Profile.js";
import { useDispatch, useSelector } from "react-redux";
import store from "./store";
import { clearErrors, loadUser } from "./actions/userActions";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from "axios";
import Payment from "./component/Cart/Payment.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct.js";
import UpdateProduct from "./component/Admin/UpdateProduct.js";
import OrderList from "./component/Order/OrderList.js";
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import UsersList from "./component/User/UsersList.js";
import UpdateUser from "./component/User/UpdateUser.js";
import ProductReviews from "./component/Admin/ProductReviews.js";
import About from "./component/layout/About/About";
import Contact from "./component/layout/Contact/Contact";
import NotFound from './component/layout/NotFound/NotFound'

function App() {
  const dispatch = useDispatch();
  const [stripeApiKey, setstripeApiKey] = useState("");

  // GETTING USER DETAILS IF AVAILABLE
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  async function getStripeApiKey() {
    try {
      const { data } = await axios.get("/api/v1/stripeapikey");
      setstripeApiKey(data.stripeApiKey);
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    webFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    dispatch(loadUser("app.js"));
    getStripeApiKey();
  }, []);
  return (
    <BrowserRouter>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}

      <Routes>
        

        <Route exact path="/" element={<Home />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/login" element={<LoginSignUp />} />
        <Route exact path="/cart" element={<Cart />} />

        <Route exact path="/search" element={<Search />} />

        {/* Protected Routes  */}
        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              user={user}
              loading={loading}
            />
          }
        >
          <Route exact path="/account" element={<Profile />} />
          <Route exact path="/me/update" element={<UpdateProfile />} />
          <Route exact path="/password/update" element={<UpdatePassword />} />
          <Route exact path="/shipping" element={<Shipping />} />
          <Route exact path="/order/confirm" element={<ConfirmOrder />} />
          <Route exact path="/success" element={<OrderSuccess />} />
          <Route exact path="/orders" element={<MyOrders />} />
          <Route exact path="/order/:id" element={<OrderDetails />} />
          <Route exact path="/password/forgot" element={<ForgotPassword />} />
          <Route
            exact
            path="/password/reset/:token"
            element={<ResetPassword />}
          />
        </Route>

        {/* ADMIN ROUTES */}
        {stripeApiKey && (
          <Route
            path="/process/payment"
            element={ 
              <Elements stripe={loadStripe(stripeApiKey)}>
                <Payment />
              </Elements>
            }
          />
        )}

        <Route
          exact
          path="/admin/products"
          element={
            <ProtectedRoute
              isAdmin={true}
              isAuthenticated={isAuthenticated}
              loading={loading}
              user={user}
            >
              <ProductList />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/admin/product"
          element={
            <ProtectedRoute
              isAdmin={true}
              isAuthenticated={isAuthenticated}
              loading={loading}
              user={user}
            >
              <NewProduct />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/admin/product/:id"
          element={
            <ProtectedRoute
              isAdmin={true}
              isAuthenticated={isAuthenticated}
              loading={loading}
              user={user}
            >
              <UpdateProduct />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/admin/orders"
          element={
            <ProtectedRoute
              isAdmin={true}
              isAuthenticated={isAuthenticated}
              loading={loading}
              user={user}
            >
              <OrderList />
            </ProtectedRoute>
          }
        />

        <Route
          exact
          path="/admin/order/:id"
          element={
            <ProtectedRoute
              isAdmin={true}
              isAuthenticated={isAuthenticated}
              loading={loading}
              user={user}
            >
              <ProcessOrder />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/admin/users/"
          element={
            <ProtectedRoute
              isAdmin={true}
              isAuthenticated={isAuthenticated}
              loading={loading}
              user={user}
            >
              <UsersList />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/admin/user/:id"
          element={
            <ProtectedRoute
              isAdmin={true}
              isAuthenticated={isAuthenticated}
              loading={loading}
              user={user}
            >
              <UpdateUser />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/admin/reviews/"
          element={
            <ProtectedRoute
              isAdmin={true}
              isAuthenticated={isAuthenticated}
              loading={loading}
              user={user}
            >
              <ProductReviews />
            </ProtectedRoute>
          }
        />
        <Route
          exact
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              isAdmin={true}
              isAuthenticated={isAuthenticated}
              loading={loading}
              user={user}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route   
          path="*"
          element={<NotFound />}
        />          

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
