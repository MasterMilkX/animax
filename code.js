// SOFTWARE CODE
// by Milk

//set up the canvas
var canvas = document.getElementById("spriteWindow");
var ctx = canvas.getContext("2d");
canvas.width = 320;
canvas.height = 320;

// directionals
var upKey = 38;     //[Up]
var leftKey = 37;   //[Left]
var rightKey = 39;  //[Rigt]
var downKey = 40;   //[Down]
var moveKeySet = [upKey, leftKey, rightKey, downKey];

var alphaKeySet = [];
for(var i=65;i<=90;i++){alphaKeySet.push(i);}

var keys = [];
var anyAlphaKey = false;

var sprite = new Image();
sprite.src = "sample_img/Beto.png";
var spriteReady = false;
sprite.onload = function(){spriteReady = true;}


//sprite properties
var sprWidth = 16;
var sprHeight = 16;
var fpr = 3;
var fps = 4;
var seqlength = 4;
var lock_dir = true;
var curFrame = 0;
var ct = 0;
var dir = "DOWN";
var action = "idle";
var scaleConst = 3.2;

//key definition
var keyAnimations = [];
var curAnim = "";

//frame definition
var frameAnimations = [];
var curSeq = [0,0,0,0];


function inArr(arr, e){
	if(arr.length == 0)
		return false;
	return arr.indexOf(e) !== -1
}

function isEqual(arr1, arr2){
	if(arr1.length != arr2.length)
		return false;
	else{
		for(var i=0;i<arr1.length;i++){
			if(arr1[i] != arr2[i])
				return false;
		}
		return true;
	}
}

//load a new sprite onto the canvas
function loadSprite(){
	var upSpr = document.getElementById("image_upload");
	if(upSpr.files && upSpr.files[0]){
		var reader = new FileReader();
		reader.onload = function(o){
			sprite.src = o.target.result;
		};
		reader.readAsDataURL(upSpr.files[0]);
	}
}

function updateCanvas(scaler){
	canvas.width = scaler*scaleConst;
	canvas.height = scaler*scaleConst;
}

//draw a character sprite
function drawsprite(){
	updatesprite();
	rendersprite();
}

//update animation
function updatesprite(){
	//update the frames
	if(ct == (fps - 1))
		curFrame = (curFrame + 1) % seqlength;
		
	ct = (ct + 1) % fps;
}
//draw the sprite
function rendersprite(){
	//set the animation sequence
	var sequence = curSeq;
	
	//get the row and col of the current frame
	var row = Math.floor(sequence[curFrame] / fpr);
	var col = Math.floor(sequence[curFrame] % fpr);
	
	if(spriteReady){
		ctx.drawImage(sprite, 
		col * sprWidth, row * sprHeight, 
		sprWidth, sprHeight,
		(canvas.width / 2) - (sprWidth / 2), (canvas.height / 2) - (sprHeight / 2), 
		sprWidth, sprHeight);
	}
}

//define the objects
function keyAnim(key, animation){
	this.key = key;
	this.animName = animation;
}

function seqAnim(seq, animation){
	this.sequence = seq;
	this.animName = animation;
}

//add a key 
function addKey(){
	var key = document.getElementById("keyLabel").value;
	var animName = document.getElementById("animName1").value;

	if(key === "" || animName === "")
		return;
	key = key.toUpperCase();

	//add to the array
	keyAnimations.push(new keyAnim(key, animName));

	//add to the physical table
	var table = document.getElementById("keyMapper");
	var row = table.insertRow(table.rows.length);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	cell1.innerHTML = key;
	cell2.innerHTML = animName;

	//clear the stuff
	document.getElementById("keyLabel").value = "";
	document.getElementById("animName1").value = "";
}
//remove the most recently added row from the key table
function delKey(){
	var table = document.getElementById("keyMapper");
	table.deleteRow(table.rows.length-1);
	keyAnimations.pop();
}

//clear the entire key animations list
function clearKey(){
	var table = document.getElementById("keyMapper");
	for(var i=table.rows.length;i>0;i--)
		table.deleteRow(table.rows.length-1);
	keyAnimations = [];
}

function highliteTables(){
	var keyMap = document.getElementById("keyMapper");
	var frameMap = document.getElementById("frameMapper");

	for(var i=0;i<keyAnimations.length;i++){
		var myAnim = keyAnimations[i].animName;
		if(myAnim === curAnim){
			keyMap.rows[i].style.backgroundColor = "#ffff00";
		}else{
			keyMap.rows[i].style.backgroundColor = "#ffffff"
		}
	}

	for(var i=0;i<frameAnimations.length;i++){
		var myAnim = frameAnimations[i].animName;
		if(myAnim === curAnim){
			frameMap.rows[i].style.backgroundColor = "#ffff00";
		}else{
			frameMap.rows[i].style.backgroundColor = "#ffffff"
		}
	}
}

