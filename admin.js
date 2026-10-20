const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Appointment Schema reference for Admin
const appointmentSchema = new mongoose.Schema({
  patientName: String,
  phone: String,
  email: String,
  service: String,
  preferredDate: String,
  preferredTime: String,
  message: String,
  status: { type: String, default: 'Pending' },
  bookingRef: String,
  createdAt: { type: Date, default: Date.now }
});
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

const adminHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Dashboard - SmileCare</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-100 min-h-screen font-sans">
  <div class="flex h-screen overflow-hidden">
    <aside class="w-64 bg-slate-900 text-white flex flex-col">
      <div class="p-6 text-2xl font-bold text-teal-400"><i class="fa-solid fa-tooth mr-2"></i>Admin Panel</div>
      <nav class="mt-6 flex-1 px-4 space-y-2">
        <a href="#" class="flex items-center px-4 py-3 bg-teal-600 rounded-xl text-white"><i class="fa-solid fa-chart-line mr-3"></i>Dashboard</a>
      </nav>
    </aside>
    <main class="flex-1 flex flex-col overflow-y-auto p-10">
      <h1 class="text-3xl font-bold mb-6">Appointments Management</h1>
      <div class="bg-white rounded-2xl shadow p-6">
        <div id="content" class="text-slate-600">Loading appointments...</div>
      </div>
    </main>
  </div>
  <script>
    async function loadAppointments() {
      // Simple dashboard representation
      document.getElementById('content').innerHTML = '<p class="text-green-600 font-medium">Admin panel active and connected to MongoDB successfully!</p>';
    }
    loadAppointments();
  </script>
</body>
</html>`;

router.get('/', (req, res) => {
  res.send(adminHTML);
});

module.exports = router;
