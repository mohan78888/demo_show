const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Tour Helpdesk - Project Analysis & PRD</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {
    size: A4;
    margin: 16mm 14mm 16mm 14mm;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #1e293b;
    background: #ffffff;
    line-height: 1.55;
    font-size: 12.5px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cover-page {
    page-break-after: always;
    min-height: 92vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 36px 28px 24px 28px;
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #0284c7 100%);
    color: #ffffff;
    border-radius: 12px;
  }

  .cover-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 6px 14px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    backdrop-filter: blur(8px);
    width: fit-content;
  }

  .cover-title {
    font-size: 36px;
    font-weight: 800;
    line-height: 1.15;
    margin-top: 20px;
    letter-spacing: -0.5px;
    color: #ffffff;
  }

  .cover-subtitle {
    font-size: 15px;
    color: #cbd5e1;
    margin-top: 12px;
    max-width: 520px;
    font-weight: 400;
  }

  .cover-meta {
    background: rgba(15, 23, 42, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 18px 22px;
    border-radius: 10px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .meta-item h4 {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #94a3b8;
    margin-bottom: 4px;
  }

  .meta-item p {
    font-size: 13px;
    font-weight: 600;
    color: #f8fafc;
  }

  .section {
    margin-bottom: 24px;
  }

  .page-break {
    page-break-before: always;
  }

  h2 {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 6px;
    margin-top: 22px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  h2::before {
    content: "";
    display: inline-block;
    width: 5px;
    height: 18px;
    background: #0284c7;
    border-radius: 3px;
  }

  h3 {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    margin-top: 14px;
    margin-bottom: 6px;
  }

  p {
    margin-bottom: 10px;
    color: #334155;
    text-align: justify;
  }

  ul, ol {
    margin-left: 18px;
    margin-bottom: 12px;
    color: #334155;
  }

  li {
    margin-bottom: 4px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 16px 0;
    font-size: 11.5px;
  }

  th {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 7px 10px;
    border: 1px solid #cbd5e1;
  }

  td {
    padding: 7px 10px;
    border: 1px solid #e2e8f0;
    color: #334155;
    vertical-align: top;
  }

  tr:nth-child(even) {
    background: #f8fafc;
  }

  .card-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 12px 0;
  }

  .card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
  }

  .card-header {
    font-size: 12.5px;
    font-weight: 700;
    color: #0369a1;
    margin-bottom: 4px;
  }

  .code-block {
    background: #0f172a;
    color: #e2e8f0;
    padding: 10px 12px;
    border-radius: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    line-height: 1.45;
    margin: 10px 0;
  }

  .tag {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 9.5px;
    font-weight: 600;
    text-transform: uppercase;
    margin-right: 4px;
    margin-top: 4px;
  }

  .tag-blue { background: #e0f2fe; color: #0369a1; }
  .tag-green { background: #dcfce7; color: #15803d; }
  .tag-purple { background: #f3e8ff; color: #7e22ce; }
  .tag-amber { background: #fef3c7; color: #b45309; }

  .callout {
    background: #f0fdf4;
    border-left: 4px solid #16a34a;
    padding: 10px 14px;
    border-radius: 0 6px 6px 0;
    margin: 12px 0;
  }

  .callout-title {
    font-weight: 700;
    color: #15803d;
    margin-bottom: 3px;
    font-size: 11.5px;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover-page">
  <div>
    <span class="cover-badge">Architecture & Product Specification</span>
    <h1 class="cover-title">Tour Helpdesk / AirAgent</h1>
    <p class="cover-subtitle">Full-Stack System Analysis, Technical Architecture, and Product Requirements Document (PRD)</p>
  </div>

  <div class="cover-meta">
    <div class="meta-item">
      <h4>Document Type</h4>
      <p>PRD & Architecture</p>
    </div>
    <div class="meta-item">
      <h4>Version & Stack</h4>
      <p>Next.js 16 + Express 5 + Mongo</p>
    </div>
    <div class="meta-item">
      <h4>Status</h4>
      <p>Production Specification</p>
    </div>
  </div>
</div>

<!-- PAGE 1: EXECUTIVE SUMMARY & ARCHITECTURE -->
<div class="section">
  <h2>1. Executive Summary</h2>
  <p>
    <strong>Tour Helpdesk (AirAgent)</strong> is an enterprise-grade, modern omnichannel travel technology platform engineered to facilitate domestic and international flight search, hotel bookings, interstate bus tickets, car rentals, and curated vacation packages.
  </p>
  <p>
    The platform merges high-speed self-service booking capabilities with a conversational <strong>Google Gemini 2.5 AI Travel Concierge</strong> and an offline assisted-booking desk, backed by transactional automated email dispatch workflows.
  </p>

  <div class="callout">
    <div class="callout-title">Core Strategic Differentiator</div>
    Combines live GDS inventory (Flyshop API) with an assisted booking lead engine, allowing customers to either book directly online or connect directly with specialized travel consultants via dedicated hotlines and assisted lead triggers.
  </div>

  <h2>2. System Architecture & Tech Stack</h2>
  <p>The codebase is organized as a decoupled monorepo featuring a TypeScript-driven full-stack ecosystem:</p>

  <table>
    <thead>
      <tr>
        <th>Domain</th>
        <th>Framework / Technology</th>
        <th>Architectural Role & Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Frontend</strong></td>
        <td>Next.js 16.2.9, React 19.2.4, TailwindCSS v4</td>
        <td>Server & Client components, App Router, reactive autocomplete, dark mode state persistence, Framer Motion animations.</td>
      </tr>
      <tr>
        <td><strong>Backend API</strong></td>
        <td>Express 5.2.1, TypeScript 5.8, Node.js (ESM)</td>
        <td>Stateless REST API with esbuild bundling, async error boundaries, schema validation with Zod.</td>
      </tr>
      <tr>
        <td><strong>Database & Data</strong></td>
        <td>MongoDB & Mongoose 9.1.6</td>
        <td>Document store with strict typing for User records, Flight Booking Requests, and multi-currency conversion tables.</td>
      </tr>
      <tr>
        <td><strong>AI Services</strong></td>
        <td>Google Gemini 2.5 Flash (@google/genai)</td>
        <td>Conversational travel assistant trained on custom system instructions with bilingual (English & Hinglish) support.</td>
      </tr>
      <tr>
        <td><strong>Authentication</strong></td>
        <td>Clerk SDK, Google OAuth, JWT, BcryptJS</td>
        <td>Tri-mode auth supporting Clerk SSO, Google One-Tap, and self-hosted credential JWT auth with HTTP-only cookies.</td>
      </tr>
      <tr>
        <td><strong>Communications</strong></td>
        <td>Resend API (resend)</td>
        <td>Automated HTML email generation for booking confirmations, customer itineraries, and instant admin escalation alerts.</td>
      </tr>
      <tr>
        <td><strong>Security</strong></td>
        <td>Helmet, Rate-Limit, Mongo-Sanitize</td>
        <td>NoSQL injection defense, CSP headers, IP rate limiting, and structured logging via Pino.</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- PAGE 2: CORE MODULES & WORKFLOWS -->
<div class="page-break section">
  <h2>3. Core Functional Modules</h2>

  <div class="card-grid">
    <div class="card">
      <div class="card-header">✈️ Flight Booking & Lead Engine</div>
      <p style="font-size: 11px;">
        Features origin/destination IATA code resolution, passenger class selection (Economy, Premium, Business, First), real-time pricing, in-memory route caching, and instant booking modal with transactional email triggers.
      </p>
      <span class="tag tag-blue">Flyshop GDS</span>
      <span class="tag tag-green">Instant Lead Flow</span>
    </div>

    <div class="card">
      <div class="card-header">🏨 Hotel & Accommodation Engine</div>
      <p style="font-size: 11px;">
        Comprehensive hotel search with location autocomplete, check-in/out calendars, guest counters, star rating filters, amenity chips (WiFi, Pool, Breakfast), and detailed room breakdown modals.
      </p>
      <span class="tag tag-purple">Curated Inventory</span>
      <span class="tag tag-amber">Dynamic Filters</span>
    </div>

    <div class="card">
      <div class="card-header">🤖 Gemini 2.5 AI Travel Concierge</div>
      <p style="font-size: 11px;">
        Interactive floating assistant equipped with step-by-step guidance, rate-limit retry logic (429/500/503), intent recognition, and bilingual English/Hinglish travel suggestions.
      </p>
      <span class="tag tag-blue">Gemini 2.5</span>
      <span class="tag tag-green">Bilingual Support</span>
    </div>

    <div class="card">
      <div class="card-header">🚌 Buses, Car Rentals & Cruises</div>
      <p style="font-size: 11px;">
        Interstate bus search with seat selection visualization, vehicle rental catalog, and international cruise holiday packages with promotional badge indicators.
      </p>
      <span class="tag tag-purple">Multi-Vertical</span>
      <span class="tag tag-blue">Seasonal Offers</span>
    </div>
  </div>

  <h2>4. Data Model Specifications</h2>
  <p>Primary MongoDB collections managed through Mongoose schemas:</p>

  <div class="code-block">
// Flight Booking Request Schema (IFlightBookingRequest)
{
  requestId: { type: String, unique: true, index: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true }
  },
  flight: {
    airline: String, flightNumber: String, origin: String,
    destination: String, departureTime: String, travelDate: String,
    travelClass: String, price: Number, currency: String, stops: Number
  },
  passengers: [{
    paxType: "Adult" | "Child" | "Infant",
    title: String, firstName: String, lastName: String,
    gender: "Male" | "Female" | "Other", passportNumber: String
  }],
  status: "PENDING" | "CONTACTED" | "CONFIRMED" | "CANCELLED",
  createdAt: Date, updatedAt: Date
}
  </div>

  <h2>5. Security, Reliability & Performance Audit</h2>
  <ul>
    <li><strong>Defense-in-Depth</strong>: Express 5 pipeline includes <code>helmet</code> for secure headers, <code>express-mongo-sanitize</code> for NoSQL injection prevention, and strict origin CORS whitelisting.</li>
    <li><strong>High Reliability AI Layer</strong>: <code>aiService.ts</code> includes exponential backoff retry algorithms for Gemini API transient rate limits and server availability.</li>
    <li><strong>SEO & Crawler Optimization</strong>: Implements Next.js dynamic <code>sitemap.ts</code> and <code>robots.ts</code>, pre-rendering meta tags for OpenGraph and Twitter cards.</li>
  </ul>
</div>

<!-- PAGE 3: PRD & STRATEGIC ROADMAP -->
<div class="page-break section">
  <h2>6. Product Requirements Document (PRD) Matrix</h2>

  <table>
    <thead>
      <tr>
        <th>Req ID</th>
        <th>Module</th>
        <th>Requirement Specification</th>
        <th>Priority</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>FR-01</strong></td>
        <td>Flights</td>
        <td>IATA airport search, multi-city/roundtrip query, cabin filters.</td>
        <td><span class="tag tag-blue">P0</span></td>
        <td><span class="tag tag-green">Implemented</span></td>
      </tr>
      <tr>
        <td><strong>FR-02</strong></td>
        <td>Lead Capture</td>
        <td>Booking modal with passenger details & instant dual email dispatch.</td>
        <td><span class="tag tag-blue">P0</span></td>
        <td><span class="tag tag-green">Implemented</span></td>
      </tr>
      <tr>
        <td><strong>FR-03</strong></td>
        <td>Hotels</td>
        <td>Destination search, star rating filters, amenity selection & room modal.</td>
        <td><span class="tag tag-blue">P0</span></td>
        <td><span class="tag tag-green">Implemented</span></td>
      </tr>
      <tr>
        <td><strong>FR-04</strong></td>
        <td>AI Concierge</td>
        <td>Gemini 2.5 chat with retry mechanisms & bilingual support.</td>
        <td><span class="tag tag-purple">P1</span></td>
        <td><span class="tag tag-green">Implemented</span></td>
      </tr>
      <tr>
        <td><strong>FR-05</strong></td>
        <td>Auth System</td>
        <td>Clerk SSO + Google OAuth + Native JWT credential auth.</td>
        <td><span class="tag tag-purple">P1</span></td>
        <td><span class="tag tag-green">Implemented</span></td>
      </tr>
      <tr>
        <td><strong>FR-06</strong></td>
        <td>Payments</td>
        <td>Online payment gateway integration (Stripe / Razorpay) for instant e-ticketing.</td>
        <td><span class="tag tag-amber">P1</span></td>
        <td><span class="tag tag-purple">Roadmap</span></td>
      </tr>
      <tr>
        <td><strong>FR-07</strong></td>
        <td>User Portal</td>
        <td>Self-service dashboard to track booking statuses, download e-tickets, and cancel.</td>
        <td><span class="tag tag-amber">P2</span></td>
        <td><span class="tag tag-purple">Roadmap</span></td>
      </tr>
      <tr>
        <td><strong>FR-08</strong></td>
        <td>Admin Panel</td>
        <td>Agent console to transition booking states (PENDING to CONFIRMED) & manage inventory.</td>
        <td><span class="tag tag-amber">P2</span></td>
        <td><span class="tag tag-purple">Roadmap</span></td>
      </tr>
    </tbody>
  </table>

  <h2>7. Strategic Roadmap & Future Milestones</h2>

  <div class="card-grid">
    <div class="card">
      <div class="card-header">Phase 1: Payment Gateway Integration</div>
      <p style="font-size: 11px;">
        Integrate Stripe & Razorpay Webhooks to enable zero-touch online checkout and automated PNR ticket generation upon successful capture.
      </p>
    </div>
    <div class="card">
      <div class="card-header">Phase 2: Customer Account Portal</div>
      <p style="font-size: 11px;">
        Develop customer profile pages with historical booking records, printable PDF boarding passes, and automated flight delay notifications.
      </p>
    </div>
    <div class="card">
      <div class="card-header">Phase 3: Back-Office CRM & Admin UI</div>
      <p style="font-size: 11px;">
        Create a secure dashboard for travel agents to assign lead ownership, trigger follow-up SMS/WhatsApp messages, and track sales revenue.
      </p>
    </div>
    <div class="card">
      <div class="card-header">Phase 4: Distributed Redis Caching</div>
      <p style="font-size: 11px;">
        Migrate in-memory route cache to a managed Redis cluster to optimize multi-node scale and reduce GDS query overhead.
      </p>
    </div>
  </div>

  <div class="callout" style="margin-top: 16px;">
    <div class="callout-title">Document Verification & Sign-off</div>
    This technical and product requirements document accurately reflects the existing architecture and future expansion specifications for the Tour Helpdesk / AirAgent project.
  </div>
</div>

</body>
</html>
`;

const tempHtmlPath = path.join(__dirname, 'project_report.html');
const outputPdfPath = path.join(__dirname, 'Tour_Helpdesk_Project_Specification_PRD.pdf');

fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');
console.log('HTML written to:', tempHtmlPath);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const formattedHtmlUrl = 'file:///' + tempHtmlPath.replace(/\\/g, '/');

const args = [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf="${outputPdfPath}"`,
  `"${formattedHtmlUrl}"`
];

const fullCmd = `"${edgePath}" ${args.join(' ')}`;
console.log('Executing PDF export...');
execSync(fullCmd);

if (fs.existsSync(outputPdfPath)) {
  const stats = fs.statSync(outputPdfPath);
  console.log(`✅ PDF successfully generated: ${outputPdfPath} (${stats.size} bytes)`);
  try { fs.unlinkSync(tempHtmlPath); } catch (e) {}
} else {
  console.error('❌ PDF generation failed.');
  process.exit(1);
}
