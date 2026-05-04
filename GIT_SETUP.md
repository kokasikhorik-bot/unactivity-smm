# 📦 Настройка Git и GitHub

## Шаг 1: Установка Git

Если Git не установлен:
- Скачайте с https://git-scm.com/download/win
- Установите с настройками по умолчанию

Проверка установки:
```bash
git --version
```

## Шаг 2: Настройка Git

Откройте командную строку и выполните:

```bash
git config --global user.name "Ваше Имя"
git config --global user.email "your.email@example.com"
```

## Шаг 3: Создание GitHub репозитория

1. Зайдите на https://github.com
2. Войдите в аккаунт (или создайте новый)
3. Нажмите "+" → "New repository"
4. Заполните:
   - **Repository name**: `unactivity-smm`
   - **Description**: "SMM накрутка с пинкодами"
   - **Private/Public**: выберите Private для приватного проекта
   - **НЕ добавляйте** README, .gitignore или лицензию
5. Нажмите "Create repository"

## Шаг 4: Инициализация локального репозитория

Откройте командную строку в папке проекта и выполните:

```bash
git init
git add .
git commit -m "Initial commit: Unactivity SMM"
```

## Шаг 5: Подключение к GitHub

Замените `YOUR_USERNAME` на ваш GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/unactivity-smm.git
git branch -M main
git push -u origin main
```

При первом пуше GitHub попросит авторизацию:
- Введите ваш GitHub username
- Вместо пароля используйте **Personal Access Token**

### Создание Personal Access Token:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" → "Generate new token (classic)"
3. Заполните:
   - **Note**: "Unactivity SMM"
   - **Expiration**: 90 days (или больше)
   - **Scopes**: отметьте `repo` (все подпункты)
4. "Generate token"
5. **СКОПИРУЙТЕ токен** (он больше не будет показан!)
6. Используйте этот токен вместо пароля при пуше

## Шаг 6: Проверка

```bash
git remote -v
```

Должно показать:
```
origin  https://github.com/YOUR_USERNAME/unactivity-smm.git (fetch)
origin  https://github.com/YOUR_USERNAME/unactivity-smm.git (push)
```

## Шаг 7: Настройка GUI приложения

1. Запустите GUI приложение
2. Откройте настройки (⚙️)
3. В поле "GitHub Repository URL" вставьте:
   ```
   https://github.com/YOUR_USERNAME/unactivity-smm.git
   ```
4. Сохраните

## Ежедневное использование

### Через GUI приложение:
1. Создайте пинкод
2. Нажмите "🚀 Залить на GitHub"
3. Готово! Изменения автоматически загружены

### Вручную:
```bash
git add database.json
git commit -m "Add new pincode"
git push
```

## Просмотр истории

```bash
git log --oneline
```

## Откат изменений

Если нужно вернуться к предыдущей версии:

```bash
# Посмотреть историю
git log --oneline

# Откатиться к конкретному коммиту
git checkout COMMIT_HASH database.json

# Закоммитить откат
git add database.json
git commit -m "Restore database to previous version"
git push
```

## Бэкап базы данных

Рекомендуется регулярно скачивать `database.json`:

1. Зайдите на GitHub в ваш репозиторий
2. Откройте файл `database.json`
3. Нажмите "Raw"
4. Сохраните файл (Ctrl+S)

Или через командную строку:
```bash
git pull
copy database.json database.backup.json
```

## Troubleshooting

### Ошибка "fatal: not a git repository"
```bash
git init
```

### Ошибка "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/unactivity-smm.git
```

### Ошибка при пуше "Authentication failed"
- Используйте Personal Access Token вместо пароля
- Проверьте, что токен не истек

### Конфликты при пуше
```bash
git pull --rebase
git push
```

## Полезные команды

```bash
# Статус репозитория
git status

# Посмотреть изменения
git diff

# Отменить изменения в файле
git checkout -- database.json

# Посмотреть удаленные репозитории
git remote -v

# Обновить локальную копию
git pull
```
