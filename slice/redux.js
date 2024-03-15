import { createSlice } from "@reduxjs/toolkit"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore, getDefaultMiddleware  } from '@reduxjs/toolkit';

// Créer une fonction asynchrone pour récupérer les données de l'AsyncStorage
const fetchUserData = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('utilisateur');
      return JSON.parse(jsonData) || []; // Si les données ne sont pas disponibles, retourner un tableau vide
    } catch (error) {
      console.error('Erreur lors du chargement des données : ', error);
      return []; // Retourner un tableau vide en cas d'erreur
    }
};

const fetchUserService = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('services');
      return JSON.parse(jsonData) || []; // Si les données ne sont pas disponibles, retourner un tableau vide
    } catch (error) {
      console.error('Erreur lors du chargement des données : ', error);
      return []; // Retourner un tableau vide en cas d'erreur
    }
};

const fetchUserProduits = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('produits');
      return JSON.parse(jsonData) || []; // Si les données ne sont pas disponibles, retourner un tableau vide
    } catch (error) {
      console.error('Erreur lors du chargement des données : ', error);
      return []; // Retourner un tableau vide en cas d'erreur
    }
};


const fetchUserHistorique = async () => {
  try {
    const jsonData = await AsyncStorage.getItem('historiques');
    return JSON.parse(jsonData) || []; // Si les données ne sont pas disponibles, retourner un tableau vide
  } catch (error) {
    console.error('Erreur lors du chargement des données : ', error);
    return []; // Retourner un tableau vide en cas d'erreur
  }
};

const fetchUserHistoriqueP = async () => {
  try {
    const jsonData = await AsyncStorage.getItem('historiquesP');
    return JSON.parse(jsonData) || []; // Si les données ne sont pas disponibles, retourner un tableau vide
  } catch (error) {
    console.error('Erreur lors du chargement des données : ', error);
    return []; // Retourner un tableau vide en cas d'erreur
  }
};



const userSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    InitialStore(state, action) {
      return state = action.payload;
    },
    deleteUser(state, action){
         return state.filter(user => user.id !== action.payload);
    }
  }
});

const ServiceSlice = createSlice({
    name: "services",
    initialState: [],
    reducers: {
      InitialService(state, action) {
        return state = action.payload;
      },
      deleteService(state, action){
           return state.filter(user => user.id !== action.payload);
      }
    }
});

const ProduitSlice = createSlice({
    name: "produits",
    initialState: [],
    reducers: {
      InitialProduit(state, action) {
        return state = action.payload;
      },
      deleteProduit(state, action){
           return state.filter(user => user.id !== action.payload);
      }
    }
});


const HistoriqueSlice = createSlice({
  name: "historiques",
  initialState: [],
  reducers: {
    InitialHistorique(state, action) {
      return state = action.payload;
    },
    deleteHistorique(state, action){
         return state.filter(user => user.id !== action.payload);
    }
  }
});

const HistoriqueSliceP = createSlice({
  name: "historiquesP",
  initialState: [],
  reducers: {
    InitialHistoriqueP(state, action) {
      return state = action.payload;
    },
    deleteHistoriqueP(state, action){
         return state.filter(user => user.id !== action.payload);
    }
  }
});


export const { addUser, deleteUser, InitialStore } = userSlice.actions;

export const { deleteService, InitialService } = ServiceSlice.actions;

export const { deleteProduit, InitialProduit } = ProduitSlice.actions;

export const { deleteHistorique, InitialHistorique } = HistoriqueSlice.actions;

export const { deleteHistoriqueP, InitialHistoriqueP } = HistoriqueSliceP.actions;

export const store = configureStore({
  reducer: {
    users: userSlice.reducer,
    services: ServiceSlice.reducer,
    produits: ProduitSlice.reducer,
    historiques: HistoriqueSlice.reducer,
    historiquesP: HistoriqueSliceP.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Désactiver la vérification de la sérialisation
    }),
});

export const initializeReduxStoreWithData = async () => {
    try {
      const userData = await fetchUserData();
    
      store.dispatch(InitialStore(userData)); 
    } catch (error) {
      console.error(error);
    }
  };

  export const initializeService = async () => {
    try {
      const ServiceData = await fetchUserService();
      
      store.dispatch(InitialService(ServiceData)); 
    } catch (error) {
      console.error(error);
    }
  };

  export const initializeProduit = async () => {
    try {
      const ProduitData = await fetchUserProduits();
     
      store.dispatch(InitialProduit(ProduitData)); 
    } catch (error) {
      console.error(error);
    }
  };

  export const initializeHistorique = async () => {
    try {
      const HistoriqueData = await fetchUserHistorique();
      console.log("Historique Service: ", HistoriqueData);
      store.dispatch(InitialHistorique(HistoriqueData)); 
    } catch (error) {
      console.error(error);
    }
  };

  export const initializeHistoriqueP = async () => {
    try {
      const HistoriqueData = await fetchUserHistoriqueP();
      console.log("Historique Produit PPPPP: ", HistoriqueData);
      store.dispatch(InitialHistoriqueP(HistoriqueData)); 
    } catch (error) {
      console.error(error);
    }
  };


  initializeHistoriqueP()
  initializeProduit()
  initializeService()
  initializeReduxStoreWithData();
  initializeHistorique()
 
