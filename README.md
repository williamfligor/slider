## Slider

Upload and view presentations in the web browser

## Requirements (See Dockerfile)

* Node/NPM
* Imagemagick
* GhostScript

## Quick Start

* Export a presentation to PDF
* Clone repository
* Edit `src/index.ts` changing `SLIDE_INTERVAL` to however many seconds you want slides to stay on screen before going to the next slide
* `npm run build`
* `node dist/index.js`
* Go to `localhost:3000/upload` in your browser and upload your PDF
* Go to `localhost:3000` in your browser and it will cycle through the slides
