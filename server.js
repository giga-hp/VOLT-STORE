const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'products.json');

const app = express();
app.use(cors());
app.use(express.json());

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Failed to write data', e);
    return false;
  }
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/products', (req, res) => {
  const items = readData();
  res.json(items);
});

app.post('/products', (req, res) => {
  const items = readData();
  const p = req.body;
  if (!p || !p.name || !p.price) {
    return res.status(400).json({ error: 'Missing name or price' });
  }
  const id = `p${Date.now()}`;
  const product = {
    id,
    name: p.name,
    category: p.category || 'Geral',
    description: p.description || '',
    price: Number(p.price) || 0,
    image: p.image || '',
    status: p.status || 'active'
  };
  items.unshift(product);
  if (!writeData(items)) return res.status(500).json({ error: 'Failed to save' });
  res.status(201).json(product);
});

app.put('/products/:id', (req, res) => {
  const items = readData();
  const id = req.params.id;
  const idx = items.findIndex((it) => it.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const p = req.body;
  items[idx] = Object.assign(items[idx], {
    name: p.name ?? items[idx].name,
    category: p.category ?? items[idx].category,
    description: p.description ?? items[idx].description,
    price: p.price !== undefined ? Number(p.price) : items[idx].price,
    image: p.image ?? items[idx].image,
    status: p.status ?? items[idx].status,
  });
  if (!writeData(items)) return res.status(500).json({ error: 'Failed to save' });
  res.json(items[idx]);
});

app.delete('/products/:id', (req, res) => {
  let items = readData();
  const id = req.params.id;
  const exists = items.some((it) => it.id === id);
  if (!exists) return res.status(404).json({ error: 'Not found' });
  items = items.filter((it) => it.id !== id);
  if (!writeData(items)) return res.status(500).json({ error: 'Failed to save' });
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Volt store API listening on http://localhost:${PORT}`);
});
