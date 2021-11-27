<template>
  <div class="mt-2 mx-3">
    <h3>記録まとめ</h3>

    <div>
      <label class="col-4 col-form-label">本日の日付:</label>
      <div class="col-6 col-lg-3 mb-2">
        <input type="date" v-model="today" class="form-control" />
      </div>
      <button @click="getArchives(today)" class="btn btn-primary">
        記録呼び出し
      </button>
    </div>
    <div>
      <label class="col-6 col-form-label">過去の記録呼び出し:</label>
      <div class="col-6 col-lg-3 mb-2">
        <input type="date" v-model="archiveDay" class="form-control" />
      </div>
      <div v-if="archiveDay">
        <button @click="getArchives(archiveDay)" class="btn btn-primary">
          {{ archiveDay }}:記録呼び出し
        </button>
      </div>
    </div>

    <hr />

    <div>
      <label class="col-4 col-form-label">記録更新:</label>
      <div class="col-10 col-lg-7">
        <textarea v-model="updateArchive" class="form-control"></textarea>
      </div>
    </div>
    <hr />
    <h4>{{ dayPreview }}記録</h4>
    <div v-if="dayPreview === today || dayPreview === ''"></div>
    <div v-else class="text-center">
      <button @click="copyDayArchivesData" class="btn btn-warning mt-1 mb-3">
        {{ today }}: コピー
      </button>
    </div>

    <div class="scroll-user">
      <div v-for="(archive, key) in archivesObj" :key="key">
        <p>
          部屋番号:
          <router-link :to="'/Users/User/' + key + '/records'">{{
            parseInt(key / 10)
          }}</router-link>
        </p>
        <p class="mb-0">名前: {{ archive.userName }}</p>

        <button
          @click="copyArchivetTextarea(archive.archive)"
          class="btn btn-warning rounded-circle p-0 px-1 mb-1"
        >
          ✔︎
        </button>
        <p>記録: {{ archive.archive }}</p>

        <button
          @click="updateArchiveData(key, archive.addArchiveDay)"
          class="btn btn-primary"
        >
          更新
        </button>
        <button
          @click="deleteArchiveData(key, archive.addArchiveDay)"
          class="btn btn-primary mx-1"
        >
          削除
        </button>

        <div class="mt-2">
          <label class="col-4 col-form-label">メモ:</label>
          <div class="col-7 col-lg-4">
            <textarea v-model="archive.memo" class="form-control"></textarea>
          </div>

          <div class="mt-2">
            <button
              @click="
                addArchiveMemo(
                  today,
                  key,
                  archive.userName,
                  archive.memo,
                  archive.archive
                )
              "
              class="btn btn-primary"
            >
              メモ登録
            </button>
            <button
              @click="deleteArchiveMemo(today, key)"
              class="btn btn-primary mx-1"
            >
              メモ削除
            </button>
          </div>
          <div
            v-for="(memo, memoKey) in archivesMemo"
            :key="memoKey"
            class="mt-1"
          >
            <div v-if="memo.number === key">
              <p>・{{ memo.memo }}</p>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-class-component";
import { firestore } from "../firebase/firebase";
import MixinLogger from "./mixin";
import { Mixins } from "vue-property-decorator";

@Component
export default class archives extends Mixins(MixinLogger) {
  archiveDay = ""; //日付を指定し過去の記録を呼び出す際に使用する値

  dayPreview = ""; //表示しているarchivesの日付を格納する値
  archivesMemo = {};
  archivesKeyArray = [];

  getArchives(day) {
    firestore
      .collection("archives")
      .doc(day)
      .collection("archive")
      .orderBy("userNumber")
      .onSnapshot((querySnapshot) => {
        const obj = {};
        let array = [];
        querySnapshot.forEach((doc) => {
          array = [...array, doc.id];
          obj[doc.id] = doc.data();
          console.log(doc.id);
        });
        this.archivesObj = obj;
        console.log(array);
        this.archivesKeyArray = array;
        console.log(this.archivesKeyArray);
        console.log(this.archivesObj);
        console.log(this.archivesKeyArray.length);
        this.dayPreview = day;
        this.getArchiveMemo(this.today);
      });
  }

  getArchiveMemo(day) {
    firestore
      .collection("staffs")
      .doc("staff")
      .collection(this.staffID)
      .doc(this.staffID)
      .collection(day + "archivememo")
      .onSnapshot((querySnapshot) => {
        const obj = {};
        querySnapshot.forEach((doc) => {
          obj[doc.id] = doc.data();
        });
        this.archivesMemo = obj;
      });
  }

  copyDayArchivesData() {
    //archivesのkeyを格納したarchivesKeyArray配列のlength分、今日の日付のarchives内のdocumentに選択した日付のデータを登録する
    for (let i = 0; i < this.archivesKeyArray.length; i++) {
      firestore
        .collection("archives")
        .doc(this.today)
        .collection("archive")
        .doc(this.archivesKeyArray[i])
        .set({
          archive: this.archivesObj[this.archivesKeyArray[i]].archive,
          userName: this.archivesObj[this.archivesKeyArray[i]].userName,
          userNumber: this.archivesObj[this.archivesKeyArray[i]].userNumber,
          addArchiveDay: this.today,
          memo: "",
        });
    }
    alert(this.today + "の記録まとめにコピーしました");
  }

  copyArchivetTextarea(archiveData) {
    //チェックボックスで選択したarchiveをupdateArchiveに代入しtextareaに表示させる
    this.updateArchive = archiveData;
  }

  updateArchiveData(userID, day) {
    firestore
      .collection("archives")
      .doc(day)
      .collection("archive")
      .doc(userID)
      .update({
        archive: this.updateArchive,
      })
      .then(() => {
        this.updateArchive = "";
      });
  }

  deleteArchiveData(userID, day) {
    firestore
      .collection("archives")
      .doc(day)
      .collection("archive")
      .doc(userID)
      .delete();
  }

  copyDayGetArchives(archive, number, userName, day) {
    firestore
      .collection("archives")
      .doc(this.today)
      .collection("archive")
      .doc(number)
      .set({
        archive: archive,
        userName: userName,
        userNumber: number,
        addArchiveDay: this.today,
      });
  }

  addArchiveMemo(day, number, userName, memo, archive) {
    firestore
      .collection("staffs")
      .doc("staff")
      .collection(this.staffID)
      .doc(this.staffID)
      .collection(day + "archivememo")
      .doc(number)
      .set({
        userName: userName,
        memo: memo,
        day: day,
        number: number,
        archive: archive,
      });
  }

  deleteArchiveMemo(day, number) {
    firestore
      .collection("staffs")
      .doc("staff")
      .collection(this.staffID)
      .doc(this.staffID)
      .collection(day + "archivememo")
      .doc(number)
      .delete();
  }
}
</script>
