<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useBaseStore } from "@/store/index.js";
import { useRouter } from "vue-router";
import Breadcrumbs from "@layouts/Breadcrumbs.vue";
import { inject } from "vue";

const swal = inject("$swal");

const { proxy } = getCurrentInstance();

const store = useBaseStore();

const router = useRouter();

const errorMsg = ref("");

const user = ref({
  username: "",
  password: "",
  email: "",
  phone: "",
  fullName: "",
  avatarUrl: "",
  roles: [],
});

const passwordConfirm = ref("");

onMounted(() => {
  if (store.username !== "") {
    return router.push("/home");
  }
});

async function signOut() {
  errorMsg.value = "";
  if (!/^.{8,}$/.test(user.value.fullName.trim())) {
    errorMsg.value = "Họ tên phải có ít nhất 8 ký tự";
    return;
  }
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      user.value.email.trim()
    )
  ) {
    errorMsg.value = "Email không hợp lệ";
    return;
  }
  if (!/^.{8,}$/.test(user.value.username.trim())) {
    errorMsg.value = "Tên đăng nhập phải có ít nhất 8 ký tự";
    return;
  }
  if (
    !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/.test(user.value.password.trim())
  ) {
    errorMsg.value =
      "Mật khẩu phải có ít nhất 8 ký tự chứa ít nhất một ký tự viết hoa, viết thường và chữ số";
    return;
  }
  if (passwordConfirm.value !== user.value.password) {
    errorMsg.value = "Mật khẩu không khớp";
    return;
  }
  if (!/^^(84|0[3|5|7|8|9])([0-9]{8})$/.test(user.value.phone.trim())) {
    errorMsg.value = "Số điện thoại không hợp lệ";
    return;
  }

  user.value.avatarUrl = store.avatarUserDefault;

  await proxy.$api
    .post("/api/users", user.value)
    .then((res) => {
      if (res.message) {
        errorMsg.value = res.message;
      } else {
        swal.fire({
          title: "Đăng ký Thành Công!",
          icon: "success",
        });
        router.push("/sign-in");
      }
    })
    .catch((error) => console.log(error));
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
          @submit.prevent="signOut"
        >
          <input
            v-model.trim="user.username"
            class="form-control p-3 mb-4"
            type="text"
            placeholder="Tên đăng nhập"
          />
          <input
            v-model.trim="user.password"
            class="form-control p-3 mb-4"
            type="password"
            placeholder="Mật khẩu"
            autocomplete="on"
          />

          <input
            v-model.trim="passwordConfirm"
            class="form-control p-3 mb-4"
            type="password"
            placeholder="Nhập lại mật khẩu"
          />
          <input
            v-model.trim="user.email"
            class="form-control p-3 mb-4"
            type="text"
            placeholder="Email"
          />
          <input
            v-model.trim="user.fullName"
            class="form-control p-3 mb-4"
            type="text"
            placeholder="Họ tên"
          />
          <input
            v-model.trim="user.phone"
            class="form-control p-3 mb-4"
            type="text"
            placeholder="Số điện thoại"
          />
          <div class="text-start text-red" v-if="errorMsg">
            {{ errorMsg }}
          </div>
          <v-btn
            type="submit"
            class="rounded-lg w-100 py-2 px-5"
            color="#a3765d"
          >
            Đăng ký
          </v-btn>
        </form>
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