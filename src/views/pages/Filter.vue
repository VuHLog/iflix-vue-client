<script setup>
import { ref, onMounted, getCurrentInstance, watch } from "vue";
import { useRoute } from "vue-router";
import SideBar from "@layouts/sidebar/SideBar.vue";
import Breadcrumbs from "@layouts/Breadcrumbs.vue";
import VCard from "@components/VCard.vue";

const { proxy } = getCurrentInstance();
const route = useRoute();

const totalElements = ref(0);
const totalPages = ref(10);
const field = ref("modifiedTime");
const pageSize = ref(24);
const pageNumber = ref(1);

const sortingCriteria = ref("Mới Cập Nhật");

const category = ref("");
const listCategories = ref([]);

const genre = ref("");
const listGenres = ref([]);

const country = ref("");
const listCountries = ref([]);

const releaseYear = ref("");
const listYear = ref([]);

const moviesFiltered = ref([]);

const name = ref([]);

const title = ref("");

onMounted(async () => {
  await proxy.$api
    .get("/api/genres")
    .then((res) => {
      listGenres.value = res.content;
    })
    .catch((error) => console.log(error));

  await proxy.$api
    .get("/api/countries")
    .then((res) => {
      listCountries.value = res.content;
    })
    .catch((error) => console.log(error));

  await proxy.$api
    .get("/api/categories")
    .then((res) => {
      listCategories.value = res.content;
    })
    .catch((error) => console.log(error));

  await proxy.$api
    .get("/api/movies/years")
    .then((res) => {
      listYear.value = res;
    })
    .catch((error) => console.log(error));

  handleParamsRoute();
  loadData();
});

// check nguoi dung dang o trang nao để thực hiện loadData
function handleParamsRoute() {
  if (route.query.searchText) {
    let text = route.query.searchText;
    name.value = text;
    title.value = "từ khoá: " + text;
    return;
  }
  if (route.params.genreName) {
    let name = route.params.genreName;
    genre.value = name;
    title.value = name;
    return;
  }
  if (route.params.countryName) {
    let name = route.params.countryName;
    country.value = name;
    title.value = name;
    return;
  }
  if (route.params.categoryName) {
    let name = route.params.categoryName;
    category.value = name;
    title.value = name;
    return;
  }
}

function resetParams() {
  name.value = "";
  genre.value = "";
  country.value = "";
  category.value = "";
  title.value = "";
}

// load lại data trong component khi path thay đổi
watch(
  () => route.fullPath,
  () => {
    resetParams();
    handleParamsRoute();
    loadData();
  }
);

async function loadData() {
  await proxy.$api
    .get(
      "/api/movies/filter?" +
        "field=" +
        field.value +
        "&pageNumber=" +
        (pageNumber.value - 1) +
        "&pageSize=" +
        pageSize.value +
        "&name=" +
        name.value +
        "&genre=" +
        genre.value +
        "&country=" +
        country.value +
        "&category=" +
        category.value +
        "&year=" +
        releaseYear.value
    )
    .then((res) => {
      moviesFiltered.value = res.content;
      totalElements.value = res.totalElements;
      totalPages.value = res.totalPages;
    })
    .catch((error) => console.log(error));
}

async function btnClicked() {
  await loadData();
}

watch(sortingCriteria, () => {
  if (sortingCriteria.value === "Mới Cập Nhật") {
    field.value = "modifiedTime";
  } else if (sortingCriteria.value === "Lượt Xem") {
    field.value = "numView";
  } else field.value = "releaseYear";
});
</script>

<template>
  <main class="px-4">
    <div class="pt-2">
      <Breadcrumbs :currentPage="title"></Breadcrumbs>
      <h3
        class="font-weight-regular text-gray-200 uppercase text-center py-2 border-b-custom"
      >
        {{ title }}
      </h3>

      <div class="pt-2 d-flex flex-wrap border-zinc-800">
        <div class="col-9">
          <!-- FILTER -->
          <section class="border-b-custom pb-1">
            <div class="d-flex flex-wrap text-gray-200 my-2">
              <!-- SORTING CRITERIA -->
              <div class="col-3 pr-2 my-2 user-none">
                <v-select
                  v-model="sortingCriteria"
                  label="Tiêu Chí Tìm Kiếm"
                  :items="['Mới Cập Nhật', 'Lượt Xem', 'Năm Phát Hành']"
                  bg-color="rgb(39, 39, 42)"
                ></v-select>
              </div>
              <!-- END SORTING CRITERIA -->

              <!-- GENRE -->
              <div class="col-3 pr-2 my-2 user-none">
                <v-select
                  v-model="genre"
                  label="Thể Loại"
                  :items="listGenres"
                  item-title="name"
                  bg-color="rgb(39, 39, 42)"
                ></v-select>
              </div>
              <!-- END GENRE -->

              <!-- COUNTRY -->
              <div class="col-3 pr-2 my-2 user-none">
                <v-select
                  v-model="country"
                  label="Quốc Gia"
                  :items="listCountries"
                  item-title="name"
                  bg-color="rgb(39, 39, 42)"
                ></v-select>
              </div>
              <!-- END COUNTRY -->

              <!-- CATEGORY -->
              <div class="col-3 pr-2 my-2 user-none">
                <v-select
                  v-model="category"
                  label="Danh Mục"
                  :items="listCategories"
                  item-title="name"
                  bg-color="rgb(39, 39, 42)"
                ></v-select>
              </div>
              <!-- END CATEGORY -->

              <!-- RELEASE YEAR -->
              <div class="col-3 pr-2 my-2 user-none">
                <v-select
                  v-model="releaseYear"
                  label="Năm Phát Hành"
                  :items="listYear"
                  item-title="name"
                  bg-color="rgb(39, 39, 42)"
                ></v-select>
              </div>
              <!-- END RELEASE YEAR -->

              <!-- INPUT SEARCH -->
              <div class="col-4 my-2 user-none">
                <input
                  v-model="name"
                  type="search"
                  class="w-100 rounded text-sm bg-zinc-800 text-gray-100 pl-4 h-75 outline-none text-14"
                  placeholder="Từ Khoá ..."
                />
              </div>
              <!-- END INPUT SEARCH -->

              <div class="text-center w-100 pt-1">
                <v-btn
                  type="button"
                  class="rounded-xl py-2 px-4 hover-opacity-80"
                  color="rgb(217, 138, 94)"
                  @click="btnClicked()"
                >
                  <span>Tìm kiếm</span>
                </v-btn>
              </div>
            </div>
          </section>
          <!-- END FILTER -->

          <section class="pt-4">
            <div class="row gr-3 gc-4">
              <template v-for="movie in moviesFiltered" :key="movie.id">
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
            <div class="text-center pt-3 pb-4">
              <v-pagination
                v-model="pageNumber"
                :length="totalPages"
                color="#D8D8D8"
              ></v-pagination>
            </div>
          </section>
        </div>
        <div class="col-3">
          <SideBar></SideBar>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
</style>