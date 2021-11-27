<template>
  <div class="container"></div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { firestore, auth } from "../firebase/firebase";
import MixinLogger from "./mixin";
import { Mixins, Prop } from "vue-property-decorator";

export default class Home extends Mixins(MixinLogger) {}
</script>
