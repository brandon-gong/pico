import logo from '../assets/pico.png';
import stop from '../assets/stop.png';
import stopActive from '../assets/stop-active.png';
import run from '../assets/run.png';
import runActive from '../assets/run-active.png';
import help from '../assets/help.png';

interface NavBarProps {
	isRunning: boolean;
	setRunning: (a: boolean) => void;
}

/**
 * The navbar mainly has two buttons we need to manage - the run and stop
 * buttons. Those buttons are conditionally rendered based on the App's state.
 * Note that setRunning here is not the setRunning callback defined in App.tsx;
 * that callback is wrapped in a more complex helper function before being
 * passed here as a prop.
 */
function NavBar({isRunning, setRunning}: NavBarProps) {
	return (
		<nav>
			<a href="#" className="left"><img src={logo} /></a>
			<a href="https://www.brandongong.org/2023/03/28/welcome-to-pico/" className='right'><img src={help}/></a>
			<a onClick={() => setRunning(false)} className='right'><img src={!isRunning ? stopActive : stop}/></a>
			<a onClick={() => setRunning(true)} className='right'><img src={isRunning ? runActive : run}/></a>
		</nav>
	)
}

export default NavBar;
