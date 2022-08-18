import { serve } from "https://deno.land/std@0.151.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.151.0/http/file_server.ts";
import { CSV } from "https://js.sabae.cc/CSV.js";
const url = "https://www.data.jma.go.jp/obd/stats/data/mdrr/tem_rct/alltable/mxtemsadext00_202208160900.csv";
let lastTime_getWeather = new Date().getHours()//後々 yyyyMMddhh のString形式にする予定
const updateWeatherData=async()=>{
  lastTime_getWeather = new Date().getHours();
  const data = CSV.toJSON(await CSV.fetch(url)).filter(d=>d.国際地点番号)//ロード&国際地点番号を含むデータのみ抽出
  await Deno.writeTextFile("weatherData.json", JSON.stringify(data));
}
await updateWeatherData()

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  if (req.method === "GET" && pathname === "/welcome-message") {
    return new Response("jigインターンへようこそ！");
  }

  if (req.method === "GET" && pathname === "/members") {
    return new Response("ウノ、ひより、ヤユヨ、やまじ");
  }
  if (req.method === "GET" && pathname === "/today") {
    const date = new Date();
    // date.getMonth()で帰ってくる月の数字は0~11月なので+1して1~12月になるようにする
    return new Response(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
  }
  
  if (req.method === "GET" && pathname === "/temp") {
    //テスト実行：http://localhost:8000/temp?latitude=32.5453&longitude=123.4567
    //入力(緯度経度)を整理
    const params = new URLSearchParams(req.url.substring(req.url.indexOf("?")))
    const latitude = params.get("latitude")
    const longitude = params.get("longitude")
    console.log(params)
    
    //気象庁のデータ
    if(lastTime_getWeather!=new Date().getHours()){// 1h経過したか監視
      await updateWeatherData()
    }
    const weatherData = JSON.parse(await Deno.readTextFile("weatherData.json"));
    
    //国際地点番号のデータ
    const indexNumber = JSON.parse(await Deno.readTextFile("indexNbr.json"));
    
    //wDの国際地点番号でiNの緯度経度を検索
    //及びそれぞれ距離を計算→最小とその気象情報を記録
    let minData = weatherData[0]
    let minDist = 999;
    for(let i of weatherData){
      const data = indexNumber[i.国際地点番号]
      const dist = ((latitude-data.latitude)**2+(longitude-data.longitude)**2)**0.5
      if(dist<minDist){
        minDist = dist;
        minData = i;
      }
    }
    console.log(minData)
    //記録された気象情報の温度を取得,返す
    return new Response(`${minData["今日の最高気温(℃)"]}`)
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
