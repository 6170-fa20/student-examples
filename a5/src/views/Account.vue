<template>
  <div>
    <Navbar/>
    <HomePage />
    <UserSettings/>
  </div>
</template>

<script>
import UserSettings from "../components/UserSettings.vue";
import Navbar from "../components/Navbar.vue";
import HomePage from "../components/HomePage.vue";

export default {
  name: "account",
  created() {
    localStorage.removeItem('user-auth');
  },
  components: {
    UserSettings,
    Navbar,
    HomePage,
  }
};
</script>
