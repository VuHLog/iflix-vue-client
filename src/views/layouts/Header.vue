<script setup>
import { getCurrentInstance, computed, ref, watch, onMounted } from "vue";
import { useBaseStore } from "@/store/index.js";
import NavBar from "@layouts/navbar/Navbar.vue";
import { jwtDecode } from "jwt-decode";

const { proxy } = getCurrentInstance();
const store = useBaseStore();

const username = ref("");
const avatarUrl = ref("");
const name = ref("");

const searchText = ref("");

const pageSize = ref(3);
const moviesSearched = ref([]);

const showUserMenu = ref(false);

onMounted(() => {
  let token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    username.value = decoded.sub;
    avatarUrl.value = decoded.avatarUrl;
    name.value = decoded.name;
  }
});

const loadData = () => {
  proxy.$api
    .get(
      "/api/movies?pageSize=" + pageSize.value + "&search=" + searchText.value
    )
    .then((res) => {
      moviesSearched.value = res.content;
    });
};

watch(searchText, () => {
  if (searchText.value !== "") {
    loadData();
  }
});
</script>

<template>
  <header id="header" class="">
    <div
      class="py-3 px-4 d-flex align-center justify-space-between border-b-custom"
    >
      <router-link to="/home" class="text-decoration-none">
        <div class="d-inline-block logo p-3">
          <img src="@assets/img/logo/iflixLogo.png" alt="" />
        </div>
      </router-link>
      <div class="position-relative search w-25">
        <input
          v-model.trim="searchText"
          type="text"
          class="input-search p-2 w-100 rounded-lg"
          placeholder="Tìm kiếm"
        />
        <button
          type="button"
          class="icon-search p-2 position-absolute top-0 right-0"
        >
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        </button>
        <div
          class="position-absolute w-100 search-result p-2"
          v-if="searchText"
        >
          <ul class="list-item pt-2 m-0" v-if="moviesSearched.length !== 0">
            <template v-for="movie in moviesSearched" :key="movie.id">
              <router-link to="" class="text-decoration-none">
                <li class="item d-flex align-item mb-2 border-b-custom">
                  <div>
                    <img class="image-poster" :src="movie.imageUrl" alt="" />
                    <font-awesome-icon :icon="['fas', 'angle-down']" />
                  </div>
                  <div
                    class="movie-info text-gray d-flex flex-column justify-center"
                  >
                    <p class="m-0 text-center">{{ movie.name }}</p>
                    <p class="m-0 text-center" style="color: #a1a1aa">
                      {{
                        movie.episodeTotal === movie.episodeCurrent
                          ? "Full"
                          : "Tập" +
                            " " +
                            movie.episodeCurrent +
                            " " +
                            movie.lang
                      }}
                    </p>
                  </div>
                </li>
              </router-link>
            </template>
          </ul>
          <router-link to="" class="text-decoration-none">
            <p class="m-0 text-brown text-center p-1">
              Xem tất cả kết quả "{{ searchText }}"
            </p>
          </router-link>
        </div>
      </div>
      <router-link to="/sign-in" v-if="username===''">
        <v-btn class="rounded-lg" color="#3f3f46">Đăng nhập </v-btn>
      </router-link>
      <div class="account position-relative" v-if="username !==''">
        <div
          class="avatar d-flex align-center cursor-pointer"
          @click="showUserMenu = !showUserMenu"
        >
          <img class="rounded-circle" :src="avatarUrl" alt="avatar" />
          <font-awesome-icon
            style="color: #bdc3c7; font-size: 0.8rem"
            :icon="['fas', 'angle-down']"
          />
        </div>
        <transition>
          <div
            class="position-absolute user-dropdown rounded-lg"
            v-if="username !== '' && showUserMenu"
          >
            <div class="border-b-custom py-2 px-3 font-weight-bold">
              {{ name }}
            </div>
            <ul class="user-menu p-0 m-0 py-2 cursor-pointer">
              <li class="py-2 px-3 text-center">
                <router-link class="text-decoration-none" to=""
                  >Thông tin</router-link
                >
              </li>
              <li class="py-2 px-3 text-center">
                <router-link class="text-decoration-none" to=""
                  >Tủ phim</router-link
                >
              </li>
              <li class="py-2 px-3 text-center">
                <router-link class="text-decoration-none" to=""
                  >Đổi mật khẩu</router-link
                >
              </li>
              <li class="py-2 px-3 text-center">
                <router-link class="text-decoration-none" to=""
                  >Đăng xuất</router-link
                >
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
    <NavBar></NavBar>
  </header>
</template>

<style scoped lang="scss">
@import url("@scss/header/header.scss");
</style>