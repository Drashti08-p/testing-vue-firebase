<template>
  <div class="home-page">
    <h1 class="about"></h1>
  </div>
</template>

<style scoped>
.home-page {
  background-image: url("../../public/dashboard.jpg"); /* Correct path to your image */
  background-size: cover; /* Cover the entire container */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevent image repetition */
  height: 100vh; /* 100% of the viewport height */
  width: 100vw; /* 100% of the viewport width */
  display: flex; /* Flexbox for centering content */
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
}

.about {
  color: white; /* Adjust text color to make it visible */
  font-size: 2rem; /* Font size */
}
</style>

