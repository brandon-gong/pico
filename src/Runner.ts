/**
 * The "namespace" that we expect to extract out of the user-written code.
 * The most important value here is the `color` function, which takes in
 * any variety of parameters and returns a 3-tuple of numbers.
 *
 * width, height, and loop are settings that may be modified by the user to
 * control the size of the canvas, and whether or not the sketch should be
 * animated (repeatedly redraw the canvas). Setting loop = false could be very
 * useful especially for more computationally expensive sketches.
 */
type Interpreted = {
	width: number,
	height: number,
	loop: boolean,
	color: any
};

let __internal_Math = Math;


/**
 * The main meat of pico. Takes user code for pixel-by-pixel colors and uses it
 * to draw an animated frame.
 * @param userCode the user's code to be run
 * @param setRunning callback to modify the boolean switch that controls the
 * 	running/not running UI elements. This is used in case of error when running
 * 	the code, or if the user's code has specified noloop (in which case we set
 * 	run to false after the frame has been fully rendered)
 * @param setError callback to modify the error message to be displayed to the
 * 	user.
 * @returns An IntervalID from setInterval that can be cleared later on to stop
 * 	execution.
 */
function naiveRun(
	userCode: string,
	setRunning: (a: boolean) => void,
	setError: (a: string) => void): any {

	// We wrap the user's provided code in some of our own, which pulls out
	// allowable math functions from the builtin Math library, hides the Math
	// library, configures presets for the settings, and then returns everything
	// that we need from the user's code in one neat little dict.
	let f = Function("__internal_Math", `
		let sin = __internal_Math.sin;
		let cos = __internal_Math.cos;
		let tan = __internal_Math.tan;
		let asin = __internal_Math.asin;
		let acos = __internal_Math.acos;
		let atan = __internal_Math.atan;
		let atan2 = __internal_Math.atan2;
		let sinh = __internal_Math.sinh;
		let cosh = __internal_Math.cosh;
		let tanh = __internal_Math.tanh;
		let asinh = __internal_Math.asinh;
		let acosh = __internal_Math.acosh;
		let atanh = __internal_Math.tanh;
		let log = __internal_Math.log;
		let pow = __internal_Math.pow;
		let floor = __internal_Math.floor;
		let ceil = __internal_Math.ceil;
		__internal_Math = undefined;

		let width = 800;
		let height = 800;
		let loop = true;


		${userCode}

		return {
			width: width,
			height: height,
			loop: loop,
			color: color
		}
	`);

	let u: Interpreted = f(__internal_Math);

	// This canvas is guaranteed to exist; see CanvasContainer for what this is
	let canvas = document.getElementById("drawing-area")! as HTMLCanvasElement;
	// Set dimensions of canvas to those specified by the user
	canvas.width = u.width;
	canvas.height = u.height;

	// This is just a small helper function for later - we may get all sorts of
	// crazy numbers from the user, but we really need integers strictly between
	// 0 and 255; this rounds all values and clamps it to the allowable range
	let fix_range = (val: number) => {
		let rounded = Math.round(val);
		let clamped = Math.min(Math.max(rounded, 0), 255);
		return clamped;
	}

	// Tracking mouse movements and button presses for the mouseX, mouseY, and
	// mouseDown parameters available to the user
	let mouseDown: boolean = false;
	canvas.onmousedown = () => mouseDown = true;
	canvas.onmouseup = () => mouseDown = false;
	let mouseX: number = 0;
	let mouseY: number = 0;
	canvas.onmousemove = (e) => {
		const bounding = canvas.getBoundingClientRect();
		mouseX = e.clientX - bounding.left;
		mouseY = e.clientY - bounding.top;
	}

	// Keeps track of the frame number. Also available to the user.
	let frameNumber: number = 0;

	// This function is what actually generates the frame, and is called repeatedly
	// to produce an animation.
	// TODO: move this to a Web Worker? I did try this but performance was
	// significantly impacted. But it would be nice to have a non-blocking UI
	function run() {
		let ctx = canvas.getContext("2d")!;
		let imageData = ctx.createImageData(u.width, u.height);
		let data = imageData.data;
		// This is going to produce unintended effects with detailed or small images;
		// if the user wants smooth curves, they have to make it happen themselves!
		ctx.imageSmoothingEnabled = false;

		// iterate through all the pixels; for each coordinate, call the user's
		// color function (with also the frame number and mouse data provided) and
		// copy it into the imagedata array
		for(let y = 0; y < u.height; y++) {
			for(let x = 0; x < u.width; x++) {

				Math = (undefined as unknown) as Math;
				let color = f(__internal_Math).color(x, y, frameNumber, mouseX, mouseY, mouseDown);
				Math = __internal_Math;
				color = color.map(fix_range);
				data[y * (u.width * 4) + x * 4 + 0] = color[0];
				data[y * (u.width * 4) + x * 4 + 1] = color[1];
				data[y * (u.width * 4) + x * 4 + 2] = color[2];
				data[y * (u.width * 4) + x * 4 + 3] = 255;
			}
		}

		// paint in the image data
		ctx.putImageData(imageData, 0, 0, 0, 0, u.width, u.height);
		frameNumber++;
	}
	if (u.loop) {
		let i = setInterval(() => {
			// We have to specially try-catch the run function; exceptions here
			// WILL NOT be caught outside of here. We do prety much the same things
			// as the run() function does below.
			try {
				run();
			} catch (e) {
				Math = __internal_Math;
				console.log(e);
				let msg;
				if (e instanceof Error) msg = e.message;
				else msg = String(e);
				clearInterval(i);
				setRunning(false);
				setError(msg);
			}}, 33); // 33msec between frames = roughly 30fps, a pretty good target imo
		return i;
	} else {
		// We aren't looping, so just run once, show when it has stopped, and
		// return an interval id that is not possible.
		run();
		setRunning(false);
		return -1;
	}
}

/**
 * The main entry point to the Runner module. This function is called by the UI
 * when the user wishes to run their code and see the results on the canvas.
 *
 * @param userCode the user's code to run
 * @param setRunning a callback to update the UI to reflect whether the code
 * 	is actively running or not.
 * @param setError a callback to update the UI to show if there is an error.
 * @param addInterval an callback to add the newly created IntervalID to an
 *	internal record that will be wiped between runs.
 */
function run(
	userCode: string,
	setRunning: (a: boolean) => void,
	setError: (a: string) => void,
	addInterval: (a: number) => void) {

		// This function is basically just a wrapper over naiveRun, to catch any
		// stray errors that might occur and report them to the user.
		let intervalId;
		try {
			intervalId = naiveRun(userCode, setRunning, setError);
		} catch(e) {

			// The error might have occurred between when we un-defined math and
			// restored it, so we restore it here to be sure its available
			Math = __internal_Math;
			console.log(e);

			// TypeScript shenanigans - the error might not actually be an Error type,
			// if its not, we make the best of what we've got by stringifying it
			let msg;
			if (e instanceof Error) msg = e.message;
			else msg = String(e);

			// Clear out this interval since it's causing errors
			clearInterval(intervalId);

			// update UI elements
			setRunning(false);
			setError(msg);

			intervalId = -1;
		} finally {
			// Add the newly-created interval for bookkeeping purposes
			addInterval(intervalId);
		}
}

export default run;
