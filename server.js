// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // <-- nuevo
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Habilitar CORS para desarrollo
app.use(cors());

// Middleware para leer JSON
app.use(express.json());

app.post('/consultar', async (req, res) => {
  const { dni } = req.body;

  if (!dni || isNaN(dni)) {
    return res.status(400).json({ error: 'DNI inválido' });
  }

  let client;
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(process.env.COLLECTION_NAME);

    const resultado = await collection.findOne({ dni: parseInt(dni, 10) });

    if (resultado) {
      res.json({
        lugar: resultado.escuela,
        mesa: resultado.mesa,
        departamento: resultado.Departamento
      });
    } else {
      res.json({ lugar: null });
    }
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    if (client) await client.close();
  }
});

app.get('/', (req, res) => {
  res.send('Backend de consulta de padrón funcionando ✅');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});