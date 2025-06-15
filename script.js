const bobot = {
  feel: 0.4,
  tinggi: 0.25,
  harga: 0.1,
  material: 0.25
};

const feelMap = {
  "soft": 1,
  "medium": 2,
  "medium firm": 3,
  "firm": 4
};

function mapHargaToKategori(harga) {
  if (harga < 50000000) return 1;        // Entry-level
  if (harga < 130000000) return 2;       // Mid-level
  return 3;                              // High-end
}

function mapInputHargaToKategori(value) {
  switch(value) {
    case "Entry-level": return 1;
    case "Mid-level": return 2;
    case "High-end": return 3;
    default: return 2;
  }
}

function mapTinggiToCm(value) {
  switch(value) {
    case "rendah": return 25;
    case "sedang": return 32;
    case "tinggi": return 42;
    default: return 35;
  }
}

function calculateScore(preferensi, produk) {
  const skorFeel = 1 - (Math.abs(feelMap[preferensi.feel] - feelMap[produk.feel]) / 3);
  const skorTinggi = 1 - Math.min(Math.abs(preferensi.tinggi - produk.tinggi) / 10, 1);
  const skorHarga = 1 - (Math.abs(preferensi.hargaKategori - mapHargaToKategori(produk.harga)) / 2);
  const skorMaterial = preferensi.material === produk.material ? 1 : 0;

  return (
    bobot.feel * skorFeel +
    bobot.tinggi * skorTinggi +
    bobot.harga * skorHarga +
    bobot.material * skorMaterial
  );
}

document.getElementById("preference-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const feel = document.getElementById("feel").value.toLowerCase();
  const tinggi = mapTinggiToCm(document.getElementById("height").value);
  const hargaKategori = mapInputHargaToKategori(document.getElementById("price").value);
  const hargaAsumsi = (hargaKategori === 1) ? 40000000 : (hargaKategori === 2 ? 100000000 : 150000000);
  const material = document.getElementById("material").value;

  if (!feel || !tinggi || !hargaKategori || !material) {
    alert("Mohon lengkapi semua kolom.");
    return;
  }

  const preferensi = {
    feel,
    tinggi,
    hargaKategori,
    harga: hargaAsumsi,
    material
  };

  fetch("products.json")
    .then((res) => res.json())
    .then((data) => {
      const hasil = data.map(produk => ({
        ...produk,
        skor: calculateScore(preferensi, produk)
      })).sort((a, b) => b.skor - a.skor);

      const list = document.getElementById("product-list");
      list.innerHTML = "";
      hasil.forEach(p => {
        const item = document.createElement("li");
        item.innerHTML = `
          <img src="${p.gambar}" alt="${p.kode}" width="100" />
          <h3>${p.kode}</h3>
          <p>Feel: ${p.feel}, Tinggi: ${p.tinggi} cm, Material: ${p.material}, Harga: Rp${p.harga.toLocaleString()}</p>
          <p>Skor: ${p.skor.toFixed(3)}</p>
          <a href="${p.link}" target="_blank">Lihat Detail</a>
        `;
        list.appendChild(item);
      });

      document.getElementById("results").classList.remove("hidden");
    });
});

document.getElementById("reset-btn").addEventListener("click", () => {
  document.getElementById("preference-form").reset();
  document.getElementById("results").classList.add("hidden");
  document.getElementById("product-list").innerHTML = "";
});
