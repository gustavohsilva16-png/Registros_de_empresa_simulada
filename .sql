CREATE DATABASE tarefas_db;
USE tarefas_db;

CREATE TABLE IF NOT EXISTS tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    responsavel VARCHAR(100) NOT NULL,
    data_tarefa DATE NOT NULL,
    concluido TINYINT(1) DEFAULT 0 /*O TINYINT serve para guardar números inteiros bem pequenos no banco de dados*/
    /*Ele faz o papel do Booleano (Verdadeiro ou Falso)*/
);

DESC tarefas;