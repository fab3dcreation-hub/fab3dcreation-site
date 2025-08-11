document.getElementById("btn-devis").addEventListener("click", function() {
    const productName = this.getAttribute("data-product");
    document.getElementById("product-name").value = productName;
    document.getElementById("devis-form").style.display = "block";
});
