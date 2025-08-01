#!/bin/bash

# Скрипт для запуска Frontend.School в Docker

echo "🚀 Запуск Frontend.School в Docker..."

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker Desktop."
    exit 1
fi

# Проверка статуса Docker
if ! docker info &> /dev/null; then
    echo "❌ Docker не запущен. Запустите Docker Desktop."
    exit 1
fi

# Остановка существующих контейнеров
echo "🛑 Остановка существующих контейнеров..."
docker-compose down

# Сборка и запуск
echo "🔨 Сборка и запуск контейнеров..."
docker-compose up -d --build

# Проверка статуса
echo "⏳ Ожидание запуска..."
sleep 5

# Проверка доступности
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Приложение успешно запущено!"
    echo "🌐 Откройте браузер и перейдите по адресу: http://localhost:8080"
else
    echo "❌ Ошибка запуска приложения"
    echo "📋 Логи контейнера:"
    docker-compose logs
    exit 1
fi 