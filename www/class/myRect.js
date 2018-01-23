function myRect(x,y,width,height,id) {
	this.id =id;
	this.x =x;
	this.y= y;
	this.centerX= x+ width/2;
	this.centerY= y + height/2;
	this.width = width;
	this.height = height;

	this.display= function () {
		rect(this.x,this.y,this.width,this.height);
	}

	this.clicked = function () {
		if(Math.abs(this.centerX - mouseX) < width/2 && Math.abs(this.centerY - mouseY) < height/2 ){
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
