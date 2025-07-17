# Artext
Artext is an in-development code editor that lets you paint over your code/text.
Use Ctrl+O to open files, Ctrl+S to save, Ctrl+Shift+S to save as, and Ctrl+N to make a new file.

- Full support for adding your own programming languages
- Paint over your code
- Built with customizability in mind

## The paint
- Hold Alt and use the left mouse button to draw.
- Hold Ctrl+Alt and the left mouse button to erase.
- Ctrl+Alt+Z to Undo.

The paint automatically gets saved with your art (If you save the file) into a .art folder in the same directory as your code/text file
## Currently supports:
- Python
-  C#
-  Javascript 

It's very easy to add custom support, just copy the format in [languages](https://github.com/Youssef-Mag/artext/tree/master/languages) and put it in said file.

built with html/css/js and [Neutralinojs](https://neutralino.js.org/).

# Development
setting up a dev environment:
- Install Neutralinojs cli 
	```npm install -g @neutralinojs/neu```
- Head to the Artext directory
- run ```neu run``` to test your build
- run ```neu build --release``` to package Artext to all binaries
- put the languages folder in the same directory as the executable

You can rebuild Artext with your preffered theme until custom theme support is added, check [styles.css](https://github.com/Youssef-Mag/artext/blob/master/resources/styles.css).