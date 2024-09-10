<template>
  <div class="container">
    <h1>Sign In</h1>

    <!-- Email and Password Form -->
    <div>
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
      <div class="forgot-password">
        <a href="#" @click="openForgotPasswordModal">Forgot Password?</a>
      </div>

      <button @click="signIn" class="submit-button">Sign In</button>
    </div>

    <!-- Option to go to Phone Authentication -->
    <p>Or</p>
    <div class="phone-auth-container">
      <router-link to="/phone-auth">
        <button class="phone-auth-button">
          <img
            src="../../public/phone-icon.png"
            alt="Phone"
            class="phone-icon"
          />
          Use Phone Authentication
        </button>
      </router-link>
    </div>
    <!-- Forgot Password Modal -->
    <div v-if="isForgotPasswordModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2>Forgot Password</h2>
        <form @submit.prevent="sendPasswordResetEmailSubmit">
          <div class="input-container">
            <input
              type="email"
              v-model="forgotEmail"
              placeholder="Enter your email"
              class="input-field"
              required
            />
          </div>
          <div class="modal-buttons">
            <button type="submit" class="submit-button">Send Reset Link</button>
            <button @click="closeForgotPasswordModal" class="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const email = ref("");
const password = ref("");
const forgotEmail = ref("");
const isForgotPasswordModalOpen = ref(false);
const router = useRouter();
const toast = useToast();

function signIn() {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      toast("Welcome...");
      router.push("/feed");
    })
    .catch((error) => {
      toast.error(error.message);
    });
}

function openForgotPasswordModal() {
  isForgotPasswordModalOpen.value = true;
}

function closeForgotPasswordModal() {
  isForgotPasswordModalOpen.value = false;
}

function sendPasswordResetEmailSubmit() {
  const auth = getAuth();
  sendPasswordResetEmail(auth, forgotEmail.value)
    .then(() => {
      toast.success("Password reset email sent!");
      closeForgotPasswordModal();
    })
    .catch((error) => {
      toast.error(error.message);
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

.submit-button {
  width: 100%;
  padding: 14px;
  margin-top: 15px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  background-color: #ff8c00;
  color: white;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #e67e00;
}

.phone-auth-container {
  margin-top: 30px;
  text-align: center;
  display: flex;
  justify-content: center;
}

.phone-auth-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.phone-auth-button:hover {
  background-color: #45a049;
}

.phone-icon {
  width: 20px;
  margin-right: 10px;
}

.forgot-password {
  margin-top: 10px;
}

.forgot-password a {
  font-size: 14px;
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: #f44336;
  color: white;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 15px;
}

.cancel-button:hover {
  background-color: #e53935;
}
</style>