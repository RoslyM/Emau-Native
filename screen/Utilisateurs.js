import React, { useEffect, useState, useRef} from 'react';
import { View, Text,TouchableOpacity, ScrollView,  Alert, Modal, StyleSheet, Pressable, TextInput, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Icon from "react-native-feather";
import { useDispatch, useSelector } from 'react-redux';
import {initializeReduxStoreWithData, deleteUser} from '../slice/redux'

export default function ServiceView() {

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true)
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };
    const [edit, setEdit] = useState(false)

    const [editData, setEditData] = useState('')

    const handleEdit = async (objet) => {
        setEdit(true)
        setModalVisible(true)
        setUsername(objet.username)
        setPassword(encryptPassword(objet.password, key))
        const itemToEdit = data.find(item => item.id === objet.id);
        setEditData(itemToEdit.id);
        
      };

      const ouvreModal = () =>{
        console.log("gchg")
        setEdit(false)
        setModalVisible(true)
        setUsername('')
        setPassword('')
      }


      const [data, setData] = useState([]);
      const services = useSelector(state => state.users);

      useEffect(() => {
        setData(services);
        setLoading(false);
      }, [services]);

  

      const handleService = async () => {

        try {
          const newItem = { id: Date.now(), username: username, password: password };
          const mesData = data.filter(item => item.username == newItem.username)

          if (editData !== '') {
            // Mise à jour si l'id d'édition est défini
            const updatedData = data.map(item =>
              item.id === editData ? newItem : item
            )
            setLoading(true);
            setModalVisible(false)
           await AsyncStorage.setItem('utilisateur', JSON.stringify(updatedData));
           initializeReduxStoreWithData()
         }else if (mesData.length>0) {
            setEditData('')
            // Mise à jour si l'id d'édition est défini
            alert("L'utilisateur existe déjà ! ")
          } else {
            setLoading(true);
            setModalVisible(false)
            setEditData('')
            setUsername('')
            setPassword('')
             const updatedData = [...data, newItem];
             await AsyncStorage.setItem('utilisateur', JSON.stringify(updatedData));
             initializeReduxStoreWithData()
             
         }

         setEditData('')
        
        } catch (error) {
          console.error('Erreur lors de l\'enregistrement des données : ', error);
        }
      };

      const [selectDelete, setSelectDelete] = useState('')

      const deleteItem = async item => {
        setModalVisibleDelete(true)
        setSelectDelete(item)
      };  

      const handleDelete = async ()=>{
        try {
            const updatedData = data.filter(item => item.id !== selectDelete.id);
            await AsyncStorage.setItem('utilisateur', JSON.stringify(updatedData));
            dispatch(deleteUser(selectDelete.id))
           // await AsyncStorage.clear();
            initializeReduxStoreWithData()
            setModalVisibleDelete(false)
            console.log("data : ",data)
            setLoading(true);
          } catch (error) {
            console.error('Erreur lors de la suppression des données : ', error);
          }
      } 

     

      const [seachService,setSeachService] = useState('')
  
      const visibleProduit = data.filter(service =>{
        if(seachService && (!service.username.toLowerCase().includes(seachService.toLowerCase()))){
          return false
        }
        return true
      })

    // Fonction pour chiffrer un mot de passe en utilisant XOR avec une clé
