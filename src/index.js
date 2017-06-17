import ReactDOM from 'react-dom';
import './index.css';
import { makeMainRoutes } from './routes';

const routes = makeMainRoutes();

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// // http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
  routes,
  document.getElementById('root')
);
