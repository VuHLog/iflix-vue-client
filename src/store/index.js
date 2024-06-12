import { defineStore } from "pinia";

export const useBaseStore = defineStore("base", {
  state: () => {
    return {
      showTopViews: true,
      showAboutToShow: true,
      showReleaseYear : true,
      isLoggedIn: false,
      roles: "",
      username:"",
      fullName:"",
      avatarUrl: "",
      avatarUserDefault: "https://res.cloudinary.com/iflixlong/image/upload/v1717530924/icon-256x256_judaje.png",
    };
  },
  getters: {},
  actions: {
  }
});
