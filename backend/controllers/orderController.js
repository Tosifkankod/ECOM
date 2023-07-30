const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create New Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  })

  res.status(200).json({
    success :true, 
    order
  })

});


// get Single Order
exports.getSingleOrder  = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    console.log(order)

    if(!order){
        return next(new ErrorHandler("order Not found with this Id", 404));
    }

    res.status(200).json({
        success: true, 
        order
    })
  
})

// get loggedinUser Order

exports.myOrder  = catchAsyncErrors(async (req, res, next) => {
    console.log(req.user);
    const order = await Order.find({user: req.user._id})
    console.log(order)

    res.status(200).json({
        success: true, 
        order
    })
  
})

// get All Orders --Admin
exports.getAllOrders  = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()

    let totalAmount = 0; 

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success: true, 
        totalAmount,
        orders
    })
  
})

//update Order Status --Admin
exports.updateOrder  = catchAsyncErrors(async (req, res, next) => {
    
    const order = await Order.findById(req.params.id )
    if(!order){
        return next(new ErrorHandler("order Not found with this Id", 404));
    }

    if(order.orderStatus == "Delivered"){
        return next(new ErrorHandler("you have already deliver this order", 400))
    }

    if(req.body.status === "shipped"){
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity)      
        })
    }

    order.orderStatus = req.body.status; 

    if(order.orderStatus == "Delivered"){
        order.deliveredAt = Date.now();

    }

    await order.save({validateBeforesave: false});

    res.status(200).json({
        success: true, 
    })
  
})

async function updateStock (id, quantity){
    const product = await Product.findById(id);

    product.stock -= quantity;

    await product.save({validateBeforeSave: false})
}


// get delete Order
exports.deleteOrder  = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id)

    if(!order){
        return next(new ErrorHandler("order Not found with this Id", 404));
    }


    res.status(200).json({
        success: true, 
        order
    })
  
})
