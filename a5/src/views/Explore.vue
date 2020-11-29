<template>
  <div class="inner-container">
    <Navbar/>
    <div class='explore'>
      <Titlebar title="Explore"/>
    </div>
    <div class="container cardContainer">
        <UserCard
            v-for="user in users"
            v-bind:key="user.id"
            v-bind:username="user.name"
            v-bind:cardID="user.id"
            v-bind:reqSent="user.reqSent"
            cardType="explore"
        ></UserCard>
    </div>
    <Snackbar />
  </div>
</template>

<script>

import Navbar from "../components/Navbar.vue";
import Titlebar from "../components/Titlebar.vue"; 
import UserCard from "../components/UserCard.vue";
import Snackbar from "../components/Snackbar.vue";

import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "explore",
  data() {
    return {
        errors: [],
        messages: [],
        users: JSON.parse(localStorage.getItem('explore')) || [],
        userName: this.$cookie.get('url-auth')
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchUsers();
    eventBus.$on("follow-success", (user) => {
        const snackMsg = `Successfully sent follow request to ${user}`;
        this.messages.push(snackMsg);
    });
  },
  methods: {
    fetchUsers: function() {
        axios
          .get("/api/users")
          .then((res) => {
            // handle success
            const users = res.data.users.map((name, idx) => {
              let obj = {id: idx, name: name};
              return obj;
            });
            this.users = users;
            localStorage.setItem('explore', JSON.stringify(users));
            
          })
          .catch(err => {
            // handle error
            this.errors.push(err.response.data.error);
          })
    },
  },
  watch: {
    messages: {
      // This will let Vue know to look inside the array
      deep: true,
      // We have to move our method to a handler field
      handler() {
        if (this.messages.length) {
          const newMsg = this.messages[this.messages.length-1];
          this.$store.commit('push', newMsg);
        }
      }
    },
    errors: {
      // This will let Vue know to look inside the array
      deep: true,
      // We have to move our method to a handler field
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
  }
};
</script>

<style>
.snackbar {
  padding: 5em;
  min-height: 65px;
  min-width: 350px;
}
.container {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    flex-wrap: wrap;
    padding: 0rem 1rem 0 1rem;
} 
.cardContainer {
    padding: 0 1rem;
}
.break {
  flex-basis: 100%;
  height: 0;
}
</style>