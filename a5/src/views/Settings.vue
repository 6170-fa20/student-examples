<template>
  <div class="inner-container">
    <Navbar/>
    <div class='settings'>
        <Titlebar title="Settings"/>
    </div>
    <div class="container settings-container">
        <div class="settings-form">
          <h3>Change username</h3>
          <v-form class="v-form">
            <v-text-field
              v-model="username"
              label="Name"
              required
            ></v-text-field>
            <div class="form-action">
              <v-btn outlined text @click="changeUsername">Apply</v-btn>
            </div>
          </v-form>
        </div>
        <div class="break"></div><br>
        <div class="settings-form">
          <h3>Change password</h3>
          <v-form>
            <v-text-field
              v-model="password"
              label="Password"
              required
            ></v-text-field>
            <div class="form-action">
              <v-btn outlined text @click="changePassword">Apply</v-btn>
            </div>
          </v-form>
        </div>
        <div class="break" style="margin-bottom: 80px;"></div><br>
        <div class="settings-form">
          <!-- <v-btn color="error"></v-btn> -->
          <Dialog />
        </div>
    </div>
    <Snackbar />
    
  </div>
</template>

<script>

import Navbar from "../components/Navbar.vue";
import Titlebar from "../components/Titlebar.vue"; 
import UserCard from "../components/UserCard.vue";
import Snackbar from "../components/Snackbar.vue";
import Dialog from "../components/Dialog.vue";

import axios from "axios";

export default {
  name: "settings",
  data() {
    return {
        errors: [],
        messages: [],
        username: '',
        password: '',
        userName: this.$cookie.get('url-auth')
    }
  },
  methods: {
    changeUsername: function() {
      const bodyContent = { username: this.username };
        axios
          .put("/api/users/username", bodyContent)
          .then(() => {
            // handle success
            this.messages.push('Successfully changed username!')
            this.$cookie.set('user-auth', this.username);
            localStorage.setItem('user-auth', this.username);
          })
          .catch(err => {
            // handle error
            this.errors.push(err.response.data.error);
          })
    },
    changePassword: function() {
      const bodyContent = { password: this.password };
        axios
          .put("/api/users/password", bodyContent)
          .then(() => {
            // handle success
            this.messages.push('Successfully changed password!')
            this.$cookie.set('user-auth', this.password);
            localStorage.setItem('user-auth', this.password);
          })
          .catch(err => {
            // handle error
            this.errors.push(err.response.data.error);
          })
    },
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
    errors: {
      deep: true,
      handler() {
        if (this.errors.length) {
          const newMsg = this.errors[this.errors.length-1];
          this.$store.commit('push', newMsg);
        }
      }
    }
  },
  components: {
    Navbar,
    UserCard,
    Titlebar,
    Snackbar,
    Dialog,
  }
};
</script>

<style scoped>
.form-action {
  display: flex;
  justify-content: flex-end;
}
.v-form {
    min-width: 300px;
}
.settings-container {
    justify-content: center;
}
.container {
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    padding: 2rem 1rem 0 1rem;
} 
h3 {
  color: rgba(54, 69, 79, .7);
}
.break {
  flex-basis: 100%;
  height: 0;
}
</style>