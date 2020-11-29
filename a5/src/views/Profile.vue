<template>
  <div class="inner-container">
    <Navbar/>
    <div class='profile'>
      <Titlebar title="Profile"/>
    </div>
    <div class="container">
        <v-tabs v-model="tab">
            <v-tab>
                Following
            </v-tab>
            <v-tab>
                Followers
            </v-tab>
        </v-tabs>
    <v-tabs-items v-model="tab">
        <div v-if="tab === 0" >
          <div v-if="following.length" class="container cardContainer">
            <UserCard
                v-for="fol in following"
                v-bind:key="fol.id"
                v-bind:username="fol.name"
                :cardID="fol.id"
                cardType="following"
            ></UserCard>
          </div>
          <div v-else>
              <EmptyPage text="There is nothing here yet! Request to follow other users in the Explore tab" /> 
          </div>
        </div >
        <div v-if="tab === 1">
          <div v-if="followers.length" class="container cardContainer">
            <UserCard
                v-for="fol in followers"
                v-bind:key="fol.id"
                v-bind:username="fol.name"
                :cardID="fol.id"
                cardType="follower"
            ></UserCard>
          </div>
          <div v-else>
              <EmptyPage text="There is nothing here yet! Once you approve user requests to follow you, they will show up here" /> 
          </div>
        </div>
    </v-tabs-items>
    <Snackbar />
    </div>
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
  name: "profile",
  data() {
    return {
        tab: 'following',
        errors: [],
        messages: [],
        following: JSON.parse(localStorage.getItem('following')) || [],
        followers: JSON.parse(localStorage.getItem('followers')) || [],
        userName: this.$cookie.get('url-auth'),
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchFollowers();
    this.fetchFollowing();
    eventBus.$on("unfollow-success", (id, name) => {
        this.following = this.following.filter(user => user.id !== id);
        localStorage.setItem('following', JSON.stringify(this.following));
        const snackMsg = `Successfully unfollowed ${name}`;
        this.messages.push(snackMsg);
    });
    eventBus.$on("remove-success", (id, name) => {
        this.followers = this.followers.filter(user => user.id !== id);
        localStorage.setItem('followers', JSON.stringify(this.followers));
        const snackMsg = `Successfully removed ${name} from followers!`;
        this.messages.push(snackMsg);
    });
  },
  methods: {
    fetchFollowers: function() {
        axios
          .get("/api/users/followers")
          .then((res) => {
            // handle success
            const followers = res.data.followers.map((name, idx) => {
              let obj = {id: idx, name: name};
              return obj;
            });
            this.followers = followers;
            localStorage.setItem('followers', JSON.stringify(followers));
          })
          .catch(err => {
            // handle error
            this.errors.push(err.response.data.error);
          })
    },
    fetchFollowing: function() {
        axios
          .get("/api/users/following")
          .then((res) => {
            // handle success
            const following = res.data.following.map((name, idx) => {
              let obj = {id: idx, name: name};
              return obj;
            });
            this.following = following;
            localStorage.setItem('following', JSON.stringify(following));
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
.v-tabs {
    margin: 0 13px;
}

.container {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    flex-wrap: wrap;
    padding: 0 10px 0 10px;
}
.break {
  flex-basis: 100%;
  height: 0;
}
</style>