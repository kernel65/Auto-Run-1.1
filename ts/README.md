Позволяет получить доступ к текущим координатам персонажа
используя api OverWolf.
Для корректной работы нужен вайтлист: 
https://overwolf.github.io/docs/start/submit-app-proposal#legal


## Установка
1. Скачать и установить [NodeJS](https://nodejs.org/).
После установки выполните одну из следующих команд,
чтобы проверить корректность установки NodeJS:
```
node -v
npm -v
```
Если все хорошо в терминал выведется текущая версия.

2. Скачать и установить [Overwolf desktop client](https://download.overwolf.com/install/Download).

3. Скачать репозиторий в zip файле и разархивировать.

4. В терминале выполнить следующие команды:
```
cd <вставить путь где находится папка 'ts'>
npm install
npm run build
```

5. Открыть Overwolf клиент зайти в настройки (правая кнопка мыши по значку в трее, выбрать Settings).

6. Нажать на "Development options".

7. В открытом окне, нажать на "Load unpacked extension" и выбрать папку `ts/dist/` .
После появится приложение в списке.

8. В папке Документы создать папку OverwolfAutopath и создать файл position.pos


Приложение запускается автоматически при запуске New World, опять же при наличии whitelist


