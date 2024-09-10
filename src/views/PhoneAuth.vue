<template>
  <div class="container">
    <h1>Phone Authentication</h1>

    <div v-if="!isVerificationSent">
      <div class="input-container">
        <input
          type="text"
          placeholder="Phone Number"
          v-model="phoneNumber"
          class="input-field"
        />
      </div>
      <button @click="sendVerificationCode" class="submit-button">
        Send Code
      </button>
    </div>

    <div v-else>
      <div class="input-container">
        <input
          type="text"
          placeholder="Verification Code"
          v-model="verificationCode"
          class="input-field"
        />
      </div>
      <button @click="verifyCode" class="submit-button">Verify Code</button>
    </div>

    <!-- reCAPTCHA Container -->
    <div id="recaptcha-container"></div>

    <!-- Option to go back to Email Authentication -->
    <p>Or</p>
    <div class="email-auth-container">
      <router-link to="/sign-in">
        <button class="email-auth-button">
          <img src="../../public/mail.png" alt="Email" class="email-icon" />
          Use Email Authentication
        </button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const phoneNumber = ref("");
const verificationCode = ref("");
const isVerificationSent = ref(false);
const router = useRouter();
const toast = useToast();

let confirmationResult;

function sendVerificationCode() {
  const auth = getAuth();
  const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
    callback: () => {
      console.log("reCAPTCHA resolved..");
    },
  });

  signInWithPhoneNumber(auth, phoneNumber.value, recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      isVerificationSent.value = true;
    })
    .catch((error) => {
      alert("Error sending verification code: " + error.message);
    });
}

function verifyCode() {
  if (!confirmationResult) {
    console.error("No confirmation result available.");
    return;
  }

  confirmationResult
    .confirm(verificationCode.value)
    .then(() => {
      toast.success("Successfully login with phone number...");
      router.push("/feed");
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
  background-color: #ff8c00;
}

#recaptcha-container {
  margin-top: 20px;
}

.email-auth-container {
  margin-top: 30px;
  text-align: center;
  display: flex;
  justify-content: center;
}

.email-auth-button {
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

.email-auth-button:hover {
  background-color: #4caf50;
}

.email-icon {
  width: 20px;
  margin-right: 10px;
}
</style>
