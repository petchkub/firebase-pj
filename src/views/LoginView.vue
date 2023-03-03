<template>
  <div class="body">
    <div class="card">
      <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg" color= "#EDDBC7" >
        <div class="text-subtitle-1 text-medium-emphasis">Account</div>

        <v-text-field
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          v-model="email"
          :rules="[rules.email]"
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Password
        </div>

        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          @keyup.enter="login()"
          v-model="password"
          :rules="[rules.required, rules.length(6)]"
        ></v-text-field>

        <v-btn block class="mb-8" color="blue" size="large" variant="tonal" @click="login()">
          Login
        </v-btn>

        <v-btn block class="mb-8" color="blue" size="large" variant="tonal" @click="googlelogin()">
          <img src="@/components/icons/google-logo.png" alt="" width="25" />
          <p class="btngoogle">google login</p>
        </v-btn>

        <p class="text-center">
          <router-link to="/register">Create an account.</router-link>
        </p>
      </v-card>
    </div>
  </div>
</template>
<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const visible = ref(false)
const rules = ref({
  email: (v) => !!(v || '').match(/@/) || 'กรุณากรอก e-mail',
  required: (value) => !!value || 'กรุณากรอกรหัสผ่าน',
  length: (len) => (v) => (v || '').length >= len || `รหัสผ่านต้องมีความยาว ${len} ตัวขึ้นไป`
})

function login() {
  const auth = getAuth()
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user
      console.log('User = ' + user)
      router.push('home')
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      switch (errorCode) {
        case 'auth/invalid-email':
          alert('Please enter your E-mail.')
          break
        case 'auth/user-not-found':
          alert('No user account was found.')
          break
        case 'auth/internal-error':
          alert('Please enter your Password.')
          break
        case 'auth/wrong-password':
          alert('Please Enter the correct password.')
          break

        default:
          alert(errorMessage)
      }
      return
    })
}

function googlelogin() {
  const auth = getAuth()
  const provider = new GoogleAuthProvider()
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      // The signed-in user info.
      const user = result.user
      // IdP data available using getAdditionalUserInfo(result)
      console.log('token = ' + token + ' ' + user)
      router.push('home')
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.customData.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log(errorCode + errorMessage + email + credential)
      // ...
    })
}
</script>
<style scoped>
.body {
  width: 100%;
  height: 100%;
  background-color: #A7727D;
  background-repeat: repeat-x;
  background-attachment: fixed;
  background-position: top center;
  
}

.card {
  padding: 8.5rem;
}

.btngoogle {
  margin-left: 10px;
}
</style>