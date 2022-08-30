# 2022-summer-1-d

main ブランチに PUSH されたら自動で Deno Deploy にデプロイされます。

https://jigintern-2022-summer-1-d.deno.dev/

### メンバー

- ウノ
- ャュョ(河田颯天)
- ひより
- やまじ(メンター)

## Rules

- do: filename be named with ***snake_case***.
- do: filename must be not include 2 byte charactors like Japanese.
- do: JavaScript Functions and Variables be named with ***loweCamelCase***.
- do: CSS Class selector be named with ***kebab-case***.

## H2Use dotenv

1. copy `.env.example` to `.env` and fix that.
2. run `deno run --allow-net --allow-read --allow-env server.js`

## H2Use commit temnplate

1. run `git config commit.template .commit_template`
2. `git commit` to commit with template
