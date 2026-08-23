/**
 * Automated 100 Concurrent Users Stress & Load Tester
 * Run: node load_tester.js
 */

const TOTAL_USERS = 100;
const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:5000';

async function stressTestEndpoint(name, url, options = {}) {
  console.log(`\n========================================`);
  console.log(`🚀 TESTING: ${name} with ${TOTAL_USERS} Concurrent Fake Users`);
  console.log(`📍 URL: ${url}`);
  console.log(`========================================`);

  const startTime = Date.now();
  let success = 0;
  let failed = 0;
  let responseTimes = [];

  const requests = Array.from({ length: TOTAL_USERS }, async (_, i) => {
    const reqStart = Date.now();
    try {
      const res = await fetch(url, options);
      const duration = Date.now() - reqStart;
      responseTimes.push(duration);

      if (res.ok) {
        success++;
      } else {
        failed++;
      }
      return { user: i + 1, status: res.status, time: duration };
    } catch (err) {
      failed++;
      return { user: i + 1, error: err.message };
    }
  });

  await Promise.all(requests);

  const totalTimeSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
  const avgTime = responseTimes.length > 0 
    ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(0)
    : 0;
  const minTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
  const maxTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;
  const rps = (TOTAL_USERS / Number(totalTimeSeconds)).toFixed(1);

  console.log(`\n📊 RESULTS FOR ${name}:`);
  console.log(`  ⏱️  Total Duration:     ${totalTimeSeconds}s`);
  console.log(`  ⚡  Requests Per Sec:    ${rps} req/sec`);
  console.log(`  📈  Average Latency:     ${avgTime}ms (Min: ${minTime}ms, Max: ${maxTime}ms)`);
  console.log(`  ✅  Successful (200 OK): ${success}/${TOTAL_USERS} (${((success/TOTAL_USERS)*100).toFixed(0)}%)`);
  console.log(`  ❌  Failed / Crashed:    ${failed}/${TOTAL_USERS}`);

  if (failed === 0) {
    console.log(`  🎉 RESULT: EXCELLENT! No crashes under 100 concurrent users.`);
  } else if (success > 80) {
    console.log(`  ⚠️ RESULT: GOOD, but some requests were throttled or dropped.`);
  } else {
    console.log(`  🚨 RESULT: HIGH STRESS! Server struggling or rate-limiting requests.`);
  }
}

async function main() {
  console.log(`\n🔥 --- STARTING 100 FAKE USER SIMULATION --- 🔥`);

  // 1. Test Backend Health & Database Connection Pool
  await stressTestEndpoint('1. Backend Server & DB', `${BACKEND_URL}/health`);

  // 2. Test Frontend Next.js SSR / Pages
  await stressTestEndpoint('2. Frontend Web Server', `${FRONTEND_URL}`);

  // 3. Test Live Flight Search Endpoint
  await stressTestEndpoint(
    '3. Flight Search API (Post)',
    `${BACKEND_URL}/api/flights/search`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'DEL',
        to: 'BOM',
        date: '2026-09-15',
        passengers: 1,
        travelClass: 'Economy'
      })
    }
  );

  console.log(`\n🏁 --- ALL LOAD TESTS FINISHED --- 🏁\n`);
}

main().catch(console.error);
