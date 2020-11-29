<template>
  <div>
    <Navbar/>
    <div class='home'>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";

export default {
  name: "home",
  data() {
    return {
      userName: this.$cookie.get('url-auth')
    }
  },
  components: {
    Navbar
  }
};
</script>
