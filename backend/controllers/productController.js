const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");


// Create Product -- Admin
exports.createProduct = catchAsyncError(async(req,res,next)=>{
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    });

});

// Get All Products
exports.getAllProducts = catchAsyncError(async(req,res)=>{
    const resultPerPage = 5;
    const productCount = Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeatures.query;

    res.status(200).json({
        success:true,
        products
    });
});

// Get Product Details
exports.getProductDetails = catchAsyncError(async(req,res,next)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found",404));
    }

    res.status(200).json({
        success:true,
        product,
        productCount
    });

});

//Update Product -- Admin

exports.updateProduct = catchAsyncError(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found",404));
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true,
            useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product
    })
});

// Delete Product

exports.deleteProduct = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found",404));
    }

    await product.deleteOne();

    res.status(200).json({
        success:true,
        message:"Product Deleted"
    })
});