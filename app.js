//  Служебная переменная - определяет режим работы программы. Текущий режим "тестирование"
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV: 'test';
//  Библиотеки для запуска и обощения тестов
var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');

const config = require('./config/config');
const glob = require('glob');
const mongoose = require('mongoose');

mongoose.connect(config.db);
const db = mongoose.connection;
db.on('error', () => {
    throw new Error('unable to connect to database at ' + config.db);
});

const models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
    require(model);
});
    
// Instantiate a Mocha instance.
var mocha = new Mocha();
var testDir = 'tests'

// Add each .js file to the mocha instance
fs.readdirSync(testDir).filter(function (file) {
    // Only keep the .js files
    return file.substr(-8) === '.test.js';
})


.forEach(function (file) {
    mocha.addFile(
        path.join(testDir, file)
    );
});
//  C:\ProgramData\....\tests\system.test.js - абсолютный путь (от корня логичесого диска (C) до файла)
//  .\tests\system.test.js    ||   tests\system.test.js - относительный путь. (определяется относительно чего либо (в данном случае от программы, которая оперирует этими файлами))
// Run the tests.
mocha
    // .timeout(99999)
    .run(function (failures) {
        process.exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
        return 0;
    });