import React, { useEffect, useState, useRef} from 'react';
import { View, Text,TouchableOpacity, ScrollView,  Alert, Modal, StyleSheet, Pressable, TextInput, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Icon from "react-native-feather";
import { useDispatch, useSelector } from 'react-redux';
import {initializeService, deleteService} from '../slice/redux'
import { Formik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  name: yup.string().required('Le nom est requis'),
  prix: yup.number().typeError('Le prix doit être un nombre').positive('Le prix doit être positif').required('Le prix est requis'),
});

export default function ServiceView() {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [prix, setPrix] = useState('');
    const [loading, setLoading] = useState(true)
    
    const [edit, setEdit] = useState(false)

    const [editData, setEditData] = useState('')

    const handleEdit = async (objet) => {
        setEdit(true)
        setModalVisible(true)
        setName(objet.name)
        setPrix(objet.prix)
        const itemToEdit = data.find(item => item.id === objet.id);
        setEditData(itemToEdit.id);
        
      };

      const ouvreModal = () =>{
        console.log("gchg")
        setEdit(false)
        setModalVisible(true)
        setName('')
        setPrix('')
      }


      const [data, setData] = useState([]);
      const services = useSelector(state => state.services);

      useEffect(() => {
        setData(services);
        setLoading(false);
      }, [services]);

  

      const handleService = async (values) => {

        try {
          console.log(values);
          const newItem = { id: Date.now(), name: values.name, prix: values.prix };
          const mesData = data.filter(item => item.name == newItem.name)

          if (editData !== '') {
            // Mise à jour si l'id d'édition est défini
            const updatedData = data.map(item =>
              item.id === editData ? newItem : item
            )
            setLoading(true);
            setModalVisible(false)
           await AsyncStorage.setItem('services', JSON.stringify(updatedData));
           initializeService()
         }else if (mesData.length>0) {
            setEditData('')
            // Mise à jour si l'id d'édition est défini
            alert("Le service existe déjà ! ")
          } else {
            setLoading(true);
            setModalVisible(false)
            setEditData('')
            setName('')
            setPrix('')
             const updatedData = [...data, newItem];
             await AsyncStorage.setItem('services', JSON.stringify(updatedData));
             initializeService()
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
            await AsyncStorage.setItem('services', JSON.stringify(updatedData));
            dispatch(deleteService(selectDelete.id))
           // await AsyncStorage.clear();
            initializeService()
            setModalVisibleDelete(false)
            console.log("data : ",data)
            setLoading(true);
          } catch (error) {
            console.error('Erreur lors de la suppression des données : ', error);
          }
      } 

     

      const [seachService,setSeachService] = useState('')
  
      const visibleProduit = data.filter(service =>{
        if(seachService && (!service.name.toLowerCase().includes(seachService.toLowerCase()) && !String(service.prix).includes(seachService))){
          return false
        }
        return true
      })


   
  return (
    <View className="bg-[#fafafa] flex-1">
      
      <SafeAreaView className="flex-1">
                <View className="px-5 pt-5 pb-3 bg-white  flex flex-row justify-center space-x-5 items-center">
                <Icon.Briefcase className="text-gray-800" width={25} height={25}/>
                <Text className="text-center">Mes Services</Text>
                </View>   

                <View className="flex-row justify-between items-center space-x-3 mt-4 border-2 border-gray-200 rounded-xl mx-3 p-2 px-4 bg-white">
        <View className="flex-row items-center flex-1  rounded-2xl">
          {/* <MagnifyingGlassIcon stroke={30} color="gray" /> */}
          <TextInput  value={seachService}  onChangeText={(text) => setSeachService(text)} placeholder='Rechercher en fonction du nom ou du prix'  className="ml-3 text-gray-800 flex-1" />
        </View>
        <View className="bg-white rounded-2xl">
          <Icon.Search className="text-gray-400"/>
        </View>
      </View>

           
                <View className="mt-4 mx-3">
      <View className="flex flex-row bg-white">
        <View className="flex-1 p-2">
          <Text className="text-center text-gray-800  font-[500] ">Nom</Text>
        </View>
        <View className="flex-1 p-2">
          <Text className="text-center text-gray-800  font-[500] ">Prix</Text>
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
          <Text className="text-center  text-gray-800 ">{item.name}</Text>
        </View>
        <View className="flex-1 p-2 border-2 border-gray-200">
          <Text className="text-center  text-gray-800 ">{item.prix}</Text>
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
           <Formik
      initialValues={{ name: edit ?name : '', prix: edit?prix:'' }}
      validationSchema={validationSchema}
      onSubmit={(values) => handleService(values)}
    >
       
    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.centeredView} >
          <View style={styles.modalView}>
           
           <View className="flex flex-row items-center justify-between">
                <Text className="font-[500]  text-gray-800 ">{edit?'Modifier un Service':'Ajouter un Service'}</Text>
                <Pressable
                    onPress={() => setModalVisible(!modalVisible)}>
                        <Icon.XOctagon width={30} height={30} stroke='#00b292'/>
                </Pressable>  
           </View>
           

              <Text className="text-gray-800  font-[500]  py-2">Nom du service</Text>
          <View className={`flex flex-row justify-between items-center mt-1 border-2 px-4 rounded-xl ${touched.name && errors.name ? 'border-red-500' : 'border-gray-200'}`}>
            <TextInput
              className="text-gray-800  font-[500] py-2 flex-1"
              placeholderTextColor="gray"
              placeholder="Entrer le nom du service"
              defaultValue={name}
             onBlur={handleBlur('name')}
            onChangeText={handleChange('name')}
            />
          </View>
          {touched.name && errors.name && <Text className="pt-2" style={{ color: 'red' }}>{errors.name}</Text>}
          <Text className="py-2 text-gray-800  font-[600]">Prix du service</Text>
          <View className={`flex flex-row justify-between items-center mt-1 border-2 px-4 rounded-xl ${touched.prix && errors.prix ? 'border-red-500' : 'border-gray-200'}`}
>
          <TextInput
            className="text-gray-800  font-[500] py-2 flex-1"
            placeholderTextColor="gray"
            keyboardType="numeric"
            placeholder="Entrer le prix du service"
            defaultValue={prix}
            onChangeText={handleChange('prix')}
            onBlur={handleBlur('prix')}
          />
          </View>
          {touched.prix && errors.prix && <Text className="pt-2" style={{ color: 'red' }}>{errors.prix}</Text>}
          
          <View className="flex flex-row space-x-5 items-center mt-5">
                <TouchableOpacity activeOpacity={1} delayPressIn={0} delayPressOut={0}  className="py-2 border-2 border-gray-200 rounded-lg w-full flex-1" onPress={() => setModalVisible(!modalVisible)}>
                    <Text className="text-md text-gray-800  font-[600] pb-1 text-center">Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} delayPressIn={0} delayPressOut={0}  className="bg-[#00b292] py-2 rounded-lg w-full flex-1" onPress={handleSubmit}>
              <Text className="text-md text-white font-[600] pb-1 text-center">{edit?'Modifier':'Ajouter'}</Text>
             </TouchableOpacity>
          </View>
          </View>
        </View>
    )}
       
        </Formik>
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
                 <Text className="font-[500]  text-gray-800 ">Voulez vous supprimer le service " {selectDelete.name} " ?</Text>
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

