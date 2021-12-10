<template>
  <div @mousemove.once="getManuelData" class="mt-2">
    <h4>マニュアル</h4>
    <div class="col-12">
      <label class="col-4 col-form-label">タイトル:</label>
      <div class="col-10 col-lg-3">
        <input type="data" v-model="manuelTitle" class="form-control" />
      </div>
      <label class="col-6 col-form-label">新規マニュアル:</label>
      <div class="col-10 col-lg-5 mb-3">
        <textarea v-model="manuel" class="form-control"> </textarea>
      </div>
      <button @click="addManuelData" class="btn btn-primary">登録</button>
    </div>

    <hr />

    <div class="mb-4">
      <label lass="col-2 col-form-label">タイトル更新:</label>
      <div class="col-10 col-lg-3">
        <input type="datal" v-model="updateManuelTitle" class="form-control" />
      </div>
      <label lass="col-2 col-form-label">マニュアル更新:</label>
      <div class="col-10 col-lg-5">
        <textarea v-model="updateManuel" class="form-control"> </textarea>
      </div>
    </div>

    <hr />

    <h5>マニュアル一覧</h5>
    <div class="col-6 col-lg-3 mb-3">
      <input
        type="text"
        autocomplete="on"
        list="manuel"
        v-model="keyword"
        class="form-control"
      />
      <datalist id="manuel">
        <option v-for="n in manuelArray" :key="n">{{ n.value.manuel }}</option>
        /
      </datalist>
    </div>

    <div class="scroll">
      <div v-for="(manuel, key) in manuelArray" :key="key">
        <!-- titleの値は予測変換位でないが、検索はできる -->
        <p>タイトル: {{ manuel.value.manuelTitle }}</p>
        <p class="space">{{ manuel.value.manuel }}</p>
        <button
          @click="updateManuelData(manuel.value.manuelID)"
          class="btn btn-primary px-0 col-2 col-lg-1"
        >
          更新
        </button>
        <button
          @click="deleteManuelData(manuel.value.manuelID)"
          class="btn btn-primary px-0 col-2 col-lg-1 mx-2"
        >
          削除
        </button>
        <hr />
      </div>
    </div>

    <div class="text-center">
      <p>{{ currentPage + 1 }}ページ</p>
      <div class="container">
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
import { Vue } from "vue-class-component";
import { firestore } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import MixinLogger from "./mixin";
import { Mixins, Prop } from "vue-property-decorator";

export default class manuel extends Mixins(MixinLogger) {
  @Prop() id!: number;
  @Prop() userID!: string;

  manuelsDb = firestore
    .collection("users")
    .doc(this.userID)
    .collection("manuel");

  get manuelArray() {
    this.displayItems(this.serchManuel);
    return this.arrayData;
  }

  get serchManuel(): string[] {
    const manuels = [] as string[];
    for (let i in this.manuelObj) {
      const manuelData = this.manuelObj[i];
      if (
        manuelData.value.manuelTitle.indexOf(this.keyword) !== -1 ||
        manuelData.value.manuel.indexOf(this.keyword) !== -1
      ) {
        manuels.push(manuelData);
      }
    }
    return manuels;
  }

  addManuelData() {
    this.manuelsDb
      .doc(String(this.$_uid))
      .set({
        manuelTitle: this.manuelTitle,
        manuel: this.manuel,
        manuelID: this.$_uid,
      })
      .then(() => {
        this.manuelTitle = "";
        this.manuel = "";
        this.uidCreate();
      });
  }

  updateManuelData(uid: string) {
    this.manuelsDb
      .doc(String(uid))
      .update({
        manuelTitle: this.updateManuelTitle,
        manuel: this.updateManuel,
      })
      .then(() => {
        this.updateManuelTitle = "";
        this.updateManuel = "";
        this.uidCreate();
      });
  }

  deleteManuelData(uid: string) {
    this.manuelsDb.doc(String(uid)).delete();
  }

  getManuelData() {
    this.manuelsDb.onSnapshot((querySnapshot) => {
      const obj: {
        [key: string]: { value: firebase.firestore.DocumentData };
      } = {};
      querySnapshot.forEach((doc) => {
        obj[doc.id] = { value: doc.data() };
      });
      this.manuelObj = obj;
    });
  }
}
</script>
