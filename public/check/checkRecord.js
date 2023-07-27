import { AltUri, Interest, Name } from "@ndn/packet";
import { WsTransport } from "@ndn/ws-transport";
import { Endpoint } from "@ndn/endpoint";

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
 interest.lifetime = 1000;
 interest.appParameters = encoder.encode(app); //melakukan encode dari string ke uint8array
 await interest.updateParamsDigest();
 
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

async function main() {
 const face = await WsTransport.createFace({}, "wss://hmbe.ndntel-u.my.id:9696");
 face.addRoute(new Name("/"));
 // Enable the form after connection was successful.
 document.querySelector("#app_form").addEventListener("submit", seeOne);
}
window.addEventListener("load", main);
