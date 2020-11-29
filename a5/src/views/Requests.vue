<template>
  <div class="inner-container">
    <Navbar/>
    <div class='explore'>
        <Titlebar title="Requests"/>
    </div>
    <div class="container cardContainer" v-if="requests.length">
        <UserCard
            v-for="req in requests"
            v-bind:key="req.id"
            v-bind:username="req.name"
            :cardID="req.id"
            cardType="request"
        ></UserCard>
    </div>
    <div v-else>
        <EmptyPage text="There is nothing here yet! Once users request to follow you, they will show up here" /> 
    </div>
    <Snackbar />

  </div>
</template>

<script>

import Navbar from "../components/Navbar.vue";
import Titlebar from "../components/Titlebar.vue"; 
import UserCard from "../components/UserCard.vue";
import EmptyPage from "../components/EmptyPage.vue";
import Snackbar from "../components/Snackbar.vue";

import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "requests",
  data() {
    return {
        errors: [],
        messages: [],
        requests: JSON.parse(localStorage.getItem('requests')) || [],
        userName: this.$cookie.get('url-auth')
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchRequests();
    eventBus.$on("accept-follower-success", (id, name) => {
        this.requests = this.requests.filter(user => user.id !== id);
        localStorage.setItem('requests', JSON.stringify(this.requests));
        const snackMsg = `Successfully accepted ${name}'s follow request!`;
        this.messages.push(snackMsg);
    });
    eventBus.$on("reject-follower-success", (id, name) => {
        this.requests = this.requests.filter(user => user.id !== id);
        localStorage.setItem('requests', JSON.stringify(this.requests));
        const snackMsg = `Successfully rejected ${name}'s follow request!`;
        this.messages.push(snackMsg);
    });
  },
  methods: {
    fetchRequests: function() {
        axios
          .get("/api/users/requests")
          .then((res) => {
            // handle success
            const requests = res.data.requests.map((name, idx) => {
              let obj = {id: idx, name: name};
              return obj;
            });
            this.requests = requests;
            localStorage.setItem('requests', JSON.stringify(requests));
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
    EmptyPage,
    Snackbar,
  }
};
</script>

<style>
.container {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    flex-wrap: wrap;
}
.break {
  flex-basis: 100%;
  height: 0;
}
</style>