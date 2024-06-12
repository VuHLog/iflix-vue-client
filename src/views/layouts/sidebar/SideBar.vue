<script setup>
import { ref, getCurrentInstance, onMounted,computed } from "vue";
import {useBaseStore} from "@/store/index.js"

const { proxy } = getCurrentInstance();
const store = useBaseStore();


const showTopViews = computed(() => store.showTopViews);
const listTopViews = ref([]);
const showAboutToShow = computed(() => store.showAboutToShow);
const listAboutToShow = ref([]);
const showReleaseYear = computed(() => store.showReleaseYear);


onMounted(() => {
  proxy.$api.get("/api/movies/topViews").then((res) => {
    listTopViews.value = res.result;
  });

  proxy.$api.get("/api/movies/MoviesAboutToShow").then((res) => {
    listAboutToShow.value = res.result;
  });
});
</script>

<template>
  <aside>
    <div class="pt-4">
      <div class="d-flex flex-wrap" v-if="showTopViews">
        <div class="w-100">
          <span
            class="text-gray-200 text-16 font-weight-bold border-b-custom w-100 d-block pb-2"
          >
            Top Xem Nhiều
          </span>
          <div class="d-flex flex-column w-100 mb-6 rounded">
            <div class="px-2 py-3">
              <template v-for="(movie, index) in listTopViews" :key="movie.id">
                <router-link
                  class="d-flex align-center text-decoration-none pb-2 transition-all-ease hover-scale-105"
                  :to="'/xem-phim'+movie.slug"
                >
                  <div class="col-2">
                    <div class="text-gray-200 text-14 font-medium text-14">
                      <span
                        class="bg-brown rounded-circle d-flex justify-center align-center w-7 h-7 d-inline-block"
                      >
                        {{ index + 1 }}
                      </span>
                    </div>
                  </div>
                  <div class="col-10 ml-1 d-flex flex-column">
                    <span class="block text-gray-200 capitalize truncate">{{
                      movie.name
                    }}</span>
                    <span class="text-gray-400 text-12">
                      {{ movie.numView + " lượt xem" }}
                    </span>
                  </div>
                </router-link>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pt-2" v-if="showReleaseYear">
      <div class="w-100">
        <div
          class="text-gray-200 text-md font-medium border-b-custom w-100 pb-2"
        >
          NĂM PHÁT HÀNH
        </div>
        <div class="d-flex flex-wrap gr-2 pt-2">
          <div class="col-3">
            <router-link
              class="d-inline-block py-1 px-3 text-decoration-none text-gray-300 text-center font-medium text-14 rounded-sm bg-neutral-800"
              to=""
              >2024</router-link
            >
          </div>
          <div class="col-3">
            <router-link
              class="d-inline-block py-1 px-3 text-decoration-none text-gray-300 text-center font-medium text-14 rounded-sm bg-neutral-800"
              to=""
              >2023</router-link
            >
          </div>
          <div class="col-3">
            <router-link
              class="d-inline-block py-1 px-3 text-decoration-none text-gray-300 text-center font-medium text-14 rounded-sm bg-neutral-800"
              to=""
              >2022</router-link
            >
          </div>
          <div class="col-3">
            <router-link
              class="d-inline-block py-1 px-3 text-decoration-none text-gray-300 text-center font-medium text-14 rounded-sm bg-neutral-800"
              to=""
              >2021</router-link
            >
          </div>
          <div class="col-3">
            <router-link
              class="d-inline-block py-1 px-3 text-decoration-none text-gray-300 text-center font-medium text-14 rounded-sm bg-neutral-800"
              to=""
              >2020</router-link
            >
          </div>
          <div class="col-3">
            <router-link
              class="d-inline-block py-1 px-3 text-decoration-none text-gray-300 text-center font-medium text-14 rounded-sm bg-neutral-800"
              to=""
              >2019</router-link
            >
          </div>
        </div>
      </div>
    </div>
    <div class="pt-6" v-if="showAboutToShow">
      <div class="w-100">
        <div
          class="text-gray-200 text-md font-medium border-b-custom w-100 pb-2 mb-2"
        >
          PHIM SẮP CHIẾU
        </div>
        <template v-for="movie in listAboutToShow" :key="movie.id">
          <div class="p-1 w-100 border-zinc-800">
            <div class="boder-w-sm d-flex pa-2 rounded-sm ga-2">
              <router-link class="text-decoration-none h-24 w-40p" to="">
                <img
                  :src="movie.imageUrl"
                  alt=""
                  class="w-100 h-100 object-cover object-center rounded-lg"
                />
              </router-link>
              <div class="truncate w-60p d-flex flex-column justify-center">
                <router-link
                  class="text-decoration-none text-gray-300 text-14 truncate font-medium"
                  to=""
                >
                  {{ movie.name }}
                </router-link>
                <span class="text-gray-300 font-medium text-sm mt-2">
                  {{movie.releaseYear}}
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </aside>
</template>


<style lang="scss" scoped>
@import url("@assets/scss/sidebar/sidebar.scss");
</style>