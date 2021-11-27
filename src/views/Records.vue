<template>
  <div @mousemove.once="getUserRecord(dayData)" class="mt-2">
    <h4>記録</h4>

    <div>
      <label class="col-4 col-form-label mb-1">新規記録入力:</label>
      <div class="col-8 col-lg-3 mb-3">
        <input type="datetime-local" v-model="day" class="form-control" />
      </div>
      <div class="col-10 col-lg-6 mb-3">
        <textarea v-model="record" class="form-control"> </textarea>
      </div>
      <button @click="addUserRecord" class="btn btn-primary mx-1">登録</button>
    </div>

    <hr />

    <div>
      <label class="col-4 col-form-label">記録更新:</label>
      <div class="col-8 col-lg-3 mb-3">
        <input type="datetime-local" v-model="updateDay" class="form-control" />
      </div>
      <div class="col-10 col-lg-6">
        <textarea v-model="updateRecord" class="form-control"></textarea>
      </div>
      <br />
    </div>

    <hr />

    <div>
      <label lass="col-2 col-form-label">各月の記録抽出:</label>
      <div class="col-6 my-2">
        <input type="month" v-model="selectDayValue" class="form-control" />
      </div>
      <button
        @click="getUserRecord(selectDayValue)"
        class="btn btn-primary px-1"
      >
        月分表示
      </button>
    </div>

    <hr />

    <div>
      <label class="col-5 col-form-label">日付指定記録抽出:</label>

      <div class="col-6 mb-2">
        <input type="date" v-model="dayKeywordFirst" class="form-control" />
        <p class="m-0 p-0">から</p>
        <input type="date" v-model="dayKeywordSecond" class="form-control" />
      </div>
      <button @click="getMonthsRecord" class="btn btn-primary px-1">
        {{ dayKeywordFirst }}-{{ dayKeywordSecond }}分表示
      </button>
      <button class="btn btn-primary px-1 mx-1">クリア</button>
    </div>
    <hr />
    <div>
      <div v-if="!!dayKeywordFirst && !!dayKeywordSecond">
        <h5>{{ dayKeywordFirst }}から{{ dayKeywordSecond }}までの記録</h5>
      </div>
      <div v-else-if="!selectDayValue">
        <h5>{{ dayData }}月の記録</h5>
      </div>
      <div v-else>
        <h5>{{ selectDayValue }}月の記録</h5>
      </div>

      <label class="col-6 col-form-label mb-1">キーワード検索:</label>
      <div class="col-6 mb-3">
        <input
          type="text"
          autocomplete="on"
          list="record"
          v-model="keyword"
          class="form-control"
        />
        <datalist id="record">
          <option v-for="n in recordArray" :key="n">{{ n.record }}</option>
        </datalist>
      </div>

      <div class="scroll">
        <div v-for="userRecord in recordArray" :key="userRecord.recordID">
          <p>日付: {{ userRecord.day }}</p>
          <p>{{ userRecord.record }}</p>
          <p>登録者: {{ userRecord.staffName }}</p>
          <button
            @click="updateUserRecord(userRecord.recordID)"
            class="col-2 col-lg-1 btn btn-primary px-0"
          >
            更新
          </button>
          <button
            @click="deleteUserRecord(userRecord.recordID)"
            class="col-2 col-lg-1 btn btn-primary px-0 mx-1"
          >
            削除
          </button>
          <button
            @click="addArchives(userRecord.record)"
            class="col-5 col-lg-2 btn btn-primary px-0 mx-1"
          >
            記録まとめへ追加
          </button>
          <hr />
        </div>
      </div>
    </div>
    <div class="text-center mt-1">
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
import { Component, Vue } from "vue-class-component";
import { firestore } from "../firebase/firebase";
import MixinLogger from "./mixin";
import { Mixins, Prop } from "vue-property-decorator";

@Component
export default class records extends Mixins(MixinLogger) {
  @Prop() id!: number;
  @Prop() userID!: string;
  @Prop() userName!: string;

  pagination = {};

  get recordArray() {
    this.displayItems(this.reverseSortRecords);
    return this.arrayData;
  }

  get serchRecords() {
    const userRecords = [];
    for (let i in this.userRecordObj) {
      let recordData = this.userRecordObj[i];
      if (recordData.record.indexOf(this.keyword) !== -1) {
        userRecords.push(recordData);
      }
    }
    return userRecords;
  }

  get sortRecords() {
    //日付順に並び替える
    return this.serchRecords.slice().sort((a, b) => {
      return Number(new Date(a.day)) - Number(new Date(b.day));
    });
  }

  get reverseSortRecords() {
    //日付逆転追加
    return this.sortRecords.slice().reverse();
  }

  addUserRecord() {
    firestore
      .collection("users")
      .doc(this.userID)
      .collection("user-record")
      .doc(String(this.$_uid))
      .set({
        day: this.day,
        searchDay: this.day.slice(0, 10), //検索用の値 YYYY-MM-DDで登録
        record: this.record,
        recordID: this.$_uid,
        staffName: this.displayStaffName,
      })
      .then(() => {
        this.day = "";
        this.record = "";
        this.uidCreate();
      });
  }

  updateUserRecord(uid) {
    firestore
      .collection("users")
      .doc(this.userID)
      .collection("user-record")
      .doc(String(uid))
      .update({
        day: this.updateDay,
        searchDay: this.updateDay.slice(0, 10), //検索用の値 YYYY-MM-DDで登録
        record: this.updateRecord,
        recordID: uid,
        staffName: this.displayStaffName,
      })
      .then(() => {
        this.updateDay = "";
        this.updateRecord = "";
        this.uidCreate();
      });
  }

  deleteUserRecord(uid) {
    firestore
      .collection("users")
      .doc(this.userID)
      .collection("user-record")
      .doc(String(uid))
      .delete();
  }

  getUserRecord(dayValue) {
    const startDay = dayValue + "-01";
    const endDay = dayValue + "-31";
    firestore
      .collection("users")
      .doc(this.userID)
      .collection("user-record")
      .where("day", ">=", startDay)
      .where("day", "<=", endDay)
      .limit(150)
      .onSnapshot((querySnapshot) => {
        const obj = {};
        querySnapshot.forEach((doc) => {
          obj[doc.id] = doc.data();
        });
        this.userRecordObj = obj;
      });
  }

  getMonthsRecord() {
    firestore
      .collection("users")
      .doc(this.userID)
      .collection("user-record")
      .where("searchDay", ">=", this.dayKeywordFirst)
      .where("searchDay", "<=", this.dayKeywordSecond)
      .onSnapshot((querySnapshot) => {
        const obj = {};
        querySnapshot.forEach((doc) => {
          obj[doc.id] = doc.data();
        });
        this.userRecordObj = obj;
      });
  }

  addArchives(record) {
    firestore
      .collection("archives")
      .doc(this.today)
      .collection("archive")
      .doc(this.id)
      .set({
        archive: record,
        userName: this.userName,
        userNumber: Number(this.id),
        addArchiveDay: this.today,
        memo: "", //DayArchive.vueでメモを追加する際にデータを格納するための値
      });
  }
}
</script>
