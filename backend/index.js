const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

require('dotenv').config();


const app = express();
const port = 3000;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bem-vindo ao servidor do Facilita Jurídico!');
});

app.get('/clientes', async (req, res) => {
    try {

        const query = "SELECT c.*, l.coordenada_x, l.coordenada_y FROM clientes c LEFT JOIN localizacoes l ON c.id = l.cliente_id"
        const { rows } = await pool.query(query);
        if (rows.length === 0) {
            res.json({ message: "Nenhum cliente cadastrado" });
        }
        res.json(rows);
    } catch (error) {
        console.error('Erro ao lista clientes:', error);
        res.status(500).json({ error: 'Erro ao listar clientes' });

    }
});

app.post('/clientes', async (req, res) => {
    const { nome, email, telefone, x, y } = req.body;

    try {

        const newCliente = await pool.query('INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING id', [nome, email, telefone]);
        const clienteId = newCliente.rows[0].id;

        await pool.query('INSERT INTO localizacoes (cliente_id, coordenada_x, coordenada_y) VALUES ($1, $2, $3)', [clienteId, x, y]);
        res.status(201).send('Cliente inserido com sucesso');
    } catch (error) {
        console.error('Erro ao inserir cliente', error);
        res.status(500).json({ error: 'Erro ao inserir cliente' });

    }
});

app.post('/localizacao-cliente', async (req, res) => {
    const { cliente_id, x, y } = req.body;

    try {

        const clienteExistsQuery = 'SELECT COUNT(*) FROM clientes WHERE id = $1';

        const clienteExistsResult = await pool.query(clienteExistsQuery, [cliente_id]);
        const clienteExists = parseInt(clienteExistsResult.rows[0].count) > 0;

        if (!clienteExists) {
            return res.status(400).json({ error: 'Cliente não encontrado' });
        }

        await pool.query('INSERT INTO localizacoes (cliente_id, coordenada_x, coordenada_y) VALUES ($1, $2, $3)', [cliente_id, x, y]);
        res.status(201).send(`Localizacao do cliente ${cliente_id} inserida com sucesso`);
    } catch (error) {
        console.error('Erro ao inserir a localizacao do cliente', error);
        res.status(500).json({ error: 'Erro ao inserir cliente' });

    }
});

app.get('/clientes/filtrar', async (req, res) => {
    const { nome, email, telefone } = req.query;

    let query = 'SELECT * FROM clientes WHERE true';
    let params = [];

    if (nome) {
        query += ` AND nome ILIKE $${params.length + 1}`;
        params.push(`%${nome}%`);
    };

    if (email) {
        query += ` AND email ILIKE $${params.length + 1}`;
        params.push(`%${email}%`);
    };

    if (telefone) {
        query += ` AND telefone ILIKE $${params.length + 1}`;
        params.push(`%${telefone}%`);
    };


    try {
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Erro ao filtrar clientes:', error);
        res.status(500).json({ error: 'Erro ao filtrar clientes' });
    }
});

app.get('/rota-mais-curta', async (req, res) => {
    try {
        const { rows: localizacoes } = await pool.query('SELECT coordenada_x, coordenada_y FROM localizacoes');


        if (localizacoes.length < 1) {
            return res.status(400).json({ error: 'Não existe nenhum cliente com localização no banco de dados.' });
        }

        const empresa = { coordenada_x: 0, coordenada_y: 0 };

        function calcularDistancia(ponto1, ponto2) {

            const deltaX = ponto1.coordenada_x - ponto2.coordenada_x;
            const deltaY = ponto1.coordenada_y - ponto2.coordenada_y;
            return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
        }

        function calcularRotaMaisCurta(localizacoes) {
            const visitados = new Set();
            visitados.add(0);
            const rota = [0];
            let distanciaTotal = 0;

            while (visitados.size < localizacoes.length) {
                let menorDistancia = Infinity;
                let proximoIndice;

                for (let i = 0; i < localizacoes.length; i++) {
                    if (!visitados.has(i)) {
                        const distancia = calcularDistancia(localizacoes[rota[rota.length - 1]], localizacoes[i]);
                        if (distancia < menorDistancia) {
                            menorDistancia = distancia;
                            proximoIndice = i;
                        }
                    }
                }

                rota.push(proximoIndice);
                visitados.add(proximoIndice);
                distanciaTotal += menorDistancia;
            }

            distanciaTotal += calcularDistancia(localizacoes[rota[rota.length - 1]], empresa);
            rota.push(0);

            return { rota, distancia: distanciaTotal };
        }
        const { rota, distancia } = calcularRotaMaisCurta(localizacoes);

        const result = { rota, distancia };
        res.json(result);

    } catch (error) {
        console.error('Erro ao calcular a menor distância:', error);
        res.status(500).json({ error: 'Erro ao calcular a menor distância' });
    }
});




app.listen(port, () => {
    console.log(`Servidor em funcionamento na porta ${port}`);
})