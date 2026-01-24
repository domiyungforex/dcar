#!/usr/bin/env node

import { createClient } from 'redis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env.local
const envContent = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const lines = envContent.split('\n');
const env = {};

lines.forEach(line => {
  if (line.includes('=')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').replace(/^"|"$/g, '');
    env[key.trim()] = value;
  }
});

const redisUrl = env.REDIS_URL || env.KV_URL;

async function recoveryData() {
  const client = createClient({ url: redisUrl });

  try {
    await client.connect();
    console.log('🔄 Recovering data from individual records...\n');

    // Get all individual submissions
    const keys = await client.keys('submission:*');
    console.log(`Found ${keys.length} individual submission records\n`);

    const inquiryMap = {};
    let carCount = 0;

    for (const key of keys) {
      try {
        const data = await client.get(key);
        if (data) {
          const submission = JSON.parse(data);
          if (submission.carId) {
            inquiryMap[key] = submission;
            carCount++;
          }
        }
      } catch (e) {
        console.log(`⚠️  Could not parse ${key}`);
      }
    }

    // Rebuild the inquiries object
    const rebuiltInquiries = {};
    Object.entries(inquiryMap).forEach(([key, data]) => {
      rebuiltInquiries[key] = data;
    });

    console.log(`✅ Found ${Object.keys(rebuiltInquiries).length} inquiries to recover`);

    if (Object.keys(rebuiltInquiries).length > 0) {
      console.log('\n📝 Sample inquiry:');
      console.log(JSON.stringify(Object.values(rebuiltInquiries)[0], null, 2).substring(0, 300));
    }

    // Save to backup
    const backup = {
      timestamp: new Date().toISOString(),
      inquiries: rebuiltInquiries,
      recoveryNote: 'Recovered from individual submission records'
    };

    fs.writeFileSync(
      path.join(__dirname, '..', 'redis-backup.json'),
      JSON.stringify(backup, null, 2)
    );

    console.log('\n✅ Backup saved to redis-backup.json');
    console.log('\nℹ️  Note: To restore cars, you need the individual car records.');
    console.log('   The main "cars" object was deleted, but individual submissions remain.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.quit();
  }
}

recoveryData();
