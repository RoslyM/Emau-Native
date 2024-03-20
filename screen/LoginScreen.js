// LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, SafeAreaView, StatusBar, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from "../assets/images/logo.png";
import * as Icon from "react-native-feather";
import {useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  username: yup.string().required('Le nom est requis'),
  password: yup.string().min(4, 'Le mot de passe doit comporter au moins 4 caractères').required('Le mot de passe est requis'),
});


const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState([]);
  const utilisateur = useSelector(state => state.users);

 
  useEffect(() => {
    setData(utilisateur);
    checkIfLoggedIn();
  }, [utilisateur]);


  const checkIfLoggedIn = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    // if (userToken) {
    //   navigation.navigate('Home');
    // }
  };

  const handleLogin = async (values) => {
    // Vérifier les informations de connexion
    const monItem = { username: values.username, password:values.password };
    const mesData = data.filter(item => item.username == monItem.username && item.password == monItem.password)
    console.log(mesData)

    if (mesData.length>0 ||( monItem.username=="emauAdri" && monItem.password == "emauAdri" ) ) {
      //Stocker le jeton d'utilisateur pour indiquer qu'il est connecté
      if (mesData && mesData.length > 0) {
        // Utilise le premier élément de mesData s'il est défini, sinon utilise "emauAdri"
        await AsyncStorage.setItem('userToken', mesData[0].username);
    } else {
        // Si mesData n'est pas défini ou s'il est vide, utilise "emauAdri"
        await AsyncStorage.setItem('userToken', "emauAdri");
    }
      navigation.replace('Home');
    } else {
      alert('Nom d\'utilisateur ou mot de passe incorrect');
   }

  };

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const Inscription = ()=> {
    navigation.navigate('Inscription');
    setUsername('')
    setPassword('')
  }

  return (
    <SafeAreaView className="bg-white h-full ">
     <StatusBar barStyle='dark-content' backgroundColor='#fff'/>

   
        <View style={styles.centeredView} >
          <View style={styles.modalView}>
           
          <Formik
      initialValues={{ username: '', password:'' }}
      validationSchema={validationSchema}
      onSubmit={(values) => handleLogin(values)}
    >
       {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View className="px-20">
          <View className="flex flex-row justify-center">
           <Image style={{width:130, height:100}} source={logo}/>
          </View>
          <Text className="text-center text-2xl  text-gray-800  font-[700] mt-3">Content de te revoir!</Text>

          <Text className="text-gray-800  font-[500] py-2">Nom d'utilisateur</Text>
          <View className={`flex flex-row justify-between items-center mt-1 border-2 px-4 rounded-xl ${touched.username && errors.username ? 'border-red-500' : 'border-gray-200'}`}>
            <TextInput
              className="text-gray-800  font-[500] py-2 flex-1"
              placeholderTextColor="gray"
              placeholder="Entrer le nom d'utilisateur"
              defaultValue={username}
              onBlur={handleBlur('username')}
             onChangeText={handleChange('username')}
            />
          </View>
          {touched.username && errors.username && <Text className="pt-2" style={{ color: 'red' }}>{errors.username}</Text>}
          <Text className=" py-2 text-gray-800  font-[600]">Mot de passe</Text>
          <View className={`flex flex-row justify-between items-center mt-1 border-2 px-4 rounded-xl ${touched.password && errors.password ? 'border-red-500' : 'border-gray-200'}`}>
          <TextInput
            className="text-gray-800  font-[500] py-2 flex-1"
            placeholderTextColor="gray"
            placeholder="Entrer le mot de passe"
            secureTextEntry={!showPassword}
            defaultValue={password}
            onBlur={handleBlur('password')}
           onChangeText={handleChange('password')}
          />
           <TouchableOpacity onPress={toggleShowPassword}>
           {showPassword ? <Icon.EyeOff className="text-gray-800" width={20} />  : <Icon.Eye className="text-gray-800" width={20} />}
       
      </TouchableOpacity>
          </View>
          {touched.password && errors.password && <Text className="pt-2" style={{ color: 'red' }}>{errors.password}</Text>}
          <TouchableOpacity activeOpacity={1} delayPressIn={0} delayPressOut={0} onPress={handleSubmit} className="bg-[#00b292] mt-5 py-2 flex flex-row justify-center rounded-lg">
              <Text className="text-md text-white font-[600] pb-1">Se connecter</Text>
          </TouchableOpacity>
         {/* <View className="mt-4 flex flex-row space-x-2 justify-center ">
            <Text className="font-[500] ">Vous n'avez pas de compte ?</Text>
            <TouchableOpacity activeOpacity={1} delayPressIn={0} delayPressOut={0} onPress={Inscription}><Text className="text-[#00b292] font-[500] ">Créer compte</Text></TouchableOpacity>
         </View> */}
         </View>
    )}
        </Formik>
          </View>
        </View>
     
    </SafeAreaView>
  );
};

export default LoginScreen;



const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 25,
    paddingBottom: 70
  }, 
});
