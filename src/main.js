import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
})
export default createVuetify({
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },
})

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyD7OsTbTp05lzTFREqaHAauYj-iK064Abs",
  authDomain: "fir-pj-a160f.firebaseapp.com",
  projectId: "fir-pj-a160f",
  storageBucket: "fir-pj-a160f.appspot.com",
  messagingSenderId: "198206065242",
  appId: "1:198206065242:web:344991f12add1a494aa663",
  measurementId: "G-50EF9ZES7X"
};

// Initialize Firebase
const initFirebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(initFirebase);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(initFirebase);



const app = createApp(App)

app.use(router)
app.use(vuetify)
app.mount('#app')
