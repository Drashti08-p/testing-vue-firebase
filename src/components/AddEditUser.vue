<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Add New User</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form @submit.prevent="addUser">
          <v-text-field
            v-model="newUser.name"
            label="Name"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="newUser.age"
            label="Age"
            type="number"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="newUser.email"
            label="Email"
            outlined
            required
          ></v-text-field>
          <v-text-field
            v-model="newUser.role"
            label="Role"
            outlined
            required
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="addUser">Add User</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
<script setup>
import { ref } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { inject } from "vue";
const props = defineProps(["openDialog"]);

const db = inject("db");
const dialog = ref(false); // Control the dialog visibility

// New user data
const newUser = ref({
  name: "",
  age: "",
  email: "",
  role: "",
});

// Add user function
const addUser = async () => {
  try {
    await addDoc(collection(db, "users"), {
      ...newUser.value,
      joinedDate: new Date().toISOString(),
    });
    dialog.value = false; // Close the dialog
  } catch (error) {
    console.error("Error adding user:", error);
  }
};
</script>
  
  <style scoped>
/* You can customize your styles here or rely on Vuetify's design */
</style>
  