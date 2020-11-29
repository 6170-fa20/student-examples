<template>
  <div>
    <form id="sign-in" class='component' v-on:submit.prevent="signIn" method="post">
      <v-text-field class='input-form' label="Username" id='username' v-model.trim='username' type='text' name='username'></v-text-field>
      <v-text-field class='input-form' label="Password" id='password' v-model.trim='password' type='text' name='password'></v-text-field>
    </form>
    <div>
    <v-btn depressed color="primary" class="button" @click="signIn">
      Sign In
    </v-btn>
    <v-btn depressed color="primary" class="button" @click="signUp">
      Sign Up
    </v-btn>
    </div>
    <!-- <Snackbar /> -->
  </div>
</template>

<script>
import Snackbar from "../components/Snackbar.vue";

import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "UserAuthentication",

  data() {
    return {
      errors: [],
      username: "",
      password: "",
    }
  },
  components: {
    Snackbar,
  },
  methods: {
    signIn: function() {
      const bodyContent = { username: this.username, password: this.password };
        axios
          .post("/api/users/auth", bodyContent)
          .then((res) => {
            // handle success
            eventBus.$emit('signin-success', res.data.name);
            this.$router.push('feed');
          })
          .catch(err => {
            // handle error
            this.errors.push(err.response.data.error);
          })
          .then(() => {
            // always executed
            this.resetForm();
            // this.clearMessages();
          });
    },

    signUp: function() {
      const bodyContent = { username: this.username, password: this.password };
        axios
          .post("/api/users", bodyContent)
          .then(() => {
            // handle success
            eventBus.$emit('signup-success', true);
            // eventBus.$emit('signin-success', res.data.data.name);
          })
          .catch(err => {
            // handle error
            this.errors.push(err.response.data.error);
          })
          .then(() => {
            // always executed
            this.resetForm();
            // this.clearMessages();
          });
    },

    resetForm: function() {
      this.username = "";
      this.password = "";
    },

    clearMessages: function() {
      setInterval(() => {
        this.errors = [];
      }, 5000);
    }
  },
  watch: {
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
}
</script>

<style scoped>
.input-form {
  min-width: 300px;
}
.form-group {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

label {
  margin-right: 0.5rem;
}

form {
  width: fit-content;
}

input[type="text"],
input[type="url"] {
  width: 15rem;
}
</style>