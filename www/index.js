var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope,$rootScope) {

	$scope.state = -1;

	$scope.selectRoom;

	$scope.next = function () {
		$scope.state++;
		state =$scope.state;
	}

	$scope.abort = function () {
		if($scope.state ==0){

			alert("Abort the mission");
		}else {
			$scope.state--;
			state =$scope.state;
		}
	}

	$scope.selectRoom = function (room) {
		$('.ui.basic.modal.room')
			.modal('show')
		;
		$scope.selectetRoom=room;
		console.log($scope.selectetRoom);
	}
	$scope.selectDot = function (dot) {
		$scope.selectetDot=dot;
		$('.ui.basic.modal.dot')
			.modal('show')
		;
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

	$scope.togglemenu= function () {
		$('.ui.labeled.icon.sidebar')
		  .sidebar('toggle')
		;
	}


});

var state =-1;

var  startX, endX, startY, endY;
var mouseIsDown = 0;

var  rooms =[];
var  dots =[];

var currenRoom= 0;

var currendot=0;

var stateDot=true;

function mouseReleased() {
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
		if(select !== 0){
			select=0;
		}
		if (mouseIsDown !== 0) {
			mouseIsDown = 0;
			//var pos = getMousePos(canvas, eve);
			endX = mouseX;
			endY = mouseY;
			drawSquare(); //update on mouse-up
			console.log("relase");
			currenRoom++;
		}

	}

}

function mouseDragged() {
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

function mousePressed() {
	if(state ==0){
		startX = endX =  gridTransform(mouseX);
		startY = endY =  gridTransform(mouseY);
		for (var i = rooms.length; i >=0 ; i--) {
			if(rooms[i] != null){
				if(selectRoom ===rooms[i].clicked() ){
					if(Date.now()-selectTime< 200){
						var scope = angular.element(document.getElementById("myCtrl")).scope();
						scope.$apply(function () {
							scope.selectRoom(selectRoom);
						});
					}
				}
				if(rooms[i].clicked()){
					selectTime = new Date();
					selectRoom =rooms[i].clicked();
					select=1;

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
    // creating a square
    var w = gridTransform(endX - startX);
    var h =  gridTransform(endY - startY);
    var offsetX = (w < 0) ? w : 0;
    var offsetY = (h < 0) ? h : 0;
    var width = Math.abs(w);
    var height = Math.abs(h);

		rooms[currenRoom]= new myRect(startX + offsetX, startY + offsetY, width, height,currenRoom);
}

function gridTransform(wert) {
	return Math.floor(wert/10)*10;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}


function setup() {
	var canvas =createCanvas(window.innerWidth,window.innerHeight-$('#nav').height());
	canvas.parent('canvas');


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

}