//add a sequence
function addSeq(){
	var seq = document.getElementById("frameLabel").value;
	var animName = document.getElementById("animName2").value;

	if(seq === "" || animName === "")
		return;

	//clean up the sequence input
	seq = seq.replace(/[^0-9\,]/g, "");
	seq = seq.replace(/(\,)(\,)+/g, ",");
	if((! /\[*\]/.test(seq)) && (! /\[*\]/.test(seq))){
		seq = "[" + seq + "]";
	}

	//add to the array
	frameAnimations.push(new seqAnim(JSON.parse(seq), animName));

	//add to physical table
	var table = document.getElementById("frameMapper");
	var row = table.insertRow(table.rows.length);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	cell1.innerHTML = seq;
	cell2.innerHTML = animName;

	//clear the stuff
	document.getElementById("frameLabel").value = "";
	document.getElementById("animName2").value = "";
}

//delete the most recent sequence input to the table
function delSeq(){
	var table = document.getElementById("frameMapper");
	table.deleteRow(table.rows.length-1);
	frameAnimations.pop();
}

//clear the entire set
function clearSeq(){
	var table = document.getElementById("frameMapper");
	for(var i=table.rows.length;i>0;i--)
		table.deleteRow(table.rows.length-1);
	frameAnimations = [];
}


//draw stuff
function render(){
	ctx.save();
	//clear eveoything
	ctx.clearRect(0, 0, canvas.width,canvas.height);

	drawsprite();

	ctx.restore();
}

function processKey(){
	var animation = getSeq(anyAlphaKey || anyMoveKey());
	curAnim = animation;
	getAnimation(animation);
}

function getSeq(keyDown){
	for(var i=0;i<keyAnimations.length;i++){
		var myKey = keyAnimations[i].key;
		if(isSpecialKey(myKey) && !anyAlphaKey){
			if(!anyMoveKey() && (((myKey === "DEF_" + dir) && lock_dir) || (myKey === "DEFAULT"))){
				return keyAnimations[i].animName;
			}else if(anyMoveKey() && (myKey === dir)){
				return keyAnimations[i].animName;
			}
		}else{
			if(anyAlphaKey && !isSpecialKey(myKey) && keys[myKey.charCodeAt(0)])
				return keyAnimations[i].animName;
		}
	}
	return "";
}
function getAnimation(name){
	if(name === "")
		return;

	for(var i=0;i<frameAnimations.length;i++){
		var mySeq = frameAnimations[i];
		if(mySeq.animName === name && !isEqual(curSeq, mySeq.sequence)){
			curSeq = mySeq.sequence;
			curFrame = 0;
			return;
		}
	}
}

function isSpecialKey(key){
	return (key === "DEFAULT" || key === "DEF_UP" || key === "DEF_RIGHT" || key === "DEF_LEFT" || key === "DEF_DOWN" ||
		key === "UP" || key === "LEFT" || key === "RIGHT" || key === "DOWN")
}


//determine if valud key to press
document.body.addEventListener("keydown", function (e) {
	if(inArr(moveKeySet, e.keyCode)){
		if(!anyMoveKey()){dir = transMove(e.keyCode);}
		keys[e.keyCode] = true;
	}else if(inArr(alphaKeySet, e.keyCode)){
		keys[e.keyCode] = true;
		anyAlphaKey = true;
	}
});

//check for key released
document.body.addEventListener("keyup", function (e) {
	if(inArr(moveKeySet, e.keyCode)){
		keys[e.keyCode] = false;
	}else if(inArr(alphaKeySet, e.keyCode)){
		keys[e.keyCode] = false;
		anyAlphaKey = false;
	}
});

//prevent scrolling with the game
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if(([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)){
        e.preventDefault();
    }
}, false);

//check if any directional key is held down
function anyMoveKey(){
	return (keys[upKey] || keys[downKey] || keys[leftKey] || keys[rightKey])
}

function transMove(e){
	if(e == upKey)
		return "UP";
	else if(e == downKey)
		return "DOWN";
	else if(e == leftKey)
		return "LEFT";
	else if(e == rightKey)
		return "RIGHT";
}

function init(){
	keyAnimations.push(new keyAnim("RIGHT", "move_right"));
	keyAnimations.push(new keyAnim("LEFT", "move_left"));
	keyAnimations.push(new keyAnim("DEF_RIGHT", "idle_right"));
	keyAnimations.push(new keyAnim("DEF_LEFT", "idle_left"));

	frameAnimations.push(new seqAnim([0,1,2,1], "move_right"));
	frameAnimations.push(new seqAnim([5,4,3,4], "move_left"));
	frameAnimations.push(new seqAnim([0,0,0,0], "idle_right"));
	frameAnimations.push(new seqAnim([5,5,5,5], "idle_left"));
}

//update stuff
function main(){
	render();
	processKey();
	highliteTables();
	requestAnimationFrame(main);
}

main();