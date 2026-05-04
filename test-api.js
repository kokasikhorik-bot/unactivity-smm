// Тестовый скрипт для проверки OPTSMM API
const axios = require('axios');

const API_KEY = 'zhLKUyf12DwMSsuStEfI9eo99AwvdBEL7pDZ9Fv8CnoUzxGUP7CiuhwdWPSR';
const URL = `https://optsmm.ru/api/v2?action=services&key=${API_KEY}`;

console.log('🔄 Тестирование OPTSMM API...');
console.log('URL:', URL.substring(0, 60) + '...');
console.log('');

axios.get(URL, {
  timeout: 20000,
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
})
.then(response => {
  console.log('✅ УСПЕХ!');
  console.log('Статус:', response.status);
  console.log('Тип данных:', typeof response.data);
  console.log('Это массив?', Array.isArray(response.data));
  
  if (Array.isArray(response.data)) {
    console.log('✅ Загружено услуг:', response.data.length);
    console.log('');
    console.log('Первые 3 услуги:');
    response.data.slice(0, 3).forEach(service => {
      console.log(`  - ${service.name} (ID: ${service.service}, ${service.rate} USD)`);
    });
  } else {
    console.log('❌ Данные не массив!');
    console.log('Ответ:', JSON.stringify(response.data, null, 2));
  }
})
.catch(error => {
  console.log('❌ ОШИБКА!');
  console.log('Сообщение:', error.message);
  
  if (error.response) {
    console.log('HTTP Статус:', error.response.status);
    console.log('Данные ответа:', error.response.data);
  } else if (error.request) {
    console.log('Запрос был отправлен, но ответа не получено');
    console.log('Возможно проблема с интернетом или API недоступен');
  } else {
    console.log('Ошибка настройки запроса:', error.message);
  }
});
