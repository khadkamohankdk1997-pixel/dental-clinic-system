const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI).catch(err => console.log(err));
}

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  patientName: String,
  phone: String,
  email: String,
  service: String,
  preferredDate: String,
  preferredTime: String,
  message: String,
  status: { type: String, default: 'Pending' },
  bookingRef: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// API Routes for Booking
app.post('/api/appointments', async (req, res) => {
  try {
    const bookingRef = 'SMILE-' + Math.floor(100000 + Math.random() * 900000);
    const newAppointment = new Appointment({ ...req.body, bookingRef });
    await newAppointment.save();
    res.json({ success: true, bookingRef });
  } catch (err) {
    res.status(500).json({ error: 'Server error during booking' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Frontend HTML Template
const publicHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SmileCare Dental Studio</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
  .glass { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); }
  .dark-glass { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); }
</style>
</head>
<body class="bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-100 min-h-screen text-slate-800 font-sans">
  <nav id="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 glass">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-2 text-2xl font-bold text-teal-600">
        <i class="fa-solid fa-tooth"></i><span>SmileCare</span>
      </div>
      <div class="hidden md:flex space-x-8 font-medium">
        <a href="#home" class="hover:text-teal-600 transition">Home</a>
        <a href="#services" class="hover:text-teal-600 transition">Services</a>
        <a href="#about" class="hover:text-teal-600 transition">About</a>
        <a href="#contact" class="hover:text-teal-600 transition">Contact</a>
      </div>
      <a href="#booking" class="bg-teal-600 text-white px-5 py-2.5 rounded-full shadow-lg hover:bg-teal-700 transition">Book Visit</a>
    </div>
  </nav>

  <section id="home" class="pt-32 pb-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
    <div>
      <span class="bg-teal-100 text-teal-700 text-sm font-semibold px-4 py-1.5 rounded-full">Advanced Dental Care 2026</span>
      <h1 class="text-5xl font-extrabold mt-6 leading-tight">Your Dream Smile Starts With Expert Care</h1>
      <p class="mt-4 text-lg text-slate-600">Experience world-class dentistry with state-of-the-art technology and absolute comfort in a relaxing environment.</p>
      <div class="mt-8 flex space-x-4">
        <a href="#booking" class="bg-teal-600 text-white px-8 py-3.5 rounded-xl font-medium shadow-xl hover:bg-teal-700 transition">Book Your Visit</a>
        <a href="#services" class="glass border border-teal-200 px-8 py-3.5 rounded-xl font-medium hover:bg-white transition">Our Services</a>
      </div>
    </div>
    <div class="relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
      <div class="relative glass p-4 rounded-3xl shadow-2xl">
        <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80" class="rounded-2xl w-full object-cover h-80" alt="Clinic">
      </div>
    </div>
  </section>

  <section id="services" class="py-20 px-6 max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold">Our Specialized Services</h2>
      <p class="text-slate-600 mt-2">Comprehensive dental treatments tailored for your perfection.</p>
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="glass p-8 rounded-2xl shadow-lg hover:translate-y-[-4px] transition">
        <div class="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 text-2xl mb-6"><i class="fa-solid fa-stethoscope"></i></div>
        <h3 class="text-xl font-bold mb-3">General Checkup</h3>
        <p class="text-slate-600">Routine cleaning, oral exams, and preventive care to keep your teeth sparkling.</p>
      </div>
      <div class="glass p-8 rounded-2xl shadow-lg hover:translate-y-[-4px] transition">
        <div class="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 text-2xl mb-6"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
        <h3 class="text-xl font-bold mb-3">Teeth Whitening</h3>
        <p class="text-slate-600">Advanced laser whitening procedures for an instantly brighter, confident smile.</p>
      </div>
      <div class="glass p-8 rounded-2xl shadow-lg hover:translate-y-[-4px] transition">
        <div class="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 text-2xl mb-6"><i class="fa-solid fa-shield-halved"></i></div>
        <h3 class="text-xl font-bold mb-3">Orthodontics & Implants</h3>
        <p class="text-slate-600">Painless dental implants and modern aligners to perfectly restore your bite.</p>
      </div>
    </div>
  </section>

  <section id="booking" class="py-20 px-6 max-w-3xl mx-auto">
    <div class="glass p-10 rounded-3xl shadow-2xl">
      <h2 class="text-2xl font-bold text-center mb-2">Book Your Appointment</h2>
      <p class="text-center text-slate-600 mb-8">Fill out the form below to reserve your slot instantly.</p>
      <form id="appointmentForm" class="space-y-6">
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2">Full Name</label>
            <input type="text" id="aptName" required class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Phone Number</label>
            <input type="tel" id="aptPhone" required class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500">
          </div>
        </div>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2">Email Address</label>
            <input type="email" id="aptEmail" required class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Select Service</label>
            <select id="aptService" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>General Checkup</option>
              <option>Teeth Whitening</option>
              <option>Orthodontics & Implants</option>
            </select>
          </div>
        </div>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2">Preferred Date</label>
            <input type="date" id="aptDate" required class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Preferred Time</label>
            <input type="time" id="aptTime" required class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Additional Notes</label>
          <textarea id="aptMessage" rows="3" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
        </div>
        <button type="submit" id="submitBtn" class="w-full bg-teal-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-teal-700 transition">Submit Appointment Request</button>
      </form>
    </div>
  </section>

  <footer id="contact" class="bg-slate-900 text-white py-12 px-6 mt-20">
    <div class="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
      <div>
        <h3 class="text-xl font-bold text-teal-400 mb-4">SmileCare Studio</h3>
        <p class="text-slate-400">Providing premium dental care with modern technology.</p>
      </div>
      <div>
        <h4 class="font-bold mb-4">Contact Info</h4>
        <p class="text-slate-400">Mumbai, India</p>
        <p class="text-slate-400">Phone: +91 9876543210</p>
      </div>
      <div>
        <h4 class="font-bold mb-4"><a href="/admin" class="underline hover:text-teal-400">Admin Dashboard Access</a></h4>
        <p class="text-slate-400">&copy; 2026 SmileCare Dental Studio. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <div id="toast" class="fixed bottom-5 right-5 z-50 hidden bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl"></div>

  <script>
    document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.innerText = 'Submitting...';

      const payload = {
        patientName: document.getElementById('aptName').value,
        phone: document.getElementById('aptPhone').value,
        email: document.getElementById('aptEmail').value,
        service: document.getElementById('aptService').value,
        preferredDate: document.getElementById('aptDate').value,
        preferredTime: document.getElementById('aptTime').value,
        message: document.getElementById('aptMessage').value
      };

      try {
        const res = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        const toast = document.getElementById('toast');
        if (res.ok) {
          toast.innerText = 'Success! Booking Ref: ' + data.bookingRef;
          toast.classList.remove('hidden');
          document.getElementById('appointmentForm').reset();
          setTimeout(() => toast.classList.add('hidden'), 5000);
        } else {
          toast.innerText = 'Submission failed.';
          toast.classList.remove('hidden');
          setTimeout(() => toast.classList.add('hidden'), 4000);
        }
      } catch (err) {
        alert('Network error');
      } finally {
        btn.disabled = false;
        btn.innerText = 'Submit Appointment Request';
      }
    });
  </script>
</body>
</html>`;

app.get('/', (req, res) => {
  res.send(publicHTML);
});

module.exports = app;
      
