export class OpenFile {
  constructor(name = "new", path = "new", text = "") {
    this.name = name;
    this.path = path;
    this.text = text;
    this.saved = true;
    this.realSaved = true;

    this.artUndoQueue = [""]
  }
  setText(text){
      this.text = text;
      this.saved=false
      this.realSaved=false
      
  }
  getText(text){
      return this.text;
  }
  save(){
    this.saved = true;
    window.Neutralino.filesystem.writeFile(this.path, this.text);
    //save the drawing
    var artPath = this.path.replace(this.name, ".art")
    Neutralino.filesystem.createDirectory(artPath);
    window.Neutralino.filesystem.writeFile(artPath + "/" + this.name + ".atx", drawable.toDataURL());
  }
  getArtPath(){
    return this.path.replace(this.name, ".art/") + this.name + ".atx";
  }

}

export class Language{
     constructor(name = "text", extention = ".txt", keywords = [], comment = "//") {
        this.name = name;
        this.extention = extention;
        this.keywords = keywords;
        this.comment = comment;
    } 
    
    setKeywords(keywords, comment){
        this.keywords = keywords;
        this.comment = comment;
    }
}

export class Drawable{
  constructor(){
    //For canvas drawing
    this.ctx = drawable.getContext('2d')
    this.canvasOffsetX = drawable.offsetLeft;
    this.canvasOffsetY = drawable.offsetTop;
    this.isDrawing = false;
    this.isErasing = false;
    this.strokeWidth = 6;
    this.eraseWidth = 20;

    this.startX;
    this.startY;

    this.artUndoQueue = [];
    this.curFile = new OpenFile();

    drawable.width = window.innerWidth - this.canvasOffsetX;
    drawable.height = window.innerHeight - this.canvasOffsetY;

    drawable.addEventListener('mousedown', (e)=> {
      this.isDrawing = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      console.log("isDrawing")
      this.canvasOffsetX = drawable.offsetLeft;
      this.canvasOffsetY = drawable.offsetTop;
      this.artUndoQueue.push(this.getImg())
      if(e.shiftKey){
        this.isErasing = true;
      }

    })

    drawable.addEventListener('mouseup', (e)=> {
      this.isDrawing = false;
      this.ctx.beginPath();
      this.isErasing = false;
      this.curFile.artUndoQueue.push(this.getImg())
      console.log(this.curFile.artUndoQueue)
      console.log("isntDrawing")
    })

    drawable.addEventListener('mousemove', (e) => {
      if(!this.isDrawing){
        return;
      }

      if(e.ctrlKey){
        this.ctx.beginPath();
        this.ctx.clearRect(-this.eraseWidth/2+(e.clientX - this.canvasOffsetX), -this.eraseWidth/2+(e.clientY + document.documentElement.scrollTop), this.eraseWidth, this.eraseWidth)
        return;
      }
      this.ctx.lineWidth = this.strokeWidth;
      this.ctx.lineCap = "round";
      this.ctx.strokeStyle = "red";
      this.ctx.lineTo((e.clientX - this.canvasOffsetX), (e.clientY + document.documentElement.scrollTop));
      this.ctx.stroke();
      // console.log(e)
    })
  }

  async undo(){
    this.curFile.artUndoQueue.pop()
    if(this.curFile.artUndoQueue.length > 0){
      this.setImg(this.curFile.artUndoQueue[this.curFile.artUndoQueue.length-1])
      this.fixSize()
      return;
    }
    await this.loadArt()
    this.fixSize()
  }

  getImg(){
    return drawable.toDataURL();
  }

  clear(){
    this.fixSize()
    this.ctx.clearRect(0, 0, drawable.width, drawable.height)
  }

  async loadArt(){
      try{
        // ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        let artData = await Neutralino.filesystem.readFile(this.curFile.getArtPath());
        // const img = new Image();
        // img.src = artData
        // img.onload = () => {
        //   drawable.width = displayText.offsetWidth;
        //   drawable.height = displayText.offsetHeight;
        //   ctx.drawImage(img, 0, 0);
        //   console.log(img)
        // };
        this.setImg(artData);
    }catch{
      this.clear()
      console.error("Some issue occured with loading your drawing.")
    }
  }

  setImg(src){
    this.clear()
    drawable.width = 0
    drawable.height = 0
    // Redraw content
    const img = new Image();
    img.onload = () => {
      this.fixSize()
      this.ctx.drawImage(img, 0, 0);
    };
    img.src = src;
  }

  fixSize(){
    drawable.width = displayText.offsetWidth;
    drawable.height = displayText.offsetHeight;
  }
}