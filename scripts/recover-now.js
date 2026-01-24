const https = require('https');
const fs = require('fs');
const path = require('path');

// Load env from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

let KV_REST_API_URL = '';
let KV_REST_API_TOKEN = '';

envContent.split('\n').forEach(line => {
  if (line.includes('KV_REST_API_URL')) {
    KV_REST_API_URL = line.split('=')[1].replace(/"/g, '').trim();
  }
  if (line.includes('KV_REST_API_TOKEN=') && !line.includes('READ_ONLY')) {
    KV_REST_API_TOKEN = line.split('=')[1].replace(/"/g, '').trim();
  }
});

if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
  console.error('❌ Could not load Redis credentials');
  process.exit(1);
}

const sampleCars = {
  "car-001": {
    id: "car-001",
    title: "2023 Toyota Camry - Premium Edition",
    price: 5500000,
    brand: "Toyota",
    year: 2023,
    mileage: 45000,
    condition: "excellent",
    descriptioconst https = require('https');
const fs = require('fs');
const path = require('pfeconst fs = require('fs');
cons/iconst path = require('pa-1
// Load env from .env.local800const envPath = path.join(",const envContent = fs.readFileSync(envPath, }
};

const po
let KV_REST_API_URL = '';
let KV_REST_API_TOKEN = ue:let KV_REST_API_TOKEN = rs
envContent.split('\n').fo(KV  if (line.includes('KV_REST_API_URL'))tname: url.hostname,
  path: '/set',
  metho  }
  if (line.includes('KV_REST_API_TOKEN=') && !line.includes('    Au    KV_REST_API_TOKEN = line.split('=')[1].replace(/"/g, '').trim();
  }
}es  }
});

if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
  console.erta += 
iunk  console.error('❌ Could not load Redis cr? process.exit(1);
}

const sampleCars = {
  "car-001": }}

const sampleCarror'  "car-001": {
    e.    id: "car-ro    title: "202;
      price: 5500000,
    brand: "Toyota",
    y.end  ;
