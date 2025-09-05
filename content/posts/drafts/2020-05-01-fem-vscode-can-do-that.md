---
layout: post
title: "Frontend Masters: Visual Studio Code Can Do That"
---

## Reference
https://burkeholland.gitbook.io/vs-code-can-do-that/

## Useful command to find and kill processes

### Mac/Linux: 

`lsof -i tcp:3000` then `kill <process id>`

### Windows

`netstat -ano | findstr :3000` then `taskkill /PID typeyourPIDhere /F`

## Basic shortcuts
Action | Keyboard shortcut
---|---
Toggle Sidebar | Cmd/Ctrl + B
Open Command Palette | Cmd/Ctrl + Shift + P
Open File Switcher | Cmd/Ctrl + P
Toggle Integrated Terminal | Cmd/Ctrl + `
Open Settings | Cmd/Ctrl + ,

## Customising the Editor

* Light themes: Hop Light; Night Owl Light; Noctis / Noctis Hibernis; Min Light
* Dark themes: Night Owl; Cobalt2; Dracula
* Icon themes: Seti (default); Material icon theme
* Fonts: change fonts and use ligatures if desired
* Open Settings JSON - to open the settings as a JSON file - shows only the settings overriden from the default
* Disable the minimap
* Move sidebar to the right (doesn't cause main text to jump when opening and closing - ctrl B)
* Dial down open editors setting to 0 so this isn't listed in the sidebar
* Open "Keyboard Shortcuts" to see all the shortcuts
* Turn breadcrumbs off (but I like them)
* Right click on items in the status bar to hide them
* Toggle the activity bar visibility - can map a keyboard shortcut to this e.g. ctrl-shift B - also can use keyboard shortcuts to access activities and once learnt, then no longer need the bar
* Use John Papa's Peacock extension to change the color of e.g. the top bar if multiple VS code windows are open for e.g. FE and API

## Emmet

* Built into VS Code for HTML and CSS
* Simple CSS framework: https://bulma.io

### CSS

* h100p TAB `height: 100%;`
* h100 TAB `height: 100px;`
* mw1400 TAB `min-width: 1400px;`
* bgi TAB `background-image: url();`

### Balance

* **Balance outwards** to select whole div (^ + Shift + down arrow)
* **Balance inwards** to deselect outer most div (^ + Shift + up arrow)
* **Wrap with abbreviation** to wrap the section using an emmet abbreviation e.g. `.app` for `<div class="app"></div>` 

