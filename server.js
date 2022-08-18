import { serve } from "https://deno.land/std@0.151.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.151.0/http/file_server.ts";
import { CSV } from "https://js.sabae.cc/CSV.js";
import * as postgres from "https://deno.land/x/postgres@v0.14.0/mod.ts";

const url = "https://www.data.jma.go.jp/obd/stats/data/mdrr/tem_rct/alltable/mxtemsadext00_202208160900.csv";
let lastTime_getWeather = new Date().getHours()//後々 yyyyMMddhh のString形式にする予定
const updateWeatherData=async()=>{
  lastTime_getWeather = new Date().getHours();
  const data = CSV.toJSON(await CSV.fetch(url)).filter(d=>d.国際地点番号)//ロード&国際地点番号を含むデータのみ抽出
  await Deno.writeTextFile("weatherData.json", JSON.stringify(data));
}
await updateWeatherData()


// Get the connection string from the environment variable "DATABASE_URL"
const databaseUrl = Deno.env.get("DATABASE_URL");

// Create a database pool with three connections that are lazily established
const pool = new postgres.Pool(databaseUrl, 3, true);

// Connect to the database
const connection = await pool.connect();
try {
  // Create the table
  await connection.queryObject`
    CREATE TABLE IF NOT EXISTS status (
      id SERIAL PRIMARY KEY,
      hp INTEGER NOT NULL,
      atk INTEGER NOT NULL
    )
  `;
} finally {
  // Release the connection back into the pool
  connection.release();
}


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

  if (pathname == "/player") {
    // Grab a connection from the database pool
    const connection = await pool.connect();
    console.log("fire")
    try {
      switch (req.method) {
        case "GET": { // This is a GET request. Return a list of all todos.
          // Run the query
          const params = new URLSearchParams(req.url.substring(req.url.indexOf("?")));
          const ID = params.get("id");
          console.log(`id: ${ID}`);

          const result = await connection.queryObject`
            SELECT * FROM status WHERE id=${ID}
          `;

          // Encode the result as JSON
          const body = JSON.stringify(result.rows, null, 2);

          // Return the result as JSON
          return new Response(body, {
            headers: { "content-type": "application/json" },
          });
        }
        case "POST": { // This is a POST request. Create a new todo.
          // Parse the request body as JSON. If the request body fails to parse,
          // is not a string, or is longer than 256 chars, return a 400 response.
          const params = new URLSearchParams(req.url.substring(req.url.indexOf("?")));
          const ID = params.get("id");
          const status = await req.json().catch(()=>null);
          console.log(`id: ${ID}\nstatus: ${status} (type: ${typeof status})`);
          if (typeof status !== "object") {
            console.log("Bad Reqest");
            return new Response("Bad Request", { status: 400 });
          }

          // Insert the new todo into the database
          await connection.queryObject`
            UPDATE status set hp=${status.hp}, atk=${status.atk} WHERE id=${ID}
          `;

          // Return a 201 Created response
          return new Response("", { status: 201 });
        }
        default: // If this is neither a POST, or a GET return a 405 response.
          return new Response("Method Not Allowed", { status: 405 });
      }
    }
    catch (err) {
      console.error(err);
      // If an error occurs, return a 500 response
      return new Response(`Internal Server Error\n\n${err.message}`, {
        status: 500,
      });
    } finally {
      // Release the connection back into the pool
      connection.release();
    }
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
