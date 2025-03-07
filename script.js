document.addEventListener("DOMContentLoaded", function () {
  const productsContainer = document.getElementById("productsContainer");
  const selectElement = document.getElementById("productsQuantity");
  const ingredientsSection = document.getElementById("ingredients");

  async function fetchProducts(pageSize) {
    try {
      const response = await fetch(
        `https://brandstestowy.smallhost.pl/api/random?pageNumber=1&pageSize=${pageSize}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      renderProducts(data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  function openModal(product) {
    const modal = document.createElement("dialog");
    modal.setAttribute("popover", "auto");
    const state = document.querySelector("#modal-state");

    const productImage = document.createElement("img");
    productImage.src = product.image;
    productImage.style.maxWidth = "100%";

    const closeButton = document.createElement("button");
    closeButton.textContent = "✖";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.cursor = "pointer";

    closeButton.onclick = () => modal.remove();
    modal.addEventListener("toggle", () => {
      const isOpen = modal.matches(":popover-open");
      if (!isOpen) {
        modal.remove();
      }
    });

    modal.appendChild(closeButton);
    modal.appendChild(productImage);
    document.body.appendChild(modal);

    modal.showPopover();
  }

  function renderProducts(products) {
    productsContainer.innerHTML = "";
    products.forEach((product) => {
      const productWrapper = document.createElement("button");
      const productText = document.createElement("p");
      const correctProductText = product.text.replace("test ", "");
      productText.textContent = `ID: ${correctProductText}`;
      productWrapper.appendChild(productText);
      productWrapper.classList.add("product");
      productWrapper.onclick = () => openModal(product);
      productsContainer.appendChild(productWrapper);
    });
  }

  function handleScroll() {
    const rect = ingredientsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      fetchProducts(selectElement.value);
    }
  }

  selectElement.addEventListener("change", function () {
    productsContainer.innerHTML = "";
    handleScroll();
  });

  window.addEventListener("scroll", handleScroll);

  handleScroll();
});
