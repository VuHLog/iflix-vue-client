<script setup>
import { onMounted, ref, getCurrentInstance, watch } from "vue";
import Trending from "@layouts/Home/Trending.vue";
import SideBar from "@layouts/sidebar/SideBar.vue";
import VCard from "@components/VCard.vue";

const { proxy } = getCurrentInstance();

const singleMovie = ref([]); //phim le
const listDrama = ref([]); //phim bo
const nominatedfilms = ref([]); //phim de cu
const dramaClicked = ref(true);

onMounted(() => {
  loadDrama();

  proxy.$api
    .get("/api/movies/trending?top=8")
    .then((res) => {
      nominatedfilms.value = res.result;
    })
    .catch((error) => console.log(error));
});

watch(dramaClicked, () => {
  if (dramaClicked.value) {
    loadDrama();
  } else loadSingleMovie();
});

async function loadDrama() {
  await proxy.$api
    .get("/api/movies/TopNewDrama")
    .then((res) => {
      listDrama.value = res.result;
    })
    .catch((error) => console.log(error));
}

async function loadSingleMovie() {
  await proxy.$api
    .get("/api/movies/TopNewSingleMovie")
    .then((res) => {
      singleMovie.value = res.result;
    })
    .catch((error) => console.log(error));
}
</script>

<template>
  <div class="py-4">
    <Trending></Trending>
    <div class="row">
      <div class="col-9">
        <div class="py-2">
          <div class="position-relative">
            <div class="d-flex pb-2 gc-3">
              <span
                class="text-gray py-1 px-3 rounded-sm cursor-pointer"
                :class="{ active: dramaClicked }"
                @click="dramaClicked = true"
              >
                <h2 class="text-16 m-0">Phim Bộ Mới</h2>
              </span>
              <span
                class="text-gray py-1 px-3 rounded-sm cursor-pointer"
                :class="{ active: !dramaClicked }"
                @click="dramaClicked = false"
              >
                <h2 class="text-16 m-0">Phim Lẻ Mới</h2>
              </span>
            </div>
            <div class="pt-3">
              <div class="row gr-3 gc-4">
                <template
                  v-for="drama in listDrama"
                  :key="drama.id"
                  v-if="dramaClicked"
                >
                  <VCard
                    :heightImage="240"
                    :isTrending="false"
                    :episodeCurrent="drama.episodeCurrent"
                    :episodeTotal="drama.episodeTotal"
                    :year="drama.releaseYear"
                    :name="drama.name"
                    :src="drama.imageUrl"
                    :lang="drama.lang"
                    :slug="drama.slug"
                  ></VCard>
                </template>
                <template
                  v-for="movie in singleMovie"
                  :key="movie.id"
                  v-if="!dramaClicked"
                >
                  <VCard
                    :heightImage="240"
                    :isTrending="false"
                    :episodeCurrent="movie.episodeCurrent"
                    :episodeTotal="movie.episodeTotal"
                    :year="movie.releaseYear"
                    :name="movie.name"
                    :src="movie.imageUrl"
                    :lang="movie.lang"
                    :slug="movie.slug"
                  ></VCard>
                </template>
              </div>
              <div class="d-flex justify-center w-100 pt-2">
                <router-link
                  to="/danh-muc/phim-bo"
                  class="rounded bg-brown text-decoration-none text-gray-200 py-1 px-2"
                >
                  <span class="text-14">Xem thêm</span>
                  <font-awesome-icon :icon="['fas', 'angles-right']" />
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="py-2 mt-4">
          <div class="position-relative">
            <div class="d-flex pb-2 gc-3">
              <h2 class="text-trending m-0 text-gray pl-2">Phim đề cử</h2>
            </div>
            <div class="pt-3">
              <div class="row gr-3 gc-4">
                <template
                  v-for="nominated in nominatedfilms"
                  :key="nominated.id"
                >
                  <VCard
                    :heightImage="240"
                    :isTrending="false"
                    :episodeCurrent="nominated.episodeCurrent"
                    :episodeTotal="nominated.episodeTotal"
                    :year="nominated.releaseYear"
                    :name="nominated.name"
                    :src="nominated.imageUrl"
                    :lang="nominated.lang"
                    :slug="nominated.slug"
                  ></VCard>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-3">
        <SideBar></SideBar>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import url("@assets/scss/home/home.scss");
</style>