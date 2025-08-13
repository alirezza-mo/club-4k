
export async function fetchWithRefresh(input) {

  let res = await fetch(input, {credentials: "include" });
  console.log(res);
    

  if (res.status === 401) {
    const refreshRes = await fetch("/api/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });
    
    if (refreshRes.ok) {
      res = await fetch(input, { credentials: "include" });
      return res;
    } 
  }

  

  return res;
}