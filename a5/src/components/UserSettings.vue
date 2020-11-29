<template>
  <div id="user-settings">
    <div class="form-container">
      <p>Please sign in or sign up a new account to continue</p>
      <UserAuthentication />
    </div>
  <Snackbar />
  </div>
</template>

<script>
import SignOut from "./SignOut.vue";
import UserAuthentication from "./UserAuthentication.vue";
import Snackbar from "../components/Snackbar.vue";

import { eventBus } from "../main";

export default {
  name: "UserSettings",

  components: {
    SignOut,
    UserAuthentication,
    Snackbar,
  },

  data() {
    return {
      messages: []
    };
  },

  created: function() {
    eventBus.$on("signin-success", (userName) => {
      this.$cookie.set('user-auth', userName);
      localStorage.setItem('user-auth', userName);
    });
    
    eventBus.$on("signout-success", () => {
      this.$cookie.set('user-auth', '');
      localStorage.removeItem('user-auth');
      this.messages.push("You have been signed out!");
    });

    eventBus.$on("signup-success", () => {
      this.messages.push("You have been signed up! Sign in to continue.");
    });
  },
  watch: {
    messages: {
      deep: true,
      handler() {
        if (this.messages.length) {
          const newMsg = this.messages[this.messages.length-1];
          this.$store.commit('push', newMsg);
        }
      }
    },
  }
};
</script>