async function loadProducts() {
  const response = await fetch("products.json");
  return await response.json();
}

function formatPrice(price) {
  return "Rp " + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function normalize(value, min, max) {
  return (value - min) / (max - min);
}

function getHeightCategory(height) {
  if (height < 26) return "rendah";
  if (height <= 38) return "sedang";
  return "tinggi";
}

function getPriceCategory(price) {
  if (price >= 130000000) return "High-end";
  if (price >= 50000000) return "Mid-level";
  return "Entry-level";
}

function calculateScore(product, pref) {
  let score = 0;

  if (product.feel === pref.feel) score += 1;
  if (getHeightCategory(product.tinggi) === pref.height) score += 1;
  if (getPriceCategory(product.harga) === pref.price) score += 1;
  if (product.material === pref.material) score += 1;

  return score;
}

function displayResults(products) {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${p.kode}</strong><br>
      Feel: ${p.feel} | Tinggi: ${p.tinggi} cm | Harga: ${formatPrice(p.harga)} | Material: ${p.material}<br>
      <em>Skor: ${p.score}</em>`;
    list.appendChild(li);
  });
}

document.getElementById("preference-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const preferences = {
    feel: document.getElementById("feel").value,
    height: document.getElementById("height").value,
    price: document.getElementById("price").value,
    material: document.getElementById("material").value
  };

  const products = await loadProducts();
  const scored = products.map(p => {
    return { ...p, score: calculateScore(p, preferences) };
  });

  const sorted = scored.sort((a, b) => b.score - a.score);
  document.getElementById("results").classList.remove("hidden");
  displayResults(sorted);
});

document.getElementById("reset-btn").addEventListener("click", () => {
  document.getElementById("preference-form").reset();
  document.getElementById("results").classList.add("hidden");
});
