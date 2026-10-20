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

// Фильтр по категориям и сортировка в каталоге.
const catalogGrid = document.getElementById('catalog-grid');

if (catalogGrid) {
  // Колонки с карточками. Категория, цена и исходный порядок
  // записаны в data-атрибутах каждой колонки.
  const catalogItems = Array.from(catalogGrid.children);
  const filterButtons = document.querySelectorAll('[data-filter]');
  const sortSelect = document.getElementById('catalog-sort');
  const catalogCount = document.getElementById('catalog-count');

  const updateCatalog = () => {
    const activeFilter = document.querySelector('[data-filter].active').dataset.filter;
    let visibleCount = 0;

    // Скрываем карточки других категорий классом Bootstrap d-none.
    catalogItems.forEach((item) => {
      const isVisible = activeFilter === 'all' || item.dataset.category === activeFilter;

      item.classList.toggle('d-none', !isVisible);

      if (isVisible) {
        visibleCount += 1;
      }
    });

    // Сортируем копию массива и заново добавляем колонки в сетку в новом порядке.
    const sortedItems = [...catalogItems].sort((a, b) => {
      if (sortSelect.value === 'cheap') {
        return a.dataset.price - b.dataset.price;
      }

      if (sortSelect.value === 'expensive') {
        return b.dataset.price - a.dataset.price;
      }

      return a.dataset.order - b.dataset.order;
    });

    sortedItems.forEach((item) => catalogGrid.append(item));

    catalogCount.textContent = `Показано товаров: ${visibleCount} из ${catalogItems.length}`;
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Отмечаем нажатую кнопку активной, остальные снимаем.
      filterButtons.forEach((otherButton) => {
        otherButton.classList.remove('active');
        otherButton.setAttribute('aria-pressed', 'false');
      });

      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');

      updateCatalog();
    });
  });

  sortSelect.addEventListener('change', updateCatalog);
}

// Название товара из формы: из скрытого поля (модальное окно)
// или из выбранного пункта списка (страница заявки).
const getProductName = (form) => {
  const productField = form.elements.product;

  if (!productField || !productField.value) {
    return '';
  }

  if (productField.tagName === 'SELECT') {
    return productField.selectedOptions[0].textContent;
  }

  return productField.value;
};

// Всплывающее уведомление (toast) об успешной отправке.
const successToast = document.getElementById('success-toast');

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

    // Название товара запоминаем до очистки формы.
    const productName = getProductName(form);

    form.classList.remove('was-validated');
    form.reset();

    // Если форма находится в модальном окне, закрываем его.
    const modalElement = form.closest('.modal');

    if (modalElement) {
      bootstrap.Modal.getOrCreateInstance(modalElement).hide();
    }

    successToast.querySelector('.toast-body').textContent = productName
      ? `Заявка на «${productName}» отправлена! Менеджер скоро свяжется с вами.`
      : 'Заявка отправлена! Менеджер скоро свяжется с вами.';

    bootstrap.Toast.getOrCreateInstance(successToast).show();
  });
});
