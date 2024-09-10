document.addEventListener("DOMContentLoaded", function () {
    let products = []; // Stores product data
    let currentCategory = null; // Stores the currently selected category

    // Fetch product data from the PHP backend
    fetch('get_product.php')
        .then(response => response.json())
        .then(data => {
            products = data; // Store the fetched data
            console.log(products); // Log the product data
            displaySearchResults(products);
            setupSearch(products);
            setupSort(products);
        })
        .catch(error => console.error('Error fetching product:', error));

    // Elements
    const searchInput = document.getElementById("search-input");
    const searchIcon = document.getElementById("search-icon");
    const sortButtons = document.querySelectorAll(".sort-button");
    const dropdownItems = document.querySelectorAll(".dropdown-item");
    const sortByContainer = document.querySelector(".sort-by");
    const categoriesContainer = document.getElementById("categories-container");
    const categoriesHeader = document.querySelector(".P_cat-container");
    const carouselContainer = document.getElementById("carousel-container");
    const orderForm = document.getElementById("order-form");
    const deliveryForm = document.getElementById("delivery-form");
    const cancelButton = document.getElementById("cancel-button");
    const productDetailsContainer = document.getElementById("search-results");
    const paymentConfirmation = document.getElementById("payment-confirmation");
    const completedTransaction = document.getElementById("completed-transaction");

    let filteredProducts = []; // Stores filtered product data
    let selectedProduct = null; // Stores the selected product

    productDetailsContainer.style.display = "none";

    // Event listeners for category filters
    const categoryElements = document.querySelectorAll(".category");
    categoryElements.forEach(categoryElement => {
        categoryElement.addEventListener("click", function () {
            const selectedCategory = categoryElement.getAttribute("data-category");
            currentCategory = selectedCategory; // Update the current category
            displayProductsByCategory(selectedCategory);
        });
    });

    function displayProductsByCategory(category) {
        const filtered = products.filter(product => product.categories === category);
        displaySearchResults(filtered);

        // Show/hide UI elements based on the selected category
        sortByContainer.style.display = "block";
        categoriesContainer.style.display = "none";
        categoriesHeader.style.display = "none";
        carouselContainer.style.display = "none";
    }

    function showSuggestions() {
        const inputValue = searchInput.value.trim().toLowerCase();
        const suggestions = document.getElementById("suggestions");

        productDetailsContainer.style.display = "block";

        if (inputValue === "") {
            suggestions.style.display = "none";
            return;
        }

        const filteredProducts = products.filter(product =>
            product.ProductName.toLowerCase().includes(inputValue)
        );

        filteredProducts.sort((a, b) => a.ProductName.toLowerCase().indexOf(inputValue) - b.ProductName.toLowerCase().indexOf(inputValue));

        suggestions.innerHTML = "";
        filteredProducts.forEach(product => {
            const suggestionItem = document.createElement("div");
            suggestionItem.classList.add("suggestion-item");
            suggestionItem.textContent = product.ProductName;
            suggestionItem.addEventListener("click", function () {
                searchInput.value = product.ProductName;
                handleSearch();
                hideSuggestions();
            });
            suggestions.appendChild(suggestionItem);
        });

        suggestions.style.display = "block";
    }

    function hideSuggestions() {
        const suggestions = document.getElementById("suggestions");
        suggestions.style.display = "none";
    }

    searchInput.addEventListener("input", showSuggestions);
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            handleSearch();
            hideSuggestions();
        }
    });
    searchIcon.addEventListener("click", function () {
        handleSearch();
        hideSuggestions();
    });

    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (query === "") {
            filteredProducts = products;
            displaySearchResults(filteredProducts);
            sortByContainer.style.display = "block";
            categoriesContainer.style.display = "block";
            categoriesHeader.style.display = "block";
            carouselContainer.style.display = "block";
        } else {
            filteredProducts = products.filter(product =>
                product.ProductName.toLowerCase().includes(query)
            );
            filteredProducts.sort((a, b) => a.ProductName.toLowerCase().indexOf(query) - b.ProductName.toLowerCase().indexOf(query));
            displaySearchResults(filteredProducts);
            sortByContainer.style.display = "block";
            categoriesContainer.style.display = "none";
            categoriesHeader.style.display = "none";
            carouselContainer.style.display = "none";
        }
    }

    function sortResults(sortCriteria) {
        let sortedProducts = [...filteredProducts];

        switch (sortCriteria) {
            case "relevance":
                sortedProducts.sort((a, b) => b.relevance - a.relevance);
                break;
            case "latest":
                sortedProducts.sort((a, b) => b.latest - a.latest);
                break;
            case "top-sales":
                sortedProducts.sort((a, b) => b.topSales - a.topSales);
                break;
            case "price-low-high":
                sortedProducts.sort((a, b) => a.ProductPrice - b.ProductPrice);
                break;
            case "price-high-low":
                sortedProducts.sort((a, b) => b.ProductPrice - a.ProductPrice);
                break;
        }

        displaySearchResults(sortedProducts);
    }

    sortButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            const sortCriteria = event.target.getAttribute("data-sort");
            sortResults(sortCriteria);
            setActiveSortButton(event.target);
        });
    });

    dropdownItems.forEach(item => {
        item.addEventListener("click", function (event) {
            const sortCriteria = event.target.getAttribute("data-sort");
            sortResults(sortCriteria);
            setActiveSortButton(event.target.closest(".dropdown"));
        });
    });

    function setActiveSortButton(button) {
        sortButtons.forEach(btn => btn.classList.remove("active"));
        dropdownItems.forEach(item => item.classList.remove("active"));
        button.classList.add("active");
    }

    function displaySearchResults(products) {
        const resultsContainer = document.getElementById("search-results");
        resultsContainer.innerHTML = "";

        if (products.length === 0) {
            const noResultsMessage = document.createElement("p");
            noResultsMessage.textContent = "ไม่มีสินค้าตรงกับที่คุณค้นหา";
            noResultsMessage.classList.add("no-results-message");
            resultsContainer.appendChild(noResultsMessage);
        } else {
            products.forEach(product => {
                const resultItem = document.createElement("div");
                resultItem.classList.add("result-item");

                resultItem.innerHTML =
                    `<img src="path_to_image/${product.ProductID}.jpg" alt="${product.ProductName}">
                    <h6>${product.ProductName}</h6>
                    <p>฿${product.ProductPrice}</p>`;
                resultItem.addEventListener("click", () => {
                    displayProductDetails(product);
                });
                resultsContainer.appendChild(resultItem);
            });
        }
    }

    function displayProductDetails(product) {
        sortByContainer.style.display = "none";

        console.log("Displaying product details:", product);
        selectedProduct = product; // Store the selected product

        const productDetailsContainer = document.getElementById("search-results");
        productDetailsContainer.innerHTML = "";

        const productDetails = document.createElement("div");
        productDetails.id = "product-details";
        productDetails.classList.add("product-details");

        let sizeOptions = "";
        if (product.ProductSize) {
            sizeOptions = product.ProductSize.split(',').map(size =>
                `<button class="size-option" data-size="${size}">${size}</button>`).join("");
        }

        productDetails.innerHTML =
            `<img src="path_to_image/${product.ProductID}.jpg" alt="${product.ProductName}">
            <h2>${product.ProductName}</h2>
            <p class="price">฿${product.ProductPrice}</p>
            ${sizeOptions ? 
                `<div class="size-container">
                    <label for="size">Size:</label>
                    <div id="size">${sizeOptions}</div>
                </div>`
             : ""}
            <label for="quantity">Quantity:</label>
            <div class="quantity-container">
                <button class="quantity-button" id="decrease-quantity">-</button>
                <input type="number" id="quantity" name="quantity" min="1" max="${product.ProductQuantity}" value="1">
                <button class="quantity-button" id="increase-quantity">+</button>
            </div>
            <div class="buttons-container">
                <button class="chat-now-button">Chat Now</button>
                <button class="add-to-cart-button">Add to Cart</button>
                <button class="buy-now-button" id="buy-now-button">Buy Now</button>
            </div>`;

        productDetailsContainer.appendChild(productDetails);

        // Event listeners for size options
        const sizeButtons = document.querySelectorAll(".size-option");
        sizeButtons.forEach(button => {
            button.addEventListener("click", function () {
                sizeButtons.forEach(btn => btn.classList.remove("selected"));
                button.classList.add("selected");
            });
        });

        // Event listeners for quantity buttons
        const quantityInput = document.getElementById("quantity");
        document.getElementById("increase-quantity").addEventListener("click", function () {
            if (quantityInput.value < product.ProductQuantity) {
                quantityInput.value = parseInt(quantityInput.value) + 1;
            }
        });
        document.getElementById("decrease-quantity").addEventListener("click", function () {
            if (quantityInput.value > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
            }
        });

        // Event listener for Buy Now button
        document.getElementById("buy-now-button").addEventListener("click", function () {
            if (selectedProduct) {
                displayOrderForm(selectedProduct);
            }
        });
    }

    function displayOrderForm(product) {
        console.log("Displaying order form for:", product);
        orderForm.style.display = "block";
        productDetailsContainer.style.display = "none";
        paymentConfirmation.style.display = "none";
        completedTransaction.style.display = "none";
    }

    cancelButton.addEventListener("click", function () {
        orderForm.style.display = "none";
        productDetailsContainer.style.display = "block";
    });

    function showPaymentConfirmationPage(totalPrice, paymentChannel, paymentID, productName) {
        orderForm.style.display = "none";
        sortByContainer.style.display = "none";
        
        paymentConfirmation.innerHTML = `
            <button id="close-payment-confirmation"><i class="bi bi-x-circle"></i></button>
            <h2>Payment</h2>
            <p>Total Amount: ฿${totalPrice} baht</p>
            <p>Pay to: ${paymentChannel}</p>
            <p>Payment ID: ${paymentID}</p>
            <p>Product: ${productName}</p>
            <button id="confirm-payment">Confirm Payment</button>
        `;
        paymentConfirmation.style.display = "block";
    
        document.getElementById("confirm-payment").addEventListener("click", showCompletedTransactionPage);
        document.getElementById("close-payment-confirmation").addEventListener("click", returnToProductDetails);
    }
    
    function returnToProductDetails() {
        paymentConfirmation.style.display = "none";
        productDetailsContainer.style.display = "block";
        sortByContainer.style.display = "none";
    }

    deliveryForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Prepare data to display payment confirmation page
        const totalPrice = calculateTotalPrice(); // Function to calculate total price
        const paymentChannel = document.querySelector('input[name="payment-channel"]:checked').value;
        const paymentID = generatePaymentID(); // Function to generate payment ID
        const productName = selectedProduct ? selectedProduct.ProductName : "Unknown Product";

        // Show payment confirmation page
        showPaymentConfirmationPage(totalPrice, paymentChannel, paymentID, productName);
    });

    function calculateTotalPrice() {
        // Get the quantity selected by the user
        const quantity = parseInt(document.getElementById("quantity").value);
      
        // Check if a product is selected and the quantity is valid
        if (selectedProduct && !isNaN(quantity)) {
          // Multiply the product price by the quantity to get the total price
          return selectedProduct.ProductPrice * quantity;
        } else {
          // Return 0 if no product is selected or quantity is invalid
          return 0;
        }
    }

    function generatePaymentID() {
        // Add logic to generate payment ID
        return "123456789"; // Example value
    }

    function showCompletedTransactionPage() {
        document.getElementById("completed-transaction").style.display = "block";
        document.getElementById("payment-confirmation").style.display = "none";
        document.getElementById("close-completed-transaction").addEventListener("click", returnToindex);
        function returnToindex() {
            // Implement logic to go back to the main page
            window.location.href = 'index.php'; // Replace 'index.html' with your main page URL
        }
    }
    function displayCompletedTransaction() {
        paymentConfirmation.style.display = "none";
        completedTransaction.style.display = "block";
        sortByContainer.style.display = "none";
    }
});
