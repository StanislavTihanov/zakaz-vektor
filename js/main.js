"use strict"



//------------------------------------------------------------------------Меню-Бургер
const burgerMenu = document.querySelector('.burger__wrapper');
const menuBody= document.querySelector('.menu');

if(burgerMenu) {
    burgerMenu.addEventListener("click", function (e) {
      burgerMenu.classList.toggle('_active');
      menuBody.classList.toggle('_active');
    });
}
//------------------------------------------------------------------------закрытие меню при клике вне его

//------------------------------------------------------------------------закрытие меню при клике вне его


document.addEventListener('DOMContentLoaded', function () {
  const menuItems = document.querySelectorAll('.menu__item');

  menuItems.forEach((item) => {
    const subMenu = item.querySelector('.menu__sub-list');
    const link = item.querySelector('.menu__link');

    if (subMenu) {
      // Обработка клика на сам элемент .menu__item
      item.addEventListener('click', function (e) {
        if (!e.target.classList.contains('menu__link')) {
          e.preventDefault();
          item.classList.toggle('active');

          // Закрываем другие открытые подменю
          menuItems.forEach((otherItem) => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
            }
          });
        }
      });

      // Оставляем переход по ссылке .menu__link
      link.addEventListener('click', function (e) {
        e.stopPropagation(); // Не даем родителю обработать событие
      });
    }
  });
});





//------------------------------------------------------------------------popup
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll(".lock-padding");


let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
  for (let index = 0; index < popupLinks.length; index++) {
    const popupLink = popupLinks[index];
    popupLink.addEventListener("click", function (e) {
      const popupName = popupLink.getAttribute('href').replace('#', '');
      const currentPopup = document.getElementById(popupName);
      popupOpen(currentPopup);
      e.preventDefault();
    });
  }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
  for (let index = 0; index < popupCloseIcon.length; index++) {
    const el = popupCloseIcon[index];
    el.addEventListener('click', function (e) {
      popupClose(el.closest('.popup'));
      e.preventDefault();
    })
  }
}

function popupOpen(currentPopup) {
  if (currentPopup && unlock) {
    const popupActive = document.querySelector('.popup.open');
    if (popupActive) {
      popupClose(popupActive, false);
    } else {
      bodyLock();
    }
    currentPopup.classList.add('open');
    currentPopup.addEventListener("click", function (e) {
      if (!e.target.closest('.popup__content')) {
        popupClose(e.target.closest('.popup'));
      }
    });
  }
}

function popupClose(popupActive, doUnlock = true) {
  if (unlock) {
    popupActive.classList.remove('open');
    if (doUnlock) {
      bodyUnlock();
    }
  }
}

