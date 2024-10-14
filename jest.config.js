const dotenv = require('dotenv');
dotenv.config({
  path: '.env.development',
})

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: '.',
});
const jestConfig = createJestConfig({
  moduleDirectories: ['node_modules', '<rootDir>'],
});

module.exports = jestConfig;

/*
  Desafios:
  1. Provar atraves do código que o processo do jest está no ambiente de testes.
  2. Carregar as configurações de test.

*/