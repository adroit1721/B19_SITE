require('dotenv').config();
const mongoose = require('mongoose');

const fixRegistrations = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'backbenchers19' });
    const Registration = mongoose.connection.db.collection('registrations');
    
    const regs = await Registration.find({ name: 'Anonymous' }).toArray();
    console.log(`Found ${regs.length} anonymous registrations.`);
    
    for (const reg of regs) {
      const formData = reg.formData || {};
      
      const getVal = (patterns) => {
        for (const p of patterns) {
          const key = Object.keys(formData).find(k => k.toLowerCase().includes(p.toLowerCase()));
          if (key && formData[key]) return formData[key];
        }
        return null;
      };

      const name = getVal(['name', 'full', 'participant', 'member']) || 'Anonymous';
      const phone = getVal(['phone', 'mobile', 'cell', 'contact', 'jersey']) || '';
      
      await Registration.updateOne(
        { _id: reg._id },
        { $set: { name, phone } }
      );
      console.log(`Updated ${reg._id}: ${name} (${phone})`);
    }
    
    console.log('Fix complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixRegistrations();
