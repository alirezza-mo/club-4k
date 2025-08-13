export async function fetchWithRefresh(input) {
  let res = await fetch(input, { credentials: "include" });
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


export async function getCurrentUserId() {
  try {
    const res = await fetchWithRefresh("/api/auth/me", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await res.json();
    if (!data.userId && !data._id) {
      throw new Error("User ID not found in response");
    }

    return data.userId || data._id;
  } catch (err) {
    throw new Error("Failed to get current user ID: " + err.message);
  }
}
