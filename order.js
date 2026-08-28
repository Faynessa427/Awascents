document.addEventListener('DOMContentLoaded', () => {
  const orderItemsList = document.getElementById('order-items');
  const orderTotal = document.getElementById('order-total');
  const itemCount = document.getElementById('item-count');
  const form = document.querySelector('.order-form');

  let cart = [];

  try {
    cart = JSON.parse(localStorage.getItem('awascentsCart')) || [];
  } catch {
    cart = [];
  }

  if (!orderItemsList || !orderTotal || !itemCount || !form) return;

  if (!cart.length) {
    orderItemsList.innerHTML = '<li>Your cart is empty.</li>';
    orderTotal.textContent = '0';
    itemCount.textContent = '0';
    form.querySelector('button').disabled = true;
    return;
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  let total = 0;

  orderItemsList.innerHTML = cart.map((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    return `
      <li>
        <span>${item.name} x${item.quantity}</span>
        <span>₦${itemTotal.toLocaleString()}</span>
      </li>
    `;
  }).join('');

  orderTotal.textContent = total.toLocaleString();
  itemCount.textContent = totalItems.toString();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Your order has been placed successfully!');
    localStorage.removeItem('awascentsCart');
    window.location.href = 'visit.html';
  });
});
