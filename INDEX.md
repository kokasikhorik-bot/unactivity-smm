# 📚 Unactivity SMM - Навигация по документации

Добро пожаловать в **Unactivity SMM** - профессиональную платформу для продажи SMM услуг!

## 🚀 Быстрый старт

Если вы впервые здесь, начните с этих файлов:

1. **[QUICK_START.md](QUICK_START.md)** ⭐
   - Установка за 5 минут
   - Первый запуск
   - Создание первого пинкода

2. **[README.md](README.md)**
   - Полное описание проекта
   - Основные возможности
   - Структура проекта

## 📖 Документация

### Для начинающих:

- **[SETUP.bat](SETUP.bat)** - Автоматическая установка (двойной клик)
- **[START_SERVER.bat](START_SERVER.bat)** - Запуск веб-сервера
- **[START_GUI.bat](START_GUI.bat)** - Запуск Desktop приложения

### Подробные инструкции:

- **[GIT_SETUP.md](GIT_SETUP.md)** - Настройка Git и GitHub
- **[DEPLOY.md](DEPLOY.md)** - Деплой на Railway
- **[gui-app/README.md](gui-app/README.md)** - Инструкция по GUI приложению
- **[PROJECT_INFO.md](PROJECT_INFO.md)** - Полная техническая информация

## 🎯 Что вы хотите сделать?

### Я хочу запустить проект локально
→ Откройте **[QUICK_START.md](QUICK_START.md)**

### Я хочу создать пинкод
→ Запустите **START_GUI.bat** или откройте http://localhost:3000/admin.html

### Я хочу залить проект на GitHub
→ Откройте **[GIT_SETUP.md](GIT_SETUP.md)**

### Я хочу задеплоить на Railway
→ Откройте **[DEPLOY.md](DEPLOY.md)**

### Я хочу понять как работает проект
→ Откройте **[PROJECT_INFO.md](PROJECT_INFO.md)**

### Я хочу использовать Desktop приложение
→ Откройте **[gui-app/README.md](gui-app/README.md)**

## 📁 Структура файлов

```
Unactivity SMM/
│
├── 📄 Документация
│   ├── INDEX.md (этот файл)
│   ├── README.md
│   ├── QUICK_START.md
│   ├── GIT_SETUP.md
│   ├── DEPLOY.md
│   ├── PROJECT_INFO.md
│   └── LICENSE
│
├── 🚀 Запуск
│   ├── SETUP.bat
│   ├── START_SERVER.bat
│   └── START_GUI.bat
│
├── 🌐 Веб-приложение
│   ├── server.js
│   ├── database.json
│   ├── .env
│   └── public/
│       ├── index.html (главная)
│       ├── admin.html (админка)
│       ├── styles.css
│       ├── script.js
│       └── admin.js
│
├── 🖥️ Desktop приложение
│   └── gui-app/
│       ├── main.js
│       ├── renderer.js
│       ├── index.html
│       ├── styles.css
│       ├── package.json
│       └── README.md
│
└── ⚙️ Конфигурация
    ├── package.json
    ├── .gitignore
    ├── .gitattributes
    └── .env
```

## 🎓 Обучающие материалы

### Уровень 1: Базовое использование
1. Установка проекта
2. Запуск сервера
3. Создание пинкода
4. Тестирование заказа

**Время**: 15 минут  
**Файл**: [QUICK_START.md](QUICK_START.md)

### Уровень 2: Git и GitHub
1. Установка Git
2. Создание репозитория
3. Первый коммит
4. Настройка GUI для автопуша

**Время**: 20 минут  
**Файл**: [GIT_SETUP.md](GIT_SETUP.md)

### Уровень 3: Деплой в продакшн
1. Подготовка проекта
2. Настройка Railway
3. Деплой
4. Настройка домена

**Время**: 30 минут  
**Файл**: [DEPLOY.md](DEPLOY.md)

### Уровень 4: Кастомизация
1. Изменение дизайна
2. Добавление функций
3. Интеграция с другими API
4. Оптимизация

**Время**: 1-2 часа  
**Файл**: [PROJECT_INFO.md](PROJECT_INFO.md)

## 🔧 Быстрые команды

### Установка
```bash
# Автоматическая
SETUP.bat

# Или вручную
npm install
cd gui-app && npm install
```

### Запуск
```bash
# Веб-сервер
START_SERVER.bat
# или
npm start

# Desktop GUI
START_GUI.bat
# или
cd gui-app && npm start
```

### Git
```bash
# Первая настройка
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# Обновление
git add .
git commit -m "Update"
git push
```

## 📞 Поддержка

### Проблемы с установкой?
→ Проверьте [QUICK_START.md](QUICK_START.md) раздел "Troubleshooting"

### Проблемы с Git?
→ Проверьте [GIT_SETUP.md](GIT_SETUP.md) раздел "Troubleshooting"

### Проблемы с деплоем?
→ Проверьте [DEPLOY.md](DEPLOY.md) раздел "Troubleshooting"

### Проблемы с GUI?
→ Проверьте [gui-app/README.md](gui-app/README.md) раздел "Troubleshooting"

## ✅ Чеклист для начала работы

- [ ] Установил Node.js
- [ ] Запустил SETUP.bat
- [ ] Запустил START_SERVER.bat
- [ ] Открыл http://localhost:3000
- [ ] Запустил START_GUI.bat
- [ ] Настроил GUI (путь к проекту, API ключ)
- [ ] Создал первый пинкод
- [ ] Протестировал заказ
- [ ] Настроил Git (опционально)
- [ ] Залил на GitHub (опционально)
- [ ] Задеплоил на Railway (опционально)

## 🎉 Готово!

После выполнения чеклиста вы готовы к работе!

**Следующие шаги:**
1. Создавайте пинкоды через GUI
2. Отправляйте их клиентам
3. Отслеживайте заказы
4. Получайте прибыль! 💰

---

**Версия**: 1.0.0  
**Дата**: 3 мая 2026  
**Лицензия**: MIT
