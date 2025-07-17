//For canvas drawing
var ctx = drawable.getContext('2d')
var canvasOffsetX = drawable.offsetLeft;
var canvasOffsetY = drawable.offsetTop;
var isDrawing = false;
var strokeWidth = 3;

var startX;
var startY;

drawable.width = window.innerWidth - canvasOffsetX;
drawable.height = window.innerHeight - canvasOffsetY;

drawable.addEventListener('mousedown', (e)=> {
	isDrawing = true;
	startX = e.clientX;
	startY = e.clientY;
	console.log("isDrawing")
	canvasOffsetX = drawable.offsetLeft;
	canvasOffsetY = drawable.offsetTop;

})

drawable.addEventListener('mouseup', (e)=> {
	isDrawing = false;
	ctx.stroke();
	ctx.beginPath();
	console.log("isntDrawing")
})

drawable.addEventListener('mousemove', (e) => {
	if(!isDrawing){
		return
	}

	ctx.lineWidth = strokeWidth;
	ctx.lineCap = "round"
	ctx.strokeStyle = "red"
	ctx.lineTo((e.clientX - canvasOffsetX), (e.clientY + document.documentElement.scrollTop));
	ctx.stroke();
	// console.log(e)
})