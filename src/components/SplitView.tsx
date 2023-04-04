import { useState } from 'react';

interface Props {
  children: any[]
}

/**
 * A SplitView is a generic container that holds two children, one on the left
 * and one on the right, and allows the user to resize the two children by
 * dragging a slider betwen them.
 *
 * For us, we will have the CodeMirror element on the left (children[0]), and
 * the CanvasContainer element on the right (children[1]).
 */
function SplitView({ children }: Props) {
  const [lWidth, setlWidth] = useState(600);

  // We have to name this function so we can reference it later when we
  // removeEventListener.
  // Given a MouseEvent, sets lWidth after clamping the cursor's X position to
  // a reasonable range (200px away from either wall)
  let handleMouseMove = (ev: MouseEvent) => {
    let desiredWidth = ev.clientX - 15;
    if (desiredWidth > window.innerWidth - 200)
      desiredWidth = window.innerWidth - 200;
    if (desiredWidth < 200) desiredWidth = 200;
    setlWidth(desiredWidth);
  }

  // When the user mouseDown's on the grip, we register the handleMouseMove
  // globally so that no matter where on the document the cursor moves, our grip
  // will keep up with it.
  // We also register a callback on mouseup whose sole purpose is to deregister
  // handleMouseMove once the drag has been completed.
  function handleDragStart() {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", handleMouseMove);
    })
  }

  return (
    <div className="split">
      <div className="split-left" style={{ flexBasis: lWidth + "px" }}>{children[0]}</div>
      <div className="grip" onMouseDown={handleDragStart}>⣿</div>
      {children[1]}
    </div>
  );
}

export default SplitView;
