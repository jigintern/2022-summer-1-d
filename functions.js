export const accessToAPI={
  async temperture(latitude,longitude){
    return await fetch(`/temp?latitude=${latitude}&longitude=${longitude}`)
  },
  player:{
    async get(location_href){
      return (await(await fetch(location_href)).json())[0]
    },
    async post(location_href,hp,atk){
      await fetch(location_href, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hp,atk })
      });
    }
  }
}