const {
    spawn
} = require('child_process');

const getPred = async (data) => {
    const process = await spawn('python', ['server/src/neural/neural.py']); // Запускаем дочерний процесс Python
    process.on('error', (err) => {
        console.error(`Failed to start neural.py: ${err}`);
    });


    // Передаем данные в дочерний процесс через stdin
    process.stdin.write(JSON.stringify(data));
    process.stdin.end();

    let prediction;
    process.stdout.once('data', (data) => {
        prediction = JSON.parse(data.toString()); // Декодируем данные из JSON
    });


    // ожидание завершения процесса
    await new Promise((resolve) => {
        process.on('close', () => {
            resolve();
        });
    });
    process.on('exit', (code) => {
        console.log(`neural.py exited with code ${code}`);
    });

    return prediction;
};

module.exports = {
    getPred
};