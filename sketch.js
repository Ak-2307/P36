var dog;
var happyDog;
var dogImg;
var dogImg1;
var database;
var foodS;
var foodStock;
var milkImg;
var feedPetButton;
var addFoodButton;
var fedTime;
var lastFed;
var foodObj;


function preload()
{
  dogImg = loadImage("images/dogImg.png");
  dogImg1 = loadImage("images/dogImg1.png");
}

function setup() {
	createCanvas(500, 500);
  
   dog = createSprite(250,250,40,40);
   dog.addImage(dogImg);
   dog.scale = 0.5;

   foodObj = new Food();

   feedPetButton=createButton("Feed the dog");
   feedPetButton.position(510,95);
   feedPetButton.mousePressed(function(){
     if(foodS!==undefined){
       if(foodS>=1){
         dog.addImage(dogImg1);
         foodObj.deductFood();
       }else{
         dog.changeImage(dogImg);
         //show a text saying milk is over
       }
     }
   });

   addFoodButton=createButton("Add Food");
   addFoodButton.position(610, 95);
   //addFoodButton.mousePressed(addFoodS);

   //this is how you assign firebase database to var database
   database = firebase.database();

   foodStock = database.ref('food');
   foodStock.on("value", readStock);
}


function draw(){  
  background(46,139,87);

   fedTime=database.ref('FeedTime');
   fedTime.on("value", function(data){
     lastFed=data.val()
   });

   fill(255,255,254);
   textSize(15);
   if(lastFed>=12){
     text("Last Feed: "+ lastFed%12 + "PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed: 12 AM", 350, 30);
   }else{
     text("Last Feed: "+ lastFed+ "AM", 350, 30);
   }


   foodObj.display();
   addFoodButton.mousePressed(function(){foodObj.addFoodFun()});
  drawSprites();
   
  //text("Note: Press UP_ARROW Key To Feed Yeontan Milk!", 100,30);
  
 
  text("FoodStock: " + foodS, 100,100);
  textSize(5);
  stroke("white");

}

function readStock(data){
foodS=data.val();
foodObj.updateFoodStock(foodS);

}

function writeStock(x){

  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }

  database.ref('/').update({
    food:x
  })
}

function feedDog(){
  dog.addImage(dogImg1);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime:hour()
  })

}




