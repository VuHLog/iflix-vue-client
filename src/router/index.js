import { createRouter, createWebHistory } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { useBaseStore } from "@/store/index.js";

const routes = [
  {
    path: "/",
    name: "/",
    component: DefaultLayout,
    redirect: "/dashboard",
    meta: { requiresAuth: true },
    beforeEnter: requireAdmin,
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      //table User
      {
        path: "/users",
        name: "Người dùng",
        component: User
      },
      {
        path: "/infoUser/:userId",
        name: "Info User",
        component: InfoUser,
      },
      {
        path: "/createUser",
        name: "Create User",
        component: CreateUser,
      },
      {
        path: "/editUser/:userId",
        name: "Edit User",
        component: EditUser,
      },

      //table Genres
      {
        path: "/genres",
        name: "Thể loại",
        component: Genres
      },
      {
        path: "/infoGenres/:genresId",
        name: "Info Genres",
        component: InfoGenres,
      },
      {
        path: "/createGenres",
        name: "Create Genres",
        component: CreateGenres,
      },
      {
        path: "/editGenres/:genresId",
        name: "Edit Genres",
        component: EditGenres,
      },

      //table Countries
      {
        path: "/countries",
        name: "Quốc gia",
        component: Countries
      },
      {
        path: "/infoCountries/:countriesId",
        name: "Info Countries",
        component: InfoCountries,
      },
      {
        path: "/createCountries",
        name: "Create Countries",
        component: CreateCountries,
      },
      {
        path: "/editCountries/:countriesId",
        name: "Edit Countries",
        component: EditCountries,
      },

      //table Categories
      {
        path: "/Categories",
        name: "Danh mục",
        component: Categories
      },
      {
        path: "/infoCategories/:categoriesId",
        name: "Info Categories",
        component: InfoCategories,
      },
      {
        path: "/createCategories",
        name: "Create Categories",
        component: CreateCategories,
      },
      {
        path: "/editCategories/:movieId",
        name: "Edit Categories",
        component: EditCategories,
      },

      //table Movie
      {
        path: "/movies",
        name: "Phim",
        component: Movie
      },
      {
        path: "/infoMovie/:movieId",
        name: "Info Movie",
        component: InfoMovie,
      },
      {
        path: "/createMovie",
        name: "Create Movie",
        component: CreateMovie,
      },
      {
        path: "/editMovie/:movieId",
        name: "Edit Movie",
        component: EditMovie,
      },

      //Profile
      {
        path: "/profile",
        name: "Profile",
        component: Profile,
      },


      //table Episode
      {
        path: "/episodes/:movieId",
        name: "Episode",
        component: Episode
      },
      {
        path: "/:movieId/createEpisode",
        name: "Create Episode",
        component: CreateEpisode,
      },
      {
        path: "/editEpisode/:episodeId",
        name: "Edit Episode",
        component: EditEpisode,
      },
    ],
  },
  {
    path: "/sign-in",
    name: "Sign in",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "Signin",
        component: Signin,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  const store = useBaseStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isLoggedIn() || !store.isLoggedIn) {
      next({
        path: "/sign-in",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

//hàm check login với token
function isLoggedIn() {
  const store = useBaseStore();
  const token = sessionStorage.getItem("token");
  store.isLoggedIn = true;

  if (token) {
    //giải mã token
    const decoded = jwtDecode(token);
    store.roles = decoded.scope.replaceAll("ROLE_","");
    store.username = decoded.sub;
    store.fullName = decoded.name;

    // Kiểm tra xem token có hết hạn hay không
    const expirationDate = new Date(decoded.exp * 1000);
    if (expirationDate <= new Date()) {
      // Nếu token đã hết hạn, xóa nó khỏi sessionStorage và trả về false
      sessionStorage.removeItem("token");
      return false;
    } else {
      // Nếu token hợp lệ, trả về true
      return true;
    }
  } else {
    // Nếu token không tồn tại trong sessionStorage, trả về false
    return false;
  }
}

// Hàm check role
function requireAdmin(to, from, next) {
  const token = sessionStorage.getItem("token");

  if (!isLoggedIn()) {
    next("/sign-in");
  } else {
    const decodedToken = jwtDecode(token);
    if (!decodedToken.scope.includes("ROLE_ADMIN")) {
      // store.dispatch("showToast", "Tài khoản không có quyền truy cập!");
      next({
        path: "/sign-in",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  }
}

export default router;
