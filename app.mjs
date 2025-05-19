import http from 'http';
import fs from 'fs';
import path from 'path';
import querystring from 'querystring';

const host = 'localhost';
const porta = 3000;

const servidor = http.createServer((requisicao, resposta) => {
    if (requisicao.method === 'GET' && requisicao.url === '/') {

        const caminhoHtml = path.join(process.cwd(), 'publi', 'index.html');
        fs.readFile(caminhoHtml, (erro, conteudo) => {
            if (erro) {
                resposta.writeHead(500);
                resposta.end('Erro ao carregar.');
                return;
            }
            resposta.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            resposta.end(conteudo);
        });
    } else if (requisicao.method === 'POST' && requisicao.url === '/cadastrar-livro') {
        let corpo = '';
        requisicao.on('data', chunk => {
            corpo += chunk.toString();
        });
        requisicao.on('end', () => {
            const dados = querystring.parse(corpo);
            resposta.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

            resposta.write('<html><head><meta charset="UTF-8"><title>Cadastrado</title>');
            resposta.write('<style> body {font-family: sans-serif; margin: 20px;} .c {padding:15px; background-color:#f0f0f0; border:1px solid #ccc; border-radius:5px; max-width:400px; margin:auto;} a{text-decoration:none; color:blue;} </style>');
            resposta.write('</head><body>');
            resposta.write('<div class="c">');
            resposta.write('<h1>Cadastrado!</h1>');
            resposta.write('<p><strong>Titulo:</strong> ' + (dados.titulo || '') + '</p>');
            resposta.write('<p><strong>Autor:</strong> ' + (dados.autor || '') + '</p>');
            resposta.write('<p><strong>Ano:</strong> ' + (dados.ano || '') + '</p>');
            resposta.write('<p><strong>Resenha:</strong> ' + (dados.resenha || '') + '</p>');
            resposta.write('<p><a href="/">Novo Cadastro</a></p>'); 
            resposta.write('</div>');
            resposta.write('</body></html>');
            resposta.end();
        });
    } else {
        resposta.writeHead(404);
        resposta.end('Nao encontrado.');
    }
});

servidor.listen(porta, host, () => {
    console.log('Servidor em http://' + host + ':' + porta);
});