<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: "app",
  beforeCreate: function() {
    let authenticated = this.$cookie.get('url-auth');
    if (!authenticated) {
      // this.$router.push("account");
    } else {
      // this.$router.push("feed");
    }
  }
};
</script>
