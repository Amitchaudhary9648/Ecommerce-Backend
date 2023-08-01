const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req, res) => {
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch(error){
        throw new Error(error);
    }
})

const updateProduct = asyncHandler(async (req, res) => {
    try{
        const id = req.params
        console.log(id)
        const _id = id.id
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const updateProduct = await Product.findOneAndUpdate({_id} , req.body, {
            new: true,
        })
        if(updateProduct){
            res.json(updateProduct);
        }
        else {
            res.json({
                message: "Product not found with particular id, Please check once if the product exist"
            })
        }
    } catch(error){
        throw new Error(error);
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    try{
        const id = req.params
        console.log(id)
        const _id = id.id
        const deletedProduct = await Product.findOneAndDelete({_id})
        console.log(deleteProduct)
        res.json(deletedProduct);
    } catch(error){
        throw new Error(error);
    }
})

const getaProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try{
        const findProduct = await Product.findById(id)
        res.json(findProduct);
    } catch(error){
        throw new Error(error)
    }
})

const getallProduct = asyncHandler(async (req, res) => {
    try{
        const queryObj = { ...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el])
        
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte| gt|lte|lt)\b/g, (match) => `$${match}`);
        console.log() 

        let query = Product.find(JSON.parse(queryStr))

        // Sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy)
        } else {
            query = query.sort("-createdAt");
        }

        // limiting the fields
        if(req.query.fields){
            const fields =  req.query.fields.split(",").join(" ")
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        //Pagination 
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip >= productCount) throw new Error("This page doesn't exist")
        }


        const product = await query;
        res.json(product);
    } catch(error){
        throw new Error(error)
    }
})

module.exports = {createProduct, getaProduct, getallProduct, updateProduct, deleteProduct};