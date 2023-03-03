<template>
  <div class="body">
    <div class="card">
      <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg" color= "#EDDBC7">
        <div class="title">
          <h2>Register</h2>
        </div>
        <div class="text-subtitle-1 text-medium-emphasis">Account</div>

        <v-text-field
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          v-model="regemail"
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
          @keyup.enter="register()"
          v-model="regpassword"
          :rules="[rules.required, rules.length(6)]"
        ></v-text-field>

        <v-btn block class="mb-8" color="blue" size="large" variant="tonal" @click="register()">
          register
        </v-btn>
        <div class="iconback" @click="back()">
          <v-btn variant="plain" width="30" height="40">
            <Icon icon="ion:arrow-back-circle" width="40" height="40" />
          </v-btn>
        </div>
      </v-card>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()
const regemail = ref('')
const regpassword = ref('')
const visible = ref(false)
const rules = ref({
  email: (v) => !!(v || '').match(/@/) || 'กรุณากรอก e-mail',
  required: (value) => !!value || 'กรุณากรอกรหัสผ่าน',
  length: (len) => (v) => (v || '').length >= len || `รหัสผ่านต้องมีความยาว ${len} ตัวขึ้นไป`
 
})
function register() {
  const auth = getAuth()
  createUserWithEmailAndPassword(auth, regemail.value, regpassword.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user
      console.log('User = ' + user)
      router.push('/')
      alert('ระบบได้รับข้อมูลของคุณแล้ว')
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      switch (errorCode) {
        case 'auth/invalid-email':
          alert('กรุณากรอก E-mail')
          break
        case 'auth/weak-password':
          alert('รหัสควรมีอย่างน้อย 6 ตัว')
          break
        case 'auth/internal-error':
          alert('กรุณากรอกรหัสผ่าน')
          break
        case 'auth/email-already-in-use':
          alert('ไม่สามารถลงทะเบียนด้วยบัญชีนี้ได้ \n' + 'เนื่องจากบัญชีนี้มีอยู่ในระบบแล้ว')
          break

        default:
          alert(errorMessage)
      }
      return

    })
}

function back() {
  router.push('/')
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
  padding: 7rem;
}

.title {
  text-align: center;
  margin-bottom: 3rem;
  font-style: normal;
  font-size: larger;
}

.iconback {
  text-align: center;
}
</style>
