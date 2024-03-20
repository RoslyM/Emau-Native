import React, { useEffect, useState, useRef } from 'react';
import { View, Text,TouchableOpacity, ScrollView, Alert, Modal, StyleSheet, Pressable, TextInput, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Icon from "react-native-feather";
import { useSelector } from 'react-redux';
import {initializeHistorique} from '../slice/redux'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {image} from "../assets/base64/image"
import Share from 'react-native-share';
import { codeBar } from '../assets/base64/codeBar';



export default function ServiceView() {

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleDelete, setModalVisibleDelete] = useState(false);

      const [data, setData] = useState([]);
      const [datasImp, setDatasImp] = useState([]);
     
      const produits = useSelector(state => state.services);
      const historique =  useSelector(state => state.historiques);
      const [loading, setLoading] = useState(true)
      useEffect(() => {
        console.log("Historique: ",historique)
        setDatasImp(historique)
        setData(produits);
        setLoading(false);
      }, [produits,historique]);

      

      const [seachService,setSeachService] = useState('')
  
      const visibleProduit = data.filter(service =>{
        if(seachService && (!service.name.toLowerCase().includes(seachService.toLowerCase()) && !String(service.prix).includes(seachService) && !String(service.quantity).includes(seachService))){
          return false
        }
        return true
      })

      const [counts, setCounts] = useState([]);
      const [total,setTotal] = useState(0)

      const incrementCount = (id) => {
        setCounts(prevCounts => {
          const existingCountIndex = prevCounts.findIndex(item => item.id === id);
          if (existingCountIndex !== -1) {
            const updatedCounts = [...prevCounts];
            updatedCounts[existingCountIndex].count += 1;
            const total = calculateTotal(visibleProduit, updatedCounts);
            setTotal(total)
            return updatedCounts;
          } else {
            const updatedCounts = [...prevCounts, { id: id, count: 1 }];
            const total = calculateTotal(visibleProduit, updatedCounts);
            setTotal(total)
            return updatedCounts;
          }
        });
      };
      
      const calculateTotal = (visibleProduit, counts) => {
        return visibleProduit.reduce((acc, item) => {
          const countObj = counts.find(countItem => countItem.id === item.id);
          const count = countObj ? countObj.count : 0;
          if (count > 0) {
            return acc + (item.prix * count);
          }
          return acc;
        }, 0);
      };

      const [dataImpression, setDataImpression] = useState([])

      const handleCalculateTotal = () => {
        const allDataWithCounts = visibleProduit.map(item => {
            const countObj = counts.find(countItem => countItem.id === item.id);
            const count = countObj ? countObj.count : 0;
            return { ...item, count };
          });

          setDataImpression(allDataWithCounts.filter(item => item.count > 0))
        
          const filteredData = allDataWithCounts.filter(item => item.count > 0);
        
          console.log("Toutes les données avec les counts associés et count > 0 :", filteredData);
        
        setModalVisibleDelete(true)
      };

     
    
      const decrementCount = (id) => {
        setCounts(prevCounts => {
          const existingCountIndex = prevCounts.findIndex(item => item.id === id);
          if (existingCountIndex !== -1 && prevCounts[existingCountIndex].count > 0) {
            const updatedCounts = [...prevCounts];
            updatedCounts[existingCountIndex].count -= 1;
            const total = calculateTotal(visibleProduit, updatedCounts);
            setTotal(total)
            return updatedCounts;
          }
          return prevCounts;
        });
      };

      
     const [disabled, setDisabled] = useState(false)

      let generatePdf = async () => {
        setDisabled(true)
        const currentDateTime = new Date();
        const id = Date.now()
        const formattedDateTime = currentDateTime.toLocaleString()
        const user = await AsyncStorage.getItem('userToken');

            try {
                const newItem = {
                    utilisateur : user,
                    id: id,
                    date: formattedDateTime,
                    data: dataImpression,
                    montant: total
                };
                console.log("---------------------------------------------------------------------------------------------------------------------------------")
                 const updatedData = [...datasImp,newItem]
                 console.log("data histoire : ", updatedData)
                 await AsyncStorage.setItem('historiques', JSON.stringify(updatedData));
                 initializeHistorique()
                
            } catch (error) {
              console.error('Erreur lors de l\'enregistrement des données : ', error);
            }
          

        if(dataImpression.length<1){
            alert("Votre facture est vide")
        }else{
           
           
        
            
            // Générer les éléments HTML pour les services
            let servicesHtml = '';
            let total = 0;
            dataImpression.forEach(item => {
                const serviceHtml = `
                            <span style="display:flex; justify-content: space-between;
                            align-items: center; margin-bottom:15px">
                                <span>${item.name}</span>
                                <span>${item.count}/${item.prix} FCFA</span>
                            </span>
                      `;
                servicesHtml += serviceHtml;
                total += parseInt(item.prix, 10) * item.count;
            });

            
const jour = currentDateTime.getDate().toString().padStart(2, '0');
const mois = (currentDateTime.getMonth() + 1).toString().padStart(2, '0');
const annee = currentDateTime.getFullYear();
const heure = currentDateTime.getHours().toString().padStart(2, '0');
const minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
const secondes = currentDateTime.getSeconds().toString().padStart(2, '0');
// const dateTimeFr = `${jour}/${mois}/${annee} ${heure}:${minutes}:${secondes}`;
// console.log(dateTimeFr);
        
            const html = `
            <html>
                <body style="width: 300px;font-size:15px;">
                <div style="text-align: center;">
                <img alt="logo" src="${image}" width="120"/>
                <h3>Emau Main d'Or</h3>
                <p>34, rue loudima Mougali</p>
                <p>Tél: 06 810 22 88</p>
                <p>Vendeur : Rosly</p>
                <hr>
                </div>
                <div style="padding: 10px;margin: 10px;font-size:15px;">
                    <p>${servicesHtml}</p>
                    <p>Nbre d'art : ${dataImpression.length}</p>
                    <div style="display:flex; justify-content: space-between;
                    align-items: center;">
                    <h3>Total : </h3>
                    <h3>${total} FCFA</h3>
                    </div>
                   
                    <p>Date : ${jour}/${mois}/${annee} <span style="padding-left: 10px;">à</span>  <span style="padding-left: 10px;">${heure}:${minutes}:${secondes}</span> </p>
                    <div style="display: flex; flex-direction:column; align-items: center; width:100%">
                    <img  alt="logo" src="${codeBar}" width="120"/>
                    <p style="margin-top:-4px">${id}</p>
            </div>
            <div style="margin-top:-12px">
                <hr style="border-top: 1px dashed #000;">
                <hr style="border-top: 1px dashed #000; margin-top:-7px">
                <p style="text-align: center; margin-top:-1px">Merci de votre visite . <br> A bientôt .</p>
            </div> 
                    
                </div>       
                </body>
            </html>
            `;
        
           
            try {
              const pdf = await RNHTMLtoPDF.convert({
                html: html,
                file:"html_to_pdf",
                directory:"Documents",
                base64: false
            });
              const shareOptions = {
                title: 'Share PDF',
                url: `file://${pdf.filePath}`,
                type: 'application/pdf',
              };
              await Share.open(shareOptions);
            } catch (error) {
              // console.error('Error generating PDF or sharing:', error.message);
            }
            setDisabled(false)
            setModalVisibleDelete(false)
        }
    }
    
     
  return (
    <View className="bg-[#fafafa] flex-1">
      
      <SafeAreaView className="flex-1">
                <View className=" pt-5 pb-3 bg-white  flex flex-row justify-center space-x-5 items-center">
                <Icon.Briefcase className="text-gray-800" width={30} height={30}/>
                <Text className="text-center">Facture Service</Text>
                </View>   

            <View className="flex-row justify-between items-center space-x-3 mt-5 mb-2 border-2 border-gray-200 rounded-xl mx-3 py-2 px-4 bg-white">
                <View className="flex-row items-center flex-1  rounded-2xl">
                {/* <MagnifyingGlassIcon stroke={30} color="gray" /> */}
                <TextInput  value={seachService}  onChangeText={(text) => setSeachService(text)} placeholder='Rechercher en fonction du nom ou du prix'  className="ml-3 text-gray-800 flex-1" />
               </View>
                <View className="bg-white rounded-2xl">
                <Icon.Search className="text-gray-400"/>
               
                </View>
            </View>

            <ScrollView
                showsHorizontalScrollIndicator={true}
            >
              <View className="pb-5 mb-5">
              {visibleProduit.reverse().map(((item,index) =>{
                const { id, name, prix, quantity } = item;
                const countObj = counts.find(countItem => countItem.id === id);
                const count = countObj ? countObj.count : 0;
            return (
                    <View key={item.id} className="bg-white mb-3 flex flex-row justify-between px-5 py-3 mx-3">
                        <View  className="w-56">
                             <Text className="pb-3 text-gray-800">Nom</Text>
                             <Text className="text-gray-800">{name}</Text>
                        </View>

                        <View className="w-20">
                            <Text className="pb-3 text-gray-800">Prix</Text>
                            <Text className="w-20 text-gray-800">{prix}</Text>
                        </View> 
                        <View>
                             <Text className="pb-3 text-center text-gray-800">Actions</Text>
                             <View className="flex flex-row space-x-5">
                            <Icon.PlusCircle onPress={() => incrementCount(id)}stroke='#00b292' width={25} height={25}/>
                            <Text>{count}</Text>
                            <Icon.MinusCircle onPress={() => decrementCount(id)} className="text-red-500" width={25} height={25}/>
                        </View>
                        </View>
                    </View>
                  )
               }))}
            </View> 
            </ScrollView>    

            {
  loading? (
    <View className="flex flex-col justify-center items-center absolute right-96 top-56">
      <ActivityIndicator size="large" />
    </View>
  ) : visibleProduit.length < 1 ? (
    <View className="flex flex-col justify-center items-center absolute right-80 top-44">
    <Icon.Database className="text-gray-400" width={50} height={50}/>
    <Text className="pt-4 text-gray-400">Aucune donnée disponible</Text>
</View>
  ) : null
}

        
                <View className=" bg-white py-5 w-full">
                     <View className="flex flex-row justify-between items-center w-full px-5 ">
                        <Text className=" text-gray-600">Total : </Text>
                        <Text className="text-base font-[700]">{total} FCFA</Text>
                    </View>
                    <View className="px-5 mt-5">
                            <TouchableOpacity activeOpacity={1} delayPressIn={0} delayPressOut={0} onPress={handleCalculateTotal}  className="bg-[#00b292]  py-3 flex flex-row justify-center rounded-lg space-x-5 items-center">
                            {/* <Icon.Printer stroke='white' width={30} height={30}/> */}
                            <Text className="text-base text-white font-[600] pb-1">Détails de la facture</Text>
                        </TouchableOpacity>
                    </View>
                </View>

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
                 <Text className="font-[500] text-base text-gray-800 ">Récapitulatif de la facture</Text>
                <Pressable
                    onPress={() => {setModalVisibleDelete(!modalVisibleDelete);setDisabled(false)}}>
                        <Icon.XOctagon width={30} height={30} stroke='#00b292'/>
                </Pressable>  
           </View>

           <ScrollView
                showsHorizontalScrollIndicator={true}
            >
              <View className="">
              {dataImpression.map(((item,index) =>{
                const { id, name, prix } = item;
                const countObj = counts.find(countItem => countItem.id === id);
                const count = countObj ? countObj.count : 0;
            return (
                    <View key={item.id} className="border-b border-gray-200 mb-2 flex flex-row justify-between px-5 py-3 mx-3">
                        <View  className="w-56"> 
                             <Text className="text-gray-800">{name}</Text>
                        </View>

                        <View className="w-20">
                            <Text className="w-20 text-gray-800">{prix}</Text>
                        </View> 

                        <View>
                            <Text>{count}</Text>
                        </View>
                    </View>
                  )
               }))}
            </View> 
            </ScrollView>  

          <View className="flex flex-row space-x-5 items-center mt-5">
                <TouchableOpacity activeOpacity={1} delayPressIn={0} delayPressOut={0}  className="py-2 border-2 border-[#dfdfdf]  rounded-lg w-full flex-1" onPress={() => {setModalVisibleDelete(!modalVisibleDelete);setDisabled(false)}}>
                    <Text className="text-md text-gray-800  font-[600] pb-1 text-center">Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={disabled}  activeOpacity={1} delayPressIn={0} delayPressOut={0}  className={` bg-[#00b292]  py-2 space-x-2 rounded-lg w-full flex-1 flex-row justify-center items-center`} onPress={generatePdf}>
                <Icon.Printer stroke='white' width={30} height={30}/>   
                <Text className={`text-md text-white  font-[600] text-center`}>Oui, Imprimer</Text>
                { disabled && <ActivityIndicator size="large" />}
                 </TouchableOpacity>
          </View>
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

