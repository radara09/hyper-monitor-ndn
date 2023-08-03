// Script.js

import { AltUri, Interest, Name } from "@ndn/packet";
import { WsTransport } from "@ndn/ws-transport";
import { Endpoint } from "@ndn/endpoint";
import firebase from "./firebase-config";
import {getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes} from "firebase/storage"

async function main() {
  const face = await WsTransport.createFace({}, "wss://hmbe.ndntel-u.my.id:9696");
  face.addRoute(new Name("/"));
  // Enable the form after connection was successful.
  document.querySelector("#seeAllButton").addEventListener("click", seeAll);
  document.querySelector("#app_form").addEventListener("submit", seeOne);
  document.querySelector("#recordForm").addEventListener("submit", submit);
}
window.addEventListener("load", main);


// Toggle Menu
const menuBar = document.getElementById('menubar');
const navbar = document.querySelector('.navbar');

menuBar.addEventListener('click', () => {
  navbar.classList.toggle('active');
});

// Smooth Scroll
const links = document.querySelectorAll('.navbar a');

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const href = link.getAttribute('href');
    const offsetTop = document.querySelector(href).offsetTop;

    scroll({
      top: offsetTop,
      behavior: 'smooth'
    });

    navbar.classList.remove('active');
  });
});


// seePatients

async function seeAll(evt) { //membuat fungsi async
  evt.preventDefault();
  const prefix = new Name("/data/alluser"); //membuat const baru dari id #app_prefix dari form
  const app = document.querySelector("#app_param"); //membuat const baru dari id #app_param dari form
  //const $log = document.querySelector("#app_log"); //membuat const baru dari id #app_log dari form
  
  const endpoint = new Endpoint();
  const encoder = new TextEncoder(); //membuat const baru untuk fungsi TextEncoder
  const interest = new Interest();  //membuat const baru untuk fungsi Interest
  const decoder = new TextDecoder();
  
  interest.name = prefix; //membuat const baru untuk dari fungsi interest dan name
  interest.mustBeFresh = true; 
  interest.lifetime = 10000;
  interest.appParameters = encoder.encode(app); //melakukan encode packet ndn
  await interest.updateParamsDigest();
  
  //console.log(`ini dari ${app} dan ini dari ${interest.appParameters}`);
  //console.log(app)
  const t0 = Date.now();
  const data = await endpoint.consume(interest);
  const rtt = Date.now() - t0;

  const dataContent = data.content;
  console.log(dataContent)
  console.log(`${rtt} ms`);

  const dataBaru = decoder.decode(dataContent);
  console.log(dataBaru);
  const jsonData = JSON.parse(dataBaru);
  console.log(jsonData);


  // Ambil elemen dengan ID dataContainer untuk menampilkan data
  const dataContainer = document.getElementById('dataContainer');

  // Hapus semua elemen anak dari kontainer sebelumnya
  while (dataContainer.firstChild) {
    dataContainer.removeChild(dataContainer.firstChild);
  }

  // Loop melalui data JSON dan tampilkan di dalam div
  let nomorUrut = 1;
  Object.entries(jsonData).forEach(([, pasien]) => {
  // Buat elemen untuk menampilkan data pasien
  const pasienElement = document.createElement('tr');
  pasienElement.className = 'pasien';

  // Tampilkan data pasien di dalam elemen yang telah dibuat
    pasienElement.innerHTML = `
      <td>${nomorUrut}</td>
      <td>${pasien.noPasien}</td>
      <td>${pasien.Nama}</td>
      <td>${pasien.Umur}</td>
  `;
    
  // Tambahkan elemen pasien ke dalam kontainer
    dataContainer.appendChild(pasienElement);
    nomorUrut++;
  });

}


//checkRecord

