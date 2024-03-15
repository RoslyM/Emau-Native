// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screen/LoginScreen';
import InscriptionScreen from './screen/InscriptionScreen'
import HomeScreen from './screen/HomeScreen'
import ServiceView from './screen/ServiceView';
import ProduitScreen from './screen/ProduitScreen'
import FactureProduit from './screen/FactureProduit';
import FactureService from './screen/FactureService'
import HistoriqueScreen from './screen/HistoriqueScreen'
import SplashScreen from './screen/SplashScreen'
import Utilisateur from './screen/Utilisateurs'


const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Connexion' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
        <Stack.Screen name="Inscription" component={InscriptionScreen} options={{ title: 'Inscription' }} />
        <Stack.Screen name="Service" component={ServiceView} options={{ title: 'Service' }} />
        <Stack.Screen name="Produit" component={ProduitScreen} options={{ title: 'Produit' }} />
        <Stack.Screen name="FactureP" component={FactureProduit} options={{ title: 'FactureP' }} />
        <Stack.Screen name="FactureS" component={FactureService} options={{ title: 'FactureS' }} />
        <Stack.Screen name="Historique" component={HistoriqueScreen} options={{ title: 'Historique' }} />
        <Stack.Screen name="Utilisateur" component={Utilisateur} options={{ title: 'Utilisateur' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;