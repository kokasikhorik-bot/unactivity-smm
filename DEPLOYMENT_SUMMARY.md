# 🚀 Сводка по деплою - Unactivity SMM

## ✅ Статус: ГОТОВО К ДЕПЛОЮ

Дата: 2026-05-04  
Версия: 1.0.2

---

## 📦 Что готово

### 1. Клиентский сайт (public/)
- ✅ `index.html` - Главная страница с формой ввода пинкода
- ✅ `script.js` - Логика работы с API
- ✅ `styles.css` - Современный дизайн

**Функции:**
- Ввод и проверка пинкода
- Выбор услуги из доступных
- Создание заказа
- Проверка статуса заказов
- Автоматическое форматирование пинкода (XXXX-XXXX-XXXX-XXXX)

### 2. Backend сервер (server.js)
- ✅ Express.js сервер
- ✅ OPTSMM API интеграция
- ✅ Автоматическое удаление пинкодов после использования
- ✅ Git автокоммит и автопуш

**API Endpoints:**
- `POST /api/verify-pincode` - Проверка пинкода
- `POST /api/create-order` - Создание заказа
- `GET /api/order-status/:orderId` - Статус заказа
- `GET /api/orders-by-pincode/:pincode` - Заказы по пинкоду
- `GET /api/services` - Список услуг OPTSMM
- `POST /api/admin/create-pincode` - Создание пинкода (для админа)
- `GET /api/admin/pincodes` - Все пинкоды
- `GET /api/admin/orders` - Все заказы

### 3. Десктоп приложение (gui-app/)
- ✅ Electron приложение для создания пинкодов
- ✅ Автоматическая загрузка услуг из OPTSMM
- ✅ Автоматический пуш на GitHub после создания пинкода
- ✅ Просмотр всех пинкодов и заказов

**Файл:** `gui-app/dist/Unactivity SMM Manager 1.0.0.exe`

### 4. Railway конфигурация
- ✅ `Procfile` - Команда запуска
- ✅ `railway.toml` - Конфигурация Railway
- ✅ `package.json` - Зависимости и скрипты
- ✅ `.env.example` - Пример переменных окружения

### 5. Документация
- ✅ `README.md` - Полная документация проекта
- ✅ `RAILWAY_DEPLOY.md` - Подробная инструкция по деплою
- ✅ `START_RAILWAY.txt` - Быстрый старт
- ✅ `DEPLOYMENT_SUMMARY.md` - Эта сводка

### 6. GitHub репозиторий
- ✅ Репозиторий: `https://github.com/kokasikhorik-bot/unactivity-smm`
- ✅ Все файлы залиты
- ✅ `.gitignore` настроен (node_modules, .env исключены)
- ✅ Последний коммит: "Add Railway deployment configuration and documentation"

---

## 🔄 Как работает автоудаление пинкодов

### Процесс:

1. **Клиент вводит пинкод** на сайте
2. **Сервер проверяет пинкод** в `database.json`
3. **Клиент выбирает услугу** и создаёт заказ
4. **Сервер создаёт заказ** через OPTSMM API
5. **Услуга отмечается как использованная** (`used: true`)
6. **Проверка:** Все ли услуги пинкода использованы?
   - Если **ДА** → Пинкод удаляется из `database.json`
   - Если **НЕТ** → Пинкод остаётся (можно использовать другие услуги)
7. **Автоматический git commit:** `Remove used pincode XXXX...`
8. **Автоматический git push** на GitHub
9. **Railway обнаруживает изменения** и запускает новый деплой
10. **Пинкод больше не доступен** на сайте

### Код автоудаления (server.js):

```javascript
// Проверка: все ли услуги использованы
const allUsed = pincodeData.services.every(s => s.used);

if (allUsed) {
  // Удаляем пинкод полностью
  delete database.pincodes[pincode];
  console.log(`✅ Пинкод ${pincode} полностью использован и удален`);
}

saveDatabase();

// АВТОМАТИЧЕСКИЙ ПУШ В GITHUB
try {
  const git = simpleGit(process.cwd());
  await git.add('database.json');
  await git.commit(`Remove used pincode ${pincode}`);
  await git.push();
  console.log('✅ Изменения автоматически загружены на GitHub');
} catch (gitError) {
  console.log('⚠️ Git операция не выполнена:', gitError.message);
}
```

