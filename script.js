// Cart array to hold products added to the cart
let cart = [];

// Function to add product to cart
function addToCart() {
    const productSelect = document.getElementById('product');
    const quantityInput = document.getElementById('quantity');
    
    const productName = productSelect.value;
    const productPrice = parseFloat(productSelect.selectedOptions[0].getAttribute('data-price'));
    const quantity = parseInt(quantityInput.value);
    
    if (quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }
    
    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        // Update quantity and total if the product already exists in the cart
        existingProduct.quantity += quantity;
        existingProduct.total = existingProduct.quantity * existingProduct.price;
    } else {
        // Add new product to the cart
        cart.push({
            name: productName,
            price: productPrice,
            quantity: quantity,
            total: productPrice * quantity
        });
    }
    
    // Update the cart table
    updateCart();
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Function to update the cart table and total amount
function updateCart() {
    const cartTable = document.getElementById('cart').getElementsByTagName('tbody')[0];
    const totalAmount = document.getElementById('totalAmount');
    
    // Clear the table
    cartTable.innerHTML = '';
    
    let total = 0;
    
    // Loop through the cart and add rows to the table
    cart.forEach((item, index) => {
        const row = cartTable.insertRow();
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${item.total}</td>
            <td><button onclick="removeFromCart(${index})">Remove</button></td>
        `;
        total += item.total;
    });
    
    // Update the total amount
    totalAmount.innerText = total;
}

// Function to complete the sale and save it to localStorage
function completeSale() {
    if (cart.length === 0) {
        alert("No products in the cart.");
        return;
    }
    
    // Save the sale to localStorage
    saveSaleToLocalStorage(cart);

    // Display alert with total
    alert("Sale completed! Total: " + document.getElementById('totalAmount').innerText);
    
    // Clear the cart after sale
    cart = []; 
    updateCart(); // Update the cart table
}

// Function to save the sale to localStorage
function saveSaleToLocalStorage(cartItems) {
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    const saleDate = new Date().toLocaleDateString();
    
    sales.push({
        date: saleDate,
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + item.total, 0)
    });
    
    // Save the updated sales to localStorage
    localStorage.setItem('sales', JSON.stringify(sales));
}

// Function to retrieve and display sales from localStorage (for end of day review)
function viewSales() {
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    
    if (sales.length === 0) {
        alert("No sales data available.");
        return;
    }
    
    let salesReport = "Sales Report (End of Day):\n\n";
    
    // Loop through all sales and display each sale's items and total amount
    sales.forEach(sale => {
        salesReport += `Date: ${sale.date}\n`;
        sale.items.forEach(item => {
            salesReport += `Product: ${item.name}, Quantity: ${item.quantity}, Total: ${item.total}\n`;
        });
        salesReport += `Total Sale Amount: ${sale.total}\n\n`;
    });
    
    alert(salesReport);
}

// Function to clear all sales from localStorage
function clearAllSales() {
    if (confirm("Are you sure you want to delete all sales data? This cannot be undone.")) {
        localStorage.removeItem('sales');
        alert("All sales data has been deleted.");
    }
}
