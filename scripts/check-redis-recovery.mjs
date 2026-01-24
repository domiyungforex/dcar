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

console.log('🔗 Connecting to Redis...\n');

const redisUrl = env.REDIS_URL || env.KV_URL;

if (!redisUrl) {
  console.error('❌ REDIS_URL not found in .env.local');
  process.exit(1);
}

async function checkAndRecoverData() {
  const client = createClient({ url: redisUrl });

  client.on('error', (err) => {
    console.error('❌ Redis Client Error', err);
    process.exit(1);
  });

  try {
    await client.connect();
    console.log('✅ Connected to Redis\n');

    // Check for data
    const carsData = await client.get('cars');
    const inquiriesData = await client.get('inquiries');
    const submissionsData = await client.get('submissions');

    console.log('📊 Data Status:');
    console.log('─'.repeat(60));
    console.log(`Cars: ${carsData ? '✅ Found' : '❌ Empty'}`);
    console.log(`Inquiries: ${inquiriesData ? '✅ Found' : '❌ Empty'}`);
    console.log(`Submissions: ${submissionsData ? '✅ Found' : '❌ Empty'}`);

    if (carsData) {
      const cars = JSON.parse(carsData);
      console.log(`\n🚗 Cars: ${Object.keys(cars).length} found`);
      console.log('\nFirst car:');
      console.log(JSON.stringify(Object.values(cars)[0], null, 2).substring(0, 300) + '...');
    } else {
      console.log('\n⚠️  No cars found - data may have been deleted');
    }

    if (inquiriesData) {
      const inquiries = JSON.parse(inquiriesData);
      console.log(`\n💬 Inquiries: ${Object.keys(inquiries).length} found`);
    }

    if (submissionsData) {
      const submissions = JSON.parse(submissionsData);
      console.log(`\n📝 Submissions: ${Object.keys(submissions).length} found`);
    }

    // Show all keys
    console.log('\n🔑 All Redis Keys:');
    console.log('─'.repeat(60));
    const keys = await client.keys('*');
    keys.forEach(key => {
      console.log(`  - ${key}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await client.quit();
  }
}

checkAndRecoverData();
