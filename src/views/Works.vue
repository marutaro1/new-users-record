<template>
  <div class="scroll">
    <div v-for="data in dailyWorkAllData[today]" :key="data.key">
      <div v-for="i in dailyWorkAllData[today].checkStaffsPost.length" :key="i">
        <p>職員名:{{ data[i - 1].staffName }}</p>
        <p>PHS番号:{{ data[i - 1].phs }}</p>
        <router-link
          :to="'/StaffDayWork/' + data[i - 1].phs + '/StaffPage'"
          class="btn btn-primary p-1"
          >編集</router-link
        >
        <ul>
          <li v-for="n in data[i - 1].work.length" :key="n">
            <p>
              {{ data[i - 1].work[n - 1] }}:
              {{
                staffCompleteWorkCheck[data[i - 1].staffName].workCheck[n - 1]
              }}
            </p>
          </li>
          <li>
            <p>
              {{ data[i - 1].additionalWorkOne }}:
              {{
                staffCompleteWorkCheck[data[i - 1].staffName]
                  .additionalWorkCheck[0]
              }}
            </p>
          </li>
          <li>
            <p>
              {{ data[i - 1].additionalWorkTwo }}:
              {{
                staffCompleteWorkCheck[data[i - 1].staffName]
                  .additionalWorkCheck[1]
              }}
            </p>
          </li>
          <li>
            <p>
              {{ data[i - 1].additionalWorkThree }}:
              {{
                staffCompleteWorkCheck[data[i - 1].staffName]
                  .additionalWorkCheck[2]
              }}
            </p>
          </li>
          <li>
            <p>メモ:</p>
            <p style="white-space: pre-wrap; word-wrap: break-word">
              {{ staffCompleteWorkCheck[data[i - 1].staffName].staffMemo }}
            </p>
          </li>
        </ul>
        <hr />
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
export default class works extends Mixins(MixinLogger) {
  @Prop() id!: number;
  @Prop() department!: string;
  @Prop() userID!: string;
  @Prop() dailyWorkAllData!: string;
  @Prop() departmentWorks!: string;
  @Prop() today!: string;
  @Prop() staffCompleteWorkCheck!: string;
}
</script>
