const router = require('express').Router();
const Category = require('../Models/Category');


//Make a new category
router.post('/new_stream', async (req, res)=>{
    const {body: {sub_categories, entries}} = req;
    try{
        const newCat = new Category({
            stream: req.body.stream,
            sub_categories: req.body.sub_categories,
            entries,                  
        });
        const category = await newCat.save();
        res.status(200).json(category);
    } catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

//new_sub
router.post('/new_sub', async (req, res)=>{
    const {body:{sub_category, stream}} = req;
    try {
        const add_new_sub = await Category.updateOne({
            "stream": stream
        },
        {
            $push:{"sub_categories":{
                name: sub_category
            }}
        });
        res.status(200).json(add_new_sub);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Get infomation about a particular (grand) Scheme
router.get('/get_stream', async (req, res)=>{
    try {
        
        const stream = await Category.findOne({
            stream: req.body.stream
        })
        res.status(200).json(stream)
    }catch(error) {
        res.status(500).json(error)
    }
})

//Get info about a sub_stream - this will find whole collection that holds that sub_category
//This process needs to be optimised return just info about the 
router.get('/get_sub', async (req, res)=>{
    const sub = await Category.findOne({
        sub_categories:{$elemMatch:{
            Name: req.body.sub_name
        }}
    })
    if (sub !==null){
        try {            
            const subs = sub.sub_categories
           res.status(200).json(subs)
        }catch(error) {
            console.log(error)
            res.status(500).json(error)
        }
    }else{       
        res.status(404).json(`There is no sub-category by the name ${req.body.sub_name}`)        
    }
});

//Increase the entry count of a sub_category
router.put('/add_entry', async (req, res)=>{
    const sub_to_add = await Category.updateOne({
        "sub_categories.name":req.body.sub_name      
    }, {
        $inc:{"sub_categories.$.entries" :1}
    });

    if(sub_to_add !== null){
        try {
            res.status(200).json(sub_to_add)            
            console.log(sub_to_add)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }else{
        console.log(req.body.sub_name)
        res.status(404).json('no such sub category')
    }
})


//Get the Entries from one sub category
//needs cleaning
router.get('/get_one_sub', async (req,res)=>{
    const {body:{sub_name}} = req;
    const data = await Category.findOne({
        "sub_categories.Name":sub_name
    })
    data.sub_categories.forEach((element)=>{
        if(element.Name === sub_name){
            console.log(element)
        }
    })
    if(data !== null){
        try {
            res.status(200).json(data)            
            
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }else{
        console.log(req.body.sub_name)
        res.status(404).json('no such sub category')
    }
})

router.put('/change_sub_name', async (req, res)=>{
    const {body:{new_sub, old_sub, stream}} = req;
    try {
        const change_sub_name = await Category.updateOne({
            "stream":stream,
            "sub_categories.name": old_sub
        },{
            $set:{"sub_categories.$.name":new_sub}
        })
        console.log(change_sub_name)
        res.status(200).json(change_sub_name)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
})


router.put('/change_stream_name', async (req, res)=>{
    const {body:{old_stream, new_stream}} = req;
    try {
        const change_stream_name = await Category.updateOne({
            "stream": old_stream
        },{
            $set:{"stream": new_stream}
        })
        res.status(200).json(change_stream_name)
    } catch (error) {
        res.status(500).json(error)
    }
})
module.exports = router;
