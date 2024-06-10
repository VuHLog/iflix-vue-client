import { createRouter, createWebHistory } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { useBaseStore } from "@/store/index.js";
import SignIn from "@pages/Signin.vue"
import Home from "@pages/Home.vue"

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "Home",
        component: Home,
      },
    ]
  },
  {
    path: "/sign-in",
    name: "Sign in",
    component: SignIn,
  },
  // {
  //   path: "/:pathMatch(.*)*",
  //   component: () => import("../pages/[...all].vue"),
  // },
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
  const token = localStorage.getItem("token");
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
      // Nếu token đã hết hạn, xóa nó khỏi localStorage và trả về false
      localStorage.removeItem("token");
      return false;
    } else {
      // Nếu token hợp lệ, trả về true
      return true;
    }
  } else {
    // Nếu token không tồn tại trong localStorage, trả về false
    return false;
  }
}

export default router;
