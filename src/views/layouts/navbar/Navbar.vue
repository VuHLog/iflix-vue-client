<script setup>
import { ref, computed, getCurrentInstance, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useBaseStore } from "@/store/index.js";

const { proxy } = getCurrentInstance();

const genres = ref([]);
const countries = ref([]);

onMounted(() => {
  proxy.$api
    .get("/api/genres")
    .then((res) => {
      genres.value = res.content;
    })
    .catch((error) => console.log(error));

  proxy.$api
    .get("/api/countries")
    .then((res) => {
      countries.value = res.content;
    })
    .catch((error) => console.log(error));
});
</script>

<template>
  <div
    id="navbar"
    class="navbar d-flex flex-xs-column p-2 justify-space-between border-b-custom"
  >
    <ul class="m-0 p-0 d-flex">
      <li class="py-2 px-3">
        <router-link to="/home" class="text-decoration-none font-weight-medium">
          Iflix
        </router-link>
      </li>
      <li class="py-2 px-3 position-relative genres">
        <span
          >Thể loại <font-awesome-icon :icon="['fas', 'angle-down']"
        /></span>
        <ul class="position-absolute list-genres m-0 py-7 px-10 row z-30">
          <template v-for="genre in genres" :key="genre.id">
            <li class="genre-item col-3 p-0 mb-3">
              <router-link :to="'/the-loai/'+genre.name" class="w-100 text-decoration-none">
                {{ genre.name }}
              </router-link>
            </li>
          </template>
        </ul>
      </li>
      <li class="py-2 px-3 position-relative countries">
        <span
          >Quốc gia <font-awesome-icon :icon="['fas', 'angle-down']"
        /></span>
        <ul class="position-absolute list-countries m-0 py-7 px-10 row z-30">
          <template v-for="country in countries" :key="country.id">
            <li class="country-item col-3 p-0 mb-3">
              <router-link :to="'/quoc-gia/' + country.name" class="w-100 text-decoration-none">
                {{ country.name }}
              </router-link>
            </li>
          </template>
        </ul>
      </li>
      <li class="py-2 px-3">
        <router-link to="/danh-muc/Phim Mới" class="text-decoration-none font-weight-medium">
          Phim mới
        </router-link>
      </li>
      <li class="py-2 px-3">
        <router-link to="/danh-muc/Phim Bộ" class="text-decoration-none font-weight-medium">
          Phim bộ
        </router-link>
      </li>
      <li class="py-2 px-3">
        <router-link to="/danh-muc/Phim Lẻ" class="text-decoration-none font-weight-medium">
          Phim lẻ
        </router-link>
      </li>
      <li class="py-2 px-3">
        <router-link to="/danh-muc/Phim Chiếu Rạp" class="text-decoration-none font-weight-medium">
          Phim chiếu rạp
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import url("@/assets/scss/navbar/navbar.scss");
</style>