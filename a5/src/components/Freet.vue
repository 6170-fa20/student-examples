<template>
  <v-card
    class="freet-card"
    outlined
  >
    <v-list-item three-line>
        <v-avatar>
            <v-img contain src="/images/profilepic.jpg" ></v-img>
        </v-avatar>
        <v-list-item-content class="title-content">
            <v-list-item-title class="headline">
            {{author}}
            </v-list-item-title>
            <v-list-item-subtitle>
                <div id="time">
                    {{ Math.round((Date.now() - time)/60000) }}m ago
                </div>
                <div id="refreeted-from" v-if="this.author != this.og_author">
                    Refreeted from: {{ og_author }}
                </div>
            </v-list-item-subtitle>
        </v-list-item-content>
            <div v-if="author === this.$cookie.get('user-auth')">
                <v-btn med icon
                color="grey"
                class="mx-2" 
                id="edit"
                @click=showModal
                >
                    <v-icon >
                    mdi-pencil-outline
                    </v-icon>
                </v-btn>
            </div>
            <div v-if="author === this.$cookie.get('user-auth')">
                <v-btn med icon
                class="mx-2" 
                color="grey"
                id="delete"
                @click=deleteFreet
                >
                    <v-icon dark>
                    mdi-delete
                    </v-icon>
                </v-btn>
            </div>
    </v-list-item>
    <v-card-text class="card-text">
        {{ content }}
    </v-card-text>
    <v-card-text style="padding: 0 16px 0 16px">
        {{ upvotes.length }} upvotes
        {{ refreets.length }} refreets
    </v-card-text>
    <v-card-actions>
        <v-btn
            v-if="checkUpvoted"
            outlined
            text
            :color="upvoteColor"
            @click=toggleUpvote
        >
            upvote
        </v-btn>
        <v-btn
            v-else
            color="primary"
            depressed
            @click=toggleUpvote
        >
            upvote
        </v-btn>
        <v-btn
            outlined
            text
            :color="refreetColor"
            @click='refreetFreet'
        >
            refreet
        </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "Freet",
  props: ['id', 'content', 'author', 'og_author', 'time', 'upvotes', 'refreets', 'refreetAuthors'],
  data() {
    return {
        messages: [],
        errors: [],
    }
  },
  methods: {
      toggleUpvote: function() {
          if (this.upvotes.includes(this.$cookie.get('user-auth'))) {
              this.undoUpvoteFreet();
          } else {
              this.upvoteFreet();
          }
      },
      upvoteFreet: function() {
        const bodyContent = { id: this.id, username: this.username};
        axios
            .post("/api/freets/upvote/" + this.id, bodyContent)
            .then((res) => {
                eventBus.$emit('upvote-success', res.data.id, res.data.upvotes);
            })
            .catch(err => {
                // handle error
                this.errors.push(err.response.data.error);
            })
            .then(() => {
                this.clearMessages();
            });
      },
      undoUpvoteFreet: function() {
        const bodyContent = { id: this.id, username: this.username };
        axios
            .delete("/api/freets/upvote/" + this.id, bodyContent)
            .then((res) => {
                eventBus.$emit('undo-upvote-success', res.data.id, res.data.upvotes);
            })
            .catch(err => {
                // handle error
                this.errors.push(err.response.data.error);
            }).then(() => {
                this.clearMessages();
            });
      },
      refreetFreet: function() {
        const bodyContent = { id: this.id, username: this.username };
        axios
            .post("/api/freets/refreet/" + this.id, bodyContent)
            .then((res) => {
                eventBus.$emit('refreet-success', res.data, this.id); // expected outcome <- full freet is passed
            })
            .catch(err => {
                this.errors.push(err.response.data.error);
            })
            .then(() => {
                this.clearMessages();
            });
      },
      deleteFreet: function() {
        const bodyContent = { id: this.id };
        axios
            .delete("/api/freets/" + this.id, bodyContent)
            .then((res) => {
                eventBus.$emit('delete-freet-success', res.data.id);
            })
            .catch(err => {
                this.errors.push(err.response.data.error)
            })
            .then(() => {
                this.clearMessages();
            });
      },
      clearMessages: function() {
        setInterval(() => {
            this.errors = [];
        }, 5000);
      },
      showModal: function() {
          eventBus.$emit('show-modal', this.id, this.content);
      }
  },
  computed: {
      upvoteColor() {
          return this.upvotes.includes(this.$cookie.get('user-auth')) ? "primary" : "black";
      },
      refreetColor() {
          let refreetAuthors = this.refreets.map(refreet => refreet.author);
          return refreetAuthors.includes(this.$cookie.get('user-auth')) ? "primary" : "black";
      },
      checkUpvoted() {
          return this.upvotes.includes(this.$cookie.get('user-auth')) ? false : true;
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
};
</script>

<style scoped>
.title-content {
    margin-left: 15px;
    align-self: center;
}
.card-text {
    overflow-y: hidden;
    min-height: 100px;
    max-height: 100px;
 }
.card-actions {
    display: flex;
    align-content: flex-end;
}

.v-btn {
  flex-grow: 1;
}
#freet {
    display: grid;
    grid-template-rows: 25% 60% 15%;
    height: 14rem;
    width: 45%;
    color: white;
    background-color: white;
    border-style: solid;
}
.freet-card {
    margin: 1em 1em 0 0;
    max-height: 18rem;
    min-height: 250px;
    width: 30rem;
    border: 1px solid rgba(54, 69, 79, .5);
}

#freet-button {
    flex-grow: 1;
    text-align: center;
    border-style: solid;
    border-width: 4px;
}

#undo-upvote {
    color: green;
}

a {
    color: white;
}

.btn {
    color: white;
    padding: 0;
}
</style>