export async function fetchsupplier() {
  const response = await fetch("http://localhost:5000/api/v1/supplier");
  const data = await response.json();
  return data;
}