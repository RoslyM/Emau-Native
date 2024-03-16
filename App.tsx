import React, { useEffect } from 'react';
import { View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Navigation from './navigation';
import { Provider } from 'react-redux';
import { store } from './slice/redux';

export default function App() {
  useEffect(() => {
    // Verrouiller l'orientation en mode paysage
    Orientation.lockToLandscape();
    
    // Déverrouiller l'orientation lorsqu'elle n'est plus nécessaire
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    <Provider store={store}>
      <Navigation/>
    </Provider>
  );
}
