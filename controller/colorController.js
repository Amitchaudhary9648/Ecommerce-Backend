const Color = require('../models/colorModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

const createColor = asyncHandler(async(req, res) => {
    try{
        const newColor = await Color.create(req.body);
        res.json(newColor);
    } catch(error){
        throw new Error(error)
    }
})

const updateColor = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const updatedColor = await Color.findByIdAndUpdate({_id: id}, req.body, {new: true});
        res.json(updatedColor);
    } catch(error){
        throw new Error(error)
    }
})

const deleteColor = asyncHandler(async(req, res) => {
    const {id} = req.params
    validateMongoDbId(id)
    try{
        const deletedColor = await Color.findByIdAndDelete({_id: id});
        res.json(deletedColor);
    } catch(error){
        throw new Error(error)
    }
})

const getColor = asyncHandler(async(req, res) => {
    const {id} = req.params
    try{
        const color = await Color.findById({_id: id})
        res.json(color)
    } catch(error){
        throw new Error(error)
    }
})

const getAllColor = asyncHandler(async(req, res) => {
    try{
        const categories = await Color.find()
        res.json(categories)
    } catch(error){
        throw new Error(error)
    }
})

module.exports = {createColor, updateColor, getColor, getAllColor, deleteColor}