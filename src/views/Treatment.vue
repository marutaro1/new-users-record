<template>
  <div
    @mousemove.once="
      getNewTreatmentData();
      getDayTreatment();
    "
    class="mt-2"
  >
    <h4>処置一覧</h4>
    <div v-if="defaultBoolean">
      <button @click="inversionBoolean" class="btn btn-warning m-0 py-0 px-1">
        閉じる
      </button>
      <div>
        <label class="col-form-label col-5 mt-1">新規処置記録追加:</label>
        <div class="col-10 col-lg-6 mb-3">
          <textarea v-model="newTreatment" class="form-control"></textarea>
        </div>
        <button @click="addNewTreatmentData" class="btn btn-primary">
          追加
        </button>
      </div>

      <hr />

      <div>
        <label class="col-form-label col-5 pt-0">既存処置選択:</label>
        <div class="col-10 col-lg-6 mb-2">
          <select
            v-model="updateTreatmentID"
            class="form-select form-select-sm"
          >
            <option value="">選択してください</option>
            <option
              v-for="(newTreatment, key) in newTreatmentObj"
              :key="key"
              :value="newTreatment.value.treatmentID"
            >
              {{ newTreatment.value.treatment }}
            </option>
          </select>
        </div>

        <label class="col-form-label col-5">選択内容更新:</label>
        <div class="col-10 col-lg-6 mb-3">
          <textarea
            v-model="updateTreatmentText"
            class="form-control"
          ></textarea>
        </div>

        <button
          @click="updateTreatmentData(updateTreatmentID)"
          class="btn btn-primary"
        >
          登録
        </button>
        <button
          @click="deleteTreatmentData(updateTreatmentID)"
          class="btn btn-primary mx-2"
        >
          削除
        </button>
      </div>
    </div>

    <div v-else>
      <button @click="inversionBoolean" class="btn btn-warning">
        新規処置追加フォーム表示
      </button>
    </div>

    <hr />

    <div>
      <label class="col-2 col-form-label">日付: </label>
      <div class="col-8 col-lg-3">
        <input type="datetime-local" v-model="day" class="form-control" />
      </div>
      <label class="col-2 col-form-label">処置選択</label>
      <div class="col-10 col-lg-3 mb-3">
        <select v-model="dayTreatment" class="form-select form-select-sm">
          <option value="">選択してください</option>
          <option
            v-for="(newTreatment, key) in newTreatmentObj"
            :key="key"
            :value="newTreatment.value.treatment"
          >
            {{ newTreatment.value.treatment }}
          </option>
        </select>
      </div>
      <button @click="addDayTreatmentData" class="btn btn-primary">登録</button>
    </div>

    <hr />

    <label class="col-6 col-form-label">キーワード検索: </label>
    <div class="col-6 col-lg-3 mb-3">
      <input
        type="text"
        autocomplete="on"
        list="treatment"
        v-model="keyword"
        class="form-control"
      />
      <datalist id="treatment">
        <option v-for="n in treatmentArray" :key="n">{{ n.treatment }}</option>
      </datalist>
    </div>

    <div class="scroll">
      <div v-for="(dayTreatment, key) in treatmentArray" :key="key">
        <p>日付: {{ dayTreatment.value.day }}</p>
        <p class="space">{{ dayTreatment.value.treatment }}</p>
        <p>登録者: {{ dayTreatment.value.staffName }}</p>
        <button
          @click="deleteDayTreatmentData(dayTreatment.value.treatmentID)"
          class="btn btn-primary"
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

export default class treatment extends Mixins(MixinLogger) {
  @Prop() id!: number;
  @Prop() userID!: string;

  newTreatment = ""; //新規処置入力用の値
  newTreatmentObj = {}; //新規処置入力で登録した値を格納するオブジェクト

  dayTreatment = ""; //selectした処置を入れ込むための値
  dayTreatmentObj: { [key: string]: any } = {}; //登録した日付と処置を格納する値

  updateTreatmentID = ""; //処置内容更新のための値
  updateTreatmentText = ""; //処置内容更新のための値

  defaultBoolean = false; //新規処置登録と処置内容更新のtextareaを隠すための値

  inversionBoolean() {
    //defaultBoolean反転のための値
    this.defaultBoolean = !this.defaultBoolean;
  }

  get treatmentArray() {
    this.displayItems(this.reverseSortTreatment);
    return this.arrayData;
  }

  get serchTreatment() {
    let dayTreatments = [] as string[];
    for (let i in this.dayTreatmentObj) {
      let treatmentData = this.dayTreatmentObj[i];
      if (treatmentData.value.treatment.indexOf(this.keyword) !== -1) {
        dayTreatments.push(treatmentData);
      }
    }
    return dayTreatments;
  }

  get sortTreatment() {
    //日付順に並び替える
    return this.serchTreatment
      .slice()
      .sort((a: any | string, b: any | string) => {
        return Number(new Date(a.value.day)) - Number(new Date(b.value.day));
      });
  }

  get reverseSortTreatment() {
    //日付逆転追加
    return this.sortTreatment.slice().reverse();
  }

  addNewTreatmentData() {
    //新規処置登録用のメソッド
    firestore
      .collection("treatment")
      .doc(String(this.$_uid))
      .set({
        treatment: this.newTreatment,
        treatmentID: this.$_uid,
      })
      .then(() => {
        this.newTreatment = "";
        this.uidCreate();
      });
  }

  getNewTreatmentData() {
    firestore.collection("treatment").onSnapshot((querySnapshot) => {
      const obj: {
        [key: string]: { value: firebase.firestore.DocumentData };
      } = {};
      querySnapshot.forEach((doc) => {
        obj[doc.id] = { value: doc.data() };
      });
      this.newTreatmentObj = obj;
    });
  }

  addDayTreatmentData() {
    firestore
      .collection("users")
      .doc(this.userID)
      .collection("treatment")
      .doc(String(this.$_uid))
      .set({
        treatment: this.dayTreatment,
        day: this.day,
        staffName: this.displayStaffName,
        treatmentID: this.$_uid,
      })
      .then(() => {
        this.dayTreatment = "";
        this.uidCreate();
      });
  }

  deleteDayTreatmentData(treatmentID: string) {
    firestore
      .collection("users")
      .doc(this.userID)
      .collection("treatment")
      .doc(String(treatmentID))
      .delete();
    alert("削除しました");
  }

  getDayTreatment() {
    firestore
      .collection("users")
      .doc(this.userID)
      .collection("treatment")
      .onSnapshot((querySnapshot) => {
        const obj: {
          [key: string]: { value: firebase.firestore.DocumentData };
        } = {};
        querySnapshot.forEach((doc) => {
          obj[doc.id] = { value: doc.data() };
        });
        this.dayTreatmentObj = obj;
      });
  }

  deleteTreatmentData(uid: string) {
    firestore
      .collection("treatment")
      .doc(String(uid))
      .delete()
      .then(() => {
        this.updateTreatmentID = "";
        this.updateTreatmentText = "";
        this.uidCreate();
      });
  }

  updateTreatmentData(uid: string) {
    firestore
      .collection("treatment")
      .doc(String(uid))
      .update({
        treatment: this.updateTreatmentText,
        staffName: this.displayStaffName,
      })
      .then(() => {
        this.updateTreatmentID = "";
        this.updateTreatmentText = "";
        this.uidCreate();
      });
  }
}
</script>
