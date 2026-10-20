// Модальное окно быстрой заявки (есть только на странице каталога).
const orderModal = document.getElementById('orderModal');

if (orderModal) {
  // Bootstrap вызывает событие show.bs.modal перед открытием окна.
  // В event.relatedTarget лежит кнопка «Заказать», по которой нажали.
  orderModal.addEventListener('show.bs.modal', (event) => {
    const productName = event.relatedTarget.dataset.product;

    document.getElementById('modal-product').value = productName;
    document.getElementById('modal-product-name').textContent = productName;
  });
}

// На странице заявки выбираем товар, с которого пришёл пользователь:
// ссылка «Оформить заявку» на странице товара ведёт на order.html?product=...
const productSelect = document.getElementById('order-product');
const productFromUrl = new URLSearchParams(window.location.search).get('product');

if (productSelect && productFromUrl) {
  productSelect.value = productFromUrl;
}

// Проверка форм с классом needs-validation.
// Класс was-validated включает Bootstrap-подсветку полей и подсказки invalid-feedback.
document.querySelectorAll('.needs-validation').forEach((form) => {
  form.addEventListener('submit', (event) => {
    // Backend не подключён, поэтому стандартную отправку отменяем.
    event.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    form.classList.remove('was-validated');
    form.reset();

    // Если форма находится в модальном окне, закрываем его.
    const modalElement = form.closest('.modal');

    if (modalElement) {
      bootstrap.Modal.getOrCreateInstance(modalElement).hide();
    }

    // id сообщения об успехе указан в data-success у формы.
    const successMessage = document.getElementById(form.dataset.success);

    successMessage.hidden = false;
    successMessage.scrollIntoView({ block: 'center' });
  });
});
