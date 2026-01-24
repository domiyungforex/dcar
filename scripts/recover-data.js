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

async function recoverDeletedData() {
  const client = createClient({ url: redisUrl });

  try {
    await client.connect();
    console.log('🔄 Recovering deleted cars and inquiries data...\n');

    // Get all keys
    const allKeys = await client.keys('*');
    console.log(`📊 Total Redis keys: ${allKeys.length}`);

    // Extract submission records
    const submissionKeys = allKeys.filter(k => k.startsWith('submission:'));
    console.log(`📝 Found ${submissionKeys.length} individual submissions\n`);

    const reconstructedInquiries = {};
    const carMap = {};

    // Process each submission
    for (const key of submissionKeys) {
      try {
        const data = await client.get(key);
        if (data) {
          const submission = JSON.parse(data);
          reconstructedInquiries[key] = submission;
          
          if (submission.carId) {
            if (!carMap[submission.carId]) {
              carMap[submission.carId] = {
                id: submission.carId,
                title: submission.carTitle || `Car ${submission.carId}`,
                inquiries: []
              };
            }
            carMap[submission.carId].inquiries.push(submission);
          }
        }
      } catch (e) {
        console.error(`❌ Error parsing ${key}:`, e.message);
      }
    }

    console.log(`✅ Reconstructed ${Object.keys(reconstructedInquiries).length} inquiries`);
    console.log(`📌 References to ${Object.keys(carMap).length} unique cars\n`);

    // Show sample
    if (Object.keys(reconstructedInquiries).length > 0) {
      console.log('📋 Sample Inquiry:');
      console.log(JSON.stringify(Object.values(reconstructedInquiries)[0], null, 2));
    }

    // Restore inquiries
    console.log('\n💾 Restoring inquiries to Redis...');
    await client.set('inquiries', JSON.stringify(reconstructedInquiries), { EX: 86400 * 365 });
    console.log('✅ Inquiries restored!');

    // Get existing cars
    const existingCarsData = await client.get('cars');
    const existingCars = existingCarsData ? JSON.parse(existingCarsData) : {};

    // Rebuild cars from inquiry references
    const rebuiltCars = { ...existingCars };
    Object.entries(carMap).forEach(([carId, carInfo]) => {
      if (!rebuiltCars[carId]) {
        rebuiltCars[carId] = {
          id: carId,
          title: carInfo.title,
          brand: 'Unknown',
          year: 2022,
          mileage: 0,
          price: 0,
          condition: 'good',
          images: [],
          description: `Recovered from ${carInfo.inquiries.length} customer inquiries`,
          createdAt: new Date().toISOString(),
          status: 'available'
        };
      }
    });

    // Save rebuilt cars
    await client.set('cars', JSON.stringify(rebuiltCars), { EX: 86400 * 365 });
    console.log(`\n✅ Cars restored! (${Object.keys(rebuiltCars).length} total)`);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ RECOVERY COMPLETE');
    console.log('='.repeat(60));
    console.log('\n📊 Restored Summary:');
    console.log(`  • Inquiries: ${Object.keys(reconstructedInquiries).length}`);
    console.log(`  • Cars: ${Object.keys(rebuiltCars).length}`);
    console.log(`  • Backup: redis-backup.json`);

    // Save backup
    fs.writeFileSync(
      path.join(__dirname, '..', 'redis-backup.json'),
      JSON.stringify({
        timestamp: new Date().toISOString(),
        cars: rebuiltCars,
        inquiries: reconstructedInquiries,
        recovered: true
      }, null, 2)
    );

    console.log('\n✅ All data recovered and saved!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.quit();
  }
}

recoverDeletedData();
