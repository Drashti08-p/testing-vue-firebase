<template>
  <div class="container">
    <h1>Create an Account</h1>
    <div class="input-container">
      <input
        type="text"
        placeholder="Email Address"
        v-model="email"
        class="input-field"
      />
    </div>
    <div class="input-container">
      <input
        type="password"
        placeholder="Password"
        v-model="password"
        class="input-field"
      />
    </div>
    <button @click="register" class="submit-button">Submit</button>
    <button @click="signInWithGoogle" class="google-button">
      <img
        src="../../public/googlelogo.jpeg"
        class="google-logo"
        alt="Google Logo"
      />
      Register with Google
    </button>
    <p class="redirect-text">
      Do you have an account?
      <router-link to="/sign-in" class="login-link">Login here</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "vue-toastification";

import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { useRouter } from "vue-router";

const displayName = ref("user");
const email = ref("");
const password = ref("");
const router = useRouter();
const toast = useToast();

// function register() {
//   createUserWithEmailAndPassword(getAuth(), email.value, password.value)
//     .then((data) => {
//       toast.success("Successfully registered...");
//       router.push("/feed");
//     })
//     .catch((error) => {
//       toast.error(error.message);
//     });
// }
function register() {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;

      // Update profile with display name
      updateProfile(user, { displayName: displayName.value })
        .then(() => {
          toast.success("Profile updated successfully");
          sendEmailVerification(user)
            .then(() => {
              toast.success(
                "Verification email sent. Please check your inbox."
              );
              router.push("/feed");
            })
            .catch((error) => {
              toast.error(
                "Failed to send verification email: " + error.message
              );
            });
        })
        .catch((error) => {
          toast.error("Failed to update profile: " + error.message);
        });
      console.log(auth, "authauthauth");
    })
    .catch((error) => {
      toast.error(error.message);
    });
}
function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then((result) => {
      toast.success("Successfully registered with google account...");
      console.log("Auth with Google", result.user);
      router.push("/feed");
    })
    .catch((error) => {
      toast.error(error.message);
      console.log(error.code);
    });
}
</script>

<style scoped>
body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
  background-color: #f3f4f6;
  font-family: Arial, sans-serif;
}

.container {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

h1 {
  font-size: 26px;
  margin-bottom: 20px;
  color: #333333;
  font-weight: bold;
}

.input-container {
  margin-bottom: 15px;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #dddddd;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
}

.submit-button,
.google-button {
  width: 100%;
  padding: 14px;
  margin-top: 15px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45a049;
}

.google-button {
  background-color: #db4437;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.google-button:hover {
  background-color: #c33d2e;
}

.google-logo {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.redirect-text {
  margin-top: 20px;
  font-size: 14px;
  color: #666666;
}

.login-link {
  color: #4caf50;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.login-link:hover {
  color: #388e3c;
}
</style>
