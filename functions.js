export const easilyAccessToAPI={
  async temperture(){
    const getLocation = async() => {
      let lat,lon;
      const getCurrentPosition = () => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
      };
      try {
        const position = await getCurrentPosition(); // 位置情報の取得を試行
        console.log(position.coords);
        lat  = position.coords.latitude;              // 緯度を取得
        lon  = position.coords.longitude;             // 経度を取得
        accu = position.coords.accuracy;              // その精度を取得
      } catch(e) {
        console.log(e);
        lat = 40;                                     // ダミーデータ
        lon = 140;
      } finally {
        /*const testTxt = document.querySelector("#location");
        testTxt.innerHTML = `経度：${lat}<br>緯度：${lon}<br>`;*/
        return {lat,lon};
      }
    }
    const currentLocation=await getLocation()
    return parseFloat(await(await fetch(`/temp?latitude=${currentLocation.lat}&longitude=${currentLocation.lon}`)).text())
  },
  async playerData(){
      return (await(await fetch("/player"+location.search)).json())[0]
  },
  async save(hp,atk){
    await fetch("/player"+location.search, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hp,atk })
    });
  }
}