---

## 🚀 Инструкция по деплою на Railway

### Быстрый старт (5 минут):

1. **Откройте Railway**
   ```
   https://railway.app
   ```

2. **Войдите через GitHub**
   ```
   Login → Login with GitHub
   ```

3. **Создайте проект**
   ```
   New Project → Deploy from GitHub repo
   → Выберите: kokasikhorik-bot/unactivity-smm
   → Deploy Now
   ```

4. **Добавьте переменную окружения**
   ```
   Variables → New Variable
   → OPTSMM_API_KEY = zhLKUyf12DwMSsuStEfI9eo99AwvdBEL7pDZ9Fv8CnoUzxGUP7CiuhwdWPSR
   → Add
   ```

5. **Получите URL**
   ```
   Settings → Networking → Generate Domain
   → Скопируйте URL
   ```

6. **Готово!**
   ```
   Откройте ваш URL в браузере
   ```

### Подробная инструкция:

Откройте файл `RAILWAY_DEPLOY.md` для пошаговой инструкции с решением проблем.

---

## 🧪 Тестирование

### 1. Локальное тестирование (перед деплоем)

```bash
# Установите зависимости
npm install

# Запустите сервер
npm start

# Откройте в браузере
http://localhost:3000
```

### 2. Тестирование на Railway (после деплоя)

1. **Создайте тестовый пинкод**
   - Откройте `.exe` приложение
   - Создайте пинкод с 1 услугой
   - Скопируйте пинкод

2. **Используйте на сайте**
   - Откройте ваш Railway URL
   - Введите пинкод
   - Выберите услугу
   - Введите тестовую ссылку (например: `https://instagram.com/test`)
   - Создайте заказ

3. **Проверьте удаление**
   - Попробуйте ввести тот же пинкод снова
   - Должно показать: "Неверный пинкод"
   - Откройте GitHub → `database.json`
   - Пинкод должен быть удалён

---

## 📊 Структура файлов

```
unactivity-smm/
├── public/                      # Клиентский сайт (для Railway)
│   ├── index.html               # Главная страница
│   ├── script.js                # Логика клиента
│   └── styles.css               # Стили
│
├── gui-app/                     # Десктоп приложение (НЕ для Railway)
│   ├── main.js                  # Electron main process
│   ├── renderer.js              # Frontend logic
│   ├── index.html               # UI админки
│   ├── styles.css               # Стили админки
│   ├── package.json             # Зависимости Electron
│   └── dist/                    # Собранный .exe
│       └── Unactivity SMM Manager 1.0.0.exe
│
├── server.js                    # Express сервер (для Railway)
├── database.json                # База данных (пинкоды и заказы)
├── package.json                 # Зависимости Node.js
├── .env                         # Переменные окружения (НЕ в Git!)
├── .env.example                 # Пример .env
├── .gitignore                   # Исключения для Git
│
├── Procfile                     # Команда запуска для Railway
├── railway.toml                 # Конфигурация Railway
│
├── README.md                    # Документация
├── RAILWAY_DEPLOY.md            # Инструкция по деплою
├── START_RAILWAY.txt            # Быстрый старт
└── DEPLOYMENT_SUMMARY.md        # Эта сводка
```

---

## 🔑 Переменные окружения

### Для Railway:

| Переменная | Значение | Обязательна |
|------------|----------|-------------|
| `OPTSMM_API_KEY` | `zhLKUyf12DwMSsuStEfI9eo99AwvdBEL7pDZ9Fv8CnoUzxGUP7CiuhwdWPSR` | ✅ Да |
| `PORT` | Автоматически устанавливается Railway | ❌ Нет |

### Для локального запуска:

