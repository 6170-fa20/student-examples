<template>
    <v-snackbar 
      class="snackbar"
      v-model="isVisible"
      relative
      top
      center
      outlined
      timeout="2000"
    >
      {{currentMessage}}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="error"
          text
          v-bind="attrs"
          @click="isVisible = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script>

export default {
  name: "Snackbar",
  data: () => ({
    currentMessage: null,
    isVisible: false
  }),
  computed: {
    messageLine() {
      return this.$store.state.messageLine;
    }
  },
  methods: {
    shiftMessage() {
      const newMessage = this.messageLine[0];
      this.currentMessage = newMessage;
      this.isVisible = true;
      this.$store.commit("shift");
    }
  },
  watch: {
    async isVisible(visible) {
      if (visible || !this.messageLine.length) return;
      await this.$nextTick();
      setTimeout(() => {
        this.shiftMessage();
      }, 300);
    },
    messageLine() {
      if (!this.isVisible) {
        this.shiftMessage();
      }
    }
  }
}
</script>

<style scoped>
.snackbar {
  padding: 5em;
  margin-top: 50px;
  min-height: 65px;
  min-width: 350px;
}
</style>