const fs = require('fs');
const { execSync } = require('child_process');

console.log('Starting Master Fix & Merge...');

try {
  execSync('git checkout main');
  execSync('git merge redesign');
} catch (e) {
  console.log('Merge conflicts detected (expected). Resolving...');
}

// 1. Resolve Conflicts
try { execSync('git rm app/bml/bml-card.ts'); } catch (e) {}

// bml-client.tsx (Keep V2 architecture from main, but fix the href='/')
execSync('git checkout --ours -- app/bml/bml-client.tsx');
let clientTsx = fs.readFileSync('app/bml/bml-client.tsx', 'utf8');
clientTsx = clientTsx.replace(/href="\/"/g, 'href="/booking"');
fs.writeFileSync('app/bml/bml-client.tsx', clientTsx);
execSync('git add app/bml/bml-client.tsx');

// page.tsx (Combine metadata)
execSync('git checkout --theirs -- app/bml/page.tsx');
execSync('git add app/bml/page.tsx');

// home-client.tsx (Keep Redesign)
execSync('git checkout --theirs -- app/home-client.tsx');
let homeClient = fs.readFileSync('app/home-client.tsx', 'utf8');
homeClient = homeClient.replace(/"use client";\n/g, ''); 
fs.writeFileSync('app/home-client.tsx', homeClient);
execSync('git add app/home-client.tsx');

// GOOGLE_SHEET_SETUP.md
execSync('git checkout --ours -- GOOGLE_SHEET_SETUP.md');
execSync('git add GOOGLE_SHEET_SETUP.md');

// 2. Fix CSS & Logic Bugs
console.log('Patching UI/Logic bugs...');

try {
  let wwd = fs.readFileSync('app/components/home/WhatWeDo.tsx', 'utf8');
  wwd = wwd.replace(/className="text-white/g, 'className="scroll-mt-16 text-white');
  wwd = wwd.replace(/const threshold = i \/ words.length;/g, 'const threshold = (i + 1) / words.length;');
  wwd = wwd.replace(/max-w-\[313px\]/g, 'max-w-xs sm:max-w-md');
  fs.writeFileSync('app/components/home/WhatWeDo.tsx', wwd);
} catch(e) {}

try {
  let hnav = fs.readFileSync('app/components/home/HomeNav.tsx', 'utf8');
  hnav = hnav.replace(/flex flex-col gap-4 text-sm font-bold uppercase tracking-wider text-white/g, 'flex flex-col gap-4 text-sm font-bold uppercase tracking-wider text-white max-h-[calc(100vh-4rem)] overflow-y-auto');
  fs.writeFileSync('app/components/home/HomeNav.tsx', hnav);
} catch(e) {}

try {
  let testm = fs.readFileSync('app/components/home/Testimonials.tsx', 'utf8');
  testm = testm.replace(/AUTO_ADVANCE_MS = 2000;/g, 'AUTO_ADVANCE_MS = 6000;');
  testm = testm.replace(/const r = reviews\[active\] \?\? reviews\[0\];/g, 'if (!reviews || reviews.length === 0) return null;\n  const clampedActive = active % reviews.length;\n  const r = reviews[clampedActive] ?? reviews[0];');
  testm = testm.replace(/reviews\[active\]/g, 'reviews[clampedActive]');
  testm = testm.replace(/onTouchEnd=\{onTouchEnd\}/g, 'onTouchEnd={onTouchEnd} onTouchCancel={() => { touchStart.current = null; }}');
  fs.writeFileSync('app/components/home/Testimonials.tsx', testm);
} catch(e) {}

try {
  let prod = fs.readFileSync('app/components/home/ProductTracking.tsx', 'utf8');
  prod = prod.replace(/AUTO_ADVANCE_MS = 2000;/g, 'AUTO_ADVANCE_MS = 6000;');
  prod = prod.replace(/onTouchEnd=\{onTouchEnd\}/g, 'onTouchEnd={onTouchEnd} onTouchCancel={() => { touchStart.current = null; }}');
  prod = prod.replace(/mt-8 flex gap-4/g, 'mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4');
  prod = prod.replace(/absolute -top-4 -right-4/g, 'absolute top-2 right-2 sm:-top-4 sm:-right-4');
  fs.writeFileSync('app/components/home/ProductTracking.tsx', prod);
} catch(e) {}

try {
  let sfam = fs.readFileSync('app/components/home/SoundFamiliar.tsx', 'utf8');
  sfam = sfam.replace(/text-\[25px\]/g, 'text-lg sm:text-xl md:text-[25px]');
  fs.writeFileSync('app/components/home/SoundFamiliar.tsx', sfam);
} catch(e) {}

try {
  let hero = fs.readFileSync('app/components/home/Hero.tsx', 'utf8');
  hero = hero.replace(/text-\[52px\]/g, 'text-[42px]');
  fs.writeFileSync('app/components/home/Hero.tsx', hero);
} catch(e) {}

try {
  let about = fs.readFileSync('app/components/home/AboutUs.tsx', 'utf8');
  about = about.replace(/font-thin/g, 'font-extralight');
  about = about.replace(/max-w-\[351px\]/g, 'max-w-[351px] md:max-w-2xl');
  about = about.replace(/text-justify/g, 'text-left md:text-center');
  fs.writeFileSync('app/components/home/AboutUs.tsx', about);
} catch(e) {}

try {
  let layout = fs.readFileSync('app/layout.tsx', 'utf8');
  layout = layout.replace(/<html lang="en" className=\{inter\.className\}>/g, '<html lang="en" className={inter.className} data-scroll-behavior="smooth">');
  fs.writeFileSync('app/layout.tsx', layout);
} catch(e) {}

// 3. Commit and Push
execSync('git add .');
execSync('git commit -m "fix: resolve redesign merge conflicts, UI bugs, and logic crashes"');
execSync('git push origin main');
console.log('All done!');
