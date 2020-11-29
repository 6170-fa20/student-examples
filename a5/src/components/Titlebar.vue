<template>
    <div class="container">
        <h1>{{title}}</h1>
        <div class="break"></div>
        <hr>
    </div>
</template>

<script>
export default {
  name: "Titlebar",
  props: ['title'],
  data() {
    return {

    }    
  },

};
</script>

<style scoped>
.container {
  padding: 1em 1em 0 1em;
}
hr {
    border-top: 1px solid rgba(54, 69, 79, .5);
    margin-top: 0em;
    width: 100%;
}
h1 {
    display: flex;
    justify-content: center;
    align-content: center;
    color: rgba(35, 176, 255, 1);
    font-weight: 600;
    /* margin: 2em; */
}
.title>* {
    flex: 1 1 160px;
}
</style>