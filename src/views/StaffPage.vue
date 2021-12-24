<template>
  <div>
    <h3>業務編集</h3>
    <router-link to="/StaffDayWork/Works" class="btn btn-primary p-1"
      >戻る</router-link
    >
    <div v-for="(plofile, key) in staffPlofile" :key="key">
      <div @mousemove.once="getWorkCheckChange(plofile.staffName)">
        <p>職員名:{{ plofile.staffName }}</p>
        <p>PHS番号:{{ String(plofile.phs).slice(0, -1) }}</p>
        <div v-for="i in plofile.work.length" :key="i">
          <p>
            業務:{{ plofile.work[i - 1] }}:{{ workCheck[i - 1] }}
            <button
              @click="workCheckChange([i - 1])"
              class="btn btn-primary p-1"
            >
              <div v-if="!workCheck[i - 1]">完了</div>
              <div v-else>未遂</div>
            </button>
          </p>
        </div>
      </div>
      <p>
        業務:{{ plofile.additionalWorkOne }}:{{ additionalWorkCheck[0] }}
        <button
          @click="additionalWorkCheckChange([0])"
          class="btn btn-primary p-1"
        >
          <div v-if="!additionalWorkCheck[0]">完了</div>
          <div v-else>未遂</div>
        </button>
      </p>
      <p>
        業務:{{ plofile.additionalWorkTwo }}:{{ additionalWorkCheck[1] }}
        <button
          @click="additionalWorkCheckChange([1])"
          class="btn btn-primary p-1"
        >
          <div v-if="!additionalWorkCheck[1]">完了</div>
          <div v-else>未遂</div>
        </button>
      </p>
      <p>
        業務:{{ plofile.additionalWorkThree }}:{{ additionalWorkCheck[2] }}
        <button
          @click="additionalWorkCheckChange([2])"
          class="btn btn-primary p-1"
        >
          <div v-if="!additionalWorkCheck[2]">完了</div>
          <div v-else>未遂</div>
        </button>
      </p>
      <div>
        <label class="col-2 col-form-label">メモ:</label>
        <div class="col-lg-5 col-8">
          <textarea v-model="staffMemo" class="form-control"></textarea>
        </div>
      </div>
      <button
        @click="addWorkCheckChange(plofile.staffName)"
        class="my-2 btn btn-primary"
      >
        登録
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { firestore } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import MixinLogger from "./mixin";
import { Mixins, Prop } from "vue-property-decorator";

export default class staffPage extends Mixins(MixinLogger) {
  @Prop() id!: number;
  @Prop() dailyWorkAllData!: string;
  @Prop() departmentWorks!: string;
  @Prop() today!: string;
  @Prop() staffCompleteWorkCheck!: string;

  staffDatas = {};
  workCheck = [""];
  additionalWorkCheck = ["", "", ""];
  staffMemo = "";

  get staffPlofile() {
    this.objectStaff();
    return this.staffDatas;
  }

  objectStaff() {
    const toDay: string = this.today;
    const dataValue = this.dailyWorkAllData[this.today as keyof typeof toDay]; //keyに動的な変数を入れるため as key typeofを使用
    const arr = Object.entries(dataValue);
    console.log(arr);
    const data = arr[0][1];
    console.log(data);
    const result = data.checkStaffsPost.filter(
      (value: { [key: string]: string | number }) => {
        if (Number(value.phs) === Number(this.id)) {
          return value;
        }
      }
    );
    this.staffDatas = result;
  }

  workCheckChange(i: number) {
    if (!this.workCheck[i]) {
      this.workCheck[i] = "完了";
    } else {
      this.workCheck[i] = "";
    }
  }

  additionalWorkCheckChange(i: number) {
    if (this.additionalWorkCheck[i] === "") {
      this.additionalWorkCheck[i] = "完了";
    } else {
      this.additionalWorkCheck[i] = "";
    }
  }
  addWorkCheckChange(staffName: string) {
    firestore
      .collection("staffs")
      .doc("staff")
      .collection("daily-work-" + this.departmentWorks)
      .doc(this.today + "completeWork")
      .collection("complete")
      .doc(staffName)
      .set({
        workCheck: this.workCheck,
        additionalWorkCheck: this.additionalWorkCheck,
        staffMemo: this.staffMemo,
      })
      .then(() => this.$router.push("/StaffDayWork/Works"));
    alert("完了業務を登録しました。");
  }

  getWorkCheckChange(staffName: string) {
    let objTypeKapsel: { [key: string]: any } = {}; //objを型定義するための変数
    firestore
      .collection("staffs")
      .doc("staff")
      .collection("daily-work-" + this.departmentWorks)
      .doc(this.today + "completeWork")
      .collection("complete")
      .onSnapshot(
        (querySnapshot) => {
          const obj: {
            [key: string]: { value: firebase.firestore.DocumentData };
          } = {};
          querySnapshot.forEach((doc) => {
            if (doc.id !== staffName) {
              return;
            }
            obj[doc.id] = { value: doc.data() };
          });
          objTypeKapsel = obj;
          console.log(objTypeKapsel);
          this.workCheck = objTypeKapsel[staffName].value.workCheck;
          this.additionalWorkCheck =
            objTypeKapsel[staffName].value.additionalWorkCheck;
          this.staffMemo = objTypeKapsel[staffName].value.staffMemo;
        },
        (error) => {
          console.log(error.message);
        }
      );
  }
}
</script>
