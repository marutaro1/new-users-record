<template>
  <div class="mt-2 mx-3">
    <h2>業務</h2>
    <div @click="pathStaffDayWorkView">
      <label class="col-6 col-form-label">日付:</label>
      <div class="col-6 col-lg-3">
        <input type="date" v-model="today" class="form-control" />
      </div>
      <label class="col-6 col-form-label">部署:</label>
      <div class="col-6 col-lg-2 mb-2">
        <select v-model="departmentWorks" class="form-select form-select-sm">
          <option value="">選択してください</option>
          <option value="caregiver">介護</option>
          <option value="nurse">看護</option>
          <option value="rehabilitation">リハビリ</option>
          <option value="studentSupport">施設管理</option>
        </select>
      </div>
    </div>
    <div v-if="!staffOfficialPosition">
      <button @click="staffDataGet" class="mt-2 btn btn-warning">
        業務登録
      </button>
    </div>
    <div v-else>
      <button @click="closeStaffDataGet" class="btn btn-warning py-0">×</button>
    </div>
    <div v-if="staffOfficialPosition !== ''">
      <div>
        <label class="col-4 col-form-label">新規業務登録</label>
        <div class="col-6 col-lg-3">
          <select
            v-model="dailyWorkData.week"
            class="form-select form-select-sm mb-2"
          >
            <option value="">選択してください</option>
            <option value="Sunday">日曜日</option>
            <option value="Monday">月曜日</option>
            <option value="Tuesday">火曜日</option>
            <option value="Wednesday">水曜日</option>
            <option value="Thursday">木曜日</option>
            <option value="Friday">金曜日</option>
            <option value="saturday">土曜日</option>
          </select>
        </div>
      </div>
      <div class="col-4 col-lg-5">
        <input
          type="text"
          v-model="dailyWorkData.dailyWork"
          class="form-control"
        />
        <button @click="addDailyWork" class="btn btn-primary mt-2">追加</button>
      </div>
      <div>
        <label class="col-5 col-form-label"> {{ today }} 曜日:</label>
        <div class="col-6 col-lg-3">
          <select v-model="weekData" class="form-select form-select-sm">
            <option value="">選択してください</option>
            <option value="Sunday">日曜日</option>
            <option value="Monday">月曜日</option>
            <option value="Tuesday">火曜日</option>
            <option value="Wednesday">水曜日</option>
            <option value="Thursday">木曜日</option>
            <option value="Friday">金曜日</option>
            <option value="saturday">土曜日</option>
          </select>
        </div>
      </div>
      <div v-for="(staff, key) in checkStaffsPost" :key="key">
        <div @click="getDailyWork">
          <label class="col-4 col-form-label">職員名:</label>
          <div class="col-6 col-lg-5">
            <select
              v-model="staff.staffName"
              class="form-select form-select-sm"
            >
              <option
                v-for="(name, key) in staffDatas"
                :key="key"
                :value="name.value.staffName"
              >
                {{ name.value.staffName }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <label class="col-4 col-form-label">PHS番号:</label>
          <div class="col-4 col-lg-2">
            <select v-model="staff.phs" class="form-select form-select-sm">
              <option value="">選択してください</option>
              <option
                v-for="n in [
                  5000, 5010, 5020, 5030, 5040, 5050, 5060, 5070, 5080, 5090,
                  5100, 5101,
                ]"
                :value="n"
                :key="n"
              >
                {{ String(n).slice(0, -1) }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <label class="col-5 col-form-label">{{ today }}:業務</label>
          <div class="col-4 col-lg-3">
            <select
              v-model="staff.work"
              size="2"
              class="form-select form-select-sm"
              multiple
            >
              <option
                v-for="(work, key) in dailyWorks"
                :key="key"
                :value="work.value.dailyWorkData"
              >
                {{ work.value.dailyWorkData }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <label class="col-4 col-form-label">追加業務1:</label>
          <div class="col-6 col-lg-6">
            <input v-model="staff.additionalWorkOne" class="form-control" />
          </div>
          <label class="col-4 col-form-label">追加業務2:</label>
          <div class="col-6 col-lg-6">
            <input v-model="staff.additionalWorkTwo" class="form-control" />
          </div>
          <label class="col-4 col-form-label">追加業務3:</label>
          <div class="col-6 col-lg-6">
            <input v-model="staff.additionalWorkThree" class="form-control" />
          </div>
        </div>

        <button
          v-if="!limitOver"
          @click="addStaffData"
          class="my-3 btn btn-primary"
        >
          職員追加
        </button>
        <button
          v-if="allCountNumber > 1"
          @click="removeStaffData(staff)"
          class="my-3 mx-2 btn btn-primary"
        >
          削除
        </button>
        <hr />
      </div>
      <button @click="addAllDailyWork" class="btn btn-warning">
        {{ today }}:業務登録
      </button>
    </div>
    <hr />
    <button @click="getAllDailyWork" class="mb-2 btn btn-primary">
      {{ today }}:業務表示
    </button>
    <router-view
      :dailyWorkAllData="this.dailyWorkAllData"
      :departmentWorks="this.departmentWorks"
      :today="this.today"
      :staffCompleteWorkCheck="this.staffCompleteWorkCheck"
    ></router-view>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { firestore } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import MixinLogger from "./mixin";
import { Mixins, Prop } from "vue-property-decorator";

export default class staffdaywork extends Mixins(MixinLogger) {
  staffDatas: { [key: string]: any } = {}; //staffのデータを格納するオブジェクト
  dailyWorkData = {
    //新規業務に入力した値を格納する値
    week: "",
    dailyWork: "",
  }; //getDailyWork取得した値を格納するオブジェクト
  weekData = ""; //曜日のデータを入れる値
  dailyWorks = {}; //曜日ごとに登録した業務データを入れるオブジェクト
  departmentWorks = ""; //何の部署に所属しているの選択肢あてはめる値
  dailyWorkAllData: { [key: string]: any } = {}; //staffと業務を書き出し当路kすいたすべてのデータを格納するオブジェクト
  staffCompleteWorkCheck = {};
  limit = 10;
  today =
    new Date().getFullYear() +
    "-" +
    ("00" + (new Date().getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + new Date().getDate()).slice(-2);
  officialPosition = "";
  changeValue = false; //root pathで記録未登録者ボタンと切り替えるための値
  checkStaffsPost = [
    {
      staffName: "",
      phs: "",
      work: [],
      additionalWorkOne: "",
      additionalWorkTwo: "",
      additionalWorkThree: "",
    },
  ]; //staffDatasの中のstaffNameを格納している配列

  get limitOver() {
    //登録するデータ件数(staffのデータ)がlimitを超えたとき
    return this.checkStaffsPost.length >= this.limit;
  }
  get allCountNumber() {
    //現在書き出したstaffデータの件数
    return this.checkStaffsPost.length;
  }

  pathWorksView() {
    this.$router.push("/staffDayWork/Works");
  }
  pathStaffDayWorkView() {
    if (this.$route.path !== "/StaffDayWork") {
      this.$router.push("/StaffDayWork");
      console.log(this.$route.path);
    }
  }
  staffDataGet() {
    //staff達のデータを取得するメソッド
    this.pathStaffDayWorkView();
    if (this.today === "" || this.departmentWorks === "") {
      return;
    }
    firestore
      .collection("staffs")
      .doc("staff")
      .collection(this.departmentWorks)
      .onSnapshot((querySnapshot) => {
        const obj: {
          [key: string]: { value: firebase.firestore.DocumentData };
        } = {};
        querySnapshot.forEach((doc) => {
          obj[doc.id] = { value: doc.data() };
        });
        this.staffDatas = obj;
        if (this.departmentWorks !== "studentSupport") {
          this.staffOfficialPosition =
            this.staffDatas[this.staffID].value.officialPosition;
        } else {
          this.staffOfficialPosition = "leader";
        }
      });
  }
  addDailyWork() {
    //部署ごとにfirestoreにdocumentを作り、その中のcollectionにその業務の曜日名をつけ、データを保存する
    firestore
      .collection("staffs")
      .doc("dailyWork-" + this.departmentWorks)
      .collection(this.dailyWorkData.week)
      .doc()
      .set({
        dailyWorkData: this.dailyWorkData.dailyWork,
      })
      .then(() => {
        this.dailyWorkData.week = "";
        this.dailyWorkData.dailyWork = "";
      });
  }
  getDailyWork() {
    //addDailyWorkで保存したデータを一気に取得し、dailyWorks(空のオブジェクト)に入れ込む
    firestore
      .collection("staffs")
      .doc("dailyWork-" + this.departmentWorks)
      .collection(this.weekData)
      .onSnapshot((querySnapshot) => {
        const obj: {
          [key: string]: { value: firebase.firestore.DocumentData };
        } = {};
        querySnapshot.forEach((doc) => {
          obj[doc.id] = { value: doc.data() };
        });
        this.dailyWorks = obj;
      });
  }
  addAllDailyWork() {
    //書き出したstaffのname/phs/workを、staffsのdocument→部署ごとのcollection→業務を行う日付のdocument内に登録する
    firestore
      .collection("staffs")
      .doc("staff")
      .collection("daily-work-" + this.departmentWorks)
      .doc(this.today)
      .set({
        checkStaffsPost: this.checkStaffsPost,
      })
      .then(() => {
        this.addNewDailyWorkData();
      });
  }
  getAllDailyWork() {
    setTimeout(() => {
      this.pathWorksView();
    }, 1000);
    this.addDailyWorkData();
  }
  addDailyWorkData() {
    //getAllDailyWork用のデータ登録・呼び出しメソッド
    firestore
      .collection("staffs")
      .doc("staff")
      .collection("daily-work-" + this.departmentWorks)
      .doc(this.today + "completeWork")
      .collection("complete")
      .onSnapshot((querySnapshot) => {
        const obj: {
          [key: string]: { value: firebase.firestore.DocumentData };
        } = {};
        querySnapshot.forEach((doc) => {
          obj[doc.id] = { value: doc.data() };
        });
        this.staffCompleteWorkCheck = obj; //完了業務をstaffCompleteworkCheckに入れ込む
      });
    firestore
      .collection("staffs")
      .doc("staff")
      .collection("daily-work-" + this.departmentWorks)
      .onSnapshot((querySnapshot) => {
        const obj: {
          [key: string]: { value: firebase.firestore.DocumentData };
        } = {};
        querySnapshot.forEach((doc) => {
          if (String(doc.id) !== String(this.today)) {
            return;
          }
          obj[doc.id] = { value: doc.data() };
        });
        this.dailyWorkAllData = obj; //addAllDailyWorkに保存したデータを、日付ごとに取得し、その中で日付が選択した日付と合致するもののみをdailyWorkAllData(からのオブジェクト)に入れ込む
        if (this.staffCompleteWorkCheck !== {}) {
          return;
        } //先ほどのstaffCompleteWorkCheckが{}の場合は、空のworkCheckなどの配列をDBに登録する
        console.log(
          this.dailyWorkAllData[this.today].value.checkStaffsPost.length
        );
        let i = 0;
        while (
          i <
          Number(this.dailyWorkAllData[this.today].value.checkStaffsPost.length)
        ) {
          firestore
            .collection("staffs")
            .doc("staff")
            .collection("daily-work-" + this.departmentWorks)
            .doc(this.today + "completeWork")
            .collection("complete")
            .doc(
              this.dailyWorkAllData[this.today].value.checkStaffsPost[i]
                .staffName
            )
            .set({
              workCheck: [""],
              additionalWorkCheck: ["", "", ""],
              staffMemo: "",
            });
          i++;
        }
      });
  }
  addNewDailyWorkData() {
    //addAllDailyWork用のデータ登録・呼び出しメソッド ※if(this.staffCompleteWorkCheck)の部分をなくしている
    firestore
      .collection("staffs")
      .doc("staff")
      .collection("daily-work-" + this.departmentWorks)
      .doc(this.today + "completeWork")
      .collection("complete")
      .onSnapshot((querySnapshot) => {
        const obj: {
          [key: string]: { value: firebase.firestore.DocumentData };
        } = {};
        querySnapshot.forEach((doc) => {
          obj[doc.id] = { value: doc.data() };
        });
        this.staffCompleteWorkCheck = obj; //完了業務をstaffCompleteworkCheckに入れ込む
      });
    firestore
      .collection("staffs")
      .doc("staff")
      .collection("daily-work-" + this.departmentWorks)
      .onSnapshot((querySnapshot) => {
        const obj: {
          [key: string]: { value: firebase.firestore.DocumentData };
        } = {};
        querySnapshot.forEach((doc) => {
          if (String(doc.id) !== String(this.today)) {
            return;
          }
          obj[doc.id] = { value: doc.data() };
        });
        this.dailyWorkAllData = obj; //addAllDailyWorkに保存したデータを、日付ごとに取得し、その中で日付が選択した日付と合致するもののみをdailyWorkAllData(からのオブジェクト)に入れ込む
        let i = 0;
        console.log(
          Number(this.dailyWorkAllData[this.today].value.checkStaffsPost.length)
        );
        while (
          i <
          Number(this.dailyWorkAllData[this.today].value.checkStaffsPost.length)
        ) {
          firestore
            .collection("staffs")
            .doc("staff")
            .collection("daily-work-" + this.departmentWorks)
            .doc(this.today + "completeWork")
            .collection("complete")
            .doc(
              this.dailyWorkAllData[this.today].value.checkStaffsPost[i]
                .staffName
            )
            .set({
              workCheck: [""],
              additionalWorkCheck: ["", "", ""],
              staffMemo: "",
            });
          i++;
        }
      });
  }

  closeStaffDataGet() {
    this.staffOfficialPosition = "";
  }

  addStaffData() {
    //登録するためのstaffのデータを追加するためのメソッド
    this.checkStaffsPost.push(this.independentObject());
  }
  removeStaffData(target: number) {
    //addStaffDataで追加したデータを削除するためのメソッド
    this.checkStaffsPost.splice(target, 1);
  }
  independentObject() {
    return {
      staffName: "",
      phs: "",
      work: [],
      additionalWorkOne: "",
      additionalWorkTwo: "",
      additionalWorkThree: "",
    };
  }
}
</script>
