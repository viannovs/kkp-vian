document.getElementById("formPreferensi").addEventListener("submit", function(e) {
  e.preventDefault();

  const feel = document.getElementById("feel").value;
  const tinggi = document.getElementById("tinggi").value;
  const harga = document.getElementById("harga").value;

  fetch("products.json")
    .then(res => res.json())
    .then(data => {
      let hasil = cariRekomendasi(data, feel, tinggi, harga);
      tampilkanHasil(hasil);
    });
});

function cariRekomendasi(data, feel, tinggi, harga) {
  // Skoring sederhana, bisa dikembangkan
  return data.map(produk => {
    let skor = 0;

    if (produk.feel === feel) skor += 3;
    if (produk.tinggi_kategori === tinggi) skor += 2;
    if (produk.harga_kategori === harga) skor += 1;

    return { ...produk, skor };
  }).sort((a, b) => b.skor - a.skor);
}

function tampilkanHasil(hasil) {
  const div = document.getElementById("hasil");
  div.style.display = "block";

  if (hasil.length === 0) {
    div.innerHTML = "<p>Tidak ada kasur yang cocok.</p>";
    return;
  }

  const utama = hasil[0];
  const alternatif = hasil[1];

  div.innerHTML = `
    <h2>Rekomendasi Utama:</h2>
    <p><strong>${utama.kode}</strong> - ${utama.feel}, ${utama.tinggi} cm, Rp ${utama.harga.toLocaleString()}</p>
    ${alternatif ? `
      <h3>Alternatif:</h3>
      <p><strong>${alternatif.kode}</strong> - ${alternatif.feel}, ${alternatif.tinggi} cm, Rp ${alternatif.harga.toLocaleString()}</p>
    ` : ''}
  `;
}