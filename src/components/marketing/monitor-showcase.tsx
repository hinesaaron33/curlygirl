"use client";
import { useState, useEffect } from "react";

// Drop-in animated product showcase for the hero monitor.
// Renders 6 crisp, resolution-independent SVG frames and cycles them.
// No external deps. Place inside your monitor's screen area.
//
// `holds` = how long each slide stays, in ms (by index). The last value
// is reused for any slides past the end of the array.
//   <MonitorShowcase />                       // intro 5.5s, then 4s each
//   <MonitorShowcase holds={[6000, 4500]} /> // intro 6s, then 4.5s each
//   <MonitorShowcase showDots={false} />

const FRAMES = [
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800"><rect width="1280" height="800" fill="#FBF7F2"/><circle cx="70" cy="120" r="120" fill="#EC6F9C" fill-opacity="0.10"/><circle cx="1200" cy="90" r="140" fill="#A7D3E0" fill-opacity="0.22"/><circle cx="1170" cy="760" r="130" fill="#F4D58C" fill-opacity="0.20"/><circle cx="120" cy="730" r="110" fill="#F7D6E0" fill-opacity="0.30"/><circle cx="1040" cy="240" r="9" fill="#EC6F9C" fill-opacity="0.5"/><circle cx="250" cy="300" r="7" fill="#3E8FA8" fill-opacity="0.5"/><circle cx="980" cy="560" r="8" fill="#B8841E" fill-opacity="0.45"/><g class="ai" style="--d:0.02s"><rect x="538" y="150" rx="12" ry="12" width="44" height="44" fill="#EC6F9C"/><text x="560" y="180" font-family="Poppins" font-weight="800" font-size="20" fill="#FFFFFF" text-anchor="middle">CG</text><text x="594" y="181" font-family="Poppins" font-weight="700" font-size="22" fill="#21384A">Curly Girl ELD</text></g><g class="ai" style="--d:0.10s"><text x="640.0" y="248" font-family="Poppins" font-weight="700" font-size="14" letter-spacing="3" fill="#EC6F9C" text-anchor="middle">THE ELD MEMBERSHIP</text></g><g class="wpop" style="--d:0.18s"><text x="368.7" y="348" font-family="Poppins" font-weight="700" font-size="62" fill="#21384A">One</text></g><g class="wpop" style="--d:0.28s"><text x="510.6" y="348" font-family="Poppins" font-weight="700" font-size="62" fill="#21384A">monthly</text></g><g class="wpop" style="--d:0.38s"><text x="795.1" y="348" font-family="Poppins" font-weight="700" font-size="62" fill="#EC6F9C">fee.</text></g><g class="wpop" style="--d:0.52s"><text x="258.5" y="420" font-family="Poppins" font-weight="700" font-size="46" fill="#21384A">Lesson</text></g><g class="wpop" style="--d:0.60s"><text x="430.2" y="420" font-family="Poppins" font-weight="700" font-size="46" fill="#21384A">plans,</text></g><g class="wpop" style="--d:0.68s"><text x="585.9" y="420" font-family="Poppins" font-weight="700" font-size="46" fill="#EC6F9C">scheduled</text></g><g class="wpop" style="--d:0.74s"><text x="843.8" y="420" font-family="Poppins" font-weight="700" font-size="46" fill="#EC6F9C">for</text></g><g class="wpop" style="--d:0.80s"><text x="919.1" y="420" font-family="Poppins" font-weight="700" font-size="46" fill="#EC6F9C">you.</text></g><g class="ai" style="--d:0.95s"><text x="640.0" y="476" font-family="Poppins" font-weight="500" font-size="20" fill="#6B7A85" text-anchor="middle">Standards-aligned ELD lessons, delivered fresh every month and mapped out</text><text x="640.0" y="504" font-family="Poppins" font-weight="500" font-size="20" fill="#6B7A85" text-anchor="middle">day by day, so you stop planning from scratch and start teaching.</text></g><g class="ai" style="--d:1.05s"><rect x="355.9625" y="556" rx="15.0" ry="15.0" width="175" height="30" fill="#FCEAF1"/><text x="444" y="575.9" font-family="Poppins" font-weight="600" font-size="13.5" fill="#EC6F9C" text-anchor="middle">New lessons monthly</text></g><g class="ai" style="--d:1.12s"><rect x="545.0375" y="556" rx="15.0" ry="15.0" width="190" height="30" fill="#E7F2F6"/><text x="640" y="575.9" font-family="Poppins" font-weight="600" font-size="13.5" fill="#3E8FA8" text-anchor="middle">Full scope &amp; sequence</text></g><g class="ai" style="--d:1.19s"><rect x="748.9625000000001" y="556" rx="15.0" ry="15.0" width="175" height="30" fill="#FBF1D9"/><text x="837" y="575.9" font-family="Poppins" font-weight="600" font-size="13.5" fill="#B8841E" text-anchor="middle">Credits that add up</text></g><g class="ai pulse" style="--d:1.30s"><text x="640.0" y="648" font-family="Poppins" font-weight="600" font-size="14" fill="#6B7A85" text-anchor="middle">Here’s how the membership works</text><path d="M 631.0 666 L 640.0 675 L 649.0 666" fill="none" stroke="#EC6F9C" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`,
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800"><rect width="1280" height="800" fill="#FBF7F2"/>
  <rect x="0" y="0" width="78" height="800" fill="#FFFFFF"/>
  <line x1="78" y1="0" x2="78" y2="800" stroke="#ECE6DE" stroke-width="1.5"/>
  <rect x="23" y="26" rx="12" ry="12" width="32" height="32" fill="#EC6F9C"/>
  <text x="39" y="48" font-family="Poppins" font-weight="800" font-size="15" fill="#FFFFFF" text-anchor="middle">CG</text>
  <rect x="19" y="120" rx="12" ry="12" width="40" height="40" fill="#FCEAF1"/>
  <rect x="29" y="132" width="20" height="16" rx="2" fill="#EC6F9C"/>
  <circle cx="39" cy="210" r="6" fill="#6B7A85"/><rect x="31" y="224" width="16" height="3" rx="1.5" fill="#6B7A85"/>
  <rect x="31" y="280" width="16" height="14" rx="2" fill="none" stroke="#6B7A85" stroke-width="3"/>
  <circle cx="39" cy="352" r="9" fill="none" stroke="#6B7A85" stroke-width="3"/><line x1="46" y1="359" x2="52" y2="365" stroke="#6B7A85" stroke-width="3" stroke-linecap="round"/>
  <text x="106" y="52" font-family="Poppins" font-weight="700" font-size="20" fill="#21384A">Curly Girl ELD</text>
  <text x="106" y="72" font-family="Poppins" font-weight="500" font-size="12.5" letter-spacing="1" fill="#6B7A85">MEMBERSHIP LIBRARY</text>
  <text x="560" y="56" font-family="Poppins" font-weight="700" font-size="14" fill="#21384A">Library</text><text x="660" y="56" font-family="Poppins" font-weight="600" font-size="14" fill="#6B7A85">Calendar</text><text x="780" y="56" font-family="Poppins" font-weight="600" font-size="14" fill="#6B7A85">Credits</text><rect x="557" y="64" width="48" height="3" rx="1.5" fill="#EC6F9C"/>
  <rect x="880" y="34" rx="16" ry="16" width="120" height="32" fill="#FBF1D9"/>
  <text x="940" y="55" font-family="Poppins" font-weight="700" font-size="13" fill="#B8841E" text-anchor="middle">$40 credit</text>
  <circle cx="1040" cy="50" r="20" fill="#A7D3E0"/>
  <text x="1040" y="56" font-family="Poppins" font-weight="700" font-size="15" fill="#FFFFFF" text-anchor="middle">M</text>
  <line x1="78" y1="96" x2="1280" y2="96" stroke="#ECE6DE" stroke-width="1.5"/><g class="w-sep" style="--d:0.05s"><text x="106" y="150" font-family="Poppins" font-weight="700" font-size="30" fill="#21384A">September</text></g><g class="w-drop" style="--d:0.7s"><text x="290" y="150" font-family="Poppins" font-weight="700" font-size="30" fill="#EC6F9C">drop</text></g><g class="ai" style="--d:0.50s"><text x="106" y="178" font-family="Poppins" font-weight="500" font-size="15" fill="#6B7A85">Fresh, standards-aligned lessons unlock on the 1st of every month.</text></g><g class="ai pulse" style="--d:0.14s"><g><rect x="900" y="124" rx="20" ry="20" width="262" height="40" fill="#EC6F9C"/><text x="1031" y="149" font-family="Poppins" font-weight="700" font-size="14" fill="#FFFFFF" text-anchor="middle">New this month · 4 lessons</text></g></g><g class="ai" style="--d:0.24s"><g>
      <rect x="106" y="212" rx="18" ry="18" width="300" height="300" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
      <rect x="106" y="212" rx="18" ry="18" width="300" height="64" fill="#FCEAF1"/>
      <rect x="106" y="252" width="300" height="24" fill="#FCEAF1"/>
      <rect x="106" y="212" rx="18" ry="18" width="8" height="300" fill="#EC6F9C"/>
      <text x="128" y="250" font-family="Poppins" font-weight="700" font-size="12" letter-spacing="1.5" fill="#EC6F9C">SPEAKING</text>
      <text x="128" y="310" font-family="Poppins" font-weight="700" font-size="19" fill="#21384A">ESL Newcomer Back to</text>
      <text x="128" y="336" font-family="Poppins" font-weight="700" font-size="19" fill="#21384A">School Survival Phrases</text>
      <text x="128" y="370" font-family="Poppins" font-weight="500" font-size="13" fill="#6B7A85">Grades 6–8 · 45 min</text>
      <rect x="128" y="408" rx="11.0" ry="11.0" width="72" height="22" fill="#F7D6E0"/><text x="164" y="423.0" font-family="Poppins" font-weight="600" font-size="11" fill="#21384A" text-anchor="middle">Speaking</text><rect x="208.4" y="408" rx="11.0" ry="11.0" width="72" height="22" fill="#A7D3E0"/><text x="245" y="423.0" font-family="Poppins" font-weight="600" font-size="11" fill="#21384A" text-anchor="middle">Survival</text>
      <line x1="128" y1="456" x2="384" y2="456" stroke="#ECE6DE" stroke-width="1.2"/>
      <text x="128" y="486" font-family="Poppins" font-weight="700" font-size="15" fill="#21384A">$6.99</text>
      <text x="384" y="486" font-family="Poppins" font-weight="600" font-size="12" fill="#6B7A85" text-anchor="end">TPT value</text></g></g><g class="ai" style="--d:0.34s"><g>
      <rect x="430" y="212" rx="18" ry="18" width="300" height="300" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
      <rect x="430" y="212" rx="18" ry="18" width="300" height="64" fill="#E7F2F6"/>
      <rect x="430" y="252" width="300" height="24" fill="#E7F2F6"/>
      <rect x="430" y="212" rx="18" ry="18" width="8" height="300" fill="#A7D3E0"/>
      <text x="452" y="250" font-family="Poppins" font-weight="700" font-size="12" letter-spacing="1.5" fill="#A7D3E0">WRITING</text>
      <text x="452" y="310" font-family="Poppins" font-weight="700" font-size="19" fill="#21384A">All About Me:</text>
      <text x="452" y="336" font-family="Poppins" font-weight="700" font-size="19" fill="#21384A">Identity &amp; Belonging</text>
      <text x="452" y="370" font-family="Poppins" font-weight="500" font-size="13" fill="#6B7A85">Grades 6–8 · 50 min</text>
      <rect x="452" y="408" rx="11.0" ry="11.0" width="66" height="22" fill="#F7D6E0"/><text x="485" y="423.0" font-family="Poppins" font-weight="600" font-size="11" fill="#21384A" text-anchor="middle">Writing</text><rect x="526.35" y="408" rx="11.0" ry="11.0" width="72" height="22" fill="#F4D58C"/><text x="563" y="423.0" font-family="Poppins" font-weight="600" font-size="11" fill="#21384A" text-anchor="middle">Identity</text>
      <line x1="452" y1="456" x2="708" y2="456" stroke="#ECE6DE" stroke-width="1.2"/>
      <text x="452" y="486" font-family="Poppins" font-weight="700" font-size="15" fill="#21384A">$6.99</text>
      <text x="708" y="486" font-family="Poppins" font-weight="600" font-size="12" fill="#6B7A85" text-anchor="end">TPT value</text></g></g><g class="ai" style="--d:0.44s"><g>
      <rect x="754" y="212" rx="18" ry="18" width="300" height="300" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
      <rect x="754" y="212" rx="18" ry="18" width="300" height="64" fill="#FBF1D9"/>
      <rect x="754" y="252" width="300" height="24" fill="#FBF1D9"/>
      <rect x="754" y="212" rx="18" ry="18" width="8" height="300" fill="#F4D58C"/>
      <text x="776" y="250" font-family="Poppins" font-weight="700" font-size="12" letter-spacing="1.5" fill="#F4D58C">READING</text>
      <text x="776" y="310" font-family="Poppins" font-weight="700" font-size="19" fill="#21384A">Listening &amp; Phonics</text>
      <text x="776" y="336" font-family="Poppins" font-weight="700" font-size="19" fill="#21384A">Foundation Unit</text>
      <text x="776" y="370" font-family="Poppins" font-weight="500" font-size="13" fill="#6B7A85">Grade 7 · 30 min</text>
      <rect x="776" y="408" rx="11.0" ry="11.0" width="66" height="22" fill="#A7D3E0"/><text x="809" y="423.0" font-family="Poppins" font-weight="600" font-size="11" fill="#21384A" text-anchor="middle">Reading</text><rect x="850.35" y="408" rx="11.0" ry="11.0" width="66" height="22" fill="#F7D6E0"/><text x="884" y="423.0" font-family="Poppins" font-weight="600" font-size="11" fill="#21384A" text-anchor="middle">Phonics</text>
      <line x1="776" y1="456" x2="1032" y2="456" stroke="#ECE6DE" stroke-width="1.2"/>
      <text x="776" y="486" font-family="Poppins" font-weight="700" font-size="15" fill="#21384A">$7.99</text>
      <text x="1032" y="486" font-family="Poppins" font-weight="600" font-size="12" fill="#6B7A85" text-anchor="end">TPT value</text></g></g><g class="ai" style="--d:0.54s"><text x="106" y="592" font-family="Poppins" font-weight="700" font-size="13" letter-spacing="1.5" fill="#6B7A85">WHY TEACHERS STAY</text></g><g class="ai" style="--d:0.58s"><g>
      <rect x="106" y="610" rx="16" ry="16" width="348" height="74" fill="#FCEAF1"/>
      <circle cx="150" cy="647" r="22" fill="#FFFFFF"/><polygon points="150.0,637.0 152.5,643.5 159.5,643.9 154.1,648.3 155.9,655.1 150.0,651.3 144.1,655.1 145.9,648.3 140.5,643.9 147.5,643.5" fill="#EC6F9C"/>
      <text x="184" y="644" font-family="Poppins" font-weight="700" font-size="18" fill="#21384A">225+ lesson plans</text>
      <text x="184" y="666" font-family="Poppins" font-weight="500" font-size="12.5" fill="#6B7A85">Classroom-tested library</text></g></g><g class="ai" style="--d:0.66s"><g>
      <rect x="466" y="610" rx="16" ry="16" width="348" height="74" fill="#E7F2F6"/>
      <circle cx="510" cy="647" r="22" fill="#FFFFFF"/><path d="M 501 648 L 507 654 L 519 640" fill="none" stroke="#3E8FA8" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="544" y="644" font-family="Poppins" font-weight="700" font-size="18" fill="#21384A">WIDA-aligned</text>
      <text x="544" y="666" font-family="Poppins" font-weight="500" font-size="12.5" fill="#6B7A85">State ELD standards</text></g></g><g class="ai" style="--d:0.74s"><g>
      <rect x="826" y="610" rx="16" ry="16" width="348" height="74" fill="#FBF1D9"/>
      <circle cx="870" cy="647" r="22" fill="#FFFFFF"/><rect x="860" y="639" width="20" height="18" rx="3" fill="none" stroke="#B8841E" stroke-width="2.6"/><line x1="860" y1="645" x2="880" y2="645" stroke="#B8841E" stroke-width="2.6"/><line x1="865" y1="636" x2="865" y2="642" stroke="#B8841E" stroke-width="2.6" stroke-linecap="round"/><line x1="875" y1="636" x2="875" y2="642" stroke="#B8841E" stroke-width="2.6" stroke-linecap="round"/>
      <text x="904" y="644" font-family="Poppins" font-weight="700" font-size="18" fill="#21384A">Scope &amp; sequence</text>
      <text x="904" y="666" font-family="Poppins" font-weight="500" font-size="12.5" fill="#6B7A85">A full year, mapped out</text></g></g></svg>`,
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800"><rect width="1280" height="800" fill="#FBF7F2"/>
  <rect x="0" y="0" width="78" height="800" fill="#FFFFFF"/>
  <line x1="78" y1="0" x2="78" y2="800" stroke="#ECE6DE" stroke-width="1.5"/>
  <rect x="23" y="26" rx="12" ry="12" width="32" height="32" fill="#EC6F9C"/>
  <text x="39" y="48" font-family="Poppins" font-weight="800" font-size="15" fill="#FFFFFF" text-anchor="middle">CG</text>
  <rect x="19" y="120" rx="12" ry="12" width="40" height="40" fill="#FCEAF1"/>
  <rect x="29" y="132" width="20" height="16" rx="2" fill="#EC6F9C"/>
  <circle cx="39" cy="210" r="6" fill="#6B7A85"/><rect x="31" y="224" width="16" height="3" rx="1.5" fill="#6B7A85"/>
  <rect x="31" y="280" width="16" height="14" rx="2" fill="none" stroke="#6B7A85" stroke-width="3"/>
  <circle cx="39" cy="352" r="9" fill="none" stroke="#6B7A85" stroke-width="3"/><line x1="46" y1="359" x2="52" y2="365" stroke="#6B7A85" stroke-width="3" stroke-linecap="round"/>
  <text x="106" y="52" font-family="Poppins" font-weight="700" font-size="20" fill="#21384A">Curly Girl ELD</text>
  <text x="106" y="72" font-family="Poppins" font-weight="500" font-size="12.5" letter-spacing="1" fill="#6B7A85">MEMBERSHIP LIBRARY</text>
  <text x="560" y="56" font-family="Poppins" font-weight="600" font-size="14" fill="#6B7A85">Library</text><text x="660" y="56" font-family="Poppins" font-weight="700" font-size="14" fill="#21384A">Calendar</text><text x="780" y="56" font-family="Poppins" font-weight="600" font-size="14" fill="#6B7A85">Credits</text><rect x="657" y="64" width="62" height="3" rx="1.5" fill="#EC6F9C"/>
  <rect x="880" y="34" rx="16" ry="16" width="120" height="32" fill="#FBF1D9"/>
  <text x="940" y="55" font-family="Poppins" font-weight="700" font-size="13" fill="#B8841E" text-anchor="middle">$40 credit</text>
  <circle cx="1040" cy="50" r="20" fill="#A7D3E0"/>
  <text x="1040" y="56" font-family="Poppins" font-weight="700" font-size="15" fill="#FFFFFF" text-anchor="middle">M</text>
  <line x1="78" y1="96" x2="1280" y2="96" stroke="#ECE6DE" stroke-width="1.5"/><g class="ai" style="--d:0.04s"><text x="106" y="150" font-family="Poppins" font-weight="700" font-size="30" fill="#21384A">Your year, <tspan font-weight="700" fill="#2C7DB0">mapped out.</tspan></text><text x="106" y="178" font-family="Poppins" font-weight="500" font-size="15" fill="#6B7A85">A full scope &amp; sequence, with every month planned so you never start from a blank page.</text></g><g class="ai" style="--d:0.14s"><g><rect x="872" y="124" rx="20" ry="20" width="290" height="40" fill="#EC6F9C"/><text x="1017" y="149" font-family="Poppins" font-weight="700" font-size="14" fill="#FFFFFF" text-anchor="middle">Scope &amp; sequence · 11 months</text></g></g><g class="ai" style="--d:0.18s"><g>
        <rect x="106" y="200" rx="16" ry="16" width="196" height="150" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
        <rect x="106" y="200" rx="16" ry="16" width="196" height="44" fill="#FCEAF1"/><rect x="106" y="228" width="196" height="16" fill="#FCEAF1"/>
        <text x="124" y="229" font-family="Poppins" font-weight="800" font-size="14" letter-spacing="1.5" fill="#EC6F9C">AUG</text>
        <text x="284" y="229" font-family="Poppins" font-weight="600" font-size="11" fill="#6B7A85" text-anchor="end">Unlocked</text>
        <text x="124" y="278" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Survival &amp;</text>
        <text x="124" y="299" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Belonging</text>
        <text x="124" y="330" font-family="Poppins" font-weight="500" font-size="12" fill="#6B7A85">2 lessons</text>
        <path d="M 269 327 L 275 333 L 287 319" fill="none" stroke="#EC6F9C" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g></g><g class="ai" style="--d:0.23s"><g>
        <rect x="324" y="200" rx="16" ry="16" width="196" height="150" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
        <rect x="324" y="200" rx="16" ry="16" width="196" height="44" fill="#E7F2F6"/><rect x="324" y="228" width="196" height="16" fill="#E7F2F6"/>
        <text x="342" y="229" font-family="Poppins" font-weight="800" font-size="14" letter-spacing="1.5" fill="#A7D3E0">SEP</text>
        <text x="502" y="229" font-family="Poppins" font-weight="600" font-size="11" fill="#6B7A85" text-anchor="end">Unlocked</text>
        <text x="342" y="278" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Listening &amp;</text>
        <text x="342" y="299" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Phonics</text>
        <text x="342" y="330" font-family="Poppins" font-weight="500" font-size="12" fill="#6B7A85">2 lessons</text>
        <path d="M 487 327 L 493 333 L 505 319" fill="none" stroke="#A7D3E0" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g></g><g class="ai" style="--d:0.29s"><g>
        <rect x="542" y="200" rx="16" ry="16" width="196" height="150" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
        <rect x="542" y="200" rx="16" ry="16" width="196" height="44" fill="#FBF1D9"/><rect x="542" y="228" width="196" height="16" fill="#FBF1D9"/>
        <text x="560" y="229" font-family="Poppins" font-weight="800" font-size="14" letter-spacing="1.5" fill="#F4D58C">OCT</text>
        <text x="720" y="229" font-family="Poppins" font-weight="600" font-size="11" fill="#6B7A85" text-anchor="end">Coming</text>
        <text x="560" y="278" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Seasonal</text>
        <text x="560" y="299" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Vocabulary</text>
        <text x="560" y="330" font-family="Poppins" font-weight="500" font-size="12" fill="#6B7A85">2 lessons</text>
        <rect x="707" y="324" width="14" height="11" rx="2" fill="#6B7A85"/><path d="M 710 324 v-3 a4 4 0 0 1 8 0 v3" fill="none" stroke="#6B7A85" stroke-width="2"/></g></g><g class="ai" style="--d:0.34s"><g>
        <rect x="760" y="200" rx="16" ry="16" width="196" height="150" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
        <rect x="760" y="200" rx="16" ry="16" width="196" height="44" fill="#FCEAF1"/><rect x="760" y="228" width="196" height="16" fill="#FCEAF1"/>
        <text x="778" y="229" font-family="Poppins" font-weight="800" font-size="14" letter-spacing="1.5" fill="#EC6F9C">NOV</text>
        <text x="938" y="229" font-family="Poppins" font-weight="600" font-size="11" fill="#6B7A85" text-anchor="end">Coming</text>
        <text x="778" y="278" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Present Tense</text>
        <text x="778" y="299" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">&amp; Daily Life</text>
        <text x="778" y="330" font-family="Poppins" font-weight="500" font-size="12" fill="#6B7A85">2 lessons</text>
        <rect x="925" y="324" width="14" height="11" rx="2" fill="#6B7A85"/><path d="M 928 324 v-3 a4 4 0 0 1 8 0 v3" fill="none" stroke="#6B7A85" stroke-width="2"/></g></g><g class="ai" style="--d:0.40s"><g>
        <rect x="978" y="200" rx="16" ry="16" width="196" height="150" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
        <rect x="978" y="200" rx="16" ry="16" width="196" height="44" fill="#E7F2F6"/><rect x="978" y="228" width="196" height="16" fill="#E7F2F6"/>
        <text x="996" y="229" font-family="Poppins" font-weight="800" font-size="14" letter-spacing="1.5" fill="#A7D3E0">DEC</text>
        <text x="1156" y="229" font-family="Poppins" font-weight="600" font-size="11" fill="#6B7A85" text-anchor="end">Coming</text>
        <text x="996" y="278" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Winter &amp;</text>
        <text x="996" y="299" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Celebrations</text>
        <text x="996" y="330" font-family="Poppins" font-weight="500" font-size="12" fill="#6B7A85">2 lessons</text>
        <rect x="1143" y="324" width="14" height="11" rx="2" fill="#6B7A85"/><path d="M 1146 324 v-3 a4 4 0 0 1 8 0 v3" fill="none" stroke="#6B7A85" stroke-width="2"/></g></g><g class="ai" style="--d:0.46s"><g>
        <rect x="106" y="388" rx="16" ry="16" width="196" height="150" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
        <rect x="106" y="388" rx="16" ry="16" width="196" height="44" fill="#FBF1D9"/><rect x="106" y="416" width="196" height="16" fill="#FBF1D9"/>
        <text x="124" y="417" font-family="Poppins" font-weight="800" font-size="14" letter-spacing="1.5" fill="#F4D58C">JAN</text>
        <text x="284" y="417" font-family="Poppins" font-weight="600" font-size="11" fill="#6B7A85" text-anchor="end">Coming</text>
        <text x="124" y="466" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Goals &amp;</text>
        <text x="124" y="487" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">New Year</text>
        <text x="124" y="518" font-family="Poppins" font-weight="500" font-size="12" fill="#6B7A85">2 lessons</text>
        <rect x="271" y="512" width="14" height="11" rx="2" fill="#6B7A85"/><path d="M 274 512 v-3 a4 4 0 0 1 8 0 v3" fill="none" stroke="#6B7A85" stroke-width="2"/></g></g><g class="ai" style="--d:0.51s"><g>
        <rect x="324" y="388" rx="16" ry="16" width="196" height="150" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
        <rect x="324" y="388" rx="16" ry="16" width="196" height="44" fill="#FCEAF1"/><rect x="324" y="416" width="196" height="16" fill="#FCEAF1"/>
        <text x="342" y="417" font-family="Poppins" font-weight="800" font-size="14" letter-spacing="1.5" fill="#EC6F9C">FEB</text>
        <text x="502" y="417" font-family="Poppins" font-weight="600" font-size="11" fill="#6B7A85" text-anchor="end">Coming</text>
        <text x="342" y="466" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Community &amp;</text>
        <text x="342" y="487" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Health</text>
        <text x="342" y="518" font-family="Poppins" font-weight="500" font-size="12" fill="#6B7A85">2 lessons</text>
        <rect x="489" y="512" width="14" height="11" rx="2" fill="#6B7A85"/><path d="M 492 512 v-3 a4 4 0 0 1 8 0 v3" fill="none" stroke="#6B7A85" stroke-width="2"/></g></g><g class="ai" style="--d:0.56s"><g>
        <rect x="542" y="388" rx="16" ry="16" width="196" height="150" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
        <rect x="542" y="388" rx="16" ry="16" width="196" height="44" fill="#E7F2F6"/><rect x="542" y="416" width="196" height="16" fill="#E7F2F6"/>
        <text x="560" y="417" font-family="Poppins" font-weight="800" font-size="14" letter-spacing="1.5" fill="#A7D3E0">MAR</text>
        <text x="720" y="417" font-family="Poppins" font-weight="600" font-size="11" fill="#6B7A85" text-anchor="end">Coming</text>
        <text x="560" y="466" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Spring &amp;</text>
        <text x="560" y="487" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Nature</text>
        <text x="560" y="518" font-family="Poppins" font-weight="500" font-size="12" fill="#6B7A85">2 lessons</text>
        <rect x="707" y="512" width="14" height="11" rx="2" fill="#6B7A85"/><path d="M 710 512 v-3 a4 4 0 0 1 8 0 v3" fill="none" stroke="#6B7A85" stroke-width="2"/></g></g><g class="ai" style="--d:0.62s"><g>
        <rect x="760" y="388" rx="16" ry="16" width="196" height="150" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
        <rect x="760" y="388" rx="16" ry="16" width="196" height="44" fill="#FBF1D9"/><rect x="760" y="416" width="196" height="16" fill="#FBF1D9"/>
        <text x="778" y="417" font-family="Poppins" font-weight="800" font-size="14" letter-spacing="1.5" fill="#F4D58C">APR</text>
        <text x="938" y="417" font-family="Poppins" font-weight="600" font-size="11" fill="#6B7A85" text-anchor="end">Coming</text>
        <text x="778" y="466" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Travel &amp;</text>
        <text x="778" y="487" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">The World</text>
        <text x="778" y="518" font-family="Poppins" font-weight="500" font-size="12" fill="#6B7A85">2 lessons</text>
        <rect x="925" y="512" width="14" height="11" rx="2" fill="#6B7A85"/><path d="M 928 512 v-3 a4 4 0 0 1 8 0 v3" fill="none" stroke="#6B7A85" stroke-width="2"/></g></g><g class="ai" style="--d:0.68s"><g>
        <rect x="978" y="388" rx="16" ry="16" width="196" height="150" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
        <rect x="978" y="388" rx="16" ry="16" width="196" height="44" fill="#FCEAF1"/><rect x="978" y="416" width="196" height="16" fill="#FCEAF1"/>
        <text x="996" y="417" font-family="Poppins" font-weight="800" font-size="14" letter-spacing="1.5" fill="#EC6F9C">MAY</text>
        <text x="1156" y="417" font-family="Poppins" font-weight="600" font-size="11" fill="#6B7A85" text-anchor="end">Coming</text>
        <text x="996" y="466" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Review &amp;</text>
        <text x="996" y="487" font-family="Poppins" font-weight="700" font-size="15.5" fill="#21384A">Projects</text>
        <text x="996" y="518" font-family="Poppins" font-weight="500" font-size="12" fill="#6B7A85">2 lessons</text>
        <rect x="1143" y="512" width="14" height="11" rx="2" fill="#6B7A85"/><path d="M 1146 512 v-3 a4 4 0 0 1 8 0 v3" fill="none" stroke="#6B7A85" stroke-width="2"/></g></g></svg>`,
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800"><rect width="1280" height="800" fill="#FBF7F2"/>
  <rect x="0" y="0" width="78" height="800" fill="#FFFFFF"/>
  <line x1="78" y1="0" x2="78" y2="800" stroke="#ECE6DE" stroke-width="1.5"/>
  <rect x="23" y="26" rx="12" ry="12" width="32" height="32" fill="#EC6F9C"/>
  <text x="39" y="48" font-family="Poppins" font-weight="800" font-size="15" fill="#FFFFFF" text-anchor="middle">CG</text>
  <rect x="19" y="120" rx="12" ry="12" width="40" height="40" fill="#FCEAF1"/>
  <rect x="29" y="132" width="20" height="16" rx="2" fill="#EC6F9C"/>
  <circle cx="39" cy="210" r="6" fill="#6B7A85"/><rect x="31" y="224" width="16" height="3" rx="1.5" fill="#6B7A85"/>
  <rect x="31" y="280" width="16" height="14" rx="2" fill="none" stroke="#6B7A85" stroke-width="3"/>
  <circle cx="39" cy="352" r="9" fill="none" stroke="#6B7A85" stroke-width="3"/><line x1="46" y1="359" x2="52" y2="365" stroke="#6B7A85" stroke-width="3" stroke-linecap="round"/>
  <text x="106" y="52" font-family="Poppins" font-weight="700" font-size="20" fill="#21384A">Curly Girl ELD</text>
  <text x="106" y="72" font-family="Poppins" font-weight="500" font-size="12.5" letter-spacing="1" fill="#6B7A85">MEMBERSHIP LIBRARY</text>
  <text x="560" y="56" font-family="Poppins" font-weight="700" font-size="14" fill="#21384A">Library</text><text x="660" y="56" font-family="Poppins" font-weight="600" font-size="14" fill="#6B7A85">Calendar</text><text x="780" y="56" font-family="Poppins" font-weight="600" font-size="14" fill="#6B7A85">Credits</text><rect x="557" y="64" width="48" height="3" rx="1.5" fill="#EC6F9C"/>
  <rect x="880" y="34" rx="16" ry="16" width="120" height="32" fill="#FBF1D9"/>
  <text x="940" y="55" font-family="Poppins" font-weight="700" font-size="13" fill="#B8841E" text-anchor="middle">$40 credit</text>
  <circle cx="1040" cy="50" r="20" fill="#A7D3E0"/>
  <text x="1040" y="56" font-family="Poppins" font-weight="700" font-size="15" fill="#FFFFFF" text-anchor="middle">M</text>
  <line x1="78" y1="96" x2="1280" y2="96" stroke="#ECE6DE" stroke-width="1.5"/><g class="ai" style="--d:0.04s"><text x="106" y="150" font-family="Poppins" font-weight="700" font-size="30" fill="#21384A">Find the right lesson <tspan font-weight="500" fill="#6B7A85">in seconds.</tspan></text><text x="106" y="178" font-family="Poppins" font-weight="500" font-size="15" fill="#6B7A85">Filter by theme, proficiency level, or skill. Everything is tagged.</text></g><rect x="106" y="200" rx="20" ry="20" width="330" height="470" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/><g class="ai-l" style="--d:0.14s"><text x="132" y="244" font-family="Poppins" font-weight="700" font-size="17" fill="#21384A">Filters</text><text x="410" y="244" font-family="Poppins" font-weight="600" font-size="12.5" fill="#EC6F9C" text-anchor="end">Clear all</text></g><g class="ai-l" style="--d:0.22s"><text x="132" y="278" font-family="Poppins" font-weight="700" font-size="12" letter-spacing="1.4" fill="#6B7A85">THEME</text><rect x="132" y="292" rx="13.0" ry="13.0" width="92" height="26" fill="#EC6F9C"/><text x="178" y="309.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#FFFFFF" text-anchor="middle">Community</text><rect x="231.875" y="292" rx="13.0" ry="13.0" width="85" height="26" fill="#FBF7F2"/><text x="274" y="309.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">About Me</text><rect x="324.875" y="292" rx="13.0" ry="13.0" width="71" height="26" fill="#FBF7F2"/><text x="360" y="309.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Travel</text><rect x="132" y="326" rx="13.0" ry="13.0" width="78" height="26" fill="#FBF7F2"/><text x="171" y="343.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Seasons</text></g><g class="ai-l" style="--d:0.34s"><text x="132" y="384" font-family="Poppins" font-weight="700" font-size="12" letter-spacing="1.4" fill="#6B7A85">LEVEL</text><rect x="132" y="398" rx="13.0" ry="13.0" width="85" height="26" fill="#FBF7F2"/><text x="174" y="415.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Entering</text><rect x="225.0" y="398" rx="13.0" ry="13.0" width="85" height="26" fill="#EC6F9C"/><text x="268" y="415.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#FFFFFF" text-anchor="middle">Emerging</text><rect x="318.0" y="398" rx="13.0" ry="13.0" width="85" height="26" fill="#FBF7F2"/><text x="360" y="415.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Bridging</text></g><g class="ai-l" style="--d:0.46s"><text x="132" y="456" font-family="Poppins" font-weight="700" font-size="12" letter-spacing="1.4" fill="#6B7A85">SKILL</text><rect x="132" y="470" rx="13.0" ry="13.0" width="85" height="26" fill="#EC6F9C"/><text x="174" y="487.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#FFFFFF" text-anchor="middle">Speaking</text><rect x="225.0" y="470" rx="13.0" ry="13.0" width="78" height="26" fill="#FBF7F2"/><text x="264" y="487.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Writing</text><rect x="311.125" y="470" rx="13.0" ry="13.0" width="78" height="26" fill="#FBF7F2"/><text x="350" y="487.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Reading</text><rect x="132" y="504" rx="13.0" ry="13.0" width="78" height="26" fill="#FBF7F2"/><text x="171" y="521.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Grammar</text></g><g class="ai" style="--d:0.20s"><text x="470" y="230" font-family="Poppins" font-weight="700" font-size="18" fill="#21384A">18 lessons match</text><text x="670" y="230" font-family="Poppins" font-weight="500" font-size="13" fill="#6B7A85">Sorted by newest</text></g><g class="ai-r" style="--d:0.34s"><g>
        <rect x="470" y="252" rx="16" ry="16" width="744" height="92" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
        <rect x="470" y="252" rx="16" ry="16" width="8" height="92" fill="#EC6F9C"/>
        <text x="500" y="290" font-family="Poppins" font-weight="700" font-size="17" fill="#21384A">Community Helpers Vocabulary</text>
        <text x="500" y="316" font-family="Poppins" font-weight="500" font-size="13" fill="#6B7A85">Speaking · Emerging · 40 min</text>
        <text x="1190" y="304.0" font-family="Poppins" font-weight="700" font-size="16" fill="#21384A" text-anchor="end">$6.99</text></g></g><g class="ai-r" style="--d:0.44s"><g>
        <rect x="470" y="358" rx="16" ry="16" width="744" height="92" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
        <rect x="470" y="358" rx="16" ry="16" width="8" height="92" fill="#A7D3E0"/>
        <text x="500" y="396" font-family="Poppins" font-weight="700" font-size="17" fill="#21384A">Where I Live: Speaking Task</text>
        <text x="500" y="422" font-family="Poppins" font-weight="500" font-size="13" fill="#6B7A85">Speaking · Emerging · 35 min</text>
        <text x="1190" y="410.0" font-family="Poppins" font-weight="700" font-size="16" fill="#21384A" text-anchor="end">$5.99</text></g></g><g class="ai-r" style="--d:0.54s"><g>
        <rect x="470" y="464" rx="16" ry="16" width="744" height="92" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
        <rect x="470" y="464" rx="16" ry="16" width="8" height="92" fill="#F4D58C"/>
        <text x="500" y="502" font-family="Poppins" font-weight="700" font-size="17" fill="#21384A">My Neighborhood Map Project</text>
        <text x="500" y="528" font-family="Poppins" font-weight="500" font-size="13" fill="#6B7A85">Writing · Emerging · 50 min</text>
        <text x="1190" y="516.0" font-family="Poppins" font-weight="700" font-size="16" fill="#21384A" text-anchor="end">$7.99</text></g></g><g class="ai-r" style="--d:0.64s"><g>
        <rect x="470" y="570" rx="16" ry="16" width="744" height="92" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/>
        <rect x="470" y="570" rx="16" ry="16" width="8" height="92" fill="#3E8FA8"/>
        <text x="500" y="608" font-family="Poppins" font-weight="700" font-size="17" fill="#21384A">Asking for Directions Dialogue</text>
        <text x="500" y="634" font-family="Poppins" font-weight="500" font-size="13" fill="#6B7A85">Speaking · Emerging · 30 min</text>
        <text x="1190" y="622.0" font-family="Poppins" font-weight="700" font-size="16" fill="#21384A" text-anchor="end">$5.99</text></g></g></svg>`,
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800"><rect width="1280" height="800" fill="#FBF7F2"/>
  <rect x="0" y="0" width="78" height="800" fill="#FFFFFF"/>
  <line x1="78" y1="0" x2="78" y2="800" stroke="#ECE6DE" stroke-width="1.5"/>
  <rect x="23" y="26" rx="12" ry="12" width="32" height="32" fill="#EC6F9C"/>
  <text x="39" y="48" font-family="Poppins" font-weight="800" font-size="15" fill="#FFFFFF" text-anchor="middle">CG</text>
  <rect x="19" y="120" rx="12" ry="12" width="40" height="40" fill="#FCEAF1"/>
  <rect x="29" y="132" width="20" height="16" rx="2" fill="#EC6F9C"/>
  <circle cx="39" cy="210" r="6" fill="#6B7A85"/><rect x="31" y="224" width="16" height="3" rx="1.5" fill="#6B7A85"/>
  <rect x="31" y="280" width="16" height="14" rx="2" fill="none" stroke="#6B7A85" stroke-width="3"/>
  <circle cx="39" cy="352" r="9" fill="none" stroke="#6B7A85" stroke-width="3"/><line x1="46" y1="359" x2="52" y2="365" stroke="#6B7A85" stroke-width="3" stroke-linecap="round"/>
  <text x="106" y="52" font-family="Poppins" font-weight="700" font-size="20" fill="#21384A">Curly Girl ELD</text>
  <text x="106" y="72" font-family="Poppins" font-weight="500" font-size="12.5" letter-spacing="1" fill="#6B7A85">MEMBERSHIP LIBRARY</text>
  <text x="560" y="56" font-family="Poppins" font-weight="700" font-size="14" fill="#21384A">Library</text><text x="660" y="56" font-family="Poppins" font-weight="600" font-size="14" fill="#6B7A85">Calendar</text><text x="780" y="56" font-family="Poppins" font-weight="600" font-size="14" fill="#6B7A85">Credits</text><rect x="557" y="64" width="48" height="3" rx="1.5" fill="#EC6F9C"/>
  <rect x="880" y="34" rx="16" ry="16" width="120" height="32" fill="#FBF1D9"/>
  <text x="940" y="55" font-family="Poppins" font-weight="700" font-size="13" fill="#B8841E" text-anchor="middle">$40 credit</text>
  <circle cx="1040" cy="50" r="20" fill="#A7D3E0"/>
  <text x="1040" y="56" font-family="Poppins" font-weight="700" font-size="15" fill="#FFFFFF" text-anchor="middle">M</text>
  <line x1="78" y1="96" x2="1280" y2="96" stroke="#ECE6DE" stroke-width="1.5"/><g class="ai" style="--d:0.04s"><text x="106" y="150" font-family="Poppins" font-weight="700" font-size="30" fill="#21384A">Two pathways, <tspan font-weight="500" fill="#6B7A85">one goal.</tspan></text><text x="106" y="178" font-family="Poppins" font-weight="500" font-size="15" fill="#6B7A85">Mix and match thematic projects with foundational ESL, and build the year your students need.</text></g><rect x="106" y="196" rx="22" ry="22" width="508" height="452" fill="#E7F2F6"/><g class="ai" style="--d:0.16s"><rect x="138" y="230" rx="14" ry="14" width="131" height="28" fill="#EC6F9C"/><text x="204" y="249" font-family="Poppins" font-weight="700" font-size="12.5" letter-spacing="1" fill="#FFFFFF" text-anchor="middle">PATHWAY A</text></g><g class="ai" style="--d:0.24s"><text x="138" y="304" font-family="Poppins" font-weight="700" font-size="25" fill="#21384A">Thematic &amp; Seasonal</text></g><g class="ai" style="--d:0.30s"><text x="138" y="334" font-family="Poppins" font-weight="500" font-size="14" fill="#6B7A85">High-interest projects tied to seasons and</text><text x="138" y="355" font-family="Poppins" font-weight="500" font-size="14" fill="#6B7A85">real-world topics that get students talking.</text></g><g class="ai" style="--d:0.38s"><rect x="138" y="382" rx="13.0" ry="13.0" width="126" height="26" fill="#FFFFFF"/><text x="201" y="399.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Travel Project</text></g><g class="ai" style="--d:0.44s"><rect x="275.25" y="382" rx="13.0" ry="13.0" width="85" height="26" fill="#FFFFFF"/><text x="318" y="399.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">About Me</text></g><g class="ai" style="--d:0.50s"><rect x="371.25" y="382" rx="13.0" ry="13.0" width="92" height="26" fill="#FFFFFF"/><text x="417" y="399.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">World Cup</text></g><g class="ai" style="--d:0.56s"><rect x="138" y="424" rx="13.0" ry="13.0" width="126" height="26" fill="#FFFFFF"/><text x="201" y="441.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Back to School</text></g><g class="ai" style="--d:0.62s"><rect x="275.25" y="424" rx="13.0" ry="13.0" width="58" height="26" fill="#FFFFFF"/><text x="304" y="441.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Fall</text></g><g class="ai" style="--d:0.68s"><rect x="343.75" y="424" rx="13.0" ry="13.0" width="71" height="26" fill="#FFFFFF"/><text x="379" y="441.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Winter</text></g><g class="ai" style="--d:0.74s"><rect x="426.0" y="424" rx="13.0" ry="13.0" width="71" height="26" fill="#FFFFFF"/><text x="462" y="441.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Spring</text></g><rect x="666" y="196" rx="22" ry="22" width="508" height="452" fill="#FCEAF1"/><g class="ai" style="--d:0.24s"><rect x="698" y="230" rx="14" ry="14" width="131" height="28" fill="#3E8FA8"/><text x="764" y="249" font-family="Poppins" font-weight="700" font-size="12.5" letter-spacing="1" fill="#FFFFFF" text-anchor="middle">PATHWAY B</text></g><g class="ai" style="--d:0.32s"><text x="698" y="304" font-family="Poppins" font-weight="700" font-size="25" fill="#21384A">Foundational ESL</text></g><g class="ai" style="--d:0.38s"><text x="698" y="334" font-family="Poppins" font-weight="500" font-size="14" fill="#6B7A85">Traditional life-skills topics that build the</text><text x="698" y="355" font-family="Poppins" font-weight="500" font-size="14" fill="#6B7A85">vocabulary newcomers need every day.</text></g><g class="ai" style="--d:0.46s"><rect x="698" y="382" rx="13.0" ry="13.0" width="140" height="26" fill="#FFFFFF"/><text x="768" y="399.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Around the House</text></g><g class="ai" style="--d:0.52s"><rect x="849.0" y="382" rx="13.0" ry="13.0" width="133" height="26" fill="#FFFFFF"/><text x="916" y="399.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Grocery &amp; Money</text></g><g class="ai" style="--d:0.58s"><rect x="993.125" y="382" rx="13.0" ry="13.0" width="71" height="26" fill="#FFFFFF"/><text x="1029" y="399.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Family</text></g><g class="ai" style="--d:0.64s"><rect x="698" y="424" rx="13.0" ry="13.0" width="92" height="26" fill="#FFFFFF"/><text x="744" y="441.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Community</text></g><g class="ai" style="--d:0.70s"><rect x="800.875" y="424" rx="13.0" ry="13.0" width="71" height="26" fill="#FFFFFF"/><text x="836" y="441.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">Health</text></g><g class="ai" style="--d:0.76s"><rect x="883.125" y="424" rx="13.0" ry="13.0" width="106" height="26" fill="#FFFFFF"/><text x="936" y="441.5" font-family="Poppins" font-weight="600" font-size="12.5" fill="#21384A" text-anchor="middle">School Life</text></g></svg>`,
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800"><rect width="1280" height="800" fill="#FBF7F2"/>
  <rect x="0" y="0" width="78" height="800" fill="#FFFFFF"/>
  <line x1="78" y1="0" x2="78" y2="800" stroke="#ECE6DE" stroke-width="1.5"/>
  <rect x="23" y="26" rx="12" ry="12" width="32" height="32" fill="#EC6F9C"/>
  <text x="39" y="48" font-family="Poppins" font-weight="800" font-size="15" fill="#FFFFFF" text-anchor="middle">CG</text>
  <rect x="19" y="120" rx="12" ry="12" width="40" height="40" fill="#FCEAF1"/>
  <rect x="29" y="132" width="20" height="16" rx="2" fill="#EC6F9C"/>
  <circle cx="39" cy="210" r="6" fill="#6B7A85"/><rect x="31" y="224" width="16" height="3" rx="1.5" fill="#6B7A85"/>
  <rect x="31" y="280" width="16" height="14" rx="2" fill="none" stroke="#6B7A85" stroke-width="3"/>
  <circle cx="39" cy="352" r="9" fill="none" stroke="#6B7A85" stroke-width="3"/><line x1="46" y1="359" x2="52" y2="365" stroke="#6B7A85" stroke-width="3" stroke-linecap="round"/>
  <text x="106" y="52" font-family="Poppins" font-weight="700" font-size="20" fill="#21384A">Curly Girl ELD</text>
  <text x="106" y="72" font-family="Poppins" font-weight="500" font-size="12.5" letter-spacing="1" fill="#6B7A85">MEMBERSHIP LIBRARY</text>
  <text x="560" y="56" font-family="Poppins" font-weight="600" font-size="14" fill="#6B7A85">Library</text><text x="660" y="56" font-family="Poppins" font-weight="600" font-size="14" fill="#6B7A85">Calendar</text><text x="780" y="56" font-family="Poppins" font-weight="700" font-size="14" fill="#21384A">Credits</text><rect x="777" y="64" width="48" height="3" rx="1.5" fill="#EC6F9C"/>
  <rect x="880" y="34" rx="16" ry="16" width="120" height="32" fill="#FBF1D9"/>
  <text x="940" y="55" font-family="Poppins" font-weight="700" font-size="13" fill="#B8841E" text-anchor="middle">$40 credit</text>
  <circle cx="1040" cy="50" r="20" fill="#A7D3E0"/>
  <text x="1040" y="56" font-family="Poppins" font-weight="700" font-size="15" fill="#FFFFFF" text-anchor="middle">M</text>
  <line x1="78" y1="96" x2="1280" y2="96" stroke="#ECE6DE" stroke-width="1.5"/><g class="ai" style="--d:0.04s"><text x="106" y="150" font-family="Poppins" font-weight="700" font-size="30" fill="#21384A">Everything included, <tspan font-weight="500" fill="#6B7A85">from $9.99/mo.</tspan></text><text x="106" y="178" font-family="Poppins" font-weight="500" font-size="15" fill="#6B7A85">New plans every month, a full curriculum, and store credit that keeps paying you back.</text></g><g class="ai" style="--d:0.14s"><rect x="106" y="200" rx="22" ry="22" width="700" height="200" fill="#EC6F9C"/><text x="140" y="262" font-family="Poppins" font-weight="800" font-size="46" fill="#FFFFFF">$40</text><text x="250" y="248" font-family="Poppins" font-weight="700" font-size="22" fill="#FFFFFF">store credit on Day 1</text><text x="250" y="278" font-family="Poppins" font-weight="500" font-size="15" fill="#FFEAF2">with an annual membership</text><line x1="140" y1="304" x2="772" y2="304" stroke="#F7A8C6" stroke-width="1.5"/><text x="140" y="342" font-family="Poppins" font-weight="600" font-size="15" fill="#FFFFFF">Credits never expire. Spend them on any lesson or bundle</text><text x="140" y="370" font-family="Poppins" font-weight="500" font-size="14" fill="#FFEAF2">in the Curly Girl shop. Your subscription keeps paying for itself.</text></g><g class="ai-r" style="--d:0.24s"><rect x="836" y="200" rx="16" ry="16" width="326" height="58" fill="#FCEAF1"/><circle cx="870" cy="229" r="18" fill="#FFFFFF"/><polygon points="870.0,219.0 872.5,225.5 879.5,225.9 874.1,230.3 875.9,237.1 870.0,233.3 864.1,237.1 865.9,230.3 860.5,225.9 867.5,225.5" fill="#EC6F9C"/><text x="900" y="227" font-family="Poppins" font-weight="700" font-size="16" fill="#21384A">225+ lesson plans</text><text x="900" y="246" font-family="Poppins" font-weight="500" font-size="12" fill="#6B7A85">Classroom-tested library</text></g><g class="ai-r" style="--d:0.34s"><rect x="836" y="268" rx="16" ry="16" width="326" height="58" fill="#E7F2F6"/><circle cx="870" cy="297" r="18" fill="#FFFFFF"/><path d="M 861 298 L 867 304 L 879 290" fill="none" stroke="#3E8FA8" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><text x="900" y="295" font-family="Poppins" font-weight="700" font-size="16" fill="#21384A">WIDA-aligned</text><text x="900" y="314" font-family="Poppins" font-weight="500" font-size="12" fill="#6B7A85">State ELD standards</text></g><g class="ai-r" style="--d:0.44s"><rect x="836" y="336" rx="16" ry="16" width="326" height="58" fill="#FBF1D9"/><circle cx="870" cy="365" r="18" fill="#FFFFFF"/><rect x="860" y="357" width="20" height="18" rx="3" fill="none" stroke="#B8841E" stroke-width="2.6"/><line x1="860" y1="363" x2="880" y2="363" stroke="#B8841E" stroke-width="2.6"/><line x1="865" y1="354" x2="865" y2="360" stroke="#B8841E" stroke-width="2.6" stroke-linecap="round"/><line x1="875" y1="354" x2="875" y2="360" stroke="#B8841E" stroke-width="2.6" stroke-linecap="round"/><text x="900" y="363" font-family="Poppins" font-weight="700" font-size="16" fill="#21384A">New plans monthly</text><text x="900" y="382" font-family="Poppins" font-weight="500" font-size="12" fill="#6B7A85">Delivered on the 1st</text></g><g class="ai" style="--d:0.50s"><rect x="106" y="430" rx="20" ry="20" width="1056" height="150" fill="#FFFFFF" stroke="#ECE6DE" stroke-width="1.5"/><text x="140" y="478" font-family="Poppins" font-weight="700" font-size="60" fill="#F7D6E0">“</text><text x="200" y="486" font-family="Poppins" font-weight="600" font-size="20" fill="#21384A">I used to spend my entire Sunday prepping. Now I spend 20 minutes</text><text x="200" y="516" font-family="Poppins" font-weight="600" font-size="20" fill="#21384A">customizing and I’m done.</text><circle cx="218" cy="552" r="14" fill="#A7D3E0"/><text x="218" y="557" font-family="Poppins" font-weight="700" font-size="13" fill="#FFFFFF" text-anchor="middle">M</text><text x="242" y="557" font-family="Poppins" font-weight="700" font-size="14" fill="#21384A">Maria G. <tspan font-weight="500" fill="#6B7A85">· 7th Grade ELD, California</tspan></text><polygon points="980.0,542.0 982.5,548.5 989.5,548.9 984.1,553.3 985.9,560.1 980.0,556.3 974.1,560.1 975.9,553.3 970.5,548.9 977.5,548.5" fill="#F4D58C"/><polygon points="1006.0,542.0 1008.5,548.5 1015.5,548.9 1010.1,553.3 1011.9,560.1 1006.0,556.3 1000.1,560.1 1001.9,553.3 996.5,548.9 1003.5,548.5" fill="#F4D58C"/><polygon points="1032.0,542.0 1034.5,548.5 1041.5,548.9 1036.1,553.3 1037.9,560.1 1032.0,556.3 1026.1,560.1 1027.9,553.3 1022.5,548.9 1029.5,548.5" fill="#F4D58C"/><polygon points="1058.0,542.0 1060.5,548.5 1067.5,548.9 1062.1,553.3 1063.9,560.1 1058.0,556.3 1052.1,560.1 1053.9,553.3 1048.5,548.9 1055.5,548.5" fill="#F4D58C"/><polygon points="1084.0,542.0 1086.5,548.5 1093.5,548.9 1088.1,553.3 1089.9,560.1 1084.0,556.3 1078.1,560.1 1079.9,553.3 1074.5,548.9 1081.5,548.5" fill="#F4D58C"/></g><g class="ai pulse" style="--d:0.62s"><g><rect x="106" y="612" rx="20" ry="20" width="290" height="40" fill="#EC6F9C"/><text x="251" y="637" font-family="Poppins" font-weight="700" font-size="14" fill="#FFFFFF" text-anchor="middle">Start your membership</text></g><path d="M 350 632 L 366 632 M 360 626 L 366 632 L 360 638" stroke="#FFFFFF" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="430" y="638" font-family="Poppins" font-weight="500" font-size="14" fill="#6B7A85">Cancel or change your plan anytime.</text></g></svg>`
];

const CSS = `
.cg-monitor{position:relative;width:100%;aspect-ratio:1280/800;overflow:hidden;border-radius:inherit;background:#FBF7F2;font-family:var(--font-poppins),'Poppins',system-ui,sans-serif}
.cg-monitor text{font-family:var(--font-poppins),'Poppins',system-ui,sans-serif}
.cg-frame{position:absolute;inset:0;opacity:0;pointer-events:none;transition:opacity .55s ease;will-change:opacity}
.cg-frame svg{width:100%;height:100%;display:block}
.cg-frame.cg-active{opacity:1;pointer-events:auto;z-index:2}
/* per-element entrance: hidden until their frame is active, then staggered via --d */
.cg-frame .ai,.cg-frame .ai-l,.cg-frame .ai-r{opacity:1}
.cg-frame.cg-active .ai{animation:cgUp .6s var(--d,0s) both cubic-bezier(.21,.7,.3,1)}
.cg-frame.cg-active .ai-l{animation:cgLeft .6s var(--d,0s) both cubic-bezier(.21,.7,.3,1)}
.cg-frame.cg-active .ai-r{animation:cgRight .6s var(--d,0s) both cubic-bezier(.21,.7,.3,1)}
.cg-frame.cg-active .pulse{animation:cgUp .6s var(--d,0s) both cubic-bezier(.21,.7,.3,1), cgGlow 2.4s 1.5s ease-in-out infinite}
/* title words: "September" slides in, "drop" bounces down */
.cg-frame .w-sep,.cg-frame .w-drop,.cg-frame .wpop{opacity:1}
.cg-frame .w-drop{transform-box:fill-box;transform-origin:center}
.cg-frame.cg-active .wpop{animation:cgUp .6s var(--d,0s) both cubic-bezier(.34,1.45,.6,1)}
.cg-frame.cg-active .w-sep{animation:cgLeft .6s var(--d,0s) both cubic-bezier(.21,.7,.3,1)}
.cg-frame.cg-active .w-drop{animation:cgStamp .72s var(--d,0s) both cubic-bezier(.3,.9,.3,1)}
@keyframes cgUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes cgLeft{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:none}}
@keyframes cgRight{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:none}}
@keyframes cgStamp{0%{opacity:0;transform:scale(1.9)}45%{opacity:1;transform:scale(.84)}62%{transform:scale(1.08,.9)}78%{transform:scale(.97,1.03)}100%{opacity:1;transform:none}}
@keyframes cgGlow{0%,100%{opacity:1}50%{opacity:.78}}
.cg-dots{position:absolute;left:0;right:0;bottom:14px;display:flex;gap:8px;justify-content:center;z-index:5}
.cg-dot{width:8px;height:8px;border-radius:50%;border:none;padding:0;cursor:pointer;background:#D9CFC4;transition:width .3s,background .3s}
.cg-dot.cg-on{width:22px;border-radius:5px;background:#EC6F9C}
@media (prefers-reduced-motion: reduce){.cg-frame.cg-active .ai,.cg-frame.cg-active .ai-l,.cg-frame.cg-active .ai-r,.cg-frame.cg-active .pulse,.cg-frame.cg-active .w-sep,.cg-frame.cg-active .w-drop,.cg-frame.cg-active .wpop{animation:none}}
`;

export default function MonitorShowcase({
  holds = [5500, 4000],
  showDots = true,
}: {
  holds?: number[];
  showDots?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const hold = holds[active] ?? holds[holds.length - 1] ?? 4000;
    const t = setTimeout(() => setActive((p) => (p + 1) % FRAMES.length), hold);
    return () => clearTimeout(t);
  }, [active, paused]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="cg-monitor"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{CSS}</style>
      {FRAMES.map((svg, i) => (
        <div
          key={i}
          className={"cg-frame" + (i === active ? " cg-active" : "")}
          aria-hidden={i !== active}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ))}
      {showDots && (
        <div className="cg-dots">
          {FRAMES.map((_, i) => (
            <button
              key={i}
              className={"cg-dot" + (i === active ? " cg-on" : "")}
              aria-label={"Go to slide " + (i + 1)}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
