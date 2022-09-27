import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
title: {
type: String,
require: true
},
text: {
type: String,
require: true
},
date: {
type: Date,
default: Date.now
},
views: {
type: Number,
default: 0
},
imageUrl: String,

})



export default mongoose.model('post', postSchema);