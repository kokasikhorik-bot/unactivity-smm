# 🚀 Unactivity SMM - Премиум Сервис Накрутки

Полнофункциональный SMM сервис с системой пинкодов и интеграцией OPTSMM API.

## ✨ Возможности

- 🎫 **Система пинкодов** - Уникальные 16-значные пинкоды для доступа к услугам
- 🔄 **Автоматическое удаление** - Пинкоды автоматически удаляются после использования
- 📊 **Отслеживание заказов** - Проверка статуса заказов в реальном времени
- 🎨 **Современный UI** - Красивый и отзывчивый интерфейс
- 🔒 **Безопасность** - Одноразовое использование пинкодов
- 🚀 **Быстрый деплой** - Готов к развертыванию на Railway

## 📦 Структура проекта

```
.
├── public/              # Клиентский сайт
│   ├── index.html       # Главная страница
│   ├── script.js        # Логика клиента
│   └── styles.css       # Стили
├── gui-app/             # Десктоп приложение для админа
│   ├── main.js          # Electron main process
│   ├── renderer.js      # Frontend logic
│   ├── index.html       # UI админки
│   └── dist/            # Собранный .exe
├── server.js            # Express сервер
├── database.json        # База данных (пинкоды и заказы)
├── .env                 # Переменные окружения
└── package.json         # Зависимости

```

## 🚀 Быстрый старт

### 1. Клонирование репозитория

\`\`\`bash
git clone https://github.com/kokasikhorik-bot/unactivity-smm.git
cd unactivity-smm
\`\`\`

### 2. Установка зависимостей

\`\`\`bash
npm install
\`\`\`

### 3. Настройка переменных окружения

Создайте файл `.env`:

\`\`\`env
OPTSMM_API_KEY=zhLKUyf12DwMSsuStEfI9eo99AwvdBEL7pDZ9Fv8CnoUzxGUP7CiuhwdWPSR
PORT=3000
\`\`\`

### 4. Запуск сервера

\`\`\`bash
npm start
\`\`\`

Сервер запустится на `http://localhost:3000`

## 🌐 Деплой на Railway

### Способ 1: Через GitHub (Рекомендуется)

1. **Залейте код на GitHub** (уже сделано)

2. **Перейдите на Railway**
   - Откройте [railway.app](https://railway.app)
   - Войдите через GitHub

3. **Создайте новый проект**
   - Нажмите "New Project"
   - Выберите "Deploy from GitHub repo"
   - Выберите репозиторий `unactivity-smm`

4. **Настройте переменные окружения**
   - Перейдите в Settings → Variables
   - Добавьте:
     \`\`\`
     OPTSMM_API_KEY=zhLKUyf12DwMSsuStEfI9eo99AwvdBEL7pDZ9Fv8CnoUzxGUP7CiuhwdWPSR
     PORT=3000
     \`\`\`

5. **Деплой**
   - Railway автоматически задеплоит приложение
   - Получите публичный URL в разделе Settings → Domains

### Способ 2: Через Railway CLI

\`\`\`bash
# Установите Railway CLI
npm install -g @railway/cli

# Войдите в Railway
railway login

# Инициализируйте проект
railway init

# Добавьте переменные окружения
railway variables set OPTSMM_API_KEY=zhLKUyf12DwMSsuStEfI9eo99AwvdBEL7pDZ9Fv8CnoUzxGUP7CiuhwdWPSR

# Задеплойте
railway up
\`\`\`

## 🎯 Использование

### Для администратора (Создание пинкодов)

1. Запустите десктоп приложение:
   \`\`\`
   gui-app/dist/Unactivity SMM Manager 1.0.0.exe
   \`\`\`

2. Выберите услугу и количество

3. Нажмите "Сгенерировать пинкод"

4. Пинкод автоматически сохранится и загрузится на GitHub

### Для клиентов (Использование пинкодов)

1. Откройте сайт (ваш Railway URL)

2. Введите пинкод в формате `XXXX-XXXX-XXXX-XXXX`

3. Выберите услугу из доступных

4. Введите ссылку и количество

5. Нажмите "Запустить накрутку"

6. Заказ будет создан в OPTSMM

7. **Пинкод автоматически удалится** после использования всех услуг

## 🔄 Автоматическое удаление пинкодов

Система автоматически удаляет пинкоды после использования:

1. Клиент вводит пинкод и создаёт заказ
2. Услуга отмечается как использованная
3. Если все услуги пинкода использованы:
   - Пинкод удаляется из `database.json`
   - Изменения автоматически коммитятся в Git
   - Изменения пушатся на GitHub
   - Railway автоматически обновляется

## 📊 API Endpoints

### Клиентские endpoints

- `GET /` - Главная страница
- `POST /api/verify-pincode` - Проверка пинкода
- `POST /api/create-order` - Создание заказа
- `GET /api/order-status/:orderId` - Статус заказа
- `GET /api/orders-by-pincode/:pincode` - Заказы по пинкоду

### Админские endpoints

- `GET /api/services` - Список услуг OPTSMM
- `POST /api/admin/create-pincode` - Создание пинкода
- `GET /api/admin/pincodes` - Все пинкоды
- `GET /api/admin/orders` - Все заказы

## 🔧 Технологии

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Axios** - HTTP клиент
- **Simple-Git** - Git операции
- **OPTSMM API** - Сервис накрутки

### Frontend
- **Vanilla JavaScript** - Без фреймворков
- **CSS3** - Современные стили
- **HTML5** - Семантическая разметка

### Desktop App
- **Electron** - Десктоп приложение
- **Node.js** - Backend логика

## 📝 Переменные окружения

| Переменная | Описание | Обязательна |
|------------|----------|-------------|
| `OPTSMM_API_KEY` | API ключ OPTSMM | ✅ Да |
| `PORT` | Порт сервера | ❌ Нет (по умолчанию 3000) |

## 🔒 Безопасность

- ✅ Пинкоды одноразовые
- ✅ Автоматическое удаление после использования
- ✅ Валидация всех входных данных
- ✅ CORS настроен
- ✅ Безопасное хранение API ключей

## 🐛 Решение проблем

### Пинкоды не удаляются

Проверьте, что Git настроен:
\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
\`\`\`

### Ошибка подключения к OPTSMM

Проверьте API ключ в `.env` файле

### Railway не деплоится

Убедитесь, что:
- `package.json` содержит `"start": "node server.js"`
- Все зависимости в `dependencies` (не в `devDependencies`)
- Переменные окружения настроены в Railway

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи Railway
2. Проверьте консоль браузера (F12)
3. Проверьте `database.json`

## 📄 Лицензия

MIT License

---

**Версия**: 1.0.2  
**Дата**: 2026-05-04  
**Статус**: Production Ready 🚀
