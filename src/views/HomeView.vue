<script setup>
import { ref } from 'vue'
import { getAuth, signOut } from 'firebase/auth'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { db } from '../main.js'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
const router = useRouter()

const menu = ref({
  nameTh: '',
  nameEn: '',
  price: 0,
  detail: ''
})
const editText = ref([])
const allMenu = ref([])
const dialog = ref(false)

async function addData() {
  try {
    const docRef = await addDoc(collection(db, 'foodmenu'), menu.value)
    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}
async function showMenu() {
  const querySnapshot = await getDocs(collection(db, 'foodmenu'))
  querySnapshot.forEach((doc) => {
    console.log(doc.id, ' => ', doc.data())
    const myDoc = ref({ id: doc.id, data: doc.data() })
    allMenu.value.push(myDoc.value)
  })
}
function editMenu(menulist) {
  editText.value = menulist
  menu.value = menulist.data
}
async function updateMenu(id) {
  if (confirm('Confirm edit this menu ?')) {
    try {
      const washingtonRef = doc(db, 'foodmenu', id)
      await updateDoc(washingtonRef, menu.value)
      console.log('update menu')
    } catch (e) {
      console.error(e)
    }
    readUpdateMenu(id)
  }
}
async function readUpdateMenu(id) {
  const docRef = doc(db, 'foodmenu', id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists(id)) {
    console.log(id, docSnap.data())
    const newEdit = docSnap.data()
    editText.value = newEdit
  } else {
    console.log('No such document!')
  }
}
function cancelUpdate() {
  editText.value = null
}
async function deleteMenu(id, index) {
  if (confirm('Do you want to delete this menu?')) {
    await deleteDoc(doc(db, 'foodmenu', id))
    console.log('Delete document with ID:', id)
    allMenu.value.splice(index, 1)
  }
}

function logout() {
  const auth = getAuth()
  signOut(auth)
    .then(() => {
      if (confirm('Want to log out?')) {
        router.push('/')
      }
    })
    .catch((error) => {})
}
</script>

<template>
  <div class="body">
    <div class="btlogout py-4 text-right">
      <v-btn @click="logout()">
        Logout
        <Icon icon="mdi:logout" width="20" height="20" />
      </v-btn>
    </div>
    <div class="Table">
      <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="1200" color="#EDDBC7">
        <v-card-text class="text-left">
          <v-dialog v-model="dialog" persistent width="500">
            <template v-slot:activator="{ props }">
              <v-btn color="green" v-bind="props"> เพิ่มเมนู </v-btn>
            </template>
            <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="900" rounded="lg">
              <v-form ref="form">
                <v-text-field
                  label="ชื่อเมนูไทย"
                  variant="underlined"
                  v-model="menu.nameTh"
                ></v-text-field>
                <v-text-field
                  label="ชื่อเมนูอังกฤษ"
                  variant="underlined"
                  v-model="menu.nameEn"
                ></v-text-field>
                <v-text-field
                  label="ราคา"
                  suffix="฿"
                  variant="underlined"
                  v-model="menu.price"
                ></v-text-field>
                <v-textarea
                  label="รายละเอียด"
                  auto-grow
                  variant="underlined"
                  rows="1"
                  row-height="15"
                  v-model="menu.detail"
                ></v-textarea>

                <v-card-text class="text-center">
                  <v-btn class="btndialogsave" color="green" @click="addData(), (dialog = false)">
                    <Icon icon="line-md:confirm" color="white" width="30" height="30" />
                  </v-btn>
                  <v-btn class="btndialogcancel" color="red" @click="dialog = false">
                    <Icon icon="mdi:cancel-bold" color="white" width="30" height="30" />
                  </v-btn>
                </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>

          <v-btn class="btnshowmenu" color="blue" variant="tonal" @click="showMenu()">
            แสดงเมนู
          </v-btn>
        </v-card-text>

        <v-progress-linear model-value="100" color="cyan" rounded></v-progress-linear><br />

        <v-table class="theme">
          <thead>
            <tr>
              <th>ชื่อเมนูไทย</th>
              <th>ชื่อเมนูอังกฤษ</th>
              <th>ราคา</th>
              <th>รายละเอียด</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(menulist, index) in allMenu" :key="index">
              <td>
                <p v-if="menulist != editText">{{ menulist.data.nameTh }}</p>
                <v-text-field
                  v-else
                  cols="12"
                  sm="6"
                  md="4"
                  variant="underlined"
                  v-model="menu.nameTh"
                ></v-text-field>
              </td>
              <td>
                <p v-if="menulist != editText">{{ menulist.data.nameEn }}</p>
                <v-text-field
                  v-else
                  cols="12"
                  sm="6"
                  md="4"
                  variant="underlined"
                  v-model="menu.nameEn"
                ></v-text-field>
              </td>
              <td>
                <p v-if="menulist != editText">{{ menulist.data.price }}</p>
                <input v-else type="number" v-model="menu.price" />
              </td>
              <td>
                <p v-if="menulist != editText">{{ menulist.data.detail }}</p>
                <v-text-field
                  v-else
                  cols="12"
                  sm="6"
                  md="4"
                  variant="underlined"
                  v-model="menu.detail"
                ></v-text-field>
              </td>
              <td>
                <div class="text-center" v-if="menulist != editText">
                  <v-btn class="btnedit" variant="plain" @click="editMenu(menulist)">
                    <Icon icon="material-symbols:edit-square-outline" width="30" height="30" />
                  </v-btn>
                  <v-btn class="btndelete" variant="plain" @click="deleteMenu(menulist.id, index)">
                    <Icon icon="ic:outline-delete-outline" color="red" width="30" height="30" />
                  </v-btn>
                </div>
                <div v-else>
                  <v-btn class="btnconfirm" color="green" @click="updateMenu(menulist.id)">
                    <Icon icon="line-md:confirm" color="white" width="30" height="30" />
                  </v-btn>
                  <v-btn class="btncancel" color="red" @click="cancelUpdate()">
                    <Icon icon="mdi:cancel-bold" color="white" width="30" height="30" />
                  </v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.body {
  width: 100%;
  height: 100%;
  background-color: #a7727d;
  background-repeat: repeat-x;
  background-attachment: fixed;
  background-position: top center;
}

.Table {
  padding: 14rem;
}

.btndialogsave {
  margin-left: 2rem;
  margin-right: 1rem;
}

.btndialogcancel {
  margin-left: 1rem;
  margin-right: 2rem;
}

.btnshowmenu {
  margin-left: 1rem;
}

.btnedit {
  margin-left: 1rem;
  margin-right: 1rem;
}

.btndelete {
  margin-left: 1rem;
  margin-right: 1rem;
}

.btnconfirm {
  margin-left: 1rem;
  margin-right: 1rem;
}

.btncancel {
  margin-left: 1rem;
  margin-right: 1rem;
}

.btlogout {
  margin-right: 2rem;
}
.theme {
  background-color: #f8ead8;
}
</style>