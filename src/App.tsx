import { useCallback, useState, useEffect, useRef } from 'react';

import CodeMirror from '@uiw/react-codemirror';
import { langs } from '@uiw/codemirror-extensions-langs';
import { sublime } from '@uiw/codemirror-theme-sublime';

import NavBar from './components/Navbar';
import SplitView from './components/SplitView'
import CanvasContainer from './components/CanvasContainer';
import run from './Runner';

/**
 * The central UI component of pico. This component puts all of the separate
 * UI components together (Navbar on top, then below that a SplitView with a
 * CodeMirror component on the left and a CanvasContainer on the right), and
 * also handles the core internal state of the app (the user's code, whether
 * or not it is currently running, intervals to be cleared, errors, etc.)
 */
function App() {
  
  // Setting up state variables and callbacks.

  // Whether or not the code is currently running. This info is related to the
  // user via the run and stop buttons in the navbar. By default, it is not running
  const [isRunning, setRunning] = useState(false);
  // The user's code, in plain text. We initialize it as blank, but after the
  // initial render it will be populated with their previously saved code from
  // localStorage, if it exists.
  const [userCode, setUserCode] = useState("");
  // The error message to display to the user if their code has bugs. If blank,
  // there is no error to display
  const [error, setError] = useState("");
  // A list of running Intervals from setInterval. We don't need to rerender
  // when we modify this, so we use a ref. This is the only reliable way I've
  // found to not have any ghost jobs lingering around after pressing stop.
  const intervals = useRef<number[]>([]);
  function addInterval(id: number) {
    intervals.current.push(id);
  }

  // Callback called whenever the user modifies their code in the CodeMirror
  // component. We save the changes to localStorage and also update the
  // app's state to reflect it
  const onChange = useCallback((value: string) => {
    localStorage.setItem("saved-pico", value);
    setUserCode(value);
  }, []);

  // This is a wrapper around isRunning that actually triggers the code to be
  // run. It does some different things depending on if the code is currently
  // running and if the user wants to start or stop it.
  function modifyRunning(newval: boolean) {
    // if it is already stopped, and user clicks stop again, just return
    if (!newval && !isRunning) return;

    // currently running and needs to be stopped. Clear out all of the currently
    // running intervals, and then set isRunning to false to reflect the stoppage
    // in the UI
    else if (!newval && isRunning) {
      intervals.current.forEach(clearInterval);
      intervals.current = [];
      setRunning(false);
    }

    // was stopped, needs to start. For sanity, we clear out the intervals
    // (should not be necessary), *empty out the error message* so the user can
    // see the canvas again, and start running with their fresh code.
    else if (newval && !isRunning) {
      setRunning(true);
      setError("");
      intervals.current.forEach(clearInterval);
      intervals.current = [];
      run(userCode, setRunning, setError, addInterval);
    }
    // currently runing, needs to be restarted with potentially new user code.
    // Clear out all running intervals, zero out any errors (shouldn't be
    // necessary but again, sanity) and start running with the fresh code.
    else if (newval && isRunning) {
      setRunning(true);
      intervals.current.forEach(clearInterval);
      intervals.current = [];
      setError("");
      run(userCode, setRunning, setError, addInterval);
    }
  }

  // several things on initialization (in two useEffect blocks because one we
  // only want to run once, and the second one we want to update every rerender)

  // 1. load old code from local store, if it exists
  useEffect(() => {
    let stored = localStorage.getItem("saved-pico");
  
    // if the data from localStorage is null or empty, we fill it in with the
    // default template and update localStorage as well
    if(!stored) {
      let defaultCode = `function color(x, y) {\n  return [x / width * 255, y / height * 255, 255];\n}`;
      stored = defaultCode;
      localStorage.setItem("saved-pico", stored);
    }
    setUserCode(stored);
  }, []);

  // 2. set up keyboard shortcut listeners to override defaults. I found running
  // this in the same useEffect as the previous block caused very weird behavior,
  // and it seems that when ctrl-R is pressed, stale (and possibly empty) user
  // code was being run, causing errors.
  useEffect(() => {
    document.addEventListener("keydown", (ev: KeyboardEvent) => {
      if (ev.ctrlKey || ev.metaKey) {
        if (ev.key == "s") {
          // ctrl-S doesn't do anything (for now) - we just prevent the default
          // dialog from popping up because it's annoying and people tend to hit
          // ctrl-S instinctively
          ev.preventDefault();
        } else if (ev.key == "r") {
          ev.preventDefault();
          //if (ev.repeat) return;
          modifyRunning(true);
        }
      }
    });
  });

  return (
    <>
    <NavBar isRunning={isRunning} setRunning={modifyRunning}></NavBar>
    <SplitView>
      <CodeMirror
        value={userCode}
        theme={sublime}
        height="100%"
        extensions={[langs.javascript()]}
        onChange={onChange}
      />
      <CanvasContainer error={error}/>
    </SplitView>
    </>
  );
}

export default App;
