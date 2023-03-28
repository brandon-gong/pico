import logo from '../pico.png';
import stop from '../stop.png';
import stopActive from '../stop-active.png';
import run from '../run.png';
import runActive from '../run-active.png';
import help from '../help.png';

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
			{/* TODO need to fix this href link once i've got the help page / tutorial together */}
			<a href="https://www.brandongong.org/blog/" className='right'><img src={help}/></a>
			<a onClick={() => setRunning(false)} className='right'><img src={!isRunning ? stopActive : stop}/></a>
			<a onClick={() => setRunning(true)} className='right'><img src={isRunning ? runActive : run}/></a>
		</nav>
	)
}

export default NavBar;
