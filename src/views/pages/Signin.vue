<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useBaseStore } from "@/store/index.js";
import { useRouter } from "vue-router";
import Breadcrumbs from "@layouts/Breadcrumbs.vue";

const { proxy } = getCurrentInstance();

const store = useBaseStore();

const router = useRouter();

const errorMsg = ref("");

const user = ref({
  username: "",
  password: "",
});

onMounted(() => {
  if (store.username !== "") {
    return router.push("/home");
  }
});

async function signIn() {
  if (user.value.username === "" || user.value.password === "") {
    errorMsg.value = "Bạn phải nhập đầy đủ tài khoản mật khẩu!";
    return;
  }
  await proxy.$api
    .post("/auth/token", user.value)
    .then((res) => {
      localStorage.setItem("token", res.result.token);
      store.isLoggedIn = true;
      router.push("/home");
    })
    .catch(() => {
      errorMsg.value = "Tài khoản, mật khẩu không chính xác!";
    });
}
</script>

<template>
  <div>
    <breadcrumbs class="my-8" currentPage="Đăng Nhập"></breadcrumbs>
    <div class="pa-10 d-flex align-center justify-center">
      <div class="d-flex flex-column w-50 main-form pa-8 rounded-lg">
        <h4 class="font-weight-bold">Đăng nhập</h4>
        <form
          class="mt-8 space-y-6 mb-4"
          method="POST"
          @submit.prevent="signIn"
        >
          <input
            v-model.trim="user.username"
            class="form-control p-3 mb-4"
            type="text"
            placeholder="Tên đăng nhập"
          />
          <input
            v-model.trim="user.password"
            class="form-control p-3"
            type="password"
            placeholder="Mật khẩu"
            autocomplete="on"
          />

          <div class="text-start text-red" v-if="errorMsg">
            {{ errorMsg }}
          </div>

          <div class="text-start my-4">
            <input id="remember" class="mr-2" type="checkbox" />
            <label for="remember">Nhớ mật khẩu</label>
          </div>
          <v-btn
            type="submit"
            class="rounded-lg w-100 py-2 px-5"
            color="#a3765d"
          >
            Đăng nhập
          </v-btn>
        </form>
        <p>
          Bạn chưa có tài khoản?
          <router-link to="/signup">
            <strong>Đăng ký</strong>
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-form {
  color: rgb(255, 255, 255);
  background-color: #27272a;
  .form-control {
    box-shadow: none;
  }
  .banner {
    img {
      object-fit: cover;
      height: 600px;
    }
  }
  .btn-submit {
    border-radius: 10px;
  }
}
</style>