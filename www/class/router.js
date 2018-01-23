function Router(x,y) {
	this.width = imgRouter.width*2;
	this.height = imgRouter.height*2;

	this.x = x-this.width/2;
	this.y= y-this.height/2;
	this.centerX= this.x+this.width/2;
	this.centerY= this.y + this.height/2;


	this.display = function () {
		//rect(this.x,this.y,this.width,this.height);
		image(imgRouter,this.x,this.y,this.width,this.height);

	}
	this.clicked = function () {
		if(Math.abs(this.centerX - mouseX) < this.width/2 && Math.abs(this.centerY - this.height) < height/2 ){
			return this;
		}else {
			return null;
		}
	}

	this.move= function (diffx,diffy) {
		this.x -= diffx;
		this.y -= diffy;
		this.centerX= this.x+ this.width/2;
		this.centerY= this.y + this.height/2
	}
}
