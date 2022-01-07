<template>
  <div>
    <input type="data" v-model="day" />
    <input type="text" v-model="record" />
    <button @click="addTestRecord">登録</button>
    <div v-for="testRecord in testRecordArray" :key="testRecord.id">
      <p>日付:{{ testRecord.record_day }}</p>
      <p>記録:{{ testRecord.record }}</p>
      <p>登録者:{{ testRecord.staff_name }}</p>
      <hr />
    </div>
    <div v-for="record in subscribeRecordArray" :key="record.id">
      <p>日付:{{ record.record_day }}</p>
      <p>記録:{{ record.record }}</p>
      <p>登録者:{{ record.staff_name }}</p>
      <hr />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { firestore } from "../firebase/firebase";
import firebase from "../firebase/firebase";
import MixinLogger from "./mixin";
import { Mixins, Prop } from "vue-property-decorator";
import { supabase } from "../supabase/supabase";

export default class records extends Mixins(MixinLogger) {
  @Prop() id!: number;
  @Prop() userID!: string;
  @Prop() userName!: string;
  @Prop() birthday!: string;

  testRecordArray = [];

  mounted() {
    this.getTestRecord();
  }

  addTestRecord() {
    supabase
      .from("records")
      .insert({
        record: this.record,
        user_name: this.userName,
        staff_name: this.displayStaffName,
        record_searchday: this.day.slice(0, 10),
        record_day: this.day,
      })
      .then((res) => {
        console.log(res);
        this.subscribeGetTestRecord(res.data);
      });
  }
  getTestRecord() {
    const data = supabase
      .from("records")
      .select("*")
      .limit(100)
      .then((res) => {
        console.log(res);
        this.testRecordArray = res.data;
      });
  }
  subscribeRecordArray = [];
  subscribeGetTestRecord(addData) {
    supabase
      .from("records")
      .on("INSERT", (record) => {
        console.log(record);
        console.log(record.new);
        this.subscribeRecordArray = [record.new, ...this.subscribeRecordArray];
        console.log(this.subscribeRecordArray);
      })
      .subscribe();
  }
}
</script>
