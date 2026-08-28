document.addEventListener('DOMContentLoaded', () => {
  initializeProductCards();
  attachScrollButtons();
  updateCartUI();

  document.body.addEventListener('click', (event) => {
    const addButton = event.target.closest('.add-cart-btn');
    const cancelButton = event.target.closest('.cancel-item-btn');

    if (addButton) {
      const card = addButton.closest('.first, .First, .Second, .third');
      const name = card?.dataset.name || 'Perfume';
      const price = Number(card?.dataset.price || 0);

      addToCart(name, price);
      return;
    }

    if (cancelButton) {
      const name = cancelButton.dataset.name;
      removeFromCart(name);
    }
  });
});

function initializeProductCards() {
  document.querySelectorAll('.first, .First, .Second, .third').forEach((card) => {
    const name = card.querySelector('p strong')?.textContent.trim() || 'Perfume';
    const priceText = card.querySelector('.price')?.textContent.replace(/[^0-9]/g, '') || '0';
    const price = Number(priceText);

    card.dataset.name = name;
    card.dataset.price = String(price);

    if (!card.querySelector('.add-cart-btn')) {
      const addButton = document.createElement('button');
      addButton.type = 'button';
      addButton.className = 'add-cart-btn';
      addButton.textContent = 'Add to cart';
      card.appendChild(addButton);
    }
  });
}

function attachScrollButtons() {
  const buttons = document.querySelectorAll('.scroll-btn');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;
      const carousel = document.getElementById(targetId);

      if (!carousel) return;

      const firstCard = carousel.querySelector('.first, .First, .Second, .third');
      const scrollAmount = firstCard ? firstCard.getBoundingClientRect().width + 18 : 260;

      carousel.scrollBy({
        left: button.classList.contains('next') ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    });
  });
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('awascentsCart')) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('awascentsCart', JSON.stringify(cart));
}

function addToCart(name, price) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  saveCart(cart);
  updateCartUI();
}

function removeFromCart(name) {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.name !== name);
  saveCart(updatedCart);
  updateCartUI();
}

function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

function updateCartUI() {
  const cart = getCart();
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const proceedButton = document.getElementById('proceed-btn');

  if (!cartItems || !cartTotal || !proceedButton) return;

  if (!cart.length) {
    cartItems.innerHTML = '<li class="empty-cart">Your cart is empty.</li>';
    cartTotal.textContent = '0';
    proceedButton.classList.add('disabled');
    proceedButton.removeAttribute('href');
    return;
  }

  let total = 0;

  cartItems.innerHTML = cart.map((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    return `
      <li class="cart-item-row">
        <div class="cart-item-info">
          <span>${item.name} x${item.quantity}</span>
          <span>₦${itemTotal.toLocaleString()}</span>
        </div>
        <button type="button" class="cancel-item-btn" data-name="${item.name}">Cancel</button>
      </li>
    `;
  }).join('');

  cartTotal.textContent = total.toLocaleString();
  proceedButton.classList.remove('disabled');
  proceedButton.setAttribute('href', 'order.html');
}
