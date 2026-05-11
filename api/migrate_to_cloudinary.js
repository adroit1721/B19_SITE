require('dotenv').config();
const mongoose = require('mongoose');
const { cloudinary } = require('./config/cloudinary');
const Gallery = require('./models/Gallery');
const Event = require('./models/Event');
const Blog = require('./models/Blog');
const Settings = require('./models/Settings');

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const uploadToBase64 = async (base64String, folder) => {
      try {
        const result = await cloudinary.uploader.upload(base64String, {
          folder: `backbenchers19/${folder}`,
        });
        return result.secure_url;
      } catch (err) {
        console.error('Upload failed:', err.message);
        return null;
      }
    };

    // 1. Gallery
    const galleryItems = await Gallery.find({ url: /^data:/ });
    console.log(`Found ${galleryItems.length} gallery items to migrate`);
    for (const item of galleryItems) {
      console.log(`Migrating Gallery: ${item.title}`);
      const newUrl = await uploadToBase64(item.url, 'gallery');
      if (newUrl) {
        item.url = newUrl;
        item.thumbnail = newUrl;
        await item.save();
      }
    }

    // 2. Events
    const events = await Event.find({ coverImage: /^data:/ });
    console.log(`Found ${events.length} events to migrate`);
    for (const event of events) {
      console.log(`Migrating Event: ${event.title}`);
      const newUrl = await uploadToBase64(event.coverImage, 'events');
      if (newUrl) {
        event.coverImage = newUrl;
        await event.save();
      }
    }

    // 3. Blogs
    const blogs = await Blog.find({ coverImage: /^data:/ });
    console.log(`Found ${blogs.length} blogs to migrate`);
    for (const blog of blogs) {
      console.log(`Migrating Blog: ${blog.title}`);
      const newUrl = await uploadToBase64(blog.coverImage, 'blogs');
      if (newUrl) {
        blog.coverImage = newUrl;
        await blog.save();
      }
    }

    // 4. Settings
    const settings = await Settings.findOne();
    if (settings) {
      let updated = false;
      if (settings.logoUrl?.startsWith('data:')) {
        console.log('Migrating Logo');
        const newUrl = await uploadToBase64(settings.logoUrl, 'branding');
        if (newUrl) { settings.logoUrl = newUrl; updated = true; }
      }
      if (settings.faviconUrl?.startsWith('data:')) {
        console.log('Migrating Favicon');
        const newUrl = await uploadToBase64(settings.faviconUrl, 'branding');
        if (newUrl) { settings.faviconUrl = newUrl; updated = true; }
      }
      if (updated) await settings.save();
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

migrate();
