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
        <p class="mb-0">名前: {{ archive.value.userName }}</p>

        <button
          @click="copyArchiveTextarea(archive.value.archive)"
          class="btn btn-warning rounded-circle p-0 px-1 mb-1"
        >
          ✔︎
        </button>
        <p class="space">記録: {{ archive.value.archive }}</p>

        <button
          @click="updateArchiveData(key, archive.value.addArchiveDay)"
          class="btn btn-primary"
        >
          更新
        </button>
        <button
          @click="deleteArchiveData(key, archive.value.addArchiveDay)"
          class="btn btn-primary mx-2"
        >
          削除
        </button>

        <div class="mt-2">
          <label class="col-4 col-form-label">メモ:</label>
          <div class="col-7 col-lg-4">
            <textarea
              v-model="archive.value.memo"
              class="form-control"
            ></textarea>
          </div>

          <div class="mt-2">
            <button
              @click="
                addArchiveMemo(
                  key,
                  archive.value.userName,
                  archive.value.memo,
                  archive.value.archive
                )
              "
              class="btn btn-primary"
            >
              メモ登録
            </button>
            <button
              @click="deleteArchiveMemo(key)"
              class="btn btn-primary mx-2"
            >
              メモ削除
            </button>
          </div>
          <div
            v-for="(memo, memoKey) in archivesMemo"
            :key="memoKey"
            class="mt-1"
          >
            <div v-if="memo.value.number === key">
              <p class="space">・{{ memo.value.memo }}</p>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { firestore } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import MixinLogger from "./mixin";
import { Mixins } from "vue-property-decorator";

export default class archives extends Mixins(MixinLogger) {
  archiveDay = ""; //日付を指定し過去の記録を呼び出す際に使用する値

  dayPreview = ""; //表示しているarchivesの日付を格納する値
  archivesMemo = {};
  archivesKeyArray: string[] = [];

  archivesDb = firestore.collection("archives");
  staffsDb = firestore.collection("staffs").doc("staff");

  getArchives(day: string) {
    this.archivesDb
      .doc(day)
      .collection("archive")
      .orderBy("userNumber")
      .onSnapshot(
        (querySnapshot) => {
          const obj: {
            [key: string]: { value: firebase.firestore.DocumentData };
          } = {};
          let array: string[] = [];
          querySnapshot.forEach((doc) => {
            array = [...array, doc.id];
            obj[doc.id] = { value: doc.data() };
          });
          this.archivesObj = obj;
          this.archivesKeyArray = array;
          this.dayPreview = day;
          this.getArchiveMemo();
        },
        (error) => {
          console.log(error.message);
        }
      );
  }

  updateArchiveData(userID: string, day: string) {
    this.archivesDb
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

  deleteArchiveData(userID: string, day: string) {
    this.archivesDb.doc(day).collection("archive").doc(userID).delete();
  }

  copyArchiveTextarea(archiveData: string) {
    //チェックボックスで選択したarchiveをupdateArchiveに代入しtextareaに表示させる
    this.updateArchive = archiveData;
  }

  copyDayArchivesData() {
    //archivesのkeyを格納したarchivesKeyArray配列のlength分、今日の日付のarchives内のdocumentに選択した日付のデータを登録する
    const archiveDataObject: { [key: string]: any } = this.archivesObj; //this.archivesObjでは型が当てはまらずエラーになってしまうため
    for (let i = 0; i < this.archivesKeyArray.length; i++) {
      this.archivesDb
        .doc(this.today)
        .collection("archive")
        .doc(this.archivesKeyArray[i])
        .set({
          archive: archiveDataObject[this.archivesKeyArray[i]].value.archive,
          userName: archiveDataObject[this.archivesKeyArray[i]].value.userName,
          userNumber:
            archiveDataObject[this.archivesKeyArray[i]].value.userNumber,
          addArchiveDay: this.today,
          memo: "",
        });
    }
    alert(this.today + "の記録まとめにコピーしました");
  }

  addArchiveMemo(
    number: string,
    userName: string,
    memo: string,
    archive: string
  ) {
    this.staffsDb
      .collection(this.staffID)
      .doc(this.staffID)
      .collection(this.today + "archivememo")
      .doc(number)
      .set({
        userName: userName,
        memo: memo,
        day: this.today,
        number: number,
        archive: archive,
      });
  }

  getArchiveMemo() {
    this.staffsDb
      .collection(this.staffID)
      .doc(this.staffID)
      .collection(this.today + "archivememo")
      .onSnapshot(
        (querySnapshot) => {
          const obj: {
            [key: string]: { value: firebase.firestore.DocumentData };
          } = {};
          querySnapshot.forEach((doc) => {
            obj[doc.id] = { value: doc.data() };
          });
          this.archivesMemo = obj;
        },
        (error) => {
          console.log(error.message);
        }
      );
  }

  deleteArchiveMemo(userID: string) {
    this.staffsDb
      .collection(this.staffID)
      .doc(this.staffID)
      .collection(this.today + "archivememo")
      .doc(userID)
      .delete();
  }
}
</script>
