  <h1>Инструкция по установке и запуску проекта</h1>
  <h2>Предварительные требования</h2>
  <p>Перед началом установки убедитесь, что на вашем компьютере установлены следующие компоненты:</p>
  <ul>
    <li>Node.js (версия 18.16.0 или выше)</li>
    <li>PostgreSQL (версия 15.3.0 или выше)</li>
    <li>Git</li>
  </ul>
  <h2>Шаг 1: Клонирование репозитория</h2>
  <ul>
    <li>Откройте терминал или командную строку на вашем компьютере.</li>
    <li>Введите следующую команду, чтобы клонировать репозиторий: git clone https://github.com/Artemirks/football-neuron-system.git</URL></li>
    <li>Перейдите в папку проекта: cd football-neuron-system</li>
  </ul>
  <h2>Шаг 2: Установка зависимостей</h2>
  <ul>
    <li>Введите следующую команду, чтобы установить нужные зависимости - npm install</li>
  </ul>
  <h2>Шаг 3: Установка базы данных</h2>
  <ul>
    <li>Убедитесь, что PostgreSQL запущен на вашем компьютере. Для этого выполните в терминале команду postgres --version. Если вывелось номер версии, то все работает. Если возникает ошибка, то вам необходимо открыть в настройках компьютера "Переменные среды" и в переменную PATH добавить путь к каталогу bin в установленной папке PostgreSQL.</li>
    <li>Запустите команду npm run install-db</li>
    <li>Введите ваш пароль к PostgreSQL после появления фразы Password: Password for user postgres</li>
    <li>После появления фразы created -U postgres football exited with code 0 введите еще раз ваш пароль к к PostgreSQL для клонирования скрипта БД</li>
  </ul>
  <h2>Шаг 4: Конфигурация</h2>
  <ul>
    <li>В папке проекта создайте файл .env</li>
    <li>Откройте файл .env.template и скопируйте его содержимое в .env</li>
    <li>В файле .env поменяйте your_database_password на ваш пароль к PostgreSQL</li>
    <li>Сохраните файл .env</li>
  </ul>
  <h2>Шаг 5: Запуск проекта</h2>
  <ul>
    <li>Вернитесь в корневую папку проекта, если вы находитесь не там</li>
    <li>Введите npm start, чтобы запустить проект</li>
    <li>Теперь вы можете открыть браузер и перейти по адресу http://localhost:3000 для доступа к приложению.</li>
  </ul>
