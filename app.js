//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require ("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//inicializar coneccion o creacion de base de datos 
mongoose.connect("mongodb+srv://admin-martin:sima1102@cluster0.689vn8s.mongodb.net/todolistDB")


const itemschema = {
  name : {
    type : String,
    required : true
  }
}
const listschema = {
  name : {
    type : String,
    required : true
  },
  items:[itemschema]
}

// Collections 


const Item = mongoose.model("item", itemschema)
const List = mongoose.model("list", listschema)

// Mensaje predeterminados en formato de Mongoose
const item1 = new Item ({
  name : "Ten un bonito Dia"
})
const item2 = new Item ({
  name : "Añade o elimina las tareas"
})

const defaultItems = [item1, item2];



app.get("/", function(req, res) {
  Item.find(function(err, foundItem){
    if (foundItem == 0){
      
      
      if(err){
        console.log(err)
      }

    //Ingresando items en base de datos 
      Item.insertMany(defaultItems, function(err) {
        if (err){
          console.log(err)
        }
        else{
          
        }
      })
      res.redirect("/")
    } 

    else{
      res.render("list", {listTitle: "today", newListItems: foundItem});
      

    }
  }) 
});




app.post("/", function(req, res){

  const listName = req.body.list;
  const itemName = req.body.newItem
  const newItem = new Item ({
    name : itemName
  })
  if(listName =="today"){
    
    newItem.save();  
    res.redirect("/")

  }
  else{

    List.findOne({name: listName},function(err, foundList){
      if(!err){
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/"+ foundList.name)

      }
      else{
      
      }
    })
  }
  
});



app.post("/delete", function(req,res){
  const deleteItem = req.body.checkbox
  const listName = req.body.nombre
  if (listName== "today"){

    Item.deleteOne({name : deleteItem}, function(err){
      if(err){
        console.log(err)
      }
      else{
        res.redirect("/")
      }
    })
  }
  else{

    //Dado por la profesora
    List.findOneAndUpdate({name: listName}, {$pull:{items:{name:deleteItem}}}, function(err,foundList){
      if (!err){

        res.redirect("/"+ listName)

      }
    })

    //Desarrollado por mi solito con ayuda de internet


    // List.findOne({name: listName}, function(err, foundList){

    //   let element = foundList.items;
    //   for (let i = 0; i < foundList.items.length; i++) {

    //     if (element[i].name == deleteItem){

    //       console.log(element)
    //       element.splice(i,1)
    //       foundList.save();
    //       res.redirect("/"+ listName)

    //     } 
    //   }  
    // })
  }
  
  
})



app.get("/:customList", function(request,response){
  const customList = request.params.customList
  console.log(customList)
  List.findOne({name: customList}, function(err, foundList){
    if (err){
      console.log(err)
    }
    else{
      if (!foundList){ 

        const list = new List ({
          name: customList,
          items: defaultItems
        })
        list.save();
        
        response.redirect("/"+ customList)
      }
      else{
      
        response.render("list", {listTitle: customList, newListItems: foundList.items});
      }
    }

  })
  
});


app.listen(3000, function() {

  console.log("Server started on port 3000");
});
