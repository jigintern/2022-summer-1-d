export const accessToAPI={
  async temperture(latitude,longitude){
    return await fetch(`/temp?latitude=${latitude}&longitude=${longitude}`)
  },
  async playerData(){
      return (await(await fetch(location.href)).json())[0]
  },
  async save(hp,atk){
    await fetch(location.href, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hp,atk })
    });
  }
}