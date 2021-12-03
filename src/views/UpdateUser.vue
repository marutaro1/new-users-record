<template>
  <div class="mt-2">
    <h4>利用者情報更新</h4>

    <label class="col-4 col-form-label">部屋番号:</label>
    <div class="col-4 col-lg-2 mb-1">
      <input
        type="number"
        v-model="updateNumber"
        class="form-control"
        placeholder="部屋番号"
      />
    </div>

    <label class="col-4 col-form-label">部屋内番号:</label>
    <div class="col-2 col-lg-1 mb-1">
      <select v-model="updateRoomCheck" class="form-select form-select-sm">
        <option>0</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
      </select>
    </div>

    <label class="col-4 col-form-label">要介護度:</label>
    <div class="col-6 col-lg-2 mb-3">
      <select v-model="updateCareLevel" class="form-select form-select-sm">
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

    <button @click="updateUser" class="btn btn-primary">登録</button>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { firestore } from "../firebase/firebase";
import MixinLogger from "./mixin";
import { Mixins, Prop } from "vue-property-decorator";

export default class updateuser extends Mixins(MixinLogger) {
  @Prop() id!: number;
  @Prop() userID!: string;
  @Prop() userName!: string;

  updateCareLevel = "";
  updateNumber = "";
  updateRoomCheck = "";

  updateUser() {
    //user情報を更新するメソッド
    firestore
      .collection("users")
      .doc(this.userID)
      .update({
        careLevel: this.updateCareLevel,
        number: Number(this.updateNumber + this.updateRoomCheck),
        Floor: parseInt(String(Number(this.updateNumber) / 100)) + "F",
      })
      .then(() => {
        alert.log("登録しました。");
        this.$router.push(
          "/users/user/" +
            Number(this.updateNumber + this.updateRoomCheck) +
            "/records"
        );
      });
  }
}
</script>
