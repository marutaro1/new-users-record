<template>
  <div class="mt-2 mx-3">
    <h3>利用者個人ページ</h3>
    <div v-for="(user, key) in userProfileView" :key="key">
      <div class="text-center">
        <router-link
          :to="'/users/user/' + user[1].value.number + '/records'"
          class="btn btn-primary px-2 col-lg-2"
          >記録</router-link
        >
        <router-link
          :to="'/users/user/' + user[1].value.number + '/updateuser'"
          class="btn btn-primary px-1 mx-1 col-lg-2"
          >情報更新</router-link
        >
        <router-link
          :to="'/users/user/' + user[1].value.number + '/manuel'"
          class="btn btn-primary px-1 col-lg-2"
          >マニュアル</router-link
        >
        <router-link
          :to="'/users/user/' + user[1].value.number + '/medicalhistory'"
          class="btn btn-primary px-1 mx-1 col-lg-2"
          >既往歴</router-link
        >
        <router-link
          :to="'/users/user/' + user[1].value.number + '/treatment'"
          class="btn btn-primary px-2 col-lg-2"
          >処置</router-link
        >
        <hr />

        <p>名前: {{ user[1].value.name }}</p>
        <p>部屋番号: {{ parseInt(user[1].value.number / 10) }}</p>
        <p>要介護度: {{ user[1].value.careLevel }}</p>
        <p>生年月日: {{ user[1].value.birthday }}</p>
      </div>
      <router-view
        :userID="user[0]"
        :userName="user[1].value.name"
        :birthday="user[1].value.birthday"
      ></router-view>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { firestore } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import MixinLogger from "./mixin";
import { Mixins, Prop } from "vue-property-decorator";

export default class user extends Mixins(MixinLogger) {
  @Prop() id!: number;

  get userProfileView() {
    this.getUsers();
    const arr = Object.entries(this.users);
    const result = arr.filter((value) => {
      if (Number(value[1].value.number) === Number(this.id)) {
        return value;
      }
    });
    return result;
  }
}
</script>
