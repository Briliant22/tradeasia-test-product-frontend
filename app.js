const API_BASE = "http://127.0.0.1:8000/api"; // Update if needed
let currentLang = "en";
let productDataCache = []; // used for click handling

const translations = {
  en: {
    product_list_title: "Product List",
    lang_en: "English",
    lang_id: "Bahasa",
    cas_number: "CAS Number",
    hs_code: "HS Code",
    inquire_now: "Inquire Now",
    description: "Description",
    application: "Application",
    meta_title: "Meta Title",
    meta_keyword: "Meta Keywords",
    meta_description: "Meta Description",
    no_products: "No products found.",
    failed_to_load: "Failed to load products.",
    search_placeholder: "Search for a chemical product by name",
  },
  id: {
    product_list_title: "Daftar Produk",
    lang_en: "Inggris",
    lang_id: "Bahasa",
    cas_number: "Nomor CAS",
    hs_code: "Kode HS",
    inquire_now: "Ajukan Permintaan",
    description: "Deskripsi",
    application: "Aplikasi",
    meta_title: "Judul Meta",
    meta_keyword: "Kata Kunci Meta",
    meta_description: "Deskripsi Meta",
    no_products: "Produk tidak ditemukan.",
    failed_to_load: "Gagal memuat produk.",
    search_placeholder: "Cari produk kimia berdasarkan nama",
  },
};

function updateLanguageTexts() {
  const dict = translations[currentLang];

  // update placeholder
  $(".search-bar").attr("placeholder", dict.search_placeholder);

  // update elements with data-i18n
  $("[data-i18n]").each(function () {
    const key = $(this).data("i18n");
    if (key && dict[key]) {
      if ($(this).is("input, textarea")) {
        $(this).attr("placeholder", dict[key]);
      } else if ($(this).is("option")) {
        $(this).text(dict[key]);
      } else {
        $(this).html(dict[key]);
      }
    }
  });
}

function fetchProducts() {
  $.ajax({
    url: `${API_BASE}/products`,
    method: "GET",
    data: { lang: currentLang },
    success: function (response) {
      if (response.data) {
        productDataCache = response.data;
        renderProductList(productDataCache);
      } else {
        $("#product-list").html(
          `<div class="alert alert-warning">${translations[currentLang].no_products}</div>`
        );
      }
    },
    error: function () {
      $("#product-list").html(
        `<div class="alert alert-danger">${translations[currentLang].failed_to_load}</div>`
      );
    },
  });
}

function renderProductList(products) {
  const t = translations[currentLang];
  const container = $("#product-list");
  container.empty();

  products.forEach((product, index) => {
    const card = `
      <div class="col-12 col-md-6 col-lg-4 col-xl-3">
        <div class="card h-100 border-0 shadow-sm">
          <img src="${product.image_url}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;" />
          <div class="card-body text-center">
            <h5 class="fw-semibold">${product.name}</h5>
            <p class="mb-1"><span class="text-muted">${t.cas_number} :</span> <strong>${product.cas_number}</strong></p>
            <p class="mb-3"><span class="text-muted">${t.hs_code} :</span> <strong>${product.hs_code}</strong></p>
            <button class="btn btn-outline-primary rounded-pill px-4 show-details-btn" data-index="${index}">${t.inquire_now}</button>
          </div>
        </div>
      </div>
    `;
    container.append(card);
  });
}

function showDetails(product) {
  const t = translations[currentLang];
  const content = `
    <h5>${product.name}</h5>
    <p><strong>${t.description}:</strong> ${product.description}</p>
    <p><strong>${t.application}:</strong> ${product.application}</p>
    <p><strong>${t.meta_title}:</strong> ${product.meta.meta_title}</p>
    <p><strong>${t.meta_keyword}:</strong> ${product.meta.meta_keyword}</p>
    <p><strong>${t.meta_description}:</strong> ${product.meta.meta_description}</p>
  `;

  $("#modal-content").html(content);
  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}

$(document).on("click", ".show-details-btn", function () {
  const index = $(this).data("index");
  const product = productDataCache[index];
  showDetails(product);
});

$("#languageSelector").on("change", function () {
  currentLang = $(this).val();
  updateLanguageTexts();
  fetchProducts();
});

$(document).ready(() => {
  updateLanguageTexts();
  fetchProducts();

  let searchTimeout;
  $(".search-bar").on("input", function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const keyword = $(this).val().toLowerCase();
      const filtered = productDataCache.filter((product) =>
        product.name.toLowerCase().includes(keyword)
      );
      renderProductList(filtered);
    }, 200);
  });
});
