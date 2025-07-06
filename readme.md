# Шаблон для выполнения тестового задания

## Описание
Система автоматического мониторинга тарифов Wildberries с сохранением данных в базу данных PostgreSQL и автоматическим обновлением Google Sheets.
## Структура проекта
```
src/
├── services/
│   ├── schedule.service.ts    # Планировщик задач с очередью
│   ├── wb.service.ts          # Интеграция с API Wildberries
│   ├── sheets.service.ts      # Работа с Google Sheets
│   └── db.service.ts          # Операции с базой данных
├── config/
│   ├── env/env.ts            # Конфигурация окружения
│   └── knex/knexfile.ts      # Настройки базы данных
└── app.ts                    # Точка входа приложения
```

## Настройка

### 1. Переменные окружения
Создайте `.env` файл:
```env
POSTGRES_PORT=27015
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

APP_PORT=5000

# Wildberries API credentials
WB_TOKEN=your_wildberries_api_key
WB_API_URL=https://common-api.wildberries.ru/api/v1/tariffs/box

# Google API credentials
GOOGLE_CREDENTIALS=your_google_credentials_hex
GOOGLE_API_KEY=your_google_api_key
```


## Команды:


Запуск  самого приложения:
```bash
docker compose build
docker compose up 
```

## Логи
Логи приложения:
```bash
app       | Hourly task queued at: Sun, 06 Jul 2025 09:48:00 GMT
app       | Hourly task started at: Sun, 06 Jul 2025 09:48:00 GMT
app       | Hourly task completed at: Sun, 06 Jul 2025 09:48:01 GMT
app       | --------------------------
app       | Daily task queued at: Sun, 06 Jul 2025 09:50:00 GMT
app       | Daily task started at: Sun, 06 Jul 2025 09:50:00 GMT
app       | Spreadsheet ... is now public.
app       | Daily task completed at: Sun, 06 Jul 2025 09:50:04 GMT
app       | --------------------------

```