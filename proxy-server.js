const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/images/*splat', async (req, res) => {
  try {
    const imagePath = req.params.splat.join('/');

    const response = await axios({
      url: `https://food-delivery.umain.io/images/${imagePath}`,
      responseType: 'stream',
    });

    res.set('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch {
    res.sendStatus(404);
  }
});

app.get('/api/restaurants', async (req, res) => {
  try {
    console.log('Proxying: GET /restaurants');
    const response = await axios.get('https://food-delivery.umain.io/api/v1/restaurants', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/open/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Proxying: GET /open/${id}`);
    const response = await axios.get(`https://food-delivery.umain.io/api/v1/open/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.all('/api/*splat', async (req, res) => {
  try {
    const apiPath = req.params.splat.join('/');
    const apiUrl = `https://food-delivery.umain.io/api/v1/${apiPath}`;

    const response = await axios({
      method: req.method,
      url: apiUrl,
      params: req.query,
      data: req.body,
      responseType: 'stream', 
    });

    res.status(response.status);

    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    response.data.pipe(res);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
  console.log('Forwarding to: https://food-delivery.umain.io/api/v1');
});