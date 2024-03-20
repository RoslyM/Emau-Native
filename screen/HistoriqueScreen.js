import React, { useEffect, useState, useRef } from 'react';
import { View, Text,TouchableOpacity, ScrollView, Alert, Modal, StyleSheet, Pressable, TextInput, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Icon from "react-native-feather";
import { useDispatch, useSelector } from 'react-redux';
import {initializeHistorique, initializeHistoriqueP} from '../slice/redux'


export default function ServiceView() {

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
 

      const [data, setData] = useState([]);
      const [dataP, setDataP] = useState([]);
     
      const historique =  useSelector(state => state.historiques);
      const historiqueP =  useSelector(state => state.historiquesP);
      const [loading, setLoading] = useState(true)
      useEffect(() => {
        setData(historique);
        setDataP(historiqueP)
        console.log("Historique Service : ", historique)
        setLoading(false);
      }, [historique,historiqueP]);

      

      const [seachService,setSeachService] = useState('')
      const [pageService, setPageService] = useState(true)

     
      const visibleProduit = pageService?data.filter(service =>{
        if(seachService && (!service.utilisateur.toLowerCase().includes(seachService.toLowerCase()) && !String(service.date).includes(seachService) && !String(service.id).includes(seachService)&& !String(service.montant).includes(seachService))){
          return false
        }
        return true
      }): dataP.filter(service =>{
        if(seachService && (!service.utilisateur.toLowerCase().includes(seachService.toLowerCase()) && !String(service.date).includes(seachService) && !String(service.id).includes(seachService)&& !String(service.montant).includes(seachService))){
          return false
        }
        return true
      })

     

    const [mesDonne, setMesDonne] = useState([])

    
      const OneHistorique = (id) =>{
        setModalVisibleDelete(true)
        setMesDonne(visibleProduit.filter(tab =>{
            if(tab.id === id){
                return true
            }
            return false
        }))
      }



      const deleteItem = async id => {
        try {
          setLoading(true)
          const updatedData = pageService? data.filter(item => item.id != id):dataP.filter(item => item.id != id); 
          pageService? await AsyncStorage.setItem('historiques', JSON.stringify(updatedData)):await AsyncStorage.setItem('historiquesP', JSON.stringify(updatedData))
          //await AsyncStorage.clear();
          initializeHistorique()
          initializeHistoriqueP()
          console.log("Données : ",data)
          console.log("Object : ", updatedData)
        } catch (error) {
          console.error('Erreur lors de la suppression des données : ', error);
        }
      };  

     

  return (
    <View className="bg-[#fafafa] flex-1">
      
      <SafeAreaView className="flex-1">
                <View className=" pt-5 pb-3 bg-white  flex flex-row justify-center space-x-5 items-center">
                <Icon.Archive className="text-gray-800" width={25} height={25}/>
                <Text className="text-center">Mes Historique {pageService?'Service':'Produit'}</Text>
                </View>   

            <View className="flex-row justify-between items-center space-x-3 mt-5 mb-2 border-2 border-gray-200 rounded-xl mx-3 py-2 px-4 bg-white">
                <View className="flex-row items-center flex-1  rounded-2xl">
                {/* <MagnifyingGlassIcon stroke={30} color="gray" /> */}
                <TextInput  value={seachService}  onChangeText={(text) => setSeachService(text)} placeholder='Rechercher en fonction du nom de celui qui a imprimé, montant , id et de la date'  className="ml-3 text-gray-800 flex-1" />
               </View>
                <View className="bg-white rounded-2xl">
                <Icon.Search className="text-gray-400"/>
                </View>
            </View>

            <View className="flex flex-row">
            <View className="w-72 border-r border-gray-300 h-screen px-2">
            <View className="mt-5">
                  <TouchableOpacity className="mb-3 flex flex-row items-center space-x-5 rounded-lg bg-white px-8 py-4 justify-between"  onPress={()=>setPageService(true)}>
                  <Icon.Briefcase className="text-gray-800" width={25} height={25}/>
                    <Text className=" font-[500] text-gray-800  w-28  px-4">Services</Text>
                    <Icon.ChevronRight className="text-gray-800" width={25} height={25}/>
                  </TouchableOpacity>
                  <TouchableOpacity className="mb-3 flex flex-row items-center space-x-5 rounded-lg bg-white px-8 py-4 justify-between"  onPress={()=>setPageService(false)}>
                  <Icon.ShoppingBag className="text-gray-800" width={25} height={25}/>
                    <Text className=" font-[500] text-gray-800  w-28  px-4">Produits</Text>
                    <Icon.ChevronRight className="text-gray-800" width={25} height={25}/>
                  </TouchableOpacity>
           </View>
            </View>  

            <ScrollView
                showsHorizontalScrollIndicator={true}
            >
              <View className="pb-20 mb-20">
              {visibleProduit.reverse().map(((item) =>{
                const { id, date, utilisateur, montant } = item;
            return (
                <TouchableOpacity key={item.id} onPress={()=>OneHistorique(id)}>
                     <View className="bg-white mb-3 flex flex-row justify-between px-5 py-3 mx-3 items-center">
                        <View>
                             <Text className="pb-3 text-gray-800">Nom de l'utilisateur  : {utilisateur}</Text>
                             <Text className="pb-3 text-gray-800">Montant : <Text className="font-bold">{montant}</Text> </Text>
                        </View>
                        <View>
                            <Text className="pb-3 text-gray-800">Facture ID : {id}</Text>
                            <Text className="pb-3 text-gray-800">Date : {date}</Text>
                        </View> 
                        {/* <TouchableOpacity onPress={()=>deleteItem(id)}><Text>Supprimer</Text></TouchableOpacity> */}
                    </View>
                </TouchableOpacity>
                  )
               }))}
              </View> 
            </ScrollView>  
            </View> 

            {
  loading? (
    <View className="flex flex-col justify-center items-center absolute right-64 top-56">
      <ActivityIndicator size="large" />
    </View>
  ) : visibleProduit.length < 1 ? (
    <View className="flex flex-col justify-center items-center absolute right-56 top-56">
            <Icon.Database className="text-gray-400" width={50} height={50}/>
            <Text className="pt-4 text-gray-400">Aucune donnée disponible</Text>
           </View>
  ) : null
}
               

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
                 <Text className="font-[500] text-base text-gray-800 ">Détail de la facture</Text>
                <Pressable
                    onPress={() => setModalVisibleDelete(!modalVisibleDelete)}>
                        <Icon.XOctagon width={30} height={30} stroke='#00b292'/>
                </Pressable>  
           </View>

           <ScrollView
                showsHorizontalScrollIndicator={true}
            >
              <View className="">
              {mesDonne.map(((item,index) =>{
                const { count, name, data } = item;
            return (
                    <View key={item.id} >
                        {data.map((donne)=>{
                            return(
                                <View key={donne.id} className="border-b border-gray-200 mb-2 flex flex-row justify-between px-5 py-3 mx-3">
                                    <View> 
                                    <Text className="pb-3">Nom</Text>
                                    <Text className="text-gray-800">{donne.name}</Text>
                                    </View>
                                    <View>
                                    <Text className="pb-3 text-gray-800">Prix</Text>
                                    <Text className="w-20 text-gray-800">{donne.prix}</Text>
                                    </View> 
                                    <View>
                                    <Text className="pb-3 text-gray-800">Nombre</Text>
                                    <Text className="w-20 text-gray-800">{donne.count}</Text>
                                    </View> 
                                </View>
                            )
                        })}
                    </View>
                  )
               }))}
            </View> 
            </ScrollView>  
          </View>
        </View>
                </Modal>

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
      margin: 80,
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

