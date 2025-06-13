// src/api/ai.js

export async function askAI(content, question) {
  const res = await fetch("http://localhost:8000/api/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ content, question })
  });

  const data = await res.json();
  return data.answer;
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:8000/api/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  return data.content;
}
