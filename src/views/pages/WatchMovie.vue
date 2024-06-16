<script setup>
import { onMounted, ref, getCurrentInstance, watch } from "vue";
import { useBaseStore } from "@/store/index.js";
import { useRoute, useRouter } from "vue-router";
import SideBar from "@layouts/sidebar/SideBar.vue";
import Breadcrumbs from "@layouts/Breadcrumbs.vue";
import VCard from "@components/VCard.vue";
import { inject } from "vue";

const { proxy } = getCurrentInstance();
const swal = inject("$swal");
const route = useRoute();
const router = useRouter();

const rating = ref(); //rating

const store = useBaseStore();
store.showReleaseYear = false;

const nominatedfilms = ref([]); //phim de cu

const movie = ref({});
const slug = ref(route.params.slugMovie);
const user = ref("");
onMounted(async () => {
  scrollToTop();
  loadData();
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

async function loadData() {
  await proxy.$api
    .get("/api/movies/movieBySlug/" + slug.value)
    .then((res) => {
      movie.value = res.result;
    })
    .catch((error) => console.log(error));
  await proxy.$api
    .get("/api/movies/trending?top=8")
    .then((res) => {
      nominatedfilms.value = res.result;
    })
    .catch((error) => console.log(error));

  if (localStorage.getItem("token")) {
    await proxy.$api
      .get("/api/users/myInfo")
      .then((res) => {
        user.value = res.result;
      })
      .catch((error) => console.log(error));

    await proxy.$api
      .get(
        "/api/favorites?userId=" + user.value.id + "&movieId=" + movie.value.id
      )
      .then((res) => {
        if (res.result) {
          followed.value = true;
        }
      })
      .catch((error) => console.log(error));
  }
}

// load lại data trong component khi path thay đổi
watch(
  () => route.fullPath,
  () => {
    slug.value = route.params.slugMovie;
    loadData();
  }
);

//xử lý xem danh sách tập hay xem thông tin phim
const isShowListEpisode = ref(true);
watch(isShowListEpisode, () => {
  if (!isShowListEpisode.value) {
    loadMovieContent();
  }
});

function loadMovieContent() {
  setTimeout(() => {
    document.getElementById("movie-content").innerHTML =
      movie.value.description;
  }, 0);
}

// xử lý follow
const followed = ref(false);

async function followBtnClicked() {
  if (!user.value) {
    router.push("/sign-in");
    return;
  }

  // true thi xoa , false thi them yeu thich
  if (followed.value) {
    await proxy.$api
      .delete(
        "/api/favorites?userId=" + user.value.id + "&movieId=" + movie.value.id,
        {}
      )
      .then(() => {
        swal.fire({
          title: "Bỏ Theo dõi Thành Công!",
          icon: "success",
        });
        followed.value = false;
      })
      .catch((error) => console.log(error));
  } else {
    await proxy.$api
      .post("/api/favorites", {
        movie: movie.value,
        user: user.value,
      })
      .then(() => {
        swal.fire({
          title: "Theo dõi Thành Công!",
          icon: "success",
        });
        followed.value = true;
      })
      .catch((error) => console.log(error));
  }
}
</script>
<template>
  <div class="mt-2">
    <div class="pt-2 d-flex flex-wrap gr-6">
      <section class="col-9 pr-3">
        <Breadcrumbs :currentPage="movie.name"></Breadcrumbs>
        <div class="overflow-hidden bg-181818 mt-2">
          <div class="py-2">
            <div
              class="mx-auto bg-zinc-900 d-flex border-b-custom border-zinc-800 pb-3 gc-8"
            >
              <div class="w-33p">
                <div>
                  <img
                    :src="movie.imageUrl"
                    alt=""
                    class="object-cover h-80 w-100 mx-auto object-center rounded-lg d-block"
                  />
                </div>
              </div>
              <div class="w-66p">
                <h1
                  class="text-gray-300 text-xl font-weight-bold mb-1 uppercase pt-0"
                >
                  {{ movie.name }}
                </h1>
                <div class="rounded-lg pt-2">
                  <span class="font-medium px-2 py-1 text-14 bg-brown">
                    Tập {{ movie.episodeCurrent }} Vietsub
                  </span>
                  <div class="mt-2 text-sm pt-4">
                    <div>
                      <span class="text-zinc-400">{{ movie.releaseYear }}</span>
                      <span class="text-gray"> · </span>
                      <span v-if="movie.country">
                        <router-link
                          to=""
                          class="text-14 text-decoration-none hover text-gray"
                        >
                          {{ movie.country.name }}
                        </router-link>
                      </span>
                      <span class="text-gray"> · </span>
                      <span v-if="movie.categories">
                        <router-link
                          to=""
                          class="text-14 text-decoration-none hover text-gray"
                        >
                          {{ movie.categories.name }}
                        </router-link>
                      </span>
                    </div>
                    <div class="pt-2">
                      <span class="text-zinc-400"> Thể loại: </span>
                      <template
                        v-for="(movie_genre, index) in movie.movie_genres"
                        :key="movie_genre.id"
                      >
                        <span>
                          <router-link
                            to=""
                            class="text-14 text-decoration-none hover text-gray"
                          >
                            {{ movie_genre.genre.name }}
                            <span v-if="index < movie.movie_genres.length - 1"
                              >,
                            </span>
                          </router-link>
                        </span>
                      </template>
                    </div>
                    <div class="pt-2">
                      <span class="text-zinc-400"> Diễn viên: </span>
                      <template
                        v-for="(movie_actor, index) in movie.movie_actors"
                        :key="movie_actor.id"
                      >
                        <span>
                          <router-link
                            to=""
                            class="text-14 text-decoration-none hover text-gray"
                          >
                            {{ movie_actor.actor.name }}
                            <span v-if="index < movie.movie_actors.length - 1"
                              >,
                            </span>
                          </router-link>
                        </span>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="mb-4 pt-4">
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
                <div class="d-flex gc-2 align-center">
                  <v-btn
                    type="button"
                    class="rounded py-2 px-4"
                    color="#d9534f"
                  >
                    <router-link
                      class="text-decoration-none d-flex justify-center align-center font-medium text-white"
                      :to="'/xem-phim/' + slug + '/1'"
                    >
                      <font-awesome-icon :icon="['fas', 'play']" />
                      <span>Xem Ngay</span>
                    </router-link>
                  </v-btn>
                  <v-btn
                    type="button"
                    class="rounded py-2 px-4"
                    color="#52525B"
                  >
                    <div
                      class="text-decoration-none d-flex justify-center align-center font-medium text-white"
                      @click="followBtnClicked()"
                    >
                      <font-awesome-icon
                        v-if="followed"
                        :icon="['fas', 'check']"
                      />
                      <font-awesome-icon
                        v-if="!followed"
                        :icon="['fas', 'plus']"
                      />
                      <span>Theo Dõi</span>
                    </div>
                  </v-btn>
                </div>
              </div>
            </div>

            <div class="d-flex flex-wrap">
              <div class="w-100">
                <ul class="w-auto d-flex mb-0 flex-wrap pt-3 pb-4">
                  <li class="mr-2 text-center d-flex gc-2">
                    <span
                      class="cursor-pointer text-sm font-weight-bold uppercase px-3 py-2 text-white bg-zinc-800 text-12 rounded d-block"
                      @click="isShowListEpisode = true"
                      :class="{ 'bg-brown': isShowListEpisode }"
                    >
                      danh sách tập
                    </span>
                    <span
                      class="cursor-pointer text-sm font-weight-bold uppercase px-3 py-2 text-white bg-zinc-800 text-12 rounded d-block"
                      @click="isShowListEpisode = false"
                      :class="{ 'bg-brown': !isShowListEpisode }"
                    >
                      Thông tin phim
                    </span>
                  </li>
                </ul>
                <div
                  class="d-flex flex-column bg-222222 w-10 mb-6 rounded"
                  v-if="isShowListEpisode"
                >
                  <div class="px-4 py-4">
                    <div class="pb-3">
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
                            :to="'/xem-phim/' + slug + '/' + episodeNumber"
                            class="text-decoration-none text-gray-300 text-12 text-center font-medium px-3 py-2 mb-2 rounded-sm bg-zinc-700 hover-bg-neutral-600"
                          >
                            Tập {{ episodeNumber }}
                          </router-link>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- TOM TAT MOVIE -->
                <div
                  class="d-flex flex-column bg-222222 w-10 mb-6 rounded"
                  v-if="!isShowListEpisode"
                >
                  <div class="px-4 py-4">
                    <div class="pb-3">
                      <h3
                        class="text-gray-300 text-sm uppercase font-medium inline-block"
                      >
                        Tóm tắt
                      </h3>
                      <div
                        class="pt-3 d-flex text-gray-400 text-justify d-block"
                        id="movie-content"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="py-2 mt-4">
              <div class="position-relative">
                <div class="d-flex pb-2 gc-3">
                  <h2 class="text-trending m-0 text-gray pl-2">Phim Đề Cử</h2>
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