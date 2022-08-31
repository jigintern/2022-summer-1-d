// byャュョ ----------------------------------------
//get info at power_supply, hp_heel
const tbl_power=[
  { temp:44,  get:50, prompt:"げーむなんてやってるばあいじゃないぞ！" },
  { temp:39,  get:30, prompt:"室内へ避難しよう！" },
  { temp:34,  get:20, prompt:"休憩場所を探そう！" },
  { temp:29,  get:10, prompt:"熱中症に気を付けるべき！" },
  { temp:23,  get:5,  prompt:"気温は最適！体を動かそう！" },
  { temp:-273, get:1, prompt:"寒そう！体を温めよう！" }
]
const tbl_hp=[
  { temp:34,  get:0, prompt:"暑すぎない？" },
  { temp:29,  get:20, prompt:"ちょっと暑いかも？" },
  { temp:24,  get:50, prompt:"体にいい涼しさだ！" },
  { temp:19,  get:30, prompt:" ちょっと寒いかも？" },
  { temp:14,  get:10,  prompt:"寒くなぁい？暖を取り始めよう！" },
  { temp:-273, get:1, prompt:"寒すぎる！暖かくしろ！" }
]
const getTbl = function(){
  const temp = 27//getTemp
  const tbl = location.pathname=="/power_supply.html"?tbl_power:tbl_hp
  for(const i of tbl){
    if(i.temp<temp)
      return i
  }
}

//rondom enemySelector
const enemyList=[]
const sum_freq = enemyList.reduce((sum, element) => sum + element.frequency, 0);
let j = sum_freq;
for(let i=0;i<enemyList.length;i++){
  j -= enemyList[i].frequency
  if(j<0) break;
}