async function seeOne(evt) { //membuat fungsi async
  evt.preventDefault();
  const prefix = new Name("/data/getuser"); //membuat const baru dari id #app_prefix dari form
  const app = document.querySelector("#app_name").value; //membuat const baru dari id #app_param dari form
  //const $log = document.querySelector("#app_log"); //membuat const baru dari id #app_log dari form
  
  const endpoint = new Endpoint();
  const encoder = new TextEncoder(); //membuat const baru untuk fungsi TextEncoder
  const interest = new Interest();  //membuat const baru untuk fungsi Interest
  const decoder = new TextDecoder();
  
  interest.name = prefix; //membuat const baru untuk dari fungsi interest dan name
  interest.mustBeFresh = true; 
  interest.lifetime = 10000;
  interest.appParameters = encoder.encode(app); //melakukan encode dari string ke uint8array
  await interest.updateParamsDigest(); //memberikan digital signature
  
  //console.log(`ini dari ${app} dan ini dari ${interest.appParameters}`);
  //console.log(app)
  const t0 = Date.now();
  const data = await endpoint.consume(interest);
  const rtt = Date.now() - t0;
  const dataContent = data.content;
  
  //$log.textContent += `content= ${String.fromCharCode(...dataContent)}\n`; //print data respon
  console.log(dataContent) // => datacontent masih dalam bentuk uint8array ganti ke string
  console.log(`${rtt} ms`);
  //tugasnya gimana ganti itu ke string terus string ke json harusnya.
     
     const dataBaru = decoder.decode(dataContent);
     console.log(dataBaru);
     const jsonData = JSON.parse(dataBaru);
     console.log(jsonData);
 
     const name = jsonData.Nama;
     const age = jsonData.Umur;
     const jk = jsonData.Sex;
     const diagnosis = jsonData.Diagnosis;
     const SBP = jsonData.SBP;
     const DBP = jsonData.DBP;
 
     console.log(name);
     console.log(age);
     console.log(jk);
     console.log(diagnosis);
     console.log(SBP);
     console.log(DBP);
 
     // Mengakses elemen-elemen HTML dengan menggunakan ID
     const dataNama = document.getElementById('nama');
     const dataUmur = document.getElementById('umur');
     const dataJK = document.getElementById('sex');
     const dataDiagnosis = document.getElementById('Diagnosis');
     const dataSBP = document.getElementById('SBP');
     const dataDBP = document.getElementById('DBP');
 
     dataNama.textContent = jsonData.Nama;
     dataUmur.textContent = jsonData.Umur;
     dataJK.textContent = jsonData.Sex;
     dataDiagnosis.textContent = jsonData.Diagnosis;
     dataSBP.textContent = jsonData.SBP;
     dataDBP.textContent = jsonData.DBP;
 
     // dataNama.textContent = name;
     // dataUmur.textContent = age;
     // dataJK.textContent = sex;
     // dataDiagnosis.textContent = diagnosis;
     // dataSBP.textContent = SBP;
     // dataDBP.textContent = DBP;
 
 }


//addRecord

async function submit(evt) { //membuat fungsi async
  evt.preventDefault();
  // Mengambil nilai-nilai dari elemen input
  const addForm = document.getElementById("recordForm");
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

     const jsonData = JSON.stringify(newRecord);
     const prefix = new Name("/data/adduser"); //membuat const baru dari id #app_prefix dari form
     const app = jsonData; //membuat const baru dari id #app_param dari form
     //const $log = document.querySelector("#app_log"); //membuat const baru dari id #app_log dari form
     
     const endpoint = new Endpoint();
     const encoder = new TextEncoder(); //membuat const baru untuk fungsi TextEncoder
     const interest = new Interest();  //membuat const baru untuk fungsi Interest
     
     interest.name = prefix; //membuat const baru untuk dari fungsi interest dan name
     interest.mustBeFresh = true; 
     interest.lifetime = 10000;
     interest.appParameters = encoder.encode(app); //melakukan encode packet ndn
     await interest.updateParamsDigest();
     
     //console.log(`ini dari ${app} dan ini dari ${interest.appParameters}`);
     //console.log(app)
     const t0 = Date.now();
     const data = await endpoint.consume(interest);
     const rtt = Date.now() - t0;
     const dataContent = data.content;
     
  //$log.textContent += `content= ${String.fromCharCode(...dataContent)}\n`; //print data respon
  alert("Data telah di input, silahkan kembali ke Beranda");
  console.log(interest.appParameters);
  console.log(`${rtt} ms`);
  addForm.reset();
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
