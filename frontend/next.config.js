const path = require('path');
const dotenv = require('dotenv');

// Load envs: root shared first, then frontend-specific (frontend overrides root)
dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, './.env.local') });
dotenv.config({ path: path.join(__dirname, './.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig;
