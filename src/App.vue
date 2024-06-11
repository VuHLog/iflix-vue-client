<script setup>
import Header from '@layouts/Header.vue'
import Footer from '@layouts/Footer.vue'

</script>

<template>
  <div class="container background-primary px-4">
    <Header></Header>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>

<style lang="scss">
</style>