Создайте файл `.env`:
```env
OPTSMM_API_KEY=zhLKUyf12DwMSsuStEfI9eo99AwvdBEL7pDZ9Fv8CnoUzxGUP7CiuhwdWPSR
PORT=3000
```

---

## 🎯 Workflow

### Создание пинкода:

```
1. Админ открывает .exe приложение
   ↓
2. Выбирает услугу и количество
   ↓
3. Нажимает "Сгенерировать пинкод"
   ↓
4. Приложение:
   - Создаёт уникальный 16-значный пинкод
   - Сохраняет в database.json
   - Делает git commit
   - Делает git push на GitHub
   ↓
5. Railway обнаруживает изменения
   ↓
6. Railway запускает новый деплой (30-60 сек)
   ↓
7. Пинкод доступен на сайте!
```

### Использование пинкода:

```
1. Клиент открывает сайт (Railway URL)
   ↓
2. Вводит пинкод
   ↓
3. Сервер проверяет пинкод в database.json
   ↓
4. Клиент видит доступные услуги
   ↓
5. Выбирает услугу, вводит ссылку и количество
   ↓
6. Нажимает "Запустить накрутку"
   ↓
7. Сервер:
   - Создаёт заказ через OPTSMM API
   - Отмечает услугу как использованную
   - Проверяет: все ли услуги использованы?
   - Если ДА → Удаляет пинкод из database.json
   - Делает git commit и push
   ↓
8. Railway обновляется
   ↓
9. Пинкод больше не доступен!
```

---

## 🐛 Решение проблем

### Railway не деплоится

**Симптомы:**
- Build failed
- Application failed to respond

**Решение:**
1. Проверьте логи: Railway → Deployments → Кликните на деплой
2. Убедитесь, что `OPTSMM_API_KEY` добавлен в Variables
3. Проверьте `package.json` - должен быть `"start": "node server.js"`
4. Проверьте, что все зависимости в `dependencies` (не в `devDependencies`)

### Пинкоды не удаляются

**Симптомы:**
- Пинкод можно использовать повторно
- В `database.json` на GitHub пинкод остаётся

**Решение:**
1. Проверьте логи сервера - должно быть "Пинкод удален"
2. Проверьте GitHub - есть ли коммиты "Remove used pincode"?
3. Проверьте, что Git настроен на сервере
4. Проверьте код в `server.js` - функция автоудаления должна быть

### Сайт не открывается

**Симптомы:**
- 404 Not Found
- Cannot GET /

**Решение:**
1. Проверьте, что домен сгенерирован: Settings → Networking
2. Проверьте логи - сервер должен быть запущен
3. Подождите 1-2 минуты после деплоя
4. Проверьте, что `public/` папка есть в репозитории

---

## ✅ Чеклист готовности

### Перед деплоем:

- [x] Код залит на GitHub
- [x] `database.json` существует и пустой
- [x] `public/` папка с сайтом есть
- [x] `server.js` настроен с автоудалением
- [x] `package.json` содержит все зависимости
- [x] `.env` НЕ залит на GitHub
- [x] `Procfile` создан
- [x] `railway.toml` создан
- [x] `README.md` создан
- [x] `RAILWAY_DEPLOY.md` создан

### После деплоя:

- [ ] Railway проект создан
- [ ] Репозиторий подключен
- [ ] `OPTSMM_API_KEY` добавлен в Variables
- [ ] Деплой завершён успешно
- [ ] Публичный домен сгенерирован
- [ ] Сайт открывается в браузере
- [ ] Можно ввести пинкод
- [ ] Заказ создаётся
- [ ] Пинкод удаляется после использования
- [ ] Автообновление работает

---

## 🎉 Готово!

Всё готово к деплою на Railway!

**Следующий шаг:** Откройте `START_RAILWAY.txt` или `RAILWAY_DEPLOY.md`

---

**GitHub:** https://github.com/kokasikhorik-bot/unactivity-smm  
**Railway:** https://railway.app  
**Версия:** 1.0.2  
**Дата:** 2026-05-04
