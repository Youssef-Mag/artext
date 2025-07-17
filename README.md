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

# Full custom theme support coming soon
Currently you can fully customize the theme but you have to recompile Artext, check [styles.css](https://github.com/Youssef-Mag/artext/blob/master/resources/styles.css) and Neutralino's [getting started guide](https://neutralino.js.org/docs/getting-started/your-first-neutralinojs-app).
## Development
To run Artext from source, install [Node.js](https://nodejs.org/) and the Neutralino CLI:

```bash
npm install -g @neutralinojs/neu
```

Start the development server with:

```bash
neu run
```

This command downloads the Neutralino runtime if required and launches the app. Edit the files in `resources/` and reload to see your changes. Use `neu build --release` to create distributable binaries.
