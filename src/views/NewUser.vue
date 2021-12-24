<template>
  <div class="mt-2 mx-3">
    <h3>新規利用者登録</h3>
    <label class="col-4 col-form-label">名前:</label>
    <div class="col-lg-2 col-4">
      <input
        type="data"
        v-model="name"
        class="form-control"
        placeholder="名前"
      />
    </div>
    <br />
    <label class="col-4 col-form-label">生年月日:</label>
    <div class="col-md-3 col-6">
      <input type="date" v-model="birthday" class="form-control" />
    </div>
    <br />
    <label class="col-4 col-form-label">要介護度:</label>
    <div class="col-md-3 col-6">
      <select v-model="careLevel" class="form-select form-select-sm">
        <option value="">選択してください</option>
        <option value="自立">自立</option>
        <option value="要支援1">要支援1</option>
        <option value="要支援2">要支援2</option>
        <option value="要介護1">要介護1</option>
        <option value="要介護2">要介護2</option>
        <option value="要介護3">要介護3</option>
        <option value="要介護4">要介護4</option>
        <option value="要介護5">要介護5</option>
      </select>
    </div>
    <br />
    <label class="col-4 col-form-label">部屋番号:</label>
    <div class="col-4 col-lg-3">
      <input
        type="number"
        v-model="number"
        class="form-control"
        placeholder="部屋番号"
      />
    </div>
    <br />
    <label class="col-4 col-form-label">部屋内番号:</label>
    <div class="col-lg-1 col-2">
      <select v-model="roomCheck" class="form-select form-select-sm">
        <option>0</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </select>
    </div>
    <br />
    <button @click="addUsers" class="btn btn-primary">登録</button>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { firestore } from "../firebase/firebase";
import MixinLogger from "./mixin";
import { Mixins, Prop } from "vue-property-decorator";

export default class about extends Mixins(MixinLogger) {
  addUsers() {
    //userを登録するメソッド
    firestore
      .collection("users")
      .doc(String(this.$_uid))
      .set({
        name: this.name,
        birthday: this.birthday,
        careLevel: this.careLevel,
        number: Number(this.number + this.roomCheck),
        //Floor: parseInt(String(Number(this.number) / 100)) + "F",
        checkRecordDay: "",
        userID: String(this.$_uid),
      })
      .then(() => {
        alert("登録しました。");
        this.name = "";
        this.birthday = "";
        this.careLevel = "";
        this.number = "";
        this.roomCheck = "";
        this.age = 0;
      });
  }
}
</script>
