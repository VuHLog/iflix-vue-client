<script setup>
import { ref } from "vue";

const props = defineProps({
  width: {
    type: Number,
    default: 200,
  },
  heightImage: {
    type: Number,
    default: 200,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  episodeCurrent: {
    type: Number,
    required: true,
  },
  episodeTotal: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  slug:{
    type: String,
    required: true,
  }
});

const width = ref(props.width + "px");
const heightImage = ref(props.heightImage + "px");
</script>
<template>
  <div
    id="card"
    class="rounded-lg d-inline-block overflow-hidden"
    :style="{ width: width }"
  >
    <router-link class="d-block position-relative text-decoration-none w-100" :to="'/xem-phim'+props.slug">
      <div class="poster ">
        <img
          class="rounded-lg w-100"
          :style="{ height: heightImage, width: width }"
          :src="props.src"
        />
      </div>
      <div class="position-absolute trending-text" v-if="props.isTrending">
        <span class="p-1">Trending</span>
      </div>
      <div class="position-absolute episode-text py-1 px-2">
        <span>{{
          props.episodeCurrent === props.episodeTotal
            ? "Full "
            : "Tập " + props.episodeCurrent + " "+props.lang
        }}</span>
      </div>
      <div
        class="position-absolute movie-info mt-2 p-2 w-100 text-start"
        v-if="props.isTrending"
      >
        <h3 class="name font-weight-bold">{{ props.name }}</h3>
        <span class="year font-weight-bold">{{ props.year }}</span>
      </div>
      <div
        class="movie-info p-2 w-100 px-2"
        style="background-color: #181818"
        v-if="!props.isTrending"
      >
        <h3 class="name font-weight-bold m-0 pt-1 capitalize truncate">{{ props.name }}</h3>
      </div>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
#card {
  .poster {
    &:hover {
      transform: scale(1.1);
    }
    transform: scale(1);
    transition: all 0.7s ease;
    img {
      object-fit: cover;
    }
  }
  .trending-text {
    top: 0;
    right: 0;
    font-size: 12px;
    background-color: #991b1b;
    color: #f9fafb;
  }
  .episode-text {
    top: 14px;
    left: 0;
    font-size: 12px;
    background-color: rgb(163, 118, 93);
    color: #f9fafb;
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  }
  .movie-info {
    color: #f9fafb;
    bottom: 0;
    left: 0;
    .name {
      font-size: 15px;
    }
    .year {
      font-size: 14px;
    }
  }
}
</style>