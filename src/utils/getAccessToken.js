// utils/fetchWithRefresh.ts
export async function fetchWithRefresh(input, init) {
  let res = await fetch(input, { ...init, credentials: "include" });

  if (res.status === 401) {
    const refreshRes = await fetch("/api/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      res = await fetch(input, { ...init, credentials: "include" });
      return res;
    } 
    // else {
    //   window.location.href = "/login"; 
    //   return null;
    // }
  }

  return res;
}
