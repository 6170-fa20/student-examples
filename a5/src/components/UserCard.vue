<template>
  <v-card
    class="user-card"
    max-width="450"
    outlined
  >
    <v-list-item two-line>
        <v-list-item-avatar
          tile
          size="40"
          color="grey"
        ></v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline">
          {{ username }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-card-actions>
      <v-btn
        outlined
        text
        @click='followUser'
        v-if="cardType === 'explore'"
      >
        Follow
      </v-btn>
      <v-btn
        outlined
        text
        @click='unfollowUser'
        v-if="cardType === 'following'"
      >
        Unfollow
      </v-btn>
      <v-btn
        outlined
        text
        @click='removeFollower'
        v-if="cardType === 'follower'"
      >
        Remove
      </v-btn>
      <v-btn
        outlined
        text
        @click='acceptFollower'
        v-if="cardType === 'request'"
      >
        Accept
      </v-btn>
      <v-btn
        outlined
        text
        @click='rejectFollower'
        v-if="cardType === 'request'"
      >
        Reject
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "UserCard",
  props: ['username', 'currentUser', 'cardType', 'cardID', 'reqSent'],
  data() {
    return {
      errors: [],
      messages: [],
    }    
  },
  computed: {
  },
  methods: {
    followUser: function() {
      const bodyContent = {followUsername: this.username};
        axios
            .post("/api/users/requests", bodyContent)
            .then(() => {
              eventBus.$emit('follow-success', this.username); 
            })
            .catch(err => {
                // handle error
                this.errors.push(err.response.data.error);
            })
    },
    unfollowUser: function() {
      const bodyContent = {unfollowUsername: this.username};
        axios
            .put("/api/users/requests", bodyContent)
            .then(() => {
              eventBus.$emit('unfollow-success', this.cardID, this.username); 
              const snackMsg = "Successfully unfollowed user!";
              this.messages.push(snackMsg);
            })
            .catch(err => {
                // handle error
                this.errors.push(err.response.data.error);
            })
    },
    removeFollower: function() {
      const bodyContent = {followerUsername: this.username};
        axios
            .put("/api/users/requests", bodyContent)
            .then(() => {
              const snackMsg = "Successfully removed user from followers!";
              this.messages.push(snackMsg);
              eventBus.$emit('remove-success', this.cardID, this.username); 
            })
            .catch(err => {
                // handle error
                this.errors.push(err.response.data.error);
            })
    },
    acceptFollower: function() {
      const bodyContent = {approveID: this.username};
        axios
            .post("/api/users/requests", bodyContent)
            .then(() => {
              eventBus.$emit('accept-follower-success', this.cardID, this.username); 
            })
            .catch(err => {
                // handle error
                this.errors.push(err.response.data.error);
            })
    },
    rejectFollower: function() {
      const bodyContent = {rejectID: this.username};
        axios
            .post("/api/users/requests", bodyContent)
            .then(() => {
              eventBus.$emit('reject-follower-success', this.cardID, this.username); 
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

};
</script>

<style scoped>
.v-btn {
  flex-grow: 1;
  /* width: 100%; */
}
.image-cropper {
    overflow: hidden;
    border-radius: 50%;
    border-radius: 50%;
}
.profile-pic {
  display: flex;
  margin: 0 auto;
}
.user-card {
    margin: 1em 1em 0 0;
    height: 8rem;
    width: 15rem;
    border: 1px solid rgba(54, 69, 79, .5);
}

</style>