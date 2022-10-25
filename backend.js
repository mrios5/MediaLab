const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0.tzrgkus.mongodb.net/TakeTheList');


const listData = mongoose.model('people', 
{ 
    name: String, 
    assist: String
});


const get_data = (name) => {
    const Data = {"name": `Angel`, "assist": "Yes"}
    return Data
}

const save_Data = () => {
    var GoodData = new listData(get_data())
    GoodData.save()
    console.log("maybe its done")
}

save_Data()

