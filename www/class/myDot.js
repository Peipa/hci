function myDot(x,y,id) {
	this.x=x;
	this.y=y;
	this.id =id;
	this.rand = Math.floor(Math.random() * (3 -  0));
	this.r = 12;
	this.date = new Date();


	if(this.rand == 0){
		this.color = color(255, 0, 0);
	}else  if (this.rand == 1){
		this.color = color(255, 255, 0);
	}else {
		this.color = color(0, 255, 0);
	}

	this.clicked = function () {
		var d = dist(mouseX,mouseY,this.x,this.y);
		if(d < this.r){
			return this;
		}else {
			return null;
		}
	}

	this.display= function () {


		fill(this.color);
		//stroke(255);
		ellipse(this.x, this.y, this.r*2, this.r*2);
		fill(255);

	}

}
