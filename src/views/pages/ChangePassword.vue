<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { inject } from "vue";
import Breadcrumbs from "@layouts/Breadcrumbs.vue";

const { proxy } = getCurrentInstance();
const swal = inject("$swal");
const errorMsg = ref("");
const password = ref("");
const passwordConfirm = ref("");

const user = ref({
  password: "",
  email: "",
  phone: "",
  fullName: "",
  avatarUrl: "",
  roles: [],
});

onMounted(() => {
  proxy.$api
    .get("/api/users/myInfo")
    .then((res) => {
      Object.assign(user.value, res.result);
      delete user.user_roles;
      user.value.roles = res.result.user_roles.map((role) => role.role);
    })
    .catch((error) => console.log(error));
});

async function changePassword() {
  errorMsg.value = "";
  if(password.value !== passwordConfirm.value){
    errorMsg.value = "Mật khẩu không khớp, vui lòng nhập lại !";
    return;
  }
  if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/.test(password.value.trim())) {
    errorMsg.value =
      "Mật khẩu phải có ít nhất 8 ký tự chứa ít nhất một ký tự viết hoa, viết thường và chữ số";
    return;
  }

  user.value.password = password.value;

  await proxy.$api
    .put("/api/users/" + user.value.id, user.value)
    .then((res) => {
      if (res.message) {
        errorMsg.value = res.message;
      } else {
        swal.fire({
          title: "Cập Nhật Mật Khẩu Thành Công!",
          icon: "success",
        });
      }
    })
    .catch((error) => console.log(error));
}
</script>
<template>
  <section>
    <Breadcrumbs class="mt-2"></Breadcrumbs>

    <div class="pa-10 d-flex align-center justify-center">
    <div
      class="d-flex flex-column w-50 main-form pa-4 my-4 rounded bg-zinc-800"
    >
      <h4 class="font-weight-bold text-zinc-300">Đổi Mật Khẩu</h4>
      <form
        class="mt-8 space-y-6 mb-4"
        method="POST"
        @submit.prevent="changePassword()"
      >
        <div class="mt-4">
          <label
            for="password"
            class="d-block mb-2 text-sm font-medium text-zinc-300"
            >Mật khẩu mới</label
          >
          <input
            v-model="password"
            id="password"
            type="password"
            class="focus-outline-none bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg d-block w-100 p-2"
          />
        </div>

        <div class="mt-4">
          <label
            for="passwordConfirm"
            class="d-block mb-2 text-sm font-medium text-zinc-300"
            >Nhập lại mật khẩu mới</label
          >
          <input
            v-model="passwordConfirm"
            id="passwordConfirm"
            type="password"
            class="focus-outline-none bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg d-block w-100 p-2"
          />
        </div>

        <div class="text-start text-red" v-if="errorMsg">
          {{ errorMsg }}
        </div>

        <div class="w-100 text-end mt-4">
          <v-btn
            type="submit"
            class="rounded text-sm font-medium"
            color="#A3765D"
            >Lưu</v-btn
          >
        </div>
      </form>
    </div>
  </div>
  </section>
</template>


<style lang="scss" scoped>
</style>