/**
 * Database Seeder
 * Run: node seed.js
 * Seeds default Admin, Footer, About, and a sample Event.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Admin = require('./models/Admin');
const Footer = require('./models/Footer');
const About = require('./models/About');
const Event = require('./models/Event');

const seed = async () => {
  await connectDB();

  try {
    console.log('🌱 Starting database seeder...\n');

    // ── Admin ─────────────────────────────────────────────────────────────────
    const existingAdmin = await Admin.findOne({ username: 'Admin' });
    if (!existingAdmin) {
      await Admin.create({ username: 'Admin', password: 'admin123' });
      console.log('✅ Admin created: username=Admin, password=admin123');
    } else {
      console.log('ℹ️  Admin already exists, skipping.');
    }

    // ── Footer ────────────────────────────────────────────────────────────────
    const existingFooter = await Footer.findOne({ isActive: true });
    if (!existingFooter) {
      await Footer.create({
        schoolName: 'Rajabari Hat High School',
        batchName: 'SSC Batch-2019',
        groupName: "Backbencher's 19",
        tagline: 'Once a backbencher, always a legend.',
        description: "A digital home for the SSC Batch-2019 graduates of Rajabari Hat High School. Reliving memories, celebrating milestones, and staying connected forever.",
        socialLinks: {
          facebook: 'https://facebook.com',
          instagram: 'https://instagram.com',
          youtube: 'https://youtube.com',
        },
        quickLinks: [
          { label: 'Home', url: '/' },
          { label: 'About', url: '/about' },
          { label: 'Events', url: '/events' },
          { label: 'Gallery', url: '/gallery' },
          { label: 'Blogs', url: '/blogs' },
        ],
      });
      console.log('✅ Footer config created.');
    } else {
      console.log('ℹ️  Footer already exists, skipping.');
    }

    // ── About ─────────────────────────────────────────────────────────────────
    const existingAbout = await About.findOne({ isActive: true });
    if (!existingAbout) {
      await About.create({
        heroTitle: "We Are the Backbenchers",
        heroSubtitle: "SSC Batch-2019 | Rajabari Hat High School",
        story: "We were the ones who sat at the back of the class — not because we didn't care, but because we saw the world differently. The backbenchers of SSC Batch-2019, Rajabari Hat High School. We laughed louder, dreamed bigger, and stuck together through every chapter of life.",
        mission: "To keep the bonds of friendship alive, celebrate every milestone together, and inspire the next generation from our school.",
        vision: "To build a thriving alumni community that gives back to Rajabari Hat High School and uplifts each other.",
        stats: [
          { label: 'Batch Year', value: '2019', icon: '🎓' },
          { label: 'Members', value: '50+', icon: '👥' },
          { label: 'Events Held', value: '3+', icon: '🎉' },
          { label: 'School Legacy', value: '50+ Yrs', icon: '🏫' },
        ],
      });
      console.log('✅ About page seeded.');
    } else {
      console.log('ℹ️  About already exists, skipping.');
    }

    // ── Sample Event ──────────────────────────────────────────────────────────
    const existingEvent = await Event.findOne({ title: 'Annual Reunion 2024' });
    if (!existingEvent) {
      await Event.create({
        title: 'Annual Reunion 2024',
        description: "The biggest reunion of SSC Batch-2019! Come celebrate 5 years after passing SSC. A night of nostalgia, laughter, and memories. Don't miss it!",
        date: new Date('2024-12-20'),
        venue: 'Rajabari Hat High School Grounds',
        status: 'active',
        registrationDeadline: new Date('2024-12-15'),
        maxParticipants: 100,
        formSchema: [
          { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true, order: 1 },
          { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', required: false, order: 2 },
          { name: 'phone', label: 'Mobile Number', type: 'phone', placeholder: '01XXXXXXXXX', required: true, order: 3 },
          { name: 'group', label: 'Your Class/Group', type: 'select', options: ['Science', 'Humanities', 'Commerce'], required: true, order: 4 },
          { name: 'message', label: 'A Memory or Message', type: 'textarea', placeholder: 'Share a favorite memory...', required: false, order: 5 },
        ],
      });
      console.log('✅ Sample event created (Annual Reunion 2024) — status: active');
    } else {
      console.log('ℹ️  Sample event already exists, skipping.');
    }

    console.log('\n🎉 Seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
