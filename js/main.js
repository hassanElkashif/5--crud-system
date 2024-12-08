var pNameInput = document.querySelector("#Pname");
var pPriceInput = document.querySelector("#pPrice");
var pCatInput = document.querySelector("#pCat");
var pImgInput = document.querySelector("#pImg");
var pDescInput = document.querySelector("#pDesc");
var addBtnInput = document.querySelector("#add-btn");
var searchInput = document.querySelector("#pSearch");
var allProducts = [];
var id = 1;
var editingProgressProductId = null;

(function () {
  if (JSON.parse(localStorage.getItem("allProducts"))) {
    allProducts = JSON.parse(localStorage.getItem("allProducts"));
    showProducts(allProducts);
  } 
})();

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addProduct();
  }
});

function addProduct() {
  regex();

  if (editingProgressProductId !== null) {
    var updatedProduct = {
      id: editingProgressProductId,
      name: pNameInput.value,
      price: "$" + pPriceInput.value,
      category: pCatInput.value,
      image: `../imgs/${ pImgInput.files[0].name }`,
      descreption: pDescInput.value,
    };

    var productIndex = allProducts.findIndex(
      (product) => product.id === editingProgressProductId
    );
    if (productIndex !== -1) {
      allProducts[productIndex] = updatedProduct;
    }

    editingProgressProductId = null;
    addBtnInput.textContent = "Add Product";
  } else {
    var newProduct = {
      id: id,
      name: pNameInput.value,
      price: "$" + pPriceInput.value,
      category: pCatInput.value,
      image: `../imgs/${ pImgInput.files[0].name }`,
      descreption: pDescInput.value,
    };

    allProducts.push(newProduct);
    id++;
  }

  localStorage.setItem("allProducts", JSON.stringify(allProducts));
  showProducts(allProducts);
  resetForm();
}

function resetForm() {
  pNameInput.value = null;
  pPriceInput.value = null;
  pCatInput.value = "";
  pDescInput.value = null;
  pImgInput.value = null;
}

function showProducts(array) {
  var container = "";

  for (var i = 0; i < array.length; i++) {
    container += ` <div class="col-lg-3">
          <div class="card">
            <div class="card-img">
              <img src="${array[i].image}">
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <span>${array[i].category}</span>
                <h5 class="card-price align-self-center">${array[i].price}</h5>
              </div>
              <h5 class="card-title mt-3">${array[i].title ? array[i].title : array[i].name}</h5>
              <p class="card-text mt-2">${array[i].descreption}</p>
            </div>
            <div class="card-body d-flex justify-content-between">
              <button class="btn btn-danger" id="delBtn" onclick="deleteProduct(${
                array[i].id
              });"><i class="fa-solid fa-trash"></i></button>
              <button class="btn btn-warning" id="editBtn" onclick="editProduct(${
                array[i].id
              });"><i class="fa-solid fa-pen"></i></button>
            </div>
          </div>
        </div> `;
  }

  document.querySelector("#productsRow").innerHTML = container;
}

function deleteProduct(productId) {
  allProducts = allProducts.filter((product) => product.id !== productId);
  localStorage.setItem("allProducts", JSON.stringify(allProducts));
  showProducts(allProducts);
}

function editProduct(productId) {
  var productToEdit = allProducts.find((product) => product.id === productId);

  if (productToEdit) {
    pNameInput.value = productToEdit.name;
    pPriceInput.value = productToEdit.price.replace("$", "");
    pCatInput.value = productToEdit.category;
    pDescInput.value = productToEdit.descreption;
  }

  editingProgressProductId = productId;
  addBtnInput.innerHTML = "Update Product";
}

function searchProducts(key) {

  var searchResults = [];

  for (var i = 0; i < allProducts.length; i++) {
    if (allProducts[i].name.toUpperCase().includes(searchInput.value.toUpperCase())) {
      allProducts[i].title = allProducts[i].name
        .toLowerCase()
        .replaceAll(key , `<span class="text-danger">${key}</span>`);
      searchResults.push(allProducts[i]);
    }
  } 
  if (searchResults.length === 0) {
    console.log("no products");
    document.querySelector(".noProducts").classList.replace("d-none","d-block");
  } else {
    document.querySelector(".noProducts").classList.replace("d-block","d-none");
  }
  showProducts(searchResults);
}

var priceRegex = /^(6000|[6-9]\d{3}|[1-5]\d{4}|60000)$/;

function regex() {
  if (pDescInput.value.length > 250 || pDescInput.value == "" ) {
    document.querySelector(".desc-alert").classList.replace("d-none","d-block");
    return;
  } else {
    document.querySelector(".desc-alert").classList.replace("d-block","d-none");
  }
  if (pImgInput.value == "") {
    document.querySelector(".image-alert").classList.replace("d-none","d-block");
  } else  {
    document.querySelector(".image-alert").classList.replace("d-block","d-none");
  }
  if (pNameInput.value == "") {
    document.querySelector(".name-alert").classList.replace("d-none","d-block");
  } else  {
    document.querySelector(".name-alert").classList.replace("d-block","d-none");
  }
  if (!priceRegex.test(pPriceInput.value)) {
    document.querySelector(".price-alert").classList.replace("d-none","d-block");
    return;
  } else  {
    document.querySelector(".price-alert").classList.replace("d-block","d-none");
  }
  
}
