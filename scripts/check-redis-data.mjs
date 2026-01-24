#!/usr/bin/env node

import { kv } from '@vercel/kv';

async function checkRedisData() {
  console.log('🔍 Checking Redis data...\n');

  try {
    // Get all keys
    const cars = await kv.get('cars');
    const inquiries = await kv.get('inquiries');
    const submissions = await kv.get('submissions');
    const products = await kv.get('products');

    console.log('📊 Redis Data Status:');
    console.log('─'.repeat(50));
    console.log(`Cars: ${cars ? Object.keys(cars).length + ' cars found' : '❌ Empty'}`);
    console.log(`Inquiries: ${inquiries ? Object.keys(inquiries).length + ' inquiries found' : '❌ Empty'}`);
    console.log(`Submissions: ${submissions ? Object.keys(submissions).length + ' submissions found' : '❌ Empty'}`);
    console.log(`Products: ${products ? Object.keys(products).length + ' products found' : '❌ Empty'}`);

    if (cars) {
      console.log('\n🚗 Cars Data:');
      console.log(JSON.stringify(cars, null, 2).substring(0, 500) + '...');
    }

  } catch (error) {
    console.error('❌ Error checking Redis:', error.message);
  }
}

checkRedisData();
