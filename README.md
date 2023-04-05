<p align="center">
  <img width="400" src="./images/logo.png">
</p>

*This README provides examples and technical implementation details for Pico.
For a guided introduction and tutorial, see [this blog post](https://www.brandongong.org/2023/03/28/welcome-to-pico/), or read [the documentation](https://www.brandongong.org/2023/03/28/pico-documentation/).*

Pico is an environment for creating generative, procedural art
with JavaScript on a very low level. Users provide a function that takes in
a pixel's X and Y coordinates (and some other optional data) and returns a color
value.

## Examples
Click the title to view the corresponding source code for each example sketch.

### [Red square](https://github.com/brandon-gong/pico/blob/main/examples/red_square.js)
![red square](./images/red.png)

### [Gradient](https://github.com/brandon-gong/pico/blob/main/examples/gradient.js)
![gradient](./images/gradient.png)

### [Checkerboard](https://github.com/brandon-gong/pico/blob/main/examples/checkerboard.js)
![checkerboard](./images/checkerboard.png)

### [Metaballs](https://github.com/brandon-gong/pico/blob/main/examples/metaballs.js)
![Metaballs](./images/metaball.gif)

### [Mandelbrot](https://github.com/brandon-gong/pico/blob/main/examples/mandelbrot.js)
![Mandelbrot](./images/mandelbrot.png)

## Project structure


## Building and running
To run this project locally, you need to have `npm` installed.
- Clone this repository to your local machine.
  ```sh
  git clone https://github.com/brandon-gong/pico.git
  cd pico
  ```
- Install all dependencies for the project.
  ```sh
  npm install
  ```
- Start the project running. After this, all changes to the source
  code will be automatically compiled and updated on the page.
  ```sh
  npm start
  ```
The below note only applies to those who have push access to this
repository (me only currently).
- To deploy the project to GitHub pages, the relevant changes have
  already been made in `package.json`. Simply run
  ```sh
  npm run deploy
  ```

## Final thoughts
This project was tossed together in literally one day, so there are
of course still some features to be desired. Off the top of my head,
- Better error reporting. This is a bit hard to do, since JS doesn't throw very accurate errors for blobbed code, but it would
make it much more usable to see red squigglies in the code.
- Investigate further into Web Workers. I did try this, but it significantly decreased the performance compared to doing it on the main thread. The two main motives are to not lag the main thread (and crash the tab) when doing heavy computations, and to also possibly speed things up, since this is an [embarrassingly parallel](https://en.wikipedia.org/wiki/Embarrassingly_parallel) task.
- Saving files. Currently users can only save one file, and its
stored in `localStorage`, which is by no means a reliable place to
put things. But I'm not quite sure how to implement this without
implementing user logins, which I am not that interested in doing. Contributions are welcome
