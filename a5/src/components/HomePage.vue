<template>
    <div class="container">
        <h1>Fritter</h1>
        <div class="break"></div>
    </div>
</template>

<script>
export default {
  name: "HomePage",
  props: ['text'],
  data() {
    return {

    }    
  },

};
</script>

<style scoped>
h1 {
    display: flex;
    justify-content: center;
    align-content: center;
    color: "primary";
    font-weight: 450;
    font-size: 200px;
    /* margin: 2em; */
}
.container {
    display: flex;
    padding: 30px;
    justify-content: center;
    align-content: center;
    text-align: center;
}
.title>* {
    flex: 1 1 160px;
}
</style>