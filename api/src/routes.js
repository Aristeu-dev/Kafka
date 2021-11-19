import express from 'express';
import { CompressionTypes } from 'kafkajs';

const routes = express.Router();

routes.post('/users', async (req, res) => {
  const message = {
    user: { id: 1, name: 'Aristeu' },
  };

  await req.producer.send({
    topic: 'issue-user',
    compression: CompressionTypes.GZIP,
    messages: [
      { value: JSON.stringify(message) },
    ],
  })

  return res.json({ message: message });
});

export default routes;