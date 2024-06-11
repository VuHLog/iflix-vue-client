<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
// If you are using PurgeCSS, make sure to whitelist the carousel CSS classes
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import VCard from "@components/VCard.vue";

const { proxy } = getCurrentInstance();
const moviesTrending = ref([]);
onMounted(() => {
  proxy.$api
    .get("/api/movies/trending?top=5")
    .then((res) => {
      moviesTrending.value = res.result;
    })
    .catch((error) => console.log(error));
});
</script>
<template>
  <div id="trending" class="py-2">
    <h2 class="text-trending m-0 text-gray pl-2">THỊNH HÀNH</h2>
    <Carousel class="pt-4 pb-8" :items-to-show="5" :wrap-around="true">
      <Slide v-for="movie in moviesTrending" :key="movie.id">
        <VCard
          :heightImage="240"
          :isTrending="true"
          :episodeCurrent="movie.episodeCurrent"
          :episodeTotal="movie.episodeTotal"
          :year="movie.releaseYear"
          :name="movie.name"
          :src="movie.imageUrl"
          :lang="movie.lang"
        ></VCard>
      </Slide>

      <template #addons>
        <Navigation>
          <template #next>
              <font-awesome-icon class="arrow-right" :icon="['fas', 'angle-right']" />
        </template>
        <template #prev>
              <font-awesome-icon class="arrow-left" :icon="['fas', 'angle-left']" />
          </template>
        </Navigation>
      </template>
    </Carousel>
  </div>
</template>

<style lang="scss" scoped>
@import url("@assets/scss/home/trending.scss");
</style>