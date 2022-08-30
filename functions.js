export const easilyAccessToAPI={
  async temperture(){
    let latitude,longitude;
    navigator.geolocation.getCurrentPosition((position)=>{
      const data = position.coords;
			// データの整理
			latitude = data.latitude;
			longitude = data.longitude;
    })
    return parseFloat(await fetch(`/temp?latitude=${latitude}&longitude=${longitude}`))
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
