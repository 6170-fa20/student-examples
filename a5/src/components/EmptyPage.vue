<template>
    <div class="page-container">
        <h3>{{text}}</h3>
    </div>
</template>

<script>
export default {
  name: "EmptyPage",
  props: ['text'],
  data() {
    return {

    }    
  },

};
</script>

<style scoped>
h3 {
    display: flex;
    justify-content: center;
    align-content: center;
    color: rgba(54, 69, 79, .3);
    font-weight: 450;
    font-size: 25px;
}
.page-container {
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