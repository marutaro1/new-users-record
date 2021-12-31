<template>
  <div
    @mousemove.once="
      getNewTreatmentData();
      getDayTreatment(dayData);
    "
    class="mt-2"
  >
    <div class="text-center">
      <p>年齢: {{ ageData }}</p>
    </div>
    <hr />
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
        <div class="col-10 col-lg-6 mb-2">
          <input
            type="text"
            autocomplete="on"
            list="record"
            v-model="updateTreatmentText"
            class="form-control"
          />
          <datalist id="record">
            <option v-for="(newTreatment, key) in newTreatmentObj" :key="key">
              {{ newTreatment.value.treatment }}
            </option>
          </datalist>
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
          選択した処置記録を削除
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
      <label class="col-4 col-form-label">処置記録登録: </label>
      <div class="col-8 col-lg-3 mb-3">
        <input type="datetime-local" v-model="day" class="form-control" />
      </div>
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

    <div>
      <label lass="col-2 col-form-label">各月の処置記録抽出:</label>
      <div class="col-6 my-2">
        <input type="month" v-model="selectDayValue" class="form-control" />
      </div>
      <button
        @click="getDayTreatment(selectDayValue)"
        class="btn btn-primary px-1"
      >
        {{ selectDayValue }}月分表示
      </button>
    </div>

    <hr />

    <div>
      <label class="col-6 col-form-label">日付指定処置記録抽出:</label>

      <div class="col-6 mb-2">
        <input type="date" v-model="dayKeywordFirst" class="form-control" />
        <p class="m-0 p-0">から</p>
        <input type="date" v-model="dayKeywordSecond" class="form-control" />
      </div>
      <button class="btn btn-primary px-1" @click="getMonthTreatment">
        {{ dayKeywordFirst }}-{{ dayKeywordSecond }}分表示
      </button>
      <button class="btn btn-primary px-1 mx-2" @click="creaDay">クリア</button>
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
        <option v-for="n in treatmentArray" :key="n">
          {{ n.value.treatment }}
        </option>
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
  @Prop() birthday!: string;

  newTreatment = ""; //新規処置入力用の値
  newTreatmentObj = {}; //新規処置入力で登録した値を格納するオブジェクト

  dayTreatment = ""; //selectした処置を入れ込むための値
  dayTreatmentObj: { [key: string]: any } = {}; //登録した日付と処置を格納する値

  updateTreatmentID = ""; //処置内容更新のための値
  updateTreatmentText = ""; //処置内容更新のための値

  defaultBoolean = false; //新規処置登録と処置内容更新のtextareaを隠すための値

  treatmentsDb = firestore //処置内容が登録してあるDB
    .collection("treatment");

  userTreatmentsDb = firestore //日々の処置の記録がuserごとに登録してあるDB
    .collection("users")
    .doc(this.userID)
    .collection("treatment");

  inversionBoolean() {
    //defaultBoolean反転のための値
    this.defaultBoolean = !this.defaultBoolean;
  }

  get treatmentArray() {
    this.sortArray(this.serchTreatment);
    this.displayItems(this.dataArrays);
    return this.arrayData;
  }

  get serchTreatment() {
    const dayTreatments = [] as string[];
    for (let i in this.dayTreatmentObj) {
      const treatmentData = this.dayTreatmentObj[i];
      if (treatmentData.value.treatment.indexOf(this.keyword) !== -1) {
        dayTreatments.push(treatmentData);
      }
    }
    return dayTreatments;
  }

  created() {
    this.getAge(this.birthday);
  }

  addNewTreatmentData() {
    if (this.newTreatment === "") {
      return alert("新規処置記録を入力してください");
    }
    //新規処置登録用のメソッド
    this.treatmentsDb
      .doc(String(this.$_uid))
      .set({
        treatment: this.newTreatment,
        treatmentID: this.$_uid,
      })
      .then(() => {
        alert("登録しました");
        this.newTreatment = "";
        this.uidCreate();
      });
  }

  getNewTreatmentData() {
    this.treatmentsDb.onSnapshot(
      (querySnapshot) => {
        const obj: {
          [key: string]: { value: firebase.firestore.DocumentData };
        } = {};
        querySnapshot.forEach((doc) => {
          obj[doc.id] = { value: doc.data() };
        });
        this.newTreatmentObj = obj;
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  addDayTreatmentData() {
    if (this.dayTreatment === "" || this.day === "") {
      return alert("日付、処置を入力してください");
    }
    this.userTreatmentsDb
      .doc(String(this.$_uid))
      .set({
        treatment: this.dayTreatment,
        day: this.day,
        staffName: this.displayStaffName,
        treatmentID: this.$_uid,
      })
      .then(() => {
        alert("登録しました");
        this.dayTreatment = "";
        this.uidCreate();
      });
  }

  deleteDayTreatmentData(treatmentID: string) {
    this.userTreatmentsDb
      .doc(String(treatmentID))
      .delete()
      .then(() => alert("削除しました"));
  }

  getDayTreatment(dayValue: string) {
    if (dayValue === "") {
      return alert("期間を入力してください");
    }
    const startDay = dayValue + "-01";
    const endDay = dayValue + "-32";
    this.userTreatmentsDb
      .where("day", ">=", startDay)
      .where("day", "<=", endDay)
      .limit(150)
      .onSnapshot(
        (querySnapshot) => {
          const obj: {
            [key: string]: { value: firebase.firestore.DocumentData };
          } = {};
          querySnapshot.forEach((doc) => {
            obj[doc.id] = { value: doc.data() };
          });
          this.dayTreatmentObj = obj;
        },
        (error) => {
          console.log(error.message);
        }
      );
  }

  getMonthTreatment() {
    if (this.dayKeywordFirst === "" || this.dayKeywordSecond === "") {
      return alert("期間を入力してください");
    }
    this.userTreatmentsDb
      .where("day", ">=", this.dayKeywordFirst)
      .where("day", "<=", this.dayKeywordSecond)
      .limit(150)
      .onSnapshot(
        (querySnapshot) => {
          const obj: {
            [key: string]: { value: firebase.firestore.DocumentData };
          } = {};
          querySnapshot.forEach((doc) => {
            obj[doc.id] = { value: doc.data() };
          });
          this.dayTreatmentObj = obj;
        },
        (error) => {
          console.log(error.message);
        }
      );
  }

  creaDay() {
    this.dayKeywordFirst = "";
    this.dayKeywordSecond = "";
    this.getDayTreatment(this.dayData);
  }

  deleteTreatmentData(uid: string) {
    if (this.updateTreatmentID === "") {
      return alert("削除する処置記録を選択してください");
    }
    this.treatmentsDb
      .doc(String(uid))
      .delete()
      .then(() => {
        alert("削除しました");
        this.updateTreatmentID = "";
        this.updateTreatmentText = "";
        this.uidCreate();
      });
  }

  updateTreatmentData(uid: string) {
    if (this.updateTreatmentID === "" || this.updateTreatmentText === "") {
      return alert("変更する処置記録の選択、変更した記録を入力してください");
    }
    this.treatmentsDb
      .doc(String(uid))
      .update({
        treatment: this.updateTreatmentText,
        staffName: this.displayStaffName,
      })
      .then(() => {
        alert("更新しました");
        this.updateTreatmentID = "";
        this.updateTreatmentText = "";
        this.uidCreate();
      });
  }
}
</script>
