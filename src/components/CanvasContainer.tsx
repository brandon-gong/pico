interface CanvasContainerProps {
	error?: string
}

/**
 * A super simple component that:
 * - wraps the <canvas> element in a div that works better with SplitView's
 * 	flexbox, and also handles scrolling when the canvas is too big
 * - displays error messages to the user. If there is an error, the canvas is
 * 	hidden from the user.
 */
function CanvasContainer({error = ""}: CanvasContainerProps) {
	return (
		<div className="canvas-container">
			{error && <div className="error">{error}</div>}
			<canvas id="drawing-area" style={{display: (error) ? "none" : "unset"}}></canvas>
		</div>
	);
}

export default CanvasContainer;
