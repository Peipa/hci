var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope,$rootScope) {

	//init sidebar
	$(".button-collapse").sideNav();
	$('.modal').modal();


	$scope.state = -1;

	$scope.selectRoom;

	$scope.next = function () {
		$scope.state++;
		state =$scope.state;

		console.log("State: "+state)

		if (state == 4) {
			calcHeatmap();
		}
	}

	$scope.abort = function () {
		if($scope.state ==-1){

			alert("Abort the mission");
		}else {
			$scope.state--;
			state =$scope.state;
		}
	}

	$scope.selectRoom = function (room) {
		$('#delete-modal').modal('open');

		$scope.selectetRoom=room;
		console.log($scope.selectetRoom);
	}
	$scope.selectDot = function (dot) {
		$scope.selectetDot=dot;
		$('#delete-modal').modal('open');

		console.log($scope.selectetDot);
	}
	$scope.selectRouter = function (router) {
		$scope.router=router;
		$('#delete-modal').modal('open');

		console.log($scope.selectetDot);
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

	$scope.switch= function (index) {
		console.log(index);
		subState = index;
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

var stateDot=true;

var imgRouter;

function calcHeatmap(){

	var dataPoints = [];

	for (var i = 0; i < dots.length; i++) {
		var dataPoint = {
			x: dots[i].x,
			y: dots[i].y,
			value: dots[i].value
		}

		dataPoint.push(dataPoint);
	}

	var config = {
	  container: document.getElementById('heatmapContainer'),
	  radius: 10,
	  maxOpacity: .5,
	  minOpacity: 0,
	  blur: .75,
		gradient: { 0 : '#00f', 0.2 : '#00f', 0.2001: '#0ff', 0.4 : '#0ff', 0.4001: '#0f0', 0.6 : '#0f0', 0.6001: '#ff0', 0.8 : '#ff0', 0.8001: '#f00', 1 : '#f00' }

	};

	var heatmap = h337.create(config);

	heatmap.setData({
	  max: 5,
	  data: dataPoints
	});

	console.log(heatmap.getDataURL());

}

function mouseReleased() {
	if(!checkInCannvas()){
		return;
	}

	if(state==2){
		for (var i = 0; i < dots.length; i++) {

			selectdot =(dots[i]!=null) ? dots[i].clicked():null;
			if(selectdot != null){
				var scope = angular.element(document.getElementById("myCtrl")).scope();
				scope.$apply(function () {
					scope.selectDot(selectdot);
				});
				stateDot= false;
				return;
			}
		}
		if(stateDot){
			dots[currendot]=(new myDot(mouseX,mouseY,currendot) );
			currendot+=1;
		}else {
			stateDot = true;
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
	if(select !== 0){
		diffx =startX -gridTransform(mouseX);
		diffy =startY - gridTransform(mouseY);
		rooms[selectRoom.id].move(diffx,diffy);
		startX  =  gridTransform(mouseX);
		startY  =  gridTransform(mouseY);
	}
	if (mouseIsDown !== 0) {
			//var pos = getMousePos(canvas, eve);
			endX = mouseX;
			endY = mouseY;

			drawSquare();
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
						scope.selectRouter(selectRouter);
					});
				}
			}
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
	if(subState ===0){
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

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

var scope;
function setup() {
	var canvas =createCanvas(window.innerWidth,window.innerHeight-$('#nav').height()-40);
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
