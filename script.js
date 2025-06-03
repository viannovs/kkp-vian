// Ambil elemen form dan container
const form = document.getElementById('preference-form');
const loadingSection = document.getElementById('loading');
const resultsSection = document.getElementById('results');
const primaryResults = document.getElementById('primary-results');
const alternativeResults = document.getElementById('alternative-results');
const resetBtn = document.getElementById('reset-btn');

let products = [];

// Load data produk
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    products = data;
  })
  .catch(err => {
    alert('Gagal load data produk');
    console.error(err);
  });

form.addEventListener('submit', e => {
  e.preventDefault();

  // Reset tampilan hasil & loading
  primaryResults.innerHTML = '';
  alternativeResults.innerHTML = '';
  resultsSection.classList.add('hidden');
  loadingSection.classList.remove('hidden');

  // Ambil input user
  const feel = form.feel.value;
  const height = form.height.value;
  const price = form.price.value;

  // Simulasi loading 1.5 detik (1500 ms)
  setTimeout(() => {
    loadingSection.classList.add('hidden');

    // Filter produk sesuai preferensi utama (semua cocok)
    const matchedProducts = products.filter(p =>
      p.feel === feel && p.tinggi_kategori === height && p.harga_kategori === price
    );

    // Filter alternatif = produk yang cocok 2 dari 3 filter
    const alternativeProducts = products.filter(p => {
      const conditions = [
        p.feel === feel,
        p.tinggi_kategori === height,
        p.harga_kategori === price,
      ];
      const matchedCount = conditions.filter(Boolean).length;
      return matchedCount === 2;
    });

    if (matchedProducts.length === 0 && alternativeProducts.length === 0) {
      primaryResults.innerHTML = '<li>Tidak ada produk yang sesuai.</li>';
      alternativeResults.innerHTML = '';
    } else {
      if (matchedProducts.length === 0) {
        primaryResults.innerHTML = '<li>Tidak ada rekomendasi utama.</li>';
      } else {
        primaryResults.innerHTML = matchedProducts
          .map(
            p =>
              `<li><strong>${p.kode}</strong> - Feel: ${p.feel}, Tinggi: ${p.tinggi} cm, Harga: Rp${p.harga.toLocaleString()}</li>`
          )
          .join('');
      }

      if (alternativeProducts.length === 0) {
        alternativeResults.innerHTML = '<li>Tidak ada alternatif lain.</li>';
      } else {
        alternativeResults.innerHTML = alternativeProducts
          .map(
            p =>
              `<li><strong>${p.kode}</strong> - Feel: ${p.feel}, Tinggi: ${p.tinggi} cm, Harga: Rp${p.harga.toLocaleString()}</li>`
          )
          .join('');
      }
    }

    resultsSection.classList.remove('hidden');
  }, 1500);
});

// Reset tombol
resetBtn.addEventListener('click', () => {
  form.reset();
  primaryResults.innerHTML = '';
  alternativeResults.innerHTML = '';
  resultsSection.classList.add('hidden');
  loadingSection.classList.add('hidden');
});
