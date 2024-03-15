import React, { useEffect, useState} from 'react';
import { View, Text,TouchableOpacity, StatusBar} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Icon from "react-native-feather";

const HomeScreen = ({ navigation }) => {

  const [user,setUser] = useState('')
 
  useEffect(() => {
    checkIfLoggedIn();
    console.log("Users : ", user)
  }, []);


 
  // Fonction pour vérifier si l'utilisateur est connecté
  
  const checkIfLoggedIn = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      navigation.navigate('Login');
    }
    setUser(await AsyncStorage.getItem('userToken'));
  };


  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  const handleUsers = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('Utilisateur');
  };


  

  const handleService = async () => {
     navigation.navigate('Service');
  };

  const handleHistory = async () => {
    navigation.navigate('Historique');
  };

  const handleProduit = async () => {
    navigation.navigate('Produit');
  };

  

  return (
        <View className="bg-[#fafafa] flex-1">    
      <SafeAreaView className="flex-1">
      <StatusBar barStyle='dark-content' backgroundColor='#fff'/>
    
        <View className="flex flex-row">
            <View className="w-72 border-r border-gray-300 h-screen px-2">
            <View className="mt-5">
                  <TouchableOpacity className="mb-3 flex flex-row items-center space-x-5 rounded-lg  bg-white px-8 py-4 justify-between" onPress={handleService}>
                    <Icon.Briefcase className="text-gray-800" width={25} height={25}/>
                    <Text className=" font-[500] text-gray-800 w-28 px-4">Services</Text>
                    <Icon.ChevronRight className="text-gray-800" width={25} height={25}/>
                  </TouchableOpacity>

                  <TouchableOpacity className="mb-3 flex flex-row items-center space-x-5 rounded-lg bg-white px-8 py-4 justify-between " onPress={handleProduit}>
                  <Icon.ShoppingBag className="text-gray-800" width={25} height={25}/>
                    <Text className=" font-[500] text-gray-800  w-28  px-4">Produits</Text>
                    <Icon.ChevronRight className="text-gray-800" width={25} height={25}/>
                  </TouchableOpacity>

                  <TouchableOpacity className="mb-3 flex flex-row items-center space-x-5 rounded-lg bg-white px-8 py-4 justify-between" onPress={handleHistory}>
                  <Icon.Archive className="text-gray-800" width={25} height={25}/>
                    <Text className=" font-[500] text-gray-800  w-28  px-4">Historiques</Text>
                    <Icon.ChevronRight className="text-gray-800" width={25} height={25}/>
                  </TouchableOpacity>

                  {
                    user=="emauAdri" &&  <TouchableOpacity className="mb-3 flex flex-row items-cnter space-x-5 rounded-lg bg-white px-8 py-4 justify-between" onPress={handleUsers}>
                    <Icon.Users className="text-gray-800" width={25} height={25}/>
                      <Text className=" font-[500] text-gray-800 w-28  px-4">Utilisateurs</Text>
                      <Icon.ChevronRight className="text-gray-800" width={25} height={25}/>
                    </TouchableOpacity>
                  }
                 

                  <TouchableOpacity className="mb-3 flex flex-row items-cnter space-x-5 rounded-lg bg-white px-8 py-4 bottom-1" onPress={handleLogout}>
                  <Icon.LogOut className="text-gray-800" width={25} height={25}/>
                    <Text className=" font-[500] text-gray-800 w-36  px-4">Se déconnecter</Text>
                  </TouchableOpacity>
           </View>
            </View>       
            <View className="flex-1 mt-5">
                <Text className="text-center text-base font-[500]  ">Démarrer une facturation </Text>
                <View className="flex flex-row my-5 justify-center">
                        <TouchableOpacity onPress={()=> user!="emauAdri"? navigation.navigate('FactureP'): alert("L'admin ne peut pas démarrer une facturation")}>
                                <View
                                className="w-56 h-32 my-5 py-5 mr-6  rounded-lg bg-white"
                                >
                                <View className="flex-row justify-center"
                                >
                                    <Icon.ShoppingBag className="text-gray-800" width={40} height={40}/>
                                </View>
                                <View className="flex-1 px-2 py-2 space-y-2">
                                    <Text className="text-gray-800 font-[600]   text-center">Produit</Text>
                                </View>
                                </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => user!="emauAdri"?navigation.navigate('FactureS'): alert("L'admin ne peut pas démarrer une facturation")}>
                                <View
                                className="w-56 h-32 my-5 py-5  rounded-lg bg-white"
                                >
                                <View className="flex-row justify-center"
                                >
                                <Icon.Briefcase className="text-gray-800" width={40} height={40}/>
                                </View>
                                <View className="flex-1 px-2 py-2 space-y-2">
                                    <Text className="text-gray-800 font-[600]   text-center">Service</Text>
                                </View>
                                </View>
                        </TouchableOpacity>
                </View>
            </View>
        </View>

      </SafeAreaView>
    </View>  
  );
};



export default HomeScreen;
