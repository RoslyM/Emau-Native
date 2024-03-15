import React, { useEffect } from 'react';
import { View, Text, StyleSheet , Image} from 'react-native';
import logo from "../assets/images/logo.png";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = () => {

    const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      checkIfLoggedIn()
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const checkIfLoggedIn = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      navigation.replace('Login');
    }else{
      navigation.replace('Home'); 
    }
  };

  return (
    <View style={styles.container}>
      <Image style={{width:150, height:130}} source={logo}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Couleur de fond de votre écran de démarrage
  },
});

export default SplashScreen;