function encryptPassword(password, key) {
  let encryptedPassword = "";
  for (let i = 0; i < password.length; i++) {
      encryptedPassword += String.fromCharCode(password.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return encryptedPassword;
}

// Fonction pour déchiffrer un mot de passe chiffré avec la méthode XOR
function decryptPassword(encryptedPassword, key) {
  let decryptedPassword = "";
  for (let i = 0; i < encryptedPassword.length; i++) {
      decryptedPassword += String.fromCharCode(encryptedPassword.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return decryptedPassword;
}

// Exemple d'utilisation

const key = "4380ZX%"; // Clé de chiffrement (plus de 5 caractères)
const encryptedPassword = encryptPassword(password, key);
console.log("Mot de passe chiffré :", encryptedPassword);

const decryptedPassword = decryptPassword(encryptedPassword, key);
console.log("Mot de passe déchiffré :", decryptedPassword);



   
  return (
    <View className="bg-[#fafafa] flex-1">
      
      <SafeAreaView className="flex-1">
                <View className="px-5 pt-5 pb-3 bg-white  flex flex-row justify-center space-x-5 items-center">
                <Icon.Users className="text-gray-800" width={25} height={25}/>
                <Text className="text-center">Mes Utilisateurs</Text>
                </View>   

                <View className="flex-row justify-between items-center space-x-3 mt-4 border-2 border-gray-200 rounded-xl mx-3 p-2 px-4 bg-white">
        <View className="flex-row items-center flex-1  rounded-2xl">
          {/* <MagnifyingGlassIcon stroke={30} color="gray" /> */}
          <TextInput  value={seachService}  onChangeText={(text) => setSeachService(text)} placeholder='Rechercher en fonction du nom'  className="ml-3 text-gray-800 flex-1" />
        </View>
        <View className="bg-white rounded-2xl">
          <Icon.Search className="text-gray-400"/>
        </View>
      </View>

           
                <View className="mt-4 mx-3">
      <View className="flex flex-row bg-white">
        <View className="flex-1 p-2">
          <Text className="text-center text-gray-800  font-[500] ">Nom d'utilisateur</Text>
        </View>
        <View className="flex-1 p-2">
          <Text className="text-center text-gray-800  font-[500] ">Mot de passe</Text>
        </View>
        <View className="flex-1 p-2">
          <Text className="text-center text-gray-800  font-[500] ">Actions</Text>
        </View>
        
      </View>
      
      <ScrollView
                showsHorizontalScrollIndicator={true}
            >
              <View className="pb-32 mb-32">
              {visibleProduit.reverse().map(((item, index) =>{
            return (
              <View key={item.id} className={`"flex flex-row ${index%2==0?'bg-green-50 ':''}"`}>
        <View className="flex-1 p-2 border-2 border-gray-200">
          <Text className="text-center  text-gray-800 ">{item.username}</Text>
        </View>
        <View className="flex-1 p-2 border-2 border-gray-200">
          <Text className="text-center  text-gray-800 ">{encryptPassword(item.password, key)}</Text>
        </View>
        <View className="flex-1 p-2 border-2 border-gray-200">
            <View className="flex flex-row justify-center space-x-8 items-center">
                <TouchableOpacity onPress={()=>handleEdit(item)}>
                    <Icon.Edit stroke='#00b292' width={25} height={25}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>deleteItem(item)}>
                    <Icon.Delete  className="text-red-500" width={25} height={25}/>
                </TouchableOpacity>
            </View>
        </View>
      </View>
           
            )
        }))}
              </View>
 </ScrollView>


 {
  loading? (
    <View className="flex flex-col justify-center items-center absolute right-96 top-24">
      <ActivityIndicator size="large" />
    </View>
  ) : visibleProduit.length < 1 ? (
    <View className="flex flex-col justify-center items-center absolute right-80 top-24">
      <Icon.Database className="text-gray-400" width={50} height={50}/>
      <Text className="pt-4 text-gray-400">Aucune donnée disponible</Text>
    </View>
  ) : null
}

    </View>
                

                <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView} >
          <View style={styles.modalView}>
           
           <View className="flex flex-row items-center justify-between">
                <Text className="font-[500]  text-gray-800 ">{edit?'Modifier un Service':'Ajouter un Service'}</Text>
                <Pressable
                    onPress={() => setModalVisible(!modalVisible)}>
                        <Icon.XOctagon width={30} height={30} stroke='#00b292'/>
                </Pressable>  
           </View>
           

              <Text className="text-gray-800  font-[500]  py-2">Nom de l'utilisateur</Text>
          <View className="flex flex-row justify-between items-center mt-1 border-2 px-4  border-gray-200 rounded-xl">
            <TextInput
              className="text-gray-800  font-[500] py-2 flex-1"
              placeholderTextColor="gray"
              placeholder="Entrer le nom de l'utilisateur"
             value={username}
            onChangeText={(text) => setUsername(text)}
            />
          </View>
          <Text className="py-2 text-gray-800  font-[600]">Mot de passe</Text>
          <View className="flex flex-row justify-between items-center mt-1 mb-5 border-2 px-4  border-gray-200 rounded-xl">
          <TextInput
            className="text-gray-800  font-[500] py-2 flex-1"
            placeholderTextColor="gray"
            keyboardType="numeric"
            placeholder="Entrer le mot de passe"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

<TouchableOpacity onPress={toggleShowPassword}>
           {showPassword ? <Icon.EyeOff className="text-gray-800" width={20} />  : <Icon.Eye className="text-gray-800" width={20} />}
       
      </TouchableOpacity>
          
          </View>
          
          
          <View className="flex flex-row space-x-5 items-center">
                <TouchableOpacity activeOpacity={1} delayPressIn={0} delayPressOut={0}  className="py-2 border-2 border-gray-200 rounded-lg w-full flex-1" onPress={() => setModalVisible(!modalVisible)}>
                    <Text className="text-md text-gray-800  font-[600] pb-1 text-center">Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} delayPressIn={0} delayPressOut={0}  className="bg-[#00b292] py-2 rounded-lg w-full flex-1" onPress={handleService}>
              <Text className="text-md text-white font-[600] pb-1 text-center">{edit?'Modifier':'Ajouter'}</Text>
             </TouchableOpacity>
          </View>
          </View>
        </View>

        
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleDelete}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

          <View className="flex flex-row items-center justify-between mb-3">
                 <Text className="font-[500]  text-gray-800 ">Voulez vous supprimer le service " {selectDelete.username} " ?</Text>
                <Pressable
                    onPress={() => setModalVisibleDelete(!modalVisibleDelete)}>
                        <Icon.XOctagon width={30} height={30} stroke='#00b292'/>
                </Pressable>  
           </View>

          <View className="flex flex-row space-x-5 items-center mt-5">
                <TouchableOpacity activeOpacity={1} delayPressIn={0} delayPressOut={0}  className="py-2 border-2 border-gray-200  rounded-lg w-full flex-1" onPress={() => setModalVisibleDelete(!modalVisibleDelete)}>
                    <Text className="text-md text-gray-800  font-[600] pb-1 text-center">Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} delayPressIn={0} delayPressOut={0}  className="bg-red-500 py-2 rounded-lg w-full flex-1" onPress={handleDelete}>
                <Text className="text-md text-white font-[600] text-center pb-1">Oui, Supprimer</Text>
                 </TouchableOpacity>
          </View>
          </View>
        </View>
      </Modal>
      
    </View>


    <TouchableOpacity  onPress={ouvreModal} className="bg-[#00b292] rounded-full w-12 h-12 flex justify-center items-center flex-row absolute bottom-10 right-5">
    <Text className="text-2xl text-center text-white">+</Text>
    </TouchableOpacity>
              
      </SafeAreaView>
    </View>  
  )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 50,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 25,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    }, 
  });

