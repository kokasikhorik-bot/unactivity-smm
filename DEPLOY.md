# 🚀 Инструкция по деплою на Railway

## Подготовка проекта

1. **Инициализация Git репозитория**
```bash
git init
git add .
git commit -m "Initial commit: Unactivity SMM"
```

2. **Создание GitHub репозитория**
   - Зайдите на https://github.com
   - Создайте новый репозиторий (например, `unactivity-smm`)
   - НЕ добавляйте README, .gitignore или лицензию

3. **Загрузка на GitHub**
```bash
git remote add origin https://github.com/ВАШ_USERNAME/unactivity-smm.git
git branch -M main
git push -u origin main
```

## Деплой на Railway

1. **Регистрация на Railway**
   - Зайдите на https://railway.app
   - Войдите через GitHub

2. **Создание проекта**
   - Нажмите "New Project"
   - Выберите "Deploy from GitHub repo"
   - Выберите ваш репозиторий `unactivity-smm`

3. **Настройка переменных окружения**
   - Откройте проект
   - Перейдите в "Variables"
   - Добавьте переменные:
     ```
     OPTSMM_API_KEY=zhLKUyf12DwMSsuStEfI9eo99AwvdBEL7pDZ9Fv8CnoUzxGUP7CiuhwdWPSR
     PORT=3000
     ```

4. **Деплой**
   - Railway автоматически задеплоит проект
   - Дождитесь завершения сборки
   - Получите URL вашего приложения (например, `unactivity-smm.up.railway.app`)

## Автоматическое обновление

После настройки каждый push в GitHub будет автоматически деплоить изменения на Railway.

```bash
# Внесите изменения
git add .
git commit -m "Update: описание изменений"
git push
```

## Использование GUI приложения с Railway

1. Откройте GUI приложение
2. В настройках укажите:
   - **Путь к проекту**: путь к локальной папке проекта
   - **OPTSMM API Key**: ваш ключ
   - **GitHub Repository URL**: `https://github.com/ВАШ_USERNAME/unactivity-smm.git`

3. При создании пинкода нажмите "Залить на GitHub"
4. Railway автоматически задеплоит изменения

## Проверка работы

1. Откройте URL вашего приложения на Railway
2. Проверьте главную страницу
3. Проверьте админ панель: `ВАШ_URL/admin.html`
4. Создайте тестовый пинкод через GUI
5. Проверьте его на сайте

## Мониторинг

- **Логи**: Railway → Ваш проект → Deployments → View Logs
- **Метрики**: Railway → Ваш проект → Metrics
- **База данных**: файл `database.json` хранится в репозитории

## Важно

⚠️ **Безопасность**:
- Никогда не коммитьте `.env` файл
- Храните API ключи только в переменных окружения Railway
- Регулярно делайте бэкапы `database.json`

⚠️ **Бэкапы**:
```bash
# Скачайте database.json из репозитория
git pull

# Сделайте копию
cp database.json database.backup.json
```

## Troubleshooting

**Проблема**: Сервер не запускается
- Проверьте логи в Railway
- Убедитесь, что все переменные окружения установлены
- Проверьте, что `package.json` содержит правильный start script

**Проблема**: API не работает
- Проверьте OPTSMM_API_KEY в переменных окружения
- Убедитесь, что ключ активен

**Проблема**: База данных не обновляется
- Убедитесь, что `database.json` закоммичен в Git
- Проверьте права доступа к репозиторию
