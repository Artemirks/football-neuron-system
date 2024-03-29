  <h1>Инструкция по установке и запуску проекта "Система по прогнозированию результатов футбольных матчей"</h1>
  <h2>Описание системы</h2>
  <p>Эта система поможет футбольным болельщикам получить предварительные прогнозы результатов футбольных матчей, основанные на предсказании количества забитых мячей. Используя методы машинного обучения и нейронных сетей, она способна проводить сложный анализ данных, выявлять тенденции и предсказывать вероятности определенных результатов. Однако следует учесть, что футбольные матчи подвержены влиянию множества случайных факторов, таких как состояние игроков, погодные условия и психологический настрой команды, что делает их результаты непредсказуемыми.</p>
  <p>Несмотря на это, система предоставляет ценную информацию для принятия более обоснованных решений в мире футбола. Она объединяет методы анализа данных и машинного обучения, помогая болельщикам лучше понимать игру и ее потенциальные результаты.</p>
  <h2>Предварительные требования</h2>
  <p>Перед началом установки убедитесь, что на вашем компьютере установлены следующие компоненты:</p>
  <ul>
    <li>Node.js (версия 18.16.0 или выше)</li>
    <li>PostgreSQL (версия 15.3.0 или выше)</li>
    <li>Git</li>
    <li>Python (версия 3.7.0 или выше)</li>
  </ul>
  <h2>Шаг 1: Клонирование репозитория</h2>
  <ul>
    <li>Создайте новую папку</li>
    <li>Откройте терминал или командную строку на вашем компьютере.</li>
    <li>Перейдите в созданную папку: cd путь_к_папке</li>
    <li>Введите следующую команду, чтобы клонировать репозиторий: git clone https://github.com/Artemirks/football-neuron-system.git</URL></li>
    <li>Перейдите в папку проекта: cd football-neuron-system</li>
  </ul>
  <h2>Шаг 2: Установка зависимостей</h2>
  <ul>
    <li>Введите следующую команду, чтобы установить нужные зависимости - npm install</li>
  </ul>
  <h2>Шаг 3: Установка numpy</h2>
  <ul>
    <li>Проверьте, установлен ли на вашем компьютере numpy. Для этого откройте командную строку от имени администратора и введите команду pip3 list. Если в списке вы видите numpy, то можете перейти к следующему шагу</li>
    <li>Если numpy нет в вашей системе, то введите команду pip install numpy</li>
  </ul>
  <h2>Шаг 4: Установка базы данных</h2>
  <ul>
    <li>Убедитесь, что PostgreSQL запущен на вашем компьютере. Для этого выполните в терминале команду postgres --version. Если вывелось номер версии, то все работает. Если возникает ошибка, то вам необходимо открыть в настройках компьютера "Переменные среды" и в переменную PATH добавить путь к каталогу bin в установленной папке PostgreSQL.</li>
    <li>Запустите команду npm run install-db</li>
    <li>Введите ваш пароль к PostgreSQL после появления фразы Password: Password for user postgres</li>
    <li>После появления фразы created -U postgres football exited with code 0 введите еще раз ваш пароль к к PostgreSQL для клонирования скрипта БД</li>
    <li>Если у вас возникли проблемы с клонированием БД. То вы можете запустить команду клонирования отдельно, после создания таблицы football. Команда на создание таблицы - createdb -U postgres football. Команда на клонирование - psql -U postgres -d football -f backup.sql. Пароли - ваш пароль к PostgreSQL.</li>
  </ul>
  <h2>Шаг 5: Конфигурация</h2>
  <ul>
    <li>В папке проекта создайте файл .env</li>
    <li>Откройте файл .env.template и скопируйте его содержимое в .env</li>
    <li>В файле .env поменяйте your_database_password на ваш пароль к PostgreSQL</li>
    <li>Сохраните файл .env</li>
  </ul>
  <h2>Шаг 6: Запуск проекта</h2>
  <ul>
    <li>Вернитесь в корневую папку проекта, если вы находитесь не там</li>
    <li>Введите npm start, чтобы запустить проект</li>
    <li>Теперь вы можете открыть браузер и перейти по адресу http://localhost:3000 для доступа к приложению.</li>
  </ul>
<h2>Результат обучения. Нейронная сеть</h2>
![alt text](src/assets/test_result.jpg)
![alt text](src/assets/system_result.jpg)
