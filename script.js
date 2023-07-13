"use strict";

let originalArray = []
let myArrayUsers = []
const $wr = document.querySelector('[data-wr]')
const $search = document.querySelector('[search-wr]')
const $buttonSearch = document.querySelector('[button-search-wr]')
const $searchClear = document.querySelector('[clear-search-wr]')
const $sortDate = document.querySelector('[sort-by-date]')
const $sortRaiting = document.querySelector('[sort-by-rating]')
const $paginPage = document.querySelector('[pagination-wr]')
const $modalWr = document.querySelector('[data-modals_wr]')

// разметка поля для юзера 
const generateUserRecords = (user) => `<tr user-wr id=${user.id}">
  <td class="name_users">${user.username}</td>
  <td>${user.email}</td>
  <td>${user.registration_date}</td>
  <td>${user.rating}</td>
  <td><button button-delete-wr=${user.id} id=${user.id} class="button_delete"></button></td>
  </tr>`


// генерация кнопок пагинации принимает текущий массив и номер кнопки пагинации
const paginatorPage = (arr, n = 1) => {
  let numButtons = Math.ceil(arr.length / 5);
  $paginPage.innerHTML = ''
  if (arr.length > 5) {
    for (let i = 1; i <= numButtons; i++) {
      if (i == n) {
        $paginPage.insertAdjacentHTML('beforeend', `<a class="active" id=${i} href="#">${i}</a>`)
      } else {
        $paginPage.insertAdjacentHTML('beforeend', `<a id=${i} href="#">${i}</a>`)
      }
    }
  }
}

// функция для пагинации массива принимает текущий массив и номер кнопки пагинации
const paginator = (arr, n = 1) => {
  let result = [];
  let num = 5;
  for (let i = n * num - num; i < (n * num) && i < arr.length; i++) {
    result.push(arr[i]);
  }
  return result;
}

// GET запрос 
async function getAllUsers() {
  try {
    const response = await fetch('https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users')
    return response.json()
  } catch (error) {
    throw new Error(error)
  }
}

// Рендер таблицы
const tableRender = (state, n = 1) => {
  $wr.innerHTML = ''
  paginatorPage(state, n)
  paginator(state, n).forEach((user) => $wr.insertAdjacentHTML('beforeend', generateUserRecords(user)))
}

// Получаем массив с пользователями и рисуем таблицу
getAllUsers()
  .then((responsFromBackEnd) => {
    myArrayUsers = [...responsFromBackEnd]
    originalArray = myArrayUsers
    tableRender(myArrayUsers)
  })
  .catch(alert)


// Слушатель на выведение результатов поиска в таблицу
$buttonSearch.addEventListener('click', event => {
  event.preventDefault()
  let searchResult = $search.value.toLowerCase().trim()
  let myUsers = [...myArrayUsers].filter((user) => user.username.toLowerCase().trim().includes(searchResult) || user.email.toLowerCase().trim().includes(searchResult));
  tableRender(myUsers)
})

// Слушатель на удаление юзера из списка
$wr.addEventListener('click', (event) => {
  event.preventDefault()
  $modalWr.classList.remove('hidden')
  const idUser = event.target.id
  $modalWr.addEventListener('click', (event) => {
    event.preventDefault()
    if (event.target.type === "submit") {
      myArrayUsers = myArrayUsers.filter((user) => user.id !== idUser);
      tableRender(myArrayUsers)
      $modalWr.classList.add('hidden')
    } else {
      $modalWr.classList.add('hidden')
    }
  })
})

// Слушатель на очистку поиска
$searchClear.onclick = () => {
  tableRender(myArrayUsers)
  $sortDate.classList.remove('onSort')
  $sortRaiting.classList.remove('onSort')
}


// Функция для приведения значения даты в число
const dateNumber = (str) => {
  let result = ''
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== '-') {
      result += str[i]
    }
  }
  return parseInt(result)
}

// Переворот массива
const reverseSort = (event, str) => {
  if (event.target.text === str) {
    tableRender(myArrayUsers.reverse())
  }
}

 

// Сортировка по дате регистрации
$sortDate.addEventListener('click', (event) => {
  event.preventDefault()
  myArrayUsers = myArrayUsers.sort((a, b) => dateNumber(b.registration_date) - dateNumber(a.registration_date))
  $sortDate.addEventListener('click', (event) => reverseSort(event, event.target.text))
  $sortDate.classList.add('onSort')
  $sortRaiting.classList.remove('onSort')
  tableRender(myArrayUsers)
})

// Сортировка по рейтингу
$sortRaiting.addEventListener('click', (event) => {
  event.preventDefault()
  myArrayUsers = myArrayUsers.sort((a, b) => b.rating - a.rating)
  $sortRaiting.addEventListener('click', (event) => reverseSort(event, event.target.text))
  $sortRaiting.classList.add('onSort')
  $sortDate.classList.remove('onSort')
  tableRender(myArrayUsers)
})

// Слушатель на кнопку пагинации
$paginPage.addEventListener('click', (event) => {
  event.preventDefault()
  tableRender(myArrayUsers, event.target.id)
})

