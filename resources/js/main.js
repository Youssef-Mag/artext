import { Language, OpenFile } from "./classes.js";
Neutralino.init();
var keywords = [] //keywords to format to (check languagePath) 
var commentSymbol = "Long comment symbol no one will find :D" //the symbol for comments
var languages = new Map(); //all our loaded languages

var openFiles = [] //files we're currently editing
var curFile = new OpenFile() //the file that's displayed and being edited
openFiles.push(curFile)

var languagesPath = NL_PATH + "/languages" //where we store our languages
console.log(languagesPath)
//Keeping track of things to help autoscroll new lines
let prevScrollPos = 0;
let scrollCorrection = false;
let caretCorrection = 0;

//Our starting point or main function
window.onload = async function() {
    console.log(languagesPath)
    await loadLanguages(languagesPath) //load languagesPath
    refreshFileDrawer()
    //initializing our textArea
    mainText.addEventListener("input", (event) => {onTextChange(event);});
    mainText.addEventListener("scroll", onScroll);
    //adding tab key functionality
    mainText.onkeydown = function(e){
      if(e.keyCode==9 || e.which==9){
          e.preventDefault();
          var s = mainText.selectionStart;
          mainText.value = mainText.value.substring(0,mainText.selectionStart) + "    " + mainText.value.substring(mainText.selectionEnd);
          mainText.selectionEnd = s+4; 
          refreshkeywords()
      }
    }
    //To allow for dragging files into Artext
    document
      .addEventListener("drop", dropHandler);
    document
      .addEventListener("dragover", (event) => {event.preventDefault();});
    document
      .addEventListener("dragend", (event) => {event.preventDefault();});

    //Hotkeys
    document.addEventListener("keydown",async function(event) {
      if(event.ctrlKey && event.altKey && event.key == 's') { //saveas (event.shiftKey not firing so im usinh alt)
        event.preventDefault();
        saveAsInput.click()
        return;
      }
      if (event.ctrlKey && event.key == 's') { //save
        event.preventDefault();
        if(curFile.path=="new"){ //saveAs if it's a new file
            event.preventDefault();
            //saveAsInput.click()
            var path = await Neutralino.os.showSaveDialog();
            curFile.path = path;
            path = path.split('/')
            curFile.name = path[path.length-1]
            curFile.save();
            refreshFileDrawer()
            updateLanguageFormat(curFile.name);
            refreshkeywords()
            refreshFileDrawer()
          return;
        }
        curFile.save();
        refreshFileDrawer()
        updateLanguageFormat(curFile.name);
        refreshkeywords()
        refreshFileDrawer()
        return;
      }
      if (event.ctrlKey && event.key == 'n') { //new file
        event.preventDefault();
        curFile = new OpenFile();
        openFiles.push(curFile)
        loadOpenFile(curFile)
        refreshFileDrawer()
        return;
      }
      if (event.ctrlKey && event.key == 'o') { //open
        event.preventDefault(); 
        var files= await Neutralino.os.showOpenDialog("Open a file", {
            "multiSelections": true
        })
        files.forEach((file) => {
            loadFile(file)
        })
        return;
      }
    });
};

function onTextChange(event) {
    curFile.setText(mainText.value)
    refreshkeywords()
    scrollCorrection = true;
}

//where we build up the display text for the keyword highlighting and other formatting
function refreshkeywords(){ 
  var text = mainText.value;
  //some cleanup
  var newText = text.replaceAll("<", "&lt;")
                  .replaceAll(">", "&gt;")
                  .replaceAll("\n", " <br/>")
                  .replaceAll("\t", "    ")
  //we work line by line
  var splitLine = newText.split("<br/>");
  newText = "" //will be our final display string
  var isComment = false
  var endLine = true
  var commentColored = false;
  var strCount = 0
  var charCount = 0
  var numberLineText = "" //storing our numberline
  for (var i = 0 ; i < splitLine.length; i++) {
    //checking if the line has a comment and handling it
    var commentSplit = splitLine[i].split(commentSymbol)
    var comment = ""
    numberLineText += i+1 + "<br>" //adding to numberline
    if(commentSplit.length > 1){
          comment = commentSymbol + commentSplit[1] 
          splitLine[i] = commentSplit[0]
    }
    //we split our line by the delimiters, 
    //using this we can split with multiple chars and keep them in the resulting array to format with
    var delimiter = '[(){}<>"\' ;.,+=]'
    var spliText = splitLine[i].split(new RegExp(`(${delimiter})`));
    //handling word by word
    for (var j = 0 ; j < spliText.length; j++) {
      //check if it's a number
      if (!isNaN(parseFloat(spliText[j]))){
        spliText[j] = "<span class='number'>" + spliText[j] + "</span>"
      }
      //check if it's one of our delimiters
      if(delimiter.includes(spliText[j])){
        
        var prefix = ""
        var suffix = ""
        //ignoring delimiters that start with \ (so we can ignore special chars in strings when used this way \' \")
        if(!(j > 0 && spliText[j-1].endsWith("\\") &! spliText[j-1].endsWith("\\\\")))
        {
          //when charCount or strCount are divisable by 2, then we aren't in a string
          if (spliText[j] == '"' && charCount % 2 == 0){
            if(strCount % 2 == 0){
              prefix = "<span class='string'>"
            }
            else{
              suffix = "</span>"
            }
            strCount +=1
          }
          else if (spliText[j] == "'" && strCount % 2 == 0){
            if(charCount % 2 == 0){
              prefix = "<span class='string'>"
            }
            else{
              suffix = "</span>"
            }
            charCount +=1
          }
        }
        newText += prefix + spliText[j]+suffix
        continue;
      }
      //If we're not in a string, check for keywords and format them
      if((strCount+charCount)%2 == 0){
        for (var k = keywords.length - 1; k >= 0; k--) {
          if(spliText[j] == keywords[k]){
            spliText[j] = "<span class='keyword'>"+spliText[j]+"</span>"
          }
        }
      }
      newText += spliText[j]
    }
    //add our comment if it exists
    if (comment.length > 0){
        newText += "<span class='comment'>"+comment+"</span>"
      }
    newText += "<br/>" //adding our newline
  }
  displayText.innerHTML= newText
  numberLine.innerHTML = numberLineText
  refreshFileDrawer() //not efficient but works to show us that we edited the file

}

