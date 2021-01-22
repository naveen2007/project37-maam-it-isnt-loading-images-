

var database 

var dog,dogImg,happyDogImg
var foodS,foodStock
var fedTime, lastFed
var foodObj
var feed
var food
var garden, washroom, bedroom;
function preload()
{
 dogImg = loadImage("images/dogImg.png");
 happyDogImg = loadImage("images/dogImg1.png");
 garden=loadImage("images/Garden.png");
washroom=loadImage("images/WashRoom.png");
bedroom=loadImage("images/BedRoom.png");
}

function setup() {
createCanvas(500,500);


dog = createSprite(400,400)
dog.addImage(dogImg)
dog.scale = 0.1
  
database = firebase.database()
foodObj = new Food()

feed = createButton("feed the dog")
feed.position(650,95)
feed.mousePressed(feedDog)

readState=database.ref('gameState');
readState.on("value",function(data){
gameState=data.val();
})

addFood = createButton("add Food")
addFood.position(750,95)
addFood.mousePressed(addFoods)
  
}


function draw() {  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

   if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
   feed.show();
   addFood.show();
  }




  background(46,139,87)
  foodStock = database.ref('Food')
  foodStock.on("value",readStock)


  lastFed = database.ref('feedTime')
  lastFed.on("value",(data)=>{
  lastFed = data.val()

  })
  
  foodObj.display()
  fill(255)
  textSize(15)
  if(lastFed>=12){
    text("last Feed : "+ lastFed%12+" PM",350,30)
  }else if(lastFed===0){
    text("last Fed : 12 AM",350,30)
  }else{
    text("last Fed : "+ lastFed + "AM",350,30)
  }

  drawSprites();
  fill("black")
  textSize(20)
  text("food left "+foodS,190,50)
  text("last fed "+ lastFed,100,100)
}
 
    function readStock(data){
    foodS = data.val()
    foodObj.updateFoodStock(foodS);
  }
  function writeStock(x){

    if(x<=0){
      x=0;
    }else{
      x=x-1
    }
    database.ref('/').update({
      Food:x
    })
  }
  

function feedDog(){
  dog.addImage(happyDogImg);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    feedTime : hour() 
  })
  

}

  function addFoods(){
  foodS++
  database.ref('/').update({
  Food:foodS
  })


  function update(state){
    database.ref('/').update({
      gameState:state
    })
}
  }



