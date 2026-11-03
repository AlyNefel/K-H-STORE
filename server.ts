import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import apiRouter from './server/routes.ts';
import { connectDB, isDbConnected } from './server/db.ts';
import { seedDatabase } from './server/seedData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON Body Parser with high limit for image payloads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Connect to MongoDB Atlas in background
  connectDB().then(() => {
    if (isDbConnected()) {
      seedDatabase().catch(err => console.error('Seed error:', err));
    }
  }).catch(err => {
    console.error('Initial DB connect attempt notice:', err.message);
  });

  // Mount API router
  app.use('/api', apiRouter);

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      dbConnected: isDbConnected(),
      store: 'K&H Online Store',
      timestamp: new Date().toISOString()
    });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ K&H Online Store Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
