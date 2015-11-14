/*
-Id
-Name
 */
var mongoose=require('mongoose');
var url =require('url');
var db=require('../db/db');
var dish_catSchem=mongoose.Schema({
    Id:{
        type:Number,
        unique:true,
        required:true
    },
    Name:{
        type:String,
        unique:true,
        required:true
    }
});
var bind = function(app){
    app.post('/dish_cats/store', function(req, res) {
            req.body.Id = parseInt(req.body.Id || '0', 10);
            var dish_catId = req.body.Id;
            var dish_cat = db.model('dish_cats', dish_catSchem);
            var create = function(){
                var dish_catPostedElem = new dish_cat(req.body);
                dish_catPostedElem.save();
            };
            if (dish_catId) {
                db.collection('dish_cats').remove({Id: parseInt(dish_catId, 10)});
                create();
                res.end('OK');
            }
            else {
                db.getNextSequence('dish_catid', function(id){
                    req.body.Id = id;
                    create();
                    res.end('OK');
                })
            }

        })
        .get('/dish_cats/list', function(req, res){
            db.collection('dish_cats').find().toArray().then(function(data){
                res.json(data);
            });

        });
};
module.exports =bind;