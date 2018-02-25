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
var dir = "north";
var action = "idle";
var scaleConst = 3.2;

//key definition
var keyAnimations = [];

//frame definition
var frameAnimations = [];


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
	var sequence = [1,1,1,1];
	
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
	frameAnimations.push(new seqAnim(seq, animName));

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


//draw stuff
function render(){
	ctx.save();
	//clear eveoything
	ctx.clearRect(0, 0, canvas.width,canvas.height);

	drawsprite();

	ctx.restore();
}

//update stuff
function main(){
	render();
	requestAnimationFrame(main);

}

main();