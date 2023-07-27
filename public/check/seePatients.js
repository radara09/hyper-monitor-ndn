import { AltUri, Interest, Name } from "@ndn/packet";
import { WsTransport } from "@ndn/ws-transport";
import { Endpoint } from "@ndn/endpoint";

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
  interest.lifetime = 1000;
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

// Loop melalui data JSON dan tampilkan di dalam div
Object.entries(jsonData).forEach(([, pasien]) => {
// Buat elemen untuk menampilkan data pasien
const pasienElement = document.createElement('tr');
pasienElement.className = 'pasien';

// Tampilkan data pasien di dalam elemen yang telah dibuat
pasienElement.innerHTML = `
    <td>${pasien.noPasien}</td>
    <td>${pasien.Nama}</td>
    <td>${pasien.Umur}</td>
`;

// Tambahkan elemen pasien ke dalam kontainer
dataContainer.appendChild(pasienElement);
});

}

async function main() {
  const face = await WsTransport.createFace({}, "wss://hmbe.ndntel-u.my.id:9696");
  face.addRoute(new Name("/"));
  // Enable the form after connection was successful.
  document.querySelector("#seeAllButton").addEventListener("click", seeAll);
}
window.addEventListener("load", main);