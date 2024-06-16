<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useBaseStore } from "@/store/index.js";
import { inject } from "vue";

const { proxy } = getCurrentInstance();
const swal = inject("$swal");
const file = ref(null);
const errorMsg = ref("");

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

async function handleFileUpload(event) {
  file.value = event.target.files[0];
  if (file.value !== null) {
    await submitFile();
  }
}

async function submitFile() {
  let formData = new FormData();

  formData.append("image", file.value);
  await proxy.$api
    .postFile("/cloudinary/upload", formData)
    .then((res) => {
      user.value.avatarUrl = res.url;
      console.log(res.url);
    })
    .catch((error) => console.log(error));
}

async function updateUser() {
  errorMsg.value = "";
  if (!/^.{8,}$/.test(user.value.fullName.trim())) {
    errorMsg.value = "Họ tên phải có ít nhất 8 ký tự";
    return;
  }

  await proxy.$api
    .put("/api/users/" + user.value.id, user.value)
    .then((res) => {
      if (res.message) {
        errorMsg.value = res.message;
      } else {
        swal.fire({
          title: "Cập Nhật Thông Tin Thành Công!",
          icon: "success",
        });
      }
    })
    .catch((error) => console.log(error));
}
</script>

<template>
  <section>
    <Breadcrumbs class="mt-2" currentPage="Cập Nhật Thông Tin"></Breadcrumbs>
    <div class="pa-10 d-flex align-center justify-center">
      <div
        class="d-flex flex-column w-50 main-form pa-4 my-4 rounded bg-zinc-800"
      >
        <h4 class="font-weight-bold text-zinc-300 mb-4">Cập Nhật Thông Tin</h4>
        <form
          class="mt-8 space-y-6 mb-4"
          method="POST"
          @submit.prevent="updateUser"
        >
          <div class="border-b-custom pb-3 d-flex justify-center">
            <div class="bg-zinc-900 rounded-lg">
              <div class="pa-3">
                <div
                  class="pa-2 mb-2 bg-zinc-900 border-zinc-700 rounded-lg d-flex align-center justify-center mx-auto cursor-pointer"
                >
                  <input
                    id="Avatar"
                    type="file"
                    class="d-none"
                    accept="image/*"
                    @change="handleFileUpload($event)"
                  />
                  <img
                    :src="user.avatarUrl"
                    alt=""
                    class="w-24 h-24 object-cover object-center"
                  />
                </div>
                <div class="d-flex justify-center align-center">
                  <div class="w-100">
                    <label
                      for="Avatar"
                      class="w-100 text-white bg-zinc-700 font-medium rounded-lg text-sm px-4 py-2 cursor-pointer d-flex justify-center align-center"
                    >
                      <span class="text-center text-sm ml-2">Chọn ảnh</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <label
              for="fullName"
              class="d-block mb-2 text-sm font-medium text-zinc-300"
              >Tên</label
            >
            <input
              v-model="user.fullName"
              id="fullName"
              type="text"
              class="focus-outline-none bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg d-block w-100 p-2"
            />
            <div class="text-start text-red" v-if="errorMsg">
              {{ errorMsg }}
            </div>
          </div>

          <div class="mt-4">
            <label
              for="username"
              class="d-block mb-2 text-sm font-medium text-zinc-300"
              >Tên Tài Khoản</label
            >
            <input
              v-model="user.username"
              id="username"
              type="text"
              class="focus-outline-none bg-zinc-400 border-gray-300 text-gray-900 text-sm rounded-lg d-block w-100 p-2"
              disabled
            />
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