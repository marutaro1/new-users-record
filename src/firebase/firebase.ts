import firebase from "firebase/compat/app"; //firebaseをimport
import "firebase/compat/auth";
import "firebase/compat/firestore"; //firestoreをimport

if (typeof window !== "undefined" && !firebase.apps.length) {
  //"typeof window" は、スクリプトがWebブラウザ内のWebページで実行されているかどうかを確認するための慣用的なチェック
  const firebaseConfig = {
    apiKey: "AIzaSyC-9ENZWD0PSlg7GKgDVBzTHhKkPoCiNbY",
    authDomain: "users-record-ts.firebaseapp.com",
    projectId: "users-record-ts",
    storageBucket: "users-record-ts.appspot.com",
    messagingSenderId: "27343436434",
    appId: "1:27343436434:web:d0bf9e2261948eafcd444b",
  };
  firebase.initializeApp(firebaseConfig); //firebaseの初期化
}

export default firebase;
export const auth = firebase.auth();
export const firestore = firebase.firestore();
//firestoreという定数に入れ、import { firestore } from "../firebase/firebase" とする。
//これにより、import先で firestore.collection(...)... とCloud Firestoreのデータベースにアクセスできる
