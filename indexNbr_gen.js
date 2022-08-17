// 使い方
// denoの実行できる環境で以下のコマンドをターミナルで実行してください
// deno run --allow-net --allow-write indexNbr_gen.js

//タブ区切りのtxtデータを{国際地点番号 : {緯度経度(10進数)}}のJsonデータに変換する
const 緯度経度10進 = (str)=>{
  const axis = str.charAt(str.length-1)
  let pm = 0;
  switch(axis){
    case "N":
    case "E":
      pm = 1;
      break;
    case "S":
    case "W":
      pm = -1;
      break;
  }
  const values = str.slice(0,-1).split(" ").map(s=>parseInt(s));
  return pm*(values[0]+(values[1]+values[2]/60)/60)
}
const txtData = await fetch("https://www.jma.go.jp/jma/kishou/books/station/station.txt")
const txtData2 = await txtData.text();
const lines = txtData2.split('\n');
const region2s = lines.filter(l=>l.charAt(0)=='2')
const region2s2 = region2s.map(d=>d.split('\t'))
const japans = region2s2.filter(d=>d[1]=="JAPAN ")
let data = {};
for(let ja of japans){
  data[ja[2]] = {latitude:緯度経度10進(ja[6]),longitude:緯度経度10進(ja[7])}
}
await Deno.writeTextFile("indexNbr.json", JSON.stringify(data));
