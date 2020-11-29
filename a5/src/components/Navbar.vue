<template>
  <div class="nav-bar">
    <div class="nav-container">
      <router-link to="/feed" v-if="isSignedIn" class="navlink">
        <span  @click="setTab('feed')" v-bind:style="getStyle('feed')" >
          Feed
        </span>
      </router-link>
      <router-link to="/explore" v-if="isSignedIn" class="navlink">
        <span @click="setTab('explore')" v-bind:style="getStyle('explore')" >
          Explore
        </span>
      </router-link>
      <router-link to="/requests" v-if="isSignedIn" class="navlink" >
        <span @click="setTab('requests')" v-bind:style="getStyle('requests')" >
          Requests
        </span>
      </router-link>
      <router-link to="/settings" v-if="isSignedIn" class="navlink">
        <span  @click="setTab('settings')" v-bind:style="getStyle('settings')" >
          Settings
        </span>
      </router-link>
      <router-link to="/profile" v-if="isSignedIn" class="navlink">
        <span  @click="setTab('profile')" v-bind:style="getStyle('profile')" >
          Profile
        </span>
      </router-link>
      <SignOut v-if="isSignedIn"/>
    </div>
  </div>
</template>

<script>
import SignOut from "./SignOut.vue";

export default {
  name: "Navbar",
  components: {
    SignOut,
  },
  data() {
    return {
      selected: this.$route.name,
      userName: this.$cookie.get('user-auth'),
    }
  },
  computed: {
    isSignedIn() {
      return localStorage.getItem('user-auth') !== null;
    } 
  },
  methods: {
    setTab: function(tab) {
      this.selected = tab;
    },
    getStyle: function(tab) {
      return {color: this.selected === tab ? 'rgba(35, 176, 255, 1)' : 'rgba(54, 69, 79, .5)'}
    }
  }
};
</script>

<style scoped>
a {
  padding: 0 1em 0 1em;
}
.nav-container {
  display: flex;
  justify-content: flex-end;
}
.nav-bar {
  font-size: 21px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  padding: 1em 1em 0 0em;
}

.navlink {
  text-decoration: none;
}
</style>