import postModel from '../models/post.js';

export const create = async (req, res) => {
const post = new postModel({
    title: req.body.title,
    text: req.body.text,
    imageUrl: `/${req.file.filename}`
})

try {
    await post.save()
    res.status(201).json(post)
} catch (e) {
    res.status(500).json(e)
}
}