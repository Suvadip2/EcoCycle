const API_URL = "http://localhost:8080/api";

export async function testBackend() {
  const response = await fetch(`${API_URL}/test`);

  if (!response.ok) {
    throw new Error("Backend request failed");
  }

  return response.json();
}

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

export async function registerAdmin(adminData) {
  const response = await fetch(`${API_URL}/auth/admin/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(adminData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Admin registration failed");
  }

  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function getAllUsers() {
  const response = await fetch(`${API_URL}/auth/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function deleteUser(id, adminEmail, adminPassword) {
  const response = await fetch(`${API_URL}/auth/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Failed to delete user.");
  }

  return true;
}

export async function submitEWaste(requestData) {
  const response = await fetch(`${API_URL}/ewaste`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "E-waste submission failed");
  }

  return data;
}

export async function getAllEWaste() {
  const response = await fetch(`${API_URL}/ewaste`);

  if (!response.ok) {
    throw new Error("Failed to fetch e-waste requests");
  }

  return response.json();
}

export async function getUserEWaste(email) {
  const response = await fetch(
    `${API_URL}/ewaste/user/${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user requests");
  }

  return response.json();
}

export async function getEWasteById(id) {
  const response = await fetch(`${API_URL}/ewaste/${id}`);

  if (!response.ok) {
    throw new Error("Request not found");
  }

  return response.json();
}

export async function updateEWasteStatus(id, status) {
  const response = await fetch(`${API_URL}/ewaste/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update status");
  }

  return data;
}

export async function deleteEWaste(id) {
  const response = await fetch(`${API_URL}/ewaste/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete request");
  }

  return true;
}