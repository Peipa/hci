function Router(x,y) {
	this.x = x;
	this.y= y;

	this.display = function () {
		image(imgRouter,this.x,this.y);

	}

}
