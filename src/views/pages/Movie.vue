<script setup>
import { onMounted, ref, getCurrentInstance, watch } from "vue";
import { useBaseStore } from "@/store/index.js";
import { useRoute, useRouter } from "vue-router";
import SideBar from "@layouts/sidebar/SideBar.vue";
import Breadcrumbs from "@layouts/Breadcrumbs.vue";

const { proxy } = getCurrentInstance();
const route = useRoute();

const store = useBaseStore();
const rating = ref(); //rating

const movie = ref({});
const slug = route.params.slugMovie;
const episodeCurrent = ref(route.params.episodeNumber);
const episode = ref([]);
onMounted(async () => {
  scrollToTop();
  await proxy.$api
    .get("/api/movies/movieBySlug/" + slug)
    .then((res) => {
      movie.value = res.result;
    })
    .catch((error) => console.log(error));
  loadMovieContent();

  loadData();
});

async function loadData() {
  episodeCurrent.value = route.params.episodeNumber;
  await proxy.$api
    .get(
      "/api/episodes/number?episodeNumber=" +
        episodeCurrent.value +
        "&movieId=" +
        movie.value.id
    )
    .then((res) => {
      episode.value = res.result;
    })
    .catch((error) => console.log(error));
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function loadMovieContent() {
  setTimeout(() => {
    document.getElementById("movie-content").innerHTML =
      movie.value.description;
  }, 0);
}

// load lại data trong component khi path thay đổi
watch(
  () => route.fullPath,
  () => {
    loadData();
  }
);
</script>

<template>
  <div class="mt-2">
    <div class="pt-2 d-flex flex-wrap gr-6">
      <section class="col-9 pr-3">
        <breadcrumbs :currentPage="'Tập' + episodeCurrent" :previusPage="Array.of({name: movie.name, link: route.fullPath.slice(0,route.fullPath.length-2)})"></breadcrumbs>
        <div class="bg-171717 border-b-custom border-zinc-800 pb-2">
          <div class="ma-auto w-100 my-2">
            <template v-for="link in episode" key="link.id">
              <p>
                <iframe
                  allowfullscreen
                  :src="link.link"
                  frameborder="0"
                  height="450"
                  width="100%"
                  scrolling="0"
                ></iframe>
              </p>
            </template>
          </div>
        </div>

        <div class="border-b-custom pb-2">
          <div class="pa-2 mt-2 bg-222222">
            <h3
              class="text-gray-300 text-sm uppercase font-medium inline-block"
            >
              Danh sách tập
            </h3>
            <div class="pt-3 d-flex flex-wrap gc-2">
              <template
                v-for="episodeNumber in Array.from(
                  { length: movie.episodeCurrent },
                  (_, i) => i + 1
                )"
              >
                <router-link
                  :to="'/xem-phim' + movie.slug + '/' + episodeNumber"
                  class="text-decoration-none text-gray-300 text-12 text-center font-medium px-3 py-2 mb-2 rounded-sm bg-zinc-700 hover-bg-neutral-600"
                  :class="{ 'bg-A3765D': episodeCurrent === episodeNumber }"
                >
                  Tập {{ episodeNumber }}
                </router-link>
              </template>
            </div>
          </div>
        </div>

        <div class="pt-3 mt-2">
          <h4 class="text-gray-200 font-weight-bold uppercase d-inline-block">
            {{ movie.name + " tập " + episodeCurrent }}
          </h4>
          <div class="py-2">
            <v-rating
              v-model="rating"
              hover
              length="10"
              color="#eab308"
              size="x-small"
            ></v-rating>
            <div class="text-zinc-400 text-14 pt-1 font-medium">
              <span>(</span>
              <span>8</span>
              <span> điểm / </span>
              <span> 650</span>
              <span> lượt)</span>
            </div>
          </div>

          <div class="mt-2 bg-222222 pa-1 text-gray-400 text-justify">
            <b>{{ movie.name }}</b>
            <div id="movie-content" class="pt-2 d-inline"></div>
          </div>
        </div>
      </section>
      <section class="col-3">
        <SideBar></SideBar>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>