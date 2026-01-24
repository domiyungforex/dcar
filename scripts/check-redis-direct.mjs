#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Read .env.local
const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
const lines = envContent.split('\n');
const env = {};

lines.forEach(line => {
  if (line.includes('=')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').replace(/^"|"$/g, '');
    env[key.trim()] = value;
  }
});

console.log('✅ Environment loaded');
console.log('KV_URL:', env.KV_URL ? env.KV_URL.substring(0, 30) + '...' : 'NOT FOUND');

// Now check Redis using raw connection
const { createClient } = await import('redis');

async function checkData() {
  try {
    const client = createClient({
      url: env.REDIS_URL || env.KV_URL
    });

    await client.connect();
    console.log('\n✅ Connected to Redis');

    const keys = await client.keys('*');
    console.log(`\n📊 Found ${keys.length} keys in Redis`);
    
    if (keys.length > 0) {
      console.log('\n🔑 Keys:');
      for (const key of keys.slice(0, 10)) {
        const type = await client.type(key);
        console.log(`  - ${key} (${type})`);
      }
    }

    await client.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkData();
