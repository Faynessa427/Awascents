document.addEventListener('DOMContentLoaded', () => {
  initializeProductCards();
  initializeCategorySearch();
  attachScrollButtons();
  addSelectedProductToCart();
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

function initializeCategorySearch() {
  const searchInput = document.getElementById('category-search-input');
  const suggestions = document.getElementById('category-suggestions');
  const status = document.getElementById('category-search-status');
  const showAllButton = document.getElementById('show-all-categories');
  const categories = [...document.querySelectorAll('[data-category]')];

  if (!searchInput || !suggestions || !status || !showAllButton) return;

  function closeSuggestions() {
    suggestions.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
  }

  function renderSuggestions() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const matches = categories.filter((section) =>
      section.dataset.category.toLocaleLowerCase().includes(query)
    );

    suggestions.replaceChildren();
    matches.forEach((section) => {
      const categoryName = section.dataset.category;
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'category-suggestion';
      option.dataset.categoryOption = categoryName;
      option.textContent = categoryName;
      suggestions.appendChild(option);
    });

    suggestions.hidden = matches.length === 0;
    searchInput.setAttribute('aria-expanded', String(matches.length > 0));
  }

  function selectCategory(categoryName) {
    const selectedCategory = categories.find((section) => section.dataset.category === categoryName);
    if (!selectedCategory) return;

    categories.forEach((section) => {
      section.hidden = section !== selectedCategory;
    });
    searchInput.value = categoryName;
    showAllButton.hidden = false;
    status.textContent = `Showing ${categoryName} perfumes.`;
    closeSuggestions();
    selectedCategory.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  searchInput.addEventListener('focus', renderSuggestions);
  searchInput.addEventListener('input', renderSuggestions);
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSuggestions();
      return;
    }

    if (event.key === 'Enter') {
      const exactMatch = categories.find((section) =>
        section.dataset.category.toLocaleLowerCase() === searchInput.value.trim().toLocaleLowerCase()
      );
      const firstSuggestion = suggestions.querySelector('.category-suggestion');
      const categoryName = exactMatch?.dataset.category || firstSuggestion?.dataset.category;

      if (categoryName) {
        event.preventDefault();
        selectCategory(categoryName);
      }
    }
  });

  suggestions.addEventListener('click', (event) => {
    const option = event.target.closest('.category-suggestion');
    if (option) selectCategory(option.dataset.categoryOption);
  });

  showAllButton.addEventListener('click', () => {
    categories.forEach((section) => {
      section.hidden = false;
    });
    searchInput.value = '';
    showAllButton.hidden = true;
    status.textContent = `Browse all ${categories.length} perfume categories.`;
    closeSuggestions();
    searchInput.focus();
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.category-search')) closeSuggestions();
  });
}

function addSelectedProductToCart() {
  const productName = new URLSearchParams(window.location.search).get('product');
  if (!productName) return;

  const productCard = [...document.querySelectorAll('.first, .First, .Second, .third')]
    .find((card) => card.dataset.name === productName);

  if (!productCard) return;

  addToCart(productCard.dataset.name, Number(productCard.dataset.price));
  window.history.replaceState({}, document.title, 'visit.html');
}

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
