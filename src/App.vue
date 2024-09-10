<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { RouterLink, RouterView } from "vue-router";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { getDatabase, ref as dbRef, onValue } from "firebase/database"; // Add Firebase Realtime Database for profile data

const isLoggedIn = ref(false);
const userProfile = ref<User | null>(null);
const router = useRouter();
let auth;
let db;

onMounted(() => {
  auth = getAuth();
  db = getDatabase();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      userProfile.value = user;
      // Fetch additional user profile data from Realtime Database
      const userRef = dbRef(db, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        userProfile.value = { ...user, ...data }; // Combine Firebase Auth user data with profile data
      });
    } else {
      isLoggedIn.value = false;
      userProfile.value = null;
    }
  });
});

function handleSignOut() {
  signOut(auth).then(() => {
    router.push("/");
  });
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-links">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/feed" class="nav-link">Feed</router-link>
      <router-link to="/register" class="nav-link">Register</router-link>
      <router-link to="/sign-in" class="nav-link">Login</router-link>
      <button @click="handleSignOut" v-if="isLoggedIn" class="signout-button">
        Sign out
      </button>
    </div>
    <div v-if="isLoggedIn && userProfile" class="profile">
      <img
        :src="userProfile.photoURL"
        alt="Profile Picture"
        class="profile-pic"
      />
      <div class="profile-info">
        <p class="profile-name">{{ userProfile.displayName || "User" }}</p>
        <p class="profile-email">{{ userProfile.email }}</p>
      </div>
    </div>
  </nav>
  <div class="content">
    <RouterView />
  </div>
</template>

<style scoped>
.navbar {
  background-color: #333;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between; /* Align items to the edges */
  align-items: center; /* Center items vertically */
  position: sticky;
  top: 0;
  z-index: 1000; /* Ensures it stays on top of other content */
}

.nav-links {
  display: flex;
  gap: 15px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 16px;
  padding: 10px 15px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #555;
}

.signout-button {
  background-color: #ff4b5c;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.signout-button:hover {
  background-color: #ff2a3d;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info {
  color: white;
}

.profile-name {
  font-weight: bold;
}

.profile-email {
  font-size: 14px;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
</style>
