<template>
  <div class="mt-2 mx-3">
    <h3>利用者個人ページ</h3>

    <div v-for="(user, key) in userProfileView" :key="key">
      <div class="text-center">
        <p>名前: {{ user[1].name }}</p>
        <p>部屋番号: {{ parseInt(user[1].number / 10) }}</p>
        <p>要介護度: {{ user[1].careLevel }}</p>
        <p>生年月日: {{ user[1].birthday }}</p>
        <p>年齢: {{ age(user[1].birthday) }}歳</p>
        <hr />
        <router-link
          :to="'/users/user/' + user[1].number + '/records'"
          class="btn btn-primary px-2 col-lg-2"
          >記録</router-link
        >
        <router-link
          :to="'/users/user/' + user[1].number + '/updateuser'"
          class="btn btn-primary px-1 mx-1 col-lg-2"
          >情報更新</router-link
        >
        <router-link
          :to="'/users/user/' + user[1].number + '/manuel'"
          class="btn btn-primary px-1 col-lg-2"
          >マニュアル</router-link
        >
        <router-link
          :to="'/users/user/' + user[1].number + '/medicalhistory'"
          class="btn btn-primary px-1 mx-1 col-lg-2"
          >既往歴</router-link
        >
        <router-link
          :to="'/users/user/' + user[1].number + '/treatment'"
          class="btn btn-primary px-2 col-lg-2"
          >処置</router-link
        >
      </div>
      <router-view :userID="user[0]" :userName="user[1].name"></router-view>
    </div>
  </div>
</template>
<script>
import { Vue } from "vue-class-component";
import { firestore } from "../firebase/firebase";

export default {
  props: ["id"],
  data() {
    return {
      userData: "", //usersの代わり
    };
  },
  computed: {
    userProfileView() {
      firestore.collection("users").onSnapshot((querySnapshot) => {
        const obj = {};
        querySnapshot.forEach((doc) => {
          //querySnapshotが現在の全体のデータ
          obj[doc.id] = doc.data();
          //doc.idはランダムな文字列のid
        });
        this.userData = obj;
      });
      const arr = Object.entries(this.userData);
      const result = arr.filter((value) => {
        if (Number(value[1].number) === Number(this.id)) {
          return value;
        }
      });
      return result;
    },
    age() {
      return function (a) {
        const ageTime = Date.now() - new Date(a).getTime();
        const ageDate = new Date(ageTime);
        return ageDate.getUTCFullYear() - 1970;
      };
    },
  },
};
</script>
