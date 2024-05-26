import { config } from 'dotenv';
config();

import express from "express";
import mariadb from 'mariadb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_DTB,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
})

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Données manquantes');
    }

    let conn;
    try {
        conn = await pool.getConnection();

        const existingUser = await conn.query("SELECT username FROM users WHERE username = ?", [username]);
        if (existingUser.length > 0) {
            return res.status(409).send('Utilisateur déjà existant');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUser = await conn.query("INSERT INTO users (username, password) VALUES (?, ?)", [req.body.username, hashedPassword]);

        jwt.sign(
            {
                userId: insertUser.insertId.toString(),
                username: username
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'Utilisateur créé avec succès'
        });
    } catch (err) {
        res.status(500).send(err);
        console.error(err);
    } finally {
        if (conn) conn.release();
    }
});

app.post('/api/login', async (req, res) => {
    let conn;
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(401).send('Données manquantes');
        }

        conn = await pool.getConnection();

        const userExist = await conn.query("SELECT * FROM users WHERE username = ?", [username]);

        if (userExist.length === 0 || !(await bcrypt.compare(password, userExist[0].password))) {
            return res.status(401).send('Le nom d\'utilisateur ou le mot de passe est incorrect');
        }

        const token = jwt.sign(
            {
                userId: userExist[0].id,
                username: userExist[0].username
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token: token, user: { id: userExist[0].id, username: userExist[0].username } });
    } catch (err) {
        console.error("Erreur lors de la connexion", err);
        res.status(500).send('Erreur de connexion');
    } finally {
        if (conn) conn.release();
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});