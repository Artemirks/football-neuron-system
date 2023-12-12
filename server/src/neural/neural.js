const { spawn } = require('child_process');

const getPred = async (data) => {
    const process = await spawn('python', ['server/src/neural/neural.py']); // Запускаем дочерний процесс Python
    process.on('error', (err) => {
        console.error(`Failed to start neural.py: ${err}`);
    });

    let prediction = '';

    // Обработчик события data
    const onData = (chunk) => {
        prediction += chunk.toString();
    };

    process.stdout.on('data', onData);

    // Передаем данные в дочерний процесс через stdin
    process.stdin.write(JSON.stringify(data));
    process.stdin.end();

    // ожидание завершения процесса
    await new Promise((resolve) => {
        process.on('close', () => {
            process.stdout.removeListener('data', onData); // Удаляем обработчик после получения данных
            resolve();
        });
    });

    process.on('exit', (code) => {
        console.log(`neural.py exited with code ${code}`);
    });

    try {
        // Пробуем разобрать весь JSON, полученный из Python
        prediction = JSON.parse(prediction);
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
    return prediction;
};

module.exports = {
    getPred
};
