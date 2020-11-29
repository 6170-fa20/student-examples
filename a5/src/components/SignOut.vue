<template>
  <div class="highlight">
    <a class="logout" @click="signOut">
      Logout
    </a>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "SignOut",
  
  methods: {
    signOut: function() {
      axios.delete('api/users/auth')
        .then(() => {
          // handle success
          localStorage.removeItem('user-auth');
          eventBus.$emit('signout-success', true);
          this.$router.push('/');
          localStorage.clear();
        })
        .catch(() => {
          // Still sign User out so they have to sign in again.
          localStorage.clear();
          eventBus.$emit('signout-success', true);
        })
    }
  }
}
</script>

<style scoped>
.logout {
  padding: 0 0em 0 1em;
  color: rgba(54, 69, 79, .5);
}
</style>