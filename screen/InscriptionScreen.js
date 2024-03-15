// LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, SafeAreaView, StatusBar , StyleSheet, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from "../assets/images/logo.png";
import * as Icon from "react-native-feather";
import { useDispatch, useSelector } from 'react-redux';
import {initializeReduxStoreWithData, deleteUser} from '../slice/redux'


const InscriptionScreen = ({ navigation }) => {
   
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const utilisateur = useSelector(state => state.users);
  
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };
  
    const Connexion = ()=> {
      navigation.navigate('Login');
      setUsername('')
      setPassword('')
    }

    
  useEffect(() => {
    setData(utilisateur);
  }, [utilisateur]);



    const handleInscription = async () => {
        try {
          const newItem = { id: Date.now(), username: username, password: password };
          const mesData = data.filter(item => item.username == newItem.username)
          if (mesData.length>0) {
            // Mise à jour si l'id d'édition est défini
            alert("L'utilisateur existe déjà ! ")
          } else {
             setUsername('')
             setPassword('')
             const updatedData = [...data, newItem];
             await AsyncStorage.setItem('utilisateur', JSON.stringify(updatedData));
             initializeReduxStoreWithData()
            navigation.navigate('Login');
         }
        
        } catch (error) {
          console.error('Erreur lors de l\'enregistrement des données : ', error);
        }
      };

      const deleteItem = async id => {
        try {
          const updatedData = data.filter(item => item.id !== id);
          await AsyncStorage.setItem('utilisateur', JSON.stringify(updatedData));
          dispatch(deleteUser(id))
          //await AsyncStorage.clear();
          initializeReduxStoreWithData()
          console.log("data : ",data)
        } catch (error) {
          console.error('Erreur lors de la suppression des données : ', error);
        }
      };  


  return (
    <SafeAreaView className="bg-white h-full pt-5">
   <StatusBar barStyle='dark-content' backgroundColor='#fff'/>
   <View style={styles.centeredView} >
          <View style={styles.modalView}>
           
       <View className="px-20">
        <View className="flex flex-row justify-center">
         <Image style={{width:130, height:100}} source={logo}/>
        </View>
          <Text className="text-center text-2xl mt-3 text-gray-800  font-[700]">Création de compte</Text>
          <Text className="text-gray-800  font-[600] py-2">Nom d'utilisateur</Text>
          <View className="flex flex-row justify-between items-center mt-1 border-2 px-4  border-[#dfdfdf] rounded-xl">
            <TextInput
              className="text-gray-800  font-[500] py-2 flex-1"
              placeholderTextColor="gray"
              placeholder="Entrer le nom d'utilisateur"
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
          </View>
          <Text className="py-2 text-gray-800  font-[600]">Mot de passe</Text>
          <View className="flex flex-row justify-between items-center mt-1 mb-5 border-2 px-4  border-[#dfdfdf] rounded-xl">
          <TextInput
            className="text-gray-800  font-[500] py-2 flex-1"
            placeholderTextColor="gray"
            placeholder="Entrer le mot de passe"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
           <TouchableOpacity onPress={toggleShowPassword}>
           {showPassword ? <Icon.EyeOff className="text-gray-800" width={20} />  : <Icon.Eye className="text-gray-800" width={20} />}
       
      </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={1} delayPressIn={0} delayPressOut={0} onPress={handleInscription} className="bg-[#00b292]  py-2 flex flex-row justify-center rounded-lg">
              <Text className="text-md text-white font-[600] pb-1">S'incrire</Text>
          </TouchableOpacity>
         <View className="mt-4 flex flex-row space-x-2 justify-center">
            <Text className="font-[500]">Vous n'avez pas de compte ?</Text>
            <TouchableOpacity activeOpacity={1} delayPressIn={0} delayPressOut={0} onPress={Connexion}><Text className="text-[#00b292] font-[500]">Se connecter</Text></TouchableOpacity>
         </View>
         
         {/* <TouchableOpacity onPress={() => deleteItem(1707564069558)} className='p-2 bg-red-500 mt-2'>
              <Text className='text-white'>Supprimer</Text>
            </TouchableOpacity>

         <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View className='my-4 flex flex-row space-x-4'>
             <Text className='text-lg text-gray-800 '>Name : {item.id}</Text>
            <Text className='text-lg text-gray-800 '>Name : {item.username}</Text>
            <Text className='text-lg text-gray-800 '>Password : {item.password}</Text>
          </View>
        )}
      /> */}
      </View> 

          </View></View>
    </SafeAreaView>
  );
};

export default InscriptionScreen;


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
  }, 
});
