var mongoose = require('mongoose');
mongoose.connect('mongodb://root:Gouthami%402010@localhost:27017/admin');
var db = mongoose.connection;
db.once("open", function(c){
    console.log("connection success");
});