function onScroll(evt) {
  if (scrollCorrection) {
    // Reset this right off so it doesn't get retriggered by the correction.
    scrollCorrection = false;
    mainText.scrollTop = prevScrollPos + caretCorrection;
    caretCorrection = 0;
  }

  prevScrollPos = mainText.scrollTop;
}

function setCaretCorrection(evt) {
  let caretPos = mainText.selectionStart;
  let scrollingNeeded;
  let amountToScroll;

  /* ... Some code to determine xy position of caret relative to
         mainText viewport, if it is scrolled out of view, and if
         so, how much to scroll to bring it in view. ... */

  if (scrollingNeeded) {
    if (scrollCorrection) {
      // scrollCorrection is true meaning random scroll has not occurred yet,
      // so flag the scroll listener to add additional correction. This method
      // won't cause a flicker which could happen if we scrollBy() explicitly.
      caretCorrection = amountToScroll;
    } else {
      // Random scroll has already occurred and been corrected, so we are
      // forced to do the additional "out of viewport" correction explicitly.
      // Note, in my situation I never saw this condition happen.
      mainText.scrollBy(0, amountToScroll);
    }
  }
}

async function loadFile(file){
  if (file) {
    let data = await Neutralino.filesystem.readFile(file);
    var splitPath = file.split('/');
    var fileName = splitPath[splitPath.length-1]
    mainText.value = data.replaceAll("\t", "    ");
    var openFile = new OpenFile(fileName, file, mainText.value);
    if(openFiles[0].path == "new" && openFiles[0].text == ""){
        openFiles[0] = openFile;
    }else{
        openFiles.push(openFile);
    }
    //refresh everything
    curFile = openFile
    updateLanguageFormat(openFile.name);
    refreshkeywords()
    refreshFileDrawer()
    // const reader = new FileReader();
    // reader.onload = (e) => {
    //   //some small formatting
    //   mainText.value = e.target.result.replaceAll("\t", "    ")
    //   var openFile = new OpenFile(file.name, file.path, mainText.value);
    //   //if we only have a new file and it's empty, replace it
    //   if(openFiles[0].path == "new" && openFiles[0].text == ""){
    //     openFiles[0] = openFile;
    //   }
    //   else{
    //     openFiles.push(openFile);
    //   }
    //   //refresh everything
    //   curFile = openFile
    //   updateLanguageFormat(openFile.name);
    //   refreshkeywords()
    //   refreshFileDrawer()
    // };
    // reader.readAsText(file); // Reads the file as text
  }
}

function refreshFileDrawer(){
  //clear the fileDrawer's children
  fileDrawer.innerHTML = ""
  openFiles.forEach((openFile) => {
    //create a new child
    var div = document.createElement("div");
    div.classList.add("fontMain")
    div.classList.add("filesInDrawer")
    div.innerHTML = openFile.name
    if(!openFile.saved){
      div.innerHTML = "x "+openFile.name
    }
    //if we're editing this file, highlight it
    if(openFile.path == curFile.path){
      div.classList.add("filesInDrawerActive")
    }
    fileDrawer.appendChild(div)
    //add listener to swap to it when we click it
    div.addEventListener("click", (event) => {
      loadOpenFile(openFile);
      refreshFileDrawer();
    });
  })
}

//load a file thats already saved to memory
function loadOpenFile(file){
  curFile = file
  mainText.value = file.getText();
  updateLanguageFormat(curFile.name);
  refreshkeywords();
}

//to allow for dragging and dropping
function dropHandler(event) {
  // Prevent default behavior (Prevent file from being opened)
  event.preventDefault();
  if (event.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...event.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        console.log(item)
        const file = item.getAsFile();
        console.log(file)
        loadFile(file);
      }
    });
  }
}
//load the supported languages under languagesPath
async function loadLanguages(directoryPath){
  //get all files in our dir
  let files = await window.Neutralino.filesystem.readDirectory(directoryPath);
  console.log(files)
  files.forEach(async (file) => {
    const filePath = directoryPath + "/" + file.entry;
    //access our files
    let data = await window.Neutralino.filesystem.readFile(filePath);
      var languagejson = JSON.parse(data)
      //create and save a new Language
      var language = new Language(languagejson.name, languagejson.extention, languagejson.keywords, languagejson.comment);
      languages.set(languagejson.extention, language);
  });
}

//update the Language we're currently using
function updateLanguageFormat(filename){
  //get extention
  var splitname = filename.split('.')
  var lang = languages.get("."+splitname[splitname.length-1])
  //default values
  keywords = []
  commentSymbol = "Long comment symbol no one will find :D"
  //set values
  try {
    keywords = lang.keywords;
    commentSymbol = lang.comment;
  } catch (error) {
    console.error("Couldn't find a proper language file src/languages");
  }
}

//Close our app
function onWindowClose() {
    Neutralino.app.exit();
}
Neutralino.events.on("windowClose", onWindowClose);