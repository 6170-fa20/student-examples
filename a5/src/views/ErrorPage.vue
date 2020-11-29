<template>
    <div class="container">
        <h1>Oops, this page doesn't exist. Please go back to the previous page</h1>
        <div class="break"></div>
    </div>
</template>

<script>
export default {
  name: "ErrorPage",
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
    color: rgba(54, 69, 79, .6);
    font-weight: 500;
    font-size: 50px;
}
.container {
    display: flex;
    padding: 60px;
    justify-content: center;
    align-content: center;
    text-align: center;
}
.title>* {
    flex: 1 1 160px;
}
</style>