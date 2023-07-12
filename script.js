"use strict";

const $wr = document.querySelector('[data-wr]')
const $search = document.querySelector('[search-wr]')
const $buttonSearch = document.querySelector('[button-search-wr]')
const $searchClear = document.querySelector('[clear-search-wr]')
const $sortDate = document.querySelector('[sort-by-date]')
const $sortRaiting = document.querySelector('[sort-by-rating]')

  // разметка поля для юзера 
const generateUserRecords = (user) => `<tr user-wr id=${user.id}">
<td class="name_users">${user.username}</td>
<td>${user.email}</td>
<td>${user.registration_date}</td>
<td>${user.rating}</td>
<td><button button-delete-wr=${user.id} id=${user.id} class="button_delete">X</button></td>
</tr>`

// GET запрос 
async function getAllUsers() {
    try {
      const response = await fetch('https://5ebbb8e5f2cfeb001697d05c.mockapi.io/users')
      return response.json()
    } catch (error) {
      throw new Error(error)
    }
  }


  // Получаем массив с пользователями и рисуем таблицу
let myArrayUsers = [];
  getAllUsers()
  .then((responsFromBackEnd) => {
    myArrayUsers = [...responsFromBackEnd]
    myArrayUsers.forEach((user) => $wr.insertAdjacentHTML('beforeend', generateUserRecords(user)))
})
  .catch(alert)

  const tableRender = (state) => {
    $wr.innerHTML = ''
    state.forEach((user) => $wr.insertAdjacentHTML('beforeend', generateUserRecords(user)))
  }
  
  // Слушатель на выведение результатов поиска в таблицу
$buttonSearch.addEventListener('click', event => {
    event.preventDefault()
    let searchResult = $search.value.toLowerCase().trim()
    let myArrayFilterUsers = [...myArrayUsers].filter((user) => user.username.toLowerCase().trim().includes(searchResult) || user.email.toLowerCase().trim().includes(searchResult));
    tableRender(myArrayFilterUsers)
  })

 // Слушатель на удаление юзера из списка
$wr.addEventListener('click', (event) => {
    event.preventDefault()
    myArrayUsers = myArrayUsers.filter((user) => user.id !== event.target.id);
    tableRender(myArrayUsers)
    })

 // Слушатель на очистку поиска
$searchClear.onclick = () => {
  tableRender(myArrayUsers)
}


// Функция для приведения значения даты в число
const dateNumber = (str) => {
let result =''
for (let i = 0; i < str.length; i++) {
    if (str[i] !== '-') {
        result += str[i]
    }
}
return parseInt(result)
}

 // Сортировка по дате регистрации
 $sortDate.addEventListener('click', (event) => {
    event.preventDefault()
    myArrayUsers = myArrayUsers.sort((a, b) => dateNumber(b.registration_date) - dateNumber(a.registration_date)) 
    $sortDate.classList.add('onSort')
    $sortRaiting.classList.remove('onSort')
    tableRender(myArrayUsers)
    })

 // Сортировка по рейтингу
 $sortRaiting.addEventListener('click', (event) => {
    event.preventDefault()
    myArrayUsers = myArrayUsers.sort((a, b) => b.rating - a.rating)
    $sortRaiting.classList.add('onSort') 
    $sortDate.classList.remove('onSort')  
    tableRender(myArrayUsers)
    })

   



