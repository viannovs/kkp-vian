// Load data produk dari products.json secara asynchronous
async function loadProducts() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error('Gagal load products.json');
    const products = await response.json();
    return products;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fungsi format harga ke string dengan ribuan dan Rp
function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatMaterial(material) {
  if (material === "spring-latex") return "Spring Latex";
  if (material === "full-latex") return "Full Latex";
  return material;
}

function filterProducts(products, preferences) {
  return products.filter((product) => {
    if (product.feel !== preferences.feel) return false;

    if (preferences.height === "tinggi" && product.tinggi < 39) return false;
    if (preferences.height === "sedang" && (product.tinggi < 26 || product.tinggi > 38)) return false;
    if (preferences.height === "rendah" && product.tinggi > 25) return false;

    let priceCategory = "";
    if (product.harga >= 130000000) priceCategory = "High-end";
    else if (product.harga >= 50000000) priceCategory = "Mid-level";
    else priceCategory = "Entry-level";

    if (priceCategory !== preferences.price) return false;

    if (product.material !== preferences.material) return false;

    return true;
  });
}

function createProductListItem(product) {
  const li = document.createElement("li");
  li.tabIndex = 0;
  li.setAttribute("role", "listitem");

  const img = document.createElement("img");
  img.src = product.gambar;
  img.alt = `Gambar kasur Kingkoil tipe ${product.kode}`;

  const info = document.createElement("div");
  info.classList.add("info");

  const kode = document.createElement("div");
  kode.classList.add("kode");
  kode.textContent = product.kode;

  const detail = document.createElement("div");
  detail.classList.add("detail");
  detail.textContent =
    `Feel: ${product.feel}, Tinggi: ${product.tinggi} cm, Harga: Rp ${formatPrice(product.harga)}, Material: ${formatMaterial(product.material)}`;

  info.appendChild(kode);
  info.appendChild(detail);

  li.appendChild(img);
  li.appendChild(info);

  // Optional: klik list item buka link produk di tab baru
  li.addEventListener("click", () => {
    window.open(product.link, "_blank", "noopener");
  });

  return li;
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const feel = document.querySelector('select[name="feel"]').value;
  const height = document.querySelector('select[name="height"]').value;
  const price = document.querySelector('select[name="price"]').value;
  const material = document.querySelector('select[name="material"]').value;

  const preferences = { feel, height, price, material };

  const products = await loadProducts();

  // Tampilkan loading
  const loading = document.getElementById("loading");
  const resultsSection = document.getElementById("results");
  const primaryResults = document.getElementById("primary-results");
  const alternativeResults = document.getElementById("alternative-results");

  loading.classList.remove("hidden");
  resultsSection.classList.add("hidden");
  primaryResults.innerHTML = "";
  alternativeResults.innerHTML = "";

  // Filter hasil utama
  const matched = filterProducts(products, preferences);

  if (matched.length > 0) {
    matched.forEach((product) => {
      const li = createProductListItem(product);
      primaryResults.appendChild(li);
    });
    alternativeResults.parentElement.classList.add("hidden");
  } else {
    // Jika tidak ada hasil, cari alternatif yang mirip (beda harga atau feel)
    const alt = products.filter((product) => {
      // boleh beda feel atau harga, tapi harus sesuai tinggi dan material
      return (
        product.tinggi >= (preferences.height === "tinggi" ? 39 : preferences.height === "sedang" ? 26 : 0) &&
        product.tinggi <= (preferences.height === "rendah" ? 25 : 43) &&
        product.material === preferences.material
      );
    });
    if (alt.length > 0) {
      alt.forEach((product) => {
        const li = createProductListItem(product);
        alternativeResults.appendChild(li);
      });
      alternativeResults.parentElement.classList.remove("hidden");
    } else {
      alternativeResults.parentElement.classList.add("hidden");
      primaryResults.innerHTML = "<li>Tidak ada produk yang cocok.</li>";
    }
  }

  loading.classList.add("hidden");
  resultsSection.classList.remove("hidden");

  // Scroll ke hasil
  resultsSection.scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", handleFormSubmit);
});
