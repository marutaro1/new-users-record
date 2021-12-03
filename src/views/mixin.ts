import { Vue } from "vue-class-component";
import { firestore, auth } from "../firebase/firebase";
import firebase from "../firebase/firebase";

export default class mixinLogger extends Vue {
  users: { [key: string]: any } = {};
  age = 0;
  $_uid!: number;
  dayData =
    new Date().getFullYear() +
    "-" +
    ("00" + (new Date().getMonth() + 1)).slice(-2);
  //各月の記録をgetするときに、input type='month'から月のデータを入れ、それを引数として渡すための値
  day =
    new Date().getFullYear() +
    "-" +
    ("00" + (new Date().getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + new Date().getDate()).slice(-2) +
    "T" +
    ("00" + new Date().getHours()).slice(-2) +
    ":" +
    "00"; //入力した日付を格納する値
  today =
    new Date().getFullYear() +
    "-" +
    ("00" + (new Date().getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + new Date().getDate()).slice(-2); //今日の日付
  keyword = "";
  staffID = ""; //staffのID(authで登録したランダムなuid)

  //Users.
  name = "";
  birthday = "";
  careLevel = "";
  number = "";
  roomCheck = "";

  //Record.vue
  userRecordObj: { [key: string]: any } = {}; //取得した記録の情報を入れ込むアブジェクト
  record = ""; //入力した記録を格納する値
  updateDay = ""; //入力した更新用の日付を格納する値
  updateRecord = ""; //入力した更新用の記録を格納する値
  selectDayValue = ""; //選択した日付を入れ、その値をgetUserRecordに引数として渡し、その日付の月の記録を抽出する
  dayKeywordFirst = ""; //getMonthsRecordで選択した日付間(dayKeywordFirst 〜 daykeywordsecond)の記録を抽出するための値
  dayKeywordSecond = ""; //getMonthsRecordで選択した日付間(dayKeywordFirst 〜 daykeywordsecond)の記録を抽出するための値
  changeValue = false; //最終記録日確認で使用

  //manuel.vue
  manuelObj: { [key: string]: any } = {}; //取得したマニュアルの情報を入れ込むアブジェクト
  manuelTitle = ""; //入力したマニュアルのタイトルを格納する値
  manuel = ""; //入力したマニュアルを格納する値
  updateManuelTitle = ""; //入力した更新用のマニュアルのタイトルを格納する値
  updateManuel = ""; //入力した更新用のマニュアルを格納する値

  //MedicalHistory.vue
  medicalHistoryObj: { [key: string]: any } = {}; //取得した既往歴の情報を入れ込むオブジェクト
  medicalHistory = ""; //入力した既往歴を格納する値
  updateMedicalHistory = ""; //入力した更新用の既往歴を格納する値

  //Archives.vue
  archivesObj = {}; //取得した記録まとめ情報を入れ込むオブジェクト
  updateArchive = ""; //入力した更新用の記録を格納する値

  //SignUp.vue
  staffs = {};
  staffid = "";
  staffKey = "";
  staffName = ""; //入力した職員名を格納する値
  department = ""; //入力した部署を格納する値
  officialPosition = ""; //入力した役職を格納する値
  email = ""; //入力したEメールを格納する値
  password = ""; //入力したパスワードを格納する値
  authentication = false;
  displayStaffName = "";

  staffOfficialPosition = ""; //ログインしたstaffのoffitialPositionを格納する値

  uidCreate() {
    this.$_uid = Math.floor(Math.random() * 1000);
  }

  created() {
    this.uidCreate();
  }

  mounted() {
    firebase.auth().onAuthStateChanged((staff) => {
      if (staff) {
        this.authentication = true;
        this.staffID = staff.uid;
        this.staffNameSeek(this.staffID);
      } else {
        this.authentication = false;
      }
    });
  }

  getUsers() {
    interface ISomeObject {
      Floor: string;
      birthday: string;
      careLevel: string;
      checkRecordDay: string;
      name: string;
      number: number;
    }
    this.changeValue = false;
    firestore
      .collection("users")
      .orderBy("number")
      .onSnapshot((querySnapshot) => {
        const obj: {
          [key: string]: { value: firebase.firestore.DocumentData };
        } = {};
        querySnapshot.forEach((doc) => {
          //querySnapshotが現在の全体のデータ
          obj[doc.id] = { value: doc.data() };
          //doc.idはランダムな文字列のid
        });
        this.users = obj;
      });
  }

  ageView(day: string): void {
    const ageTime = Date.now() - new Date(day).getTime();
    const ageDate = new Date(ageTime);
    this.age = ageDate.getUTCFullYear() - 1970;
  }

  staffNameSeek(staffID: string) {
    //ログインしているstaffの名前を取得する
    firestore
      .collection("staffs")
      .doc("staff")
      .collection(staffID)
      .onSnapshot((querySnapshot) => {
        const obj: {
          [key: string]: { value: firebase.firestore.DocumentData };
        } = {};
        querySnapshot.forEach((doc) => {
          //querySnapshotが現在の全体のデータ
          obj[doc.id] = { value: doc.data() };
        });
        this.staffs = obj;
        this.staffKey = staffID;
        const displayNameData: string = obj[staffID].value.staffName;
        // console.log(displayNameData)
        this.displayStaffName = displayNameData;
        // console.log(this.displayStaffName)
      });
  }

  signUp() {
    auth
      .createUserWithEmailAndPassword(this.email, this.password)
      .then((res) => {
        this.staffNameAdd(res.user!.uid);
      });
    alert(
      "登録しました ※注意:現在、新しく登録した職員で自動的にログインしています"
    );
  }

  staffNameAdd(staffID: string) {
    firestore
      .collection("staffs")
      .doc("staff")
      .collection(staffID)
      .doc(staffID)
      .set({
        staffName: this.staffName,
        email: this.email,
        password: this.password,
      })
      .then(() => {
        this.staffDepartment(staffID);
      });
  }

  staffDepartment(staffID: string) {
    firestore
      .collection("staffs")
      .doc("staff")
      .collection(this.department)
      .doc(staffID)
      .set({
        staffName: this.staffName,
        department: this.department,
        officialPosition: this.officialPosition,
      })
      .then(() => {
        this.$router.push("/users");
      });
  }

  doLogin() {
    auth
      .signInWithEmailAndPassword(this.email, this.password)
      .then(() => this.$router.push("/users"));
  }

  //<---- ページネーション処理 ---->
  currentPage = 0; // 現在のページ番号
  size = 10; // 1ページに表示するアイテムの上限
  pageRange = 10; // ページネーションに表示するページ数の上限
  items: string[] | number[] = []; // 表示するアイテムリスト
  head!: number;
  arrayData: string[] | number[] | any = [];
  half = 0;

  //ページ数を取得する
  //@return {number} 総ページ数(1はじまり)
  get pages() {
    return Math.ceil(this.items.length / this.size);
  }

  // ページネーションで表示するページ番号の範囲を取得する
  // @return {Array<number>} ページ番号の配列
  get displayPageRange() {
    this.pageRange = this.pages;
    this.half = Math.ceil(this.pageRange / 2);
    let start;
    let end;

    if (this.pages < this.pageRange) {
      // ページネーションのrangeよりページ数がすくない場合
      start = 1;
      end = this.pages;
    } else if (this.currentPage < this.half) {
      // 左端のページ番号が1になったとき
      start = 1;
      end = start + this.pageRange - 1;
    } else if (this.pages - this.half < this.currentPage) {
      // 右端のページ番号が総ページ数になったとき
      end = this.pages;
      start = end - this.pageRange + 1;
    } else {
      // activeページを中央にする
      start = this.currentPage - this.half + 1;
      end = this.currentPage + this.half;
    }
    const indexes = [];
    for (let i = start; i <= end; i++) {
      indexes.push(i);
    }
    // console.log("indexes" + indexes);
    return indexes;
  }

  // 現在のページで表示するアイテムリストを取得する
  // @return {any} 表示用アイテムリスト
  displayItems(array: string[] | number[]) {
    this.head = this.currentPage * this.size;
    // this.arrayData = arry
    this.items = array;
    this.arrayData = array.slice(this.head, this.head + this.size); //0 ~ 10までの配列を表示させる
  }

  // 現在のページかどうか判定する
  // @param {number} page ページ番号
  // @return{boolean} 現在のページならtrue
  // isSelected (page: number) {
  //     if(page - 1 !== this.currentPage) {
  //         this.k = page - 1
  //     }
  // }

  //ページ先頭に移動する
  first() {
    this.currentPage = 0;
    //this.selectHandler();
  }

  //ページ後尾に移動する
  last() {
    this.currentPage = this.pages - 1;
    //this.selectHandler();
  }

  //1ページ前に移動する

  prev() {
    if (0 < this.currentPage) {
      this.currentPage--;
      //this.selectHandler();
    }
  }

  //1ページ次に移動する
  next() {
    if (this.currentPage < this.pages - 1) {
      this.currentPage++;
      //this.selectHandler();
    }
  }

  //指定したページに移動する
  //@param {number} index ページ番号
  pageSelect(index: number) {
    this.currentPage = index - 1;
    //this.selectHandler();
  }

  //ページを変更した時の処理
  //selectHandler () {}
  //<-------->
}
