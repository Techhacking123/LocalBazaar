let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        document.addEventListener('DOMContentLoaded', () => {
            renderCartItems();
            updateTotal();
        });

        // Function to add item to cart
        function addItem(item, price) {
            const existingItem = cartItems.find(cartItem => cartItem.item === item);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push({
                    item, price, quantity: 1
                });
            }

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            renderCartItems();
            updateTotal();

            // Show notification
            showNotification(`${item} ₹${price} has been added to the cart.`);
        }

        function renderCartItems() {
            const cart = document.getElementById("cart-items");
            cart.innerHTML = '';
            cartItems.forEach(cartItem => {
                addItemToCartElement(cartItem);
            });
        }

        function addItemToCartElement(cartItem) {
            const cart = document.getElementById("cart-items");
            const listItem = document.createElement("li");
            listItem.textContent = `${cartItem.item} - ₹${cartItem.price} x ${cartItem.quantity}`;
            cart.appendChild(listItem);

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.onclick = function() {
                removeItem(cartItem.item);
            };
            listItem.appendChild(removeButton);
        }

        // Function to remove item from cart
        function removeItem(item) {
            const cartItem = cartItems.find(cartItem => cartItem.item === item);
            if (cartItem) {
                cartItem.quantity--;
                if (cartItem.quantity === 0) {
                    cartItems = cartItems.filter(cartItem => cartItem.item !== item);
                }
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                renderCartItems();
                updateTotal();
            }
        }

        // Function to update total
        function updateTotal() {
            const totalElement = document.getElementById("total");
            const total = cartItems.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0);
            totalElement.textContent = total.toFixed(2);
        }

        // Function to show cart
        function showCart() {
            document.getElementById("cart").style.display = "block";
        }

        // Function to hide cart
        function hideCart() {
            document.getElementById("cart").style.display = "none";
        }

        // Function to show order form
        function showOrderForm() {
            const orderItems = document.getElementById("order-items");
            orderItems.innerHTML = '';
            cartItems.forEach(cartItem => {
                const listItem = document.createElement("li");
                listItem.textContent = `${cartItem.item} - ₹${cartItem.price} x ${cartItem.quantity}`;
                orderItems.appendChild(listItem);
            });
            document.getElementById("order-details").value = JSON.stringify(cartItems);
            const total = cartItems.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0);
            document.getElementById("order-total").textContent = total.toFixed(2);
            document.getElementById("order-form").style.display = "block";
        }

        // Function to hide order form
        function hideOrderForm() {
            document.getElementById("order-form").style.display = "none";
        }

        // Handle form submission
        document.getElementById('order-form-element').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(this);

            fetch('https://formspree.io/f/xzbnqjpd', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            }).then(response => {
                if (response.ok) {
                    document.getElementById('success-message').style.display = 'block';
                    displayOrderedItems();
                    setTimeout(() => {
                        document.getElementById('success-message').style.display = 'none';
                        hideOrderForm();
                        clearCart();
                    }, 3000);
                } else {
                    alert('Failed to submit order. Please try again.');
                }
            }).catch(error => {
                console.error('Error submitting the form:', error);
                alert('Failed to submit order. Please try again.');
            });
        });

        // Function to display ordered items and total
        function displayOrderedItems() {
            const orderedItemsElement = document.getElementById('ordered-items');
            const orderTotalElement = document.getElementById('final-order-total');
            orderedItemsElement.innerHTML = '';
            const total = cartItems.reduce((sum,
                cartItem) => sum + cartItem.price * cartItem.quantity, 0);

            cartItems.forEach(cartItem => {
                const itemElement = document.createElement('div');
                itemElement.textContent = `${cartItem.item} - ₹${cartItem.price} x ${cartItem.quantity}`;
                orderedItemsElement.appendChild(itemElement);
            });

            orderTotalElement.textContent = total.toFixed(2);
        }

        // Function to clear the cart
        function clearCart() {
            cartItems = [];
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            renderCartItems();
            updateTotal();
            hideCart();
        }

        // Search functionality
        document.getElementById('search').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const items = document.querySelectorAll('#item-list .item');

            items.forEach(item => {
                const itemName = item.querySelector('p').textContent.toLowerCase();
                if (itemName.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        // Function to show the notification
        function showNotification(message) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.style.display = 'block';

            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }