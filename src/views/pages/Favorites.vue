<script setup>
import { ref, onMounted, getCurrentInstance, watch } from "vue";
import { useRoute } from "vue-router";
import Breadcrumbs from "@layouts/Breadcrumbs.vue";
import VCard from "@components/VCard.vue";

const {proxy} = getCurrentInstance();

const movieFavorites = ref([]);
const userId = ref("");
onMounted(async()=>{
    await proxy.$api
    .get("/api/users/myInfo")
    .then((res) => {
      userId.value = res.result.id;
    })
    .catch((error) => console.log(error));

    await proxy.$api.get("/api/favorites/"+userId.value).then((res)=>{
        movieFavorites.value = res.result.map(ele => ele.movie);
    })
})

</script>

<template>
  <main class="px-4">
    <div class="pt-2">
      <Breadcrumbs></Breadcrumbs>
      <h3
        class="font-weight-regular text-gray-200 uppercase text-center py-2 border-b-custom"
      >
        Tủ phim
      </h3>

      <div class="pt-2 d-flex flex-wrap border-zinc-800">
          <section class="pt-4">
            <div class="row gr-3 gc-4">
              <template v-for="movie in movieFavorites" :key="movie.id">
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
          </section>
        </div>
        <div class="col-3">
          <SideBar></SideBar>
        </div>
      </div>
  </main>
</template>


<style lang="scss" scoped>
</style>