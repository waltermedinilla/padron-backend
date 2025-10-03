// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
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

    const db = client.db(process.env.DB_NAME); // debe ser "usuarios"
    const collection = db.collection(process.env.COLLECTION_NAME); // debe ser "padron2"

    const resultado = await collection.findOne({ dni: parseInt(dni, 10) });

    if (resultado) {
      res.json({
        nombre: resultado.nombre,
        lugar: resultado.escuela,
        mesa: resultado.mesa,
        departamento: resultado.Departamento // ← ¡D mayúscula!
      });
    } else {
      res.json({ lugar: null });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error interno' });
  } finally {
    if (client) await client.close();
  }
});

app.get('/', (req, res) => {
  res.send('Backend funcionando ✅');
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});