<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="error"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Delete Account
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">
          Delete Account?
        </v-card-title>
        <v-card-text>This action is irreversible. This will remove all your Freets and followers</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="dialog = false"
          >
            Nevermind
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="deleteAccount"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
    data () {
      return {
        dialog: false,
      }
    },
  methods: {
    deleteAccount: function() {
      this.dialog = false;
      axios.delete('/api/users')
        .then(() => {
          // handle success
          localStorage.removeItem('user-auth');
          eventBus.$emit('signout-success', true);
          this.$router.push('/');
          localStorage.clear();
        })
        .catch(() => {
          // Still sign User out so they have to sign in again.
          localStorage.removeItem('user-auth');
          eventBus.$emit('signout-success', true);
          this.$router.push('/');
          localStorage.clear();
        })
    }
  }
  }
</script>