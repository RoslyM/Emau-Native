import Navigation from './navigation';
import {Provider} from "react-redux"
import {store} from './slice/redux'

export default function App() {
  return (
    <Provider store={store}>
        <Navigation/>
    </Provider>
  );
}

