import { AltUri, Interest, Name } from "@ndn/packet";
import { WsTransport } from "@ndn/ws-transport";
import { Endpoint } from "@ndn/endpoint";
import firebase from "../../src/firebase-config";
import {getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes} from "firebase/storage"

async function submit(evt) { //membuat fungsi async
  evt.preventDefault();
    // Mengambil nilai-nilai dari elemen input
  const noPasien = document.getElementById("noPasien").value;
  const nama = document.getElementById("nama").value;
  const umur = document.getElementById("umur").value;
  const sex = document.getElementById("sex").value;
  const bmi = document.getElementById("bmi").value;
  const heartRate = document.getElementById("heartRate").value;
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;
  const file = document.getElementById("file").files[0];
      // Buat objek data yang akan dikirim ke Firebase
    const newRecord = {
      noPasien: noPasien,
      nama: nama,
      umur: umur,
      sex: sex,
      bmi: bmi,
      heartRate: heartRate,
      height: height,
      weight: weight,
      file: await uploadFileAndGetDownloadURL(file)
    };

    //  const fileRecord = {file: file.name}
    //  const allRecord = {newRecord, fileRecord}

     const jsonData = JSON.stringify(newRecord);
     const prefix = new Name("/data/adduser"); //membuat const baru dari id #app_prefix dari form
     const app = jsonData; //membuat const baru dari id #app_param dari form
     //const $log = document.querySelector("#app_log"); //membuat const baru dari id #app_log dari form
     
     const endpoint = new Endpoint();
     const encoder = new TextEncoder(); //membuat const baru untuk fungsi TextEncoder
     const interest = new Interest();  //membuat const baru untuk fungsi Interest
     
     interest.name = prefix; //membuat const baru untuk dari fungsi interest dan name
     interest.mustBeFresh = true; 
     interest.lifetime = 1000;
     interest.appParameters = encoder.encode(app); //melakukan encode packet ndn
     await interest.updateParamsDigest();
     
     //console.log(`ini dari ${app} dan ini dari ${interest.appParameters}`);
     //console.log(app)
     const t0 = Date.now();
     const data = await endpoint.consume(interest);
     const rtt = Date.now() - t0;
     const dataContent = data.content;
     
     $log.textContent += `content= ${String.fromCharCode(...dataContent)}\n`; //print data respon
     console.log(interest.appParameters)
     console.log(`${rtt} ms`);
}

async function uploadFileAndGetDownloadURL(file) {
  try {
    // Buat referensi ke Firebase Storage dengan spesifik mengakses direktori "files" dan nama file
    const storageRef = firebase.storage().ref().child("files/" + file.name);
    const uploadTask = storageRef.put(file);

    // Tunggu hingga proses upload selesai
    await uploadTask;

    // Dapatkan URL unduhan file
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

    // Kembalikan URL unduhan
    return downloadURL;
  } catch (error) {
    // Tangani kesalahan yang terjadi selama proses upload atau saat mendapatkan URL unduhan
    console.error("Error uploading file or getting download URL:", error);
    throw error;
  }
}

async function main() {
     const face = await WsTransport.createFace({}, "wss://hmbe.ndntel-u.my.id:9696");
     face.addRoute(new Name("/"));
     // Enable the form after connection was successful.
     document.querySelector("#recordForm").addEventListener("submit", submit);
}
   
window.addEventListener("load", main);