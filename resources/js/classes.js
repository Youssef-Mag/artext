export class OpenFile {
  constructor(name = "new", path = "new", text = "") {
      this.name = name;
    this.path = path;
    this.text = text;
    this.saved = true;
    this.realSaved = true;
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