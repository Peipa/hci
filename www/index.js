var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope,$rootScope) {

	//init sidebar
	$(".button-collapse").sideNav();
	$('.modal').modal();
	var w = window.innerWidth;
	var h = window.innerHeight-$('#nav').height()-46;

	$(".full-size").css({"width":w, "height":h});


	$scope.state = -2;

	$scope.selectRoom;

	$scope.next = function () {
		subState=0;
		$scope.state++;
		state =$scope.state;

		console.log("State: "+state)

		if (state == 4) {
			calcHeatmap();
		}
	}

	$scope.abort = function () {
		subState=0;

		if($scope.state ==-2){
			alert("Abort the mission");
		}else {
			$scope.state--;
			state =$scope.state;

			if (state == 3) {
				console.log("triggert");
				$(".heatmap-canvas").remove();
			}
		}
	}

	$scope.selectRoom = function (room) {
		$('#delete-modal-room').modal('open');

		$scope.selectetRoom=room;
		console.log($scope.selectetRoom);
	}
	$scope.selectDot = function (dot) {
		$scope.selectetDot=dot;
		$('#delete-modal-dot').modal('open');

		console.log($scope.selectetDot);
	}
	$scope.selectRouter = function (routerID) {
		$scope.router=routerID;
		$('#delete-modal-router').modal('open');

		console.log($scope.router);
	}
	$scope.removeDot=function () {
		console.log(dots);
		//dots.splice($scope.selectetDot.id,1);
		dots[$scope.selectetDot.id] = null;
	}
	$scope.removeRoom=function () {
		rooms[$scope.selectetRoom.id]=null;
		console.log(rooms);
	}
	$scope.removeRouter=function() {
		//routers[]
		routers.splice($scope.router,1);
	}

	$scope.switch= function (index) {
		console.log(index);
		if(state ==0){
			if(subState ==1){
				routers.splice(routers.length-1,1);
			}
		}
		if(state == 2){
			if(subState==0){
				dots.splice(dots.length-1,1);
				currendot--;
			}
		}
		subState = index;
	}

	$scope.removeLast=function () {
		if(state ==0){
			if(subState ==1){
				routers.splice(routers.length-1,1);
			}
		}
		if(state == 2){
			if(subState==0){
				dots.splice(dots.length-1,1);
				currendot--;
			}
		}
	}

});

var state =-1;

var subState=0;

var  startX, endX, startY, endY;
var mouseIsDown = 0;

var  rooms =[];
var  dots =[];
var routers=[];

var currenRoom= 0;

var currenRouer= 0;

var currendot=0;

var imgRouter;

function calcHeatmap(){

	//var canvas =createCanvas(window.innerWidth,window.innerHeight-$('#nav').height()-40);
	var w = window.innerWidth;
	var h = window.innerHeight-$('#nav').height()-46;

	$("#canvas").css({"width":w, "height":h});

	var dataPoints = [];

	for (var i = 0; i < dots.length; i++) {
		var dataPoint = {
			x: dots[i].x,
			y: dots[i].y,
			value: dots[i].value,
			radius: 150
		}

		dataPoints.push(dataPoint);
	}

	var config = {
	  container: document.getElementById('canvas'),
	  radius: 10,
	  maxOpacity: .6,
	  minOpacity: .4,
	  blur: .75,

		gradient: {
			'.0': '#d50000',
			'.25': '#d50000',

			'.26': '#ff6d00',
			'.50': '#ff6d00',

			'.51': '#ffff00',
			'.75': '#ffff00',

			'.76': '#00c853',
			'1': '#00c853'
		}

	};

	var heatmap = h337.create(config);

	heatmap.setData({
	  max: 1,
	  data: dataPoints
	});

	//console.log(heatmap.getDataURL());

}

function mouseReleased() {
	if(!checkInCannvas()){
		return;
	}

	if(state==2){
		if(subState === 1){
			for (var i = 0; i < dots.length; i++) {

				selectdot =(dots[i]!=null) ? dots[i].clicked():null;
				if(selectdot != null){
					var scope = angular.element(document.getElementById("myCtrl")).scope();
					scope.$apply(function () {
						scope.selectDot(selectdot);
					});
					return;
				}
			}

		}
		if(subState ===0){
			dots[currendot]=(new myDot(mouseX,mouseY,currendot) );
			currendot+=1;
		}
	}else{
		if(subState === 1){
			routers.push(new Router(mouseX,mouseY));
			return;
		}
		if(select !== 0){
			select=0;
		}
		if (mouseIsDown !== 0) {
			mouseIsDown = 0;
			//var pos = getMousePos(canvas, eve);
			endX = mouseX;
			endY = mouseY;


			if(Math.abs(startY-endY) > 30 && Math.abs(startX-endX) > 30){
				drawSquare(); //update on mouse-up
				currenRoom++;
			}else {
				console.log("Der Raum ist zu Klein");
				rooms[currenRoom]= null;
			}

		}

	}

}

function mouseDragged() {
	if(!checkInCannvas()){
		return;
	}
	if(state ===0){
		if(select !== 0){
			diffx =startX -gridTransform(mouseX);
			diffy =startY - gridTransform(mouseY);
			rooms[selectRoom.id].move(diffx,diffy);
			startX  =  gridTransform(mouseX);
			startY  =  gridTransform(mouseY);
		}else{
			if(subState==2){
				diffx =startX -gridTransform(mouseX);
				diffy =startY - gridTransform(mouseY);
				moveall(diffx,diffy);
				startX  =  gridTransform(mouseX);
				startY  =  gridTransform(mouseY);

			}
		}
		if (mouseIsDown !== 0) {
			//var pos = getMousePos(canvas, eve);
			endX = mouseX;
			endY = mouseY;

			drawSquare();
		}
	}
}
var select= 0;
var selectRoom =null;
var selectdot;
var selectTime ;
var selectRouter;

function mousePressed() {
	if(!(checkInCannvas())){
		return;
	}

	if(state ==0){
		startX = endX =  gridTransform(mouseX);
		startY = endY =  gridTransform(mouseY);
		if(subState ===3){
			for (var i = 0; i < routers.length; i++) {
				selectRouter=routers[i].clicked();
				if(selectRouter){
					scope.$apply(function () {
						scope.selectRouter(i);
					});
					return;
				}
			}
			selectRouter=null;
		}
		for (var i = rooms.length; i >=0 ; i--) {
			if(rooms[i] != null){
				if(rooms[i].clicked()){
					selectTime = new Date();
					selectRoom =rooms[i].clicked();
					select=1;
					if(subState ===3){
						scope.$apply(function () {
							scope.selectRoom(selectRoom);
						});
					}
					return;
				}
			}
		}
		selectRoom=null;
		mouseIsDown = 1;
		//var pos = getMousePos(canvas, eve);

		drawSquare(); //update

	}else {

	}

}
function drawSquare() {
	if(subState ===0 && state==0){
		// creating a square
		var w = gridTransform(endX - startX);
		var h =  gridTransform(endY - startY);
		var offsetX = (w < 0) ? w : 0;
		var offsetY = (h < 0) ? h : 0;
		var width = Math.abs(w);
		var height = Math.abs(h);

		rooms[currenRoom]= new myRect(startX + offsetX, startY + offsetY, width, height,currenRoom);

	}
}

function gridTransform(wert) {
	return Math.floor(wert/10)*10;
}

function checkInCannvas() {
	if(mouseX > 0 && mouseX < height && mouseY > 0 && mouseY < height){
		return true;
	}
	return false;
}
function moveall(diffx,diffy) {
	for (var i = 0; i < rooms.length; i++) {
		if(rooms[i] != null){
			rooms[i].move(diffx,diffy);
		}
	}
	for (var i = 0; i < routers.length; i++) {
		if(routers[i]!= null){
			routers[i].move(diffx,diffy);

		}
	}
	/*
	for (var i = 0; i < dots.length; i++) {
		dots[i].move(diffx,diffy);
	}
	*/
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

var scope;
function setup() {
	var canvas =createCanvas(window.innerWidth,window.innerHeight-$('#nav').height()-56);
	canvas.parent('canvas');

	imgRouter = loadImage("img/ic_router_black_24px.svg");
	scope = angular.element(document.getElementById("myCtrl")).scope();

	//rooms[0]= new myRect(50,50,120,12);


}
function draw(){
	//background(255);
	clear();
	for(var i =0; i<rooms.length;i++){
		if(rooms[i]!=null){
			rooms[i].display();
		}
	}
	if(state != 0){
		for(var i =0; i<dots.length;i++){
			if(dots[i]!=null){
				dots[i].display();

			}
		}
	}
	for (var i = 0; i < routers.length; i++) {
		routers[i].display();
	}

}
