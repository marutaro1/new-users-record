<template>
  <div class="mt-2 mx-3" @mousemove.once="getUsers">
    <h2>利用者一覧</h2>
    <label class="col-5 col-form-label">キーワード検索: </label>
    <div class="col-5">
      <input
        type="text"
        autocomplete="on"
        list="users"
        v-model="keyword"
        class="form-control"
      />
      <datalist id="users">
        <option v-for="n in userArray" :key="n">{{ n.value.name }}</option>
      </datalist>
    </div>

    <label class="col-5 col-form-label">フロア検索: </label>
    <div class="col-3 col-lg-2">
      <select v-model="floorKeyword" class="form-select form-select-sm">
        <option value="">選択してください</option>
        <option
          v-for="n in [
            '1F',
            '2F',
            '3F',
            '4F',
            '5F',
            '6F',
            '7F',
            '8F',
            '9F',
            '10F',
          ]"
          :key="n"
          :value="n"
        >
          {{ n }}
        </option>
      </select>
    </div>

    <label class="col-5 col-form-label">要介護度: </label>
    <div class="col-6 col-lg-3">
      <select
        v-model="serchCareLevelKeyword"
        class="form-select form-select-sm"
      >
        <option value="" selected="selected">選択してください</option>
        <option value="自立">自立</option>
        <option value="要">要支援・要介護</option>
        <option value="要支援">要支援</option>
        <option value="要介護">要介護</option>
      </select>
    </div>
    <hr />

    <div class="scroll-user">
      <div v-for="(user, key) in userArray" :key="key">
        <div>
          <p>
            名前:<router-link
              :to="'/users/user/' + user.value.number + '/records'"
              >{{ user.value.name }}</router-link
            >
          </p>
          <p>部屋番号: {{ parseInt(user.value.number / 10) }}</p>
          <p>要介護度: {{ user.value.careLevel }}</p>
          <p>最終記録登録日: {{ user.value.checkRecordDay }}</p>
          <hr />
        </div>
      </div>
    </div>

    <div class="text-center">
      <p>{{ currentPage + 1 }}ページ</p>
      <div class="container mt-1">
        <nav>
          <ul class="pagination">
            <li class="page-item">
              <a @click="first" class="page-link">&laquo;</a>
            </li>
            <li class="page-item">
              <a @click="prev" class="page-link">&lt;</a>
            </li>

            <li v-for="i in displayPageRange" :key="i" class="page-item">
              <a @click="pageSelect(i)" class="page-link">{{ i }}</a>
            </li>

            <li class="page-item">
              <a @click="next" class="page-link">&gt;</a>
            </li>
            <li class="page-item">
              <a @click="last" class="page-link">&raquo;</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-class-component";
import { firestore } from "../firebase/firebase";
import MixinLogger from "./mixin";
import { Mixins, Prop } from "vue-property-decorator";

@Component
export default class users extends Mixins(MixinLogger) {
  floorKeyword = "";
  serchCareLevelKeyword = "";

  get userArray() {
    this.displayItems(this.sortUsers);
    return this.arrayData;
  }

  get serchUsers() {
    const usersArray = [];
    for (let i in this.users) {
      let usersData = this.users[i];
      if (
        usersData.value.name.indexOf(this.keyword) !== -1 &&
        usersData.value.Floor.indexOf(this.floorKeyword) !== -1 &&
        usersData.value.careLevel.indexOf(this.serchCareLevelKeyword) !== -1
      ) {
        usersArray.push(usersData);
      }
    }
    return usersArray;
  }

  get sortUsers() {
    return this.serchUsers.slice().sort((a, b) => {
      return Number(a.value.number) - Number(b.value.number);
    });
  }
}
</script>
