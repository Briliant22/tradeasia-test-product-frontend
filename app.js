const API_BASE = "http://127.0.0.1:8000/api"; // Update if needed
let currentLang = "en";
let productDataCache = []; // used for click handling

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
        $("#product-list").html(`<div class="alert alert-warning">No products found.</div>`);
      }
    },
    error: function () {
      $("#product-list").html(
        `<div class="alert alert-danger">Failed to load products.</div>`
      );
    },
  });
}

function renderProductList(products) {
  const container = $("#product-list");
  container.empty();

  products.slice(0, 5).forEach((product, index) => {
    const card = `
      <div class="col-md-3">
        <div class="card h-100 border-0 shadow-sm">
          <img src="${product.image_url}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;" />
          <div class="card-body text-center">
            <h5 class="fw-semibold">${product.name}</h5>
            <p class="mb-1"><span class="text-muted">CAS Number :</span> <strong>${product.cas_number}</strong></p>
            <p class="mb-3"><span class="text-muted">HS Code :</span> <strong>${product.hs_code}</strong></p>
            <button class="btn btn-outline-primary rounded-pill px-4 show-details-btn" data-index="${index}">Inquire Now</button>
          </div>
        </div>
      </div>
    `;
    container.append(card);
  });
}

function showDetails(product) {
  const content = `
    <h5>${product.name}</h5>
    <p><strong>Description:</strong> ${product.description}</p>
    <p><strong>Application:</strong> ${product.application}</p>
    <p><strong>Meta Title:</strong> ${product.meta.meta_title}</p>
    <p><strong>Meta Keywords:</strong> ${product.meta.meta_keyword}</p>
    <p><strong>Meta Description:</strong> ${product.meta.meta_description}</p>
  `;

  $("#modal-content").html(content);
  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}

// Bind click events using event delegation
$(document).on("click", ".show-details-btn", function () {
  const index = $(this).data("index");
  const product = productDataCache[index];
  showDetails(product);
});

$("#languageSelector").on("change", function () {
  currentLang = $(this).val();
  fetchProducts();
});

$(document).ready(() => {
  fetchProducts();
});
