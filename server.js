import { serve } from "https://deno.land/std@0.151.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.151.0/http/file_server.ts";

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  if (req.method === "GET" && pathname === "/welcome-message") {
    return new Response("jigインターンへようこそ！");
  }

  if (req.method === "GET" && pathname === "/members") {
    return new Response("ウノ、ひより、ヤユヨ、やまじ");
  }
<<<<<<< HEAD
=======
  if (req.method === "GET" && pathname === "/today") {
    const date = new Date();
    // date.getMonth()で帰ってくる月の数字は0~11月なので+1して1~12月になるようにする
    return new Response(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
  }
>>>>>>> 3f1e7ad (コメントを追加)

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
