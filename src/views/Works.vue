<template>
  <div class="scroll">
    <div v-for="data in dailyWorkAllData[today]" :key="data.key">
      <div
        v-for="i in dailyWorkAllData[today].value.checkStaffsPost.length"
        :key="i"
      >
        <p>職員名:{{ data.checkStaffsPost[i - 1].staffName }}</p>
        <p>
          PHS番号:{{ String(data.checkStaffsPost[i - 1].phs).slice(0, -1) }}
        </p>

        <router-link
          :to="
            '/StaffDayWork/' + data.checkStaffsPost[i - 1].phs + '/StaffPage'
          "
          class="btn btn-primary p-1"
          >編集</router-link
        >

        <ul>
          <li v-for="n in data.checkStaffsPost[i - 1].work.length" :key="n">
            <p>
              {{ data.checkStaffsPost[i - 1].work[n - 1] }}:
              {{
                staffCompleteWorkCheck[data.checkStaffsPost[i - 1].staffName]
                  .value.workCheck[n - 1]
              }}
            </p>
          </li>
          <li>
            <p>
              {{ data.checkStaffsPost[i - 1].additionalWorkOne }}:
              {{
                staffCompleteWorkCheck[data.checkStaffsPost[i - 1].staffName]
                  .value.additionalWorkCheck[0]
              }}
            </p>
          </li>
          <li>
            <p>
              {{ data.checkStaffsPost[i - 1].additionalWorkTwo }}:
              {{
                staffCompleteWorkCheck[data.checkStaffsPost[i - 1].staffName]
                  .value.additionalWorkCheck[1]
              }}
            </p>
          </li>
          <li>
            <p>
              {{ data.checkStaffsPost[i - 1].additionalWorkThree }}:
              {{
                staffCompleteWorkCheck[data.checkStaffsPost[i - 1].staffName]
                  .value.additionalWorkCheck[2]
              }}
            </p>
          </li>
          <li>
            <p>メモ:</p>
            <p class="space">
              {{
                staffCompleteWorkCheck[data.checkStaffsPost[i - 1].staffName]
                  .value.staffMemo
              }}
            </p>
          </li>
        </ul>

        <hr />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { firestore } from "../firebase/firebase";
import MixinLogger from "./mixin";
import { Mixins, Prop } from "vue-property-decorator";

export default class works extends Mixins(MixinLogger) {
  @Prop() department!: string;
  @Prop() dailyWorkAllData!: string;
  @Prop() departmentWorks!: string;
  @Prop() today!: string;
  @Prop() staffCompleteWorkCheck!: string;
}
</script>
