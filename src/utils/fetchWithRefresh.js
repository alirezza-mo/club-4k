export default async function fetchWithRefresh(url, opts = {}) {
  // initial request
  const res = await fetch(url, { ...opts });
  if (res.status !== 401) return res;

  // on 401, try refresh
  try {
    const refreshRes = await fetch("/api/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });
    if (!refreshRes.ok) return res;
    // retry original request once
    const retry = await fetch(url, { ...opts });
    return retry;
  } catch (err) {
    return res;
  }
}
