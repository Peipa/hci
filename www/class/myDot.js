function myDot(x,y,id) {
	this.x=x;
	this.y=y;
	this.id =id;
	//this.rand = Math.floor(Math.random() * (3 -  0));
	this.r = 12;
	this.date = new Date();
	this.dist =1000;
	for (var i = 0; i < routers.length; i++) {
		 var tmpd=dist(routers[i].x,routers[i].y,this.x,this.y);
		 if(tmpd<this.dist){
			 this.dist=tmpd;
		 }
	}
	console.log(this.dist);

	if(this.dist < 100){
		this.color = "#00c853";
		this.value = 1;
	}else  if (this.dist < 200){
		this.color = color(255, 255, 0);
		this.color = "#ffff00";
	}else {
		this.color = "#d50000";
		this.value = 0;
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

	this.move = function (diffx,diffy) {
		this.x -= diffx;
		this.y -= diffy;
	}

}