function bodyLock() {
  const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
  if (lockPadding.length > 0) {
    for (let index = 0; index < lockPadding.length; index++) {
      const el = lockPadding[index];
      el.style.paddingRight = lockPaddingValue;
    }
  }
  body.style.paddingRight = lockPaddingValue;
  body.classList.add('lock');

  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

function bodyUnlock () {
  setTimeout(function () {
    if(lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = '0px';
      }
  }
    body.style.paddingRight = '0px';
    body.classList.remove('lock');
  }, timeout);
  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

document.addEventListener('keydown', function (e) {
  if (e.which === 27) {
    const popupActive = document.querySelector('.popup.open');
    popupClose(popupActive);
  }
});
//------------------------------------------------------------------------popup


//------------------------------------------------------------------------Animation
document.addEventListener('DOMContentLoaded', () => {
  const animItems = document.querySelectorAll('._anim-items');

  // Проверяем, есть ли элементы для анимации на странице
  if (animItems.length > 0) {
    const observerOptions = {
      threshold: 0.5 // Срабатывает, если 50% элемента видны
    };

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('_action');
          observer.unobserve(entry.target); // Остановить наблюдение за этим элементом
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    animItems.forEach(item => observer.observe(item));
  } else {
    console.log('Элементы с классом ._anim-items не найдены. Скрыт выполнение анимации.');
  }
});

//------------------------------------------------------------------------Animation

//------------------------------------------------------------------------Обработка формы
document.addEventListener('DOMContentLoaded', function () {
  const forms = document.querySelectorAll('form'); // Получаем все формы на странице

  forms.forEach((form) => {
    const phoneInputs = form.querySelectorAll('._number'); // Поле ввода телефона

    // Добавляем маску для номера телефона
    const maskOptions = {
      mask: '+{7} (000) 000-00-00', // Маска для телефона
    };
    
    // Применяем маску ко всем найденным полям
    phoneInputs.forEach(input => {
      IMask(input, maskOptions);
    });
    
    form.addEventListener('submit', formSend);

    async function formSend(e) {
      e.preventDefault();

      let error = formValidate(form);
      let formData = new FormData(form);
      const formImage = form.querySelector('#formImage');
      if (formImage && formImage.files[0]) {
        formData.append('image', formImage.files[0]);
      }

      if (error === 0) {
        form.classList.add('_sending');
        let response = await fetch('send.php', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          let result = await response.json();
          form.style.display = 'none';

          const successMessage = document.createElement('div');
          successMessage.classList.add('success-message');
          successMessage.textContent = 'Форма успешно отправлена!';
          form.parentElement.appendChild(successMessage);
          
          const formPreview = form.querySelector('#formPreview');
          if (formPreview) {
            formPreview.innerHTML = '';
          }
          form.reset();
          form.classList.remove('_sending');
        } else {
          alert('Ошибка');
          form.classList.remove('_sending');
        }
      }
    }

    function formValidate(form) {
      let error = 0;
      let formReq = form.querySelectorAll('._req');

      formReq.forEach((input) => {
        formRemoveError(input);

        if (input.classList.contains('_email')) {
          if (!emailTest(input)) { // проверка на корректность email
            formAddError(input);
            error++;
          }
        } else if (input.classList.contains('_number')) {
          if (!phoneTest(input)) { // проверка на корректность телефона
            formAddError(input);
            error++;
          }
        } else if (input.getAttribute('type') === "checkbox" && input.checked === false) {
          formAddError(input);
          error++;
        } else {
          if (input.value === '') {
            formAddError(input);
            error++;
          }
        }
      });
      return error;
    }

    function formAddError(input) {
      input.parentElement.classList.add('_error');
      input.classList.add('_error');
    
      // Ищем элемент с классом form__error внутри контейнера родителя
      const errorSpan = input.parentElement.querySelector('.form__error');
      if (errorSpan) {
        errorSpan.classList.add('view'); // Добавляем класс view
      }
    }
    
    function formRemoveError(input) {
      input.parentElement.classList.remove('_error');
      input.classList.remove('_error');
    
      // Ищем элемент с классом form__error внутри контейнера родителя
      const errorSpan = input.parentElement.querySelector('.form__error');
      if (errorSpan) {
        errorSpan.classList.remove('view'); // Удаляем класс view
      }
    }
    
    // проверка email
    function emailTest(input) {
      return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(input.value);
    }

    // проверка телефона
    function phoneTest(input) {
      return /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/.test(input.value);
    }

    // Работа с изображением
    const formImage = form.querySelector('#formImage');
    const formPreview = form.querySelector('#formPreview');

    if (formImage) {
      formImage.addEventListener('change', () => {
        uploadFile(formImage.files[0]);
      });

      function uploadFile(file) {
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          alert('Только изображения');
          formImage.value = '';
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          alert('Файл должен быть менее 2 МБ');
          return;
        }
        let reader = new FileReader();
        reader.onload = function (e) {
          if (formPreview) {
            formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
          }
        };
        reader.onerror = function (e) {
          alert('Ошибка');
        };
        reader.readAsDataURL(file);
      }
    }
  });
});



//------------------------------------------------------------------------Обработка форм