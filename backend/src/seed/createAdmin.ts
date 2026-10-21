import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/database.js';
import { User } from '../models/User.js';

export const createOrUpdateAdmin = async () => {
  try {
    console.log('[ Admin Seed ] Connecting to MongoDB database...');
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
    const plainPassword = process.env.ADMIN_PASSWORD || 'admin@123';

    console.log(`[ Admin Seed ] Hashing password with bcrypt (salt rounds = 12)...`);
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    let admin = await User.findOne({ email: adminEmail }).select('+password');

    if (!admin) {
      console.log(`[ Admin Seed ] Admin account ${adminEmail} does not exist. Creating new SUPER_ADMIN...`);
      admin = await User.create({
        fullName: 'PawVerse AI Super Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '+91 98765 00000',
        role: 'SUPER_ADMIN',
        emailVerified: true,
        accountStatus: 'ACTIVE',
      });
      console.log(`[ Admin Seed ] SUPER_ADMIN created successfully with ID: ${admin._id}`);
    } else {
      console.log(`[ Admin Seed ] Admin account ${adminEmail} already exists. Updating credentials...`);
      admin.role = 'SUPER_ADMIN';
      admin.accountStatus = 'ACTIVE';
      admin.emailVerified = true;
      admin.password = hashedPassword;
      await admin.save();
      console.log(`[ Admin Seed ] SUPER_ADMIN account updated successfully!`);
    }

    console.log(`\n==================================================`);
    console.log(` 👑 PawVerse Admin Credentials Verified:`);
    console.log(` 📧 Email: ${adminEmail}`);
    console.log(` 🔑 Password: ${plainPassword}`);
    console.log(` 🛡️ Role: ${admin.role}`);
    console.log(` ⚡ Account Status: ${admin.accountStatus}`);
    console.log(`==================================================\n`);

    return admin;
  } catch (error: any) {
    console.error('[ Admin Seed Error ] Failed to create/update admin:', error.message);
    throw error;
  }
};

if (process.argv[1]?.includes('createAdmin')) {
  createOrUpdateAdmin()
    .then(() => {
      mongoose.disconnect();
      process.exit(0);
    })
    .catch(() => {
      mongoose.disconnect();
      process.exit(1);
    });
}
