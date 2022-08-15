import { serve } from "https://deno.land/std@0.151.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.151.0/http/file_server.ts";

//実行ページ：http://localhost:8000/today
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
    return new Response(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
