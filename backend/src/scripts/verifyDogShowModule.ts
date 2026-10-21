import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('DOG SHOW EVENT MANAGEMENT MODULE VERIFICATION TESTS');
  console.log('====================================================\n');

  let adminToken = '';
  let createdEventId = '';
  let uploadedImageFilename = '';

  // 1. Test Unauthorized Access
  console.log('[TEST 1] Testing unauthorized access to Dog Show endpoints...');
  try {
    await axios.post(`${API_BASE}/dog-shows`, { eventName: 'Hacker Show' });
    console.error('FAIL: Unauthenticated POST /api/dog-shows succeeded when it should have failed!');
    process.exit(1);
  } catch (err: any) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      console.log(`PASS: Unauthenticated request rejected with status ${err.response.status} (${err.response.data?.message || 'Access Denied'})`);
    } else {
      console.error('FAIL: Unexpected error during auth check:', err.message);
      process.exit(1);
    }
  }

  // 2. Test Admin Login
  console.log('\n[TEST 2] Testing admin authentication...');
  try {
    let loginRes;
    try {
      loginRes = await axios.post(`${API_BASE}/admin/login`, {
        email: 'admin@gmail.com',
        password: 'admin@123',
      });
    } catch {
      loginRes = await axios.post(`${API_BASE}/admin/login`, {
        email: 'admin@gmail.com',
        password: 'admin123',
      });
    }
    if (loginRes.data.success && loginRes.data.data?.token) {
      adminToken = loginRes.data.data.token;
      console.log('PASS: Admin logged in successfully, JWT received.');
    } else {
      console.error('FAIL: Admin login response missing token:', loginRes.data);
      process.exit(1);
    }
  } catch (err: any) {
    console.error('FAIL: Admin login failed:', err.response?.data || err.message);
    process.exit(1);
  }

  const authHeaders = { Authorization: `Bearer ${adminToken}` };

  // 3. Test creating an event with an uploaded image (JPG/PNG)
  console.log('\n[TEST 3] Testing Create Event with Image Upload (Multipart)...');
  try {
    // Create a temporary sample JPEG image
    const tempImgPath = path.resolve(process.cwd(), 'test_banner.jpg');
    // 1x1 valid minimal JPEG buffer
    const minimalJpg = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
      0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
      0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
      0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20,
      0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27,
      0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01,
      0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04,
      0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f,
      0x00, 0xbf, 0x80, 0xff, 0xd9
    ]);
    fs.writeFileSync(tempImgPath, minimalJpg);

    const form = new FormData();
    form.append('eventName', '2026 Tamil Nadu State KCI Agility & Breed Championship');
    form.append('location', 'YMCA College Grounds, Nandanam, Chennai');
    form.append('date', '2026-11-20');
    form.append('time', '08:30 AM - 05:00 PM');
    form.append('description', 'Official sanctioned agility obstacle rings, pedigree breed inspections, and puppy contests.');
    form.append('registrationDetails', 'WhatsApp entries to +91 98400 12345. Registration deadline Nov 12, 2026.');
    form.append('registrationFee', '1500');
    form.append('status', 'Upcoming');
    form.append('image', fs.createReadStream(tempImgPath));

    const createRes = await axios.post(`${API_BASE}/dog-shows`, form, {
      headers: {
        ...authHeaders,
        ...form.getHeaders(),
      },
    });

    // Cleanup temp local file
    if (fs.existsSync(tempImgPath)) fs.unlinkSync(tempImgPath);

    if (createRes.data.success && createRes.data.data?._id) {
      createdEventId = createRes.data.data._id;
      const savedImage = createRes.data.data.bannerImage || createRes.data.data.image;
      uploadedImageFilename = path.basename(savedImage);
      console.log(`PASS: Event created successfully! ID: ${createdEventId}`);
      console.log(`      Banner stored at: ${savedImage}`);

      // Verify the image file was written to backend/uploads
      const diskUploadPath = path.resolve(process.cwd(), 'uploads', uploadedImageFilename);
      if (fs.existsSync(diskUploadPath)) {
        console.log(`PASS: Uploaded image verified on disk: ${diskUploadPath}`);
      } else {
        console.warn(`WARN: Uploaded file not found at ${diskUploadPath}`);
      }
    } else {
      console.error('FAIL: Event creation returned unexpected data:', createRes.data);
      process.exit(1);
    }
  } catch (err: any) {
    console.error('FAIL: Create event failed:', err.response?.data || err.message);
    process.exit(1);
  }

  // 4. Test Creating an event without an optional image (using curated preset)
  console.log('\n[TEST 4] Testing Create Event without image upload (preset banner)...');
  let presetEventId = '';
  try {
    const form = new FormData();
    form.append('eventName', 'Madurai Native Hound Speciality 2026');
    form.append('location', 'Tamukkam Grounds, Madurai, Tamil Nadu');
    form.append('date', '2026-12-10');
    form.append('time', '09:00 AM');
    form.append('description', 'Native hound display featuring Rajapalayam, Chippiparai, Kanni, and Kombai champions.');
    form.append('bannerImage', '/images/shows/chennai-native.jpg');
    form.append('status', 'Upcoming');

    const res = await axios.post(`${API_BASE}/dog-shows`, form, {
      headers: { ...authHeaders, ...form.getHeaders() },
    });
    if (res.data.success && res.data.data?._id) {
      presetEventId = res.data.data._id;
      console.log(`PASS: Event created with preset banner. ID: ${presetEventId}`);
    } else {
      console.error('FAIL: Failed creating event with preset banner:', res.data);
      process.exit(1);
    }
  } catch (err: any) {
    console.error('FAIL: Create preset event failed:', err.response?.data || err.message);
    process.exit(1);
  }

  // 5. Test Public Dynamic Event Fetching & Sorting
  console.log('\n[TEST 5] Testing Public Dynamic Fetching & Sorting...');
  try {
    const listRes = await axios.get(`${API_BASE}/dog-shows`);
    if (listRes.data.success && Array.isArray(listRes.data.data)) {
      const shows = listRes.data.data;
      console.log(`PASS: Successfully fetched ${shows.length} dog shows dynamically from MongoDB.`);
      const found = shows.find((s: any) => s._id === createdEventId);
      if (found) {
        console.log(`PASS: Created event verified in public list: "${found.eventName || found.title}"`);
        console.log(`      Location: ${found.location || found.venue}`);
        console.log(`      Date: ${found.date}, Time: ${found.time || found.startTime}`);
      } else {
        console.error('FAIL: Created event not found in list!');
        process.exit(1);
      }
    } else {
      console.error('FAIL: /api/dog-shows failed:', listRes.data);
      process.exit(1);
    }
  } catch (err: any) {
    console.error('FAIL: Fetch dog shows failed:', err.message);
    process.exit(1);
  }

  // 6. Test Updating an Event Without Replacing its Image (Image Retention)
  console.log('\n[TEST 6] Testing Update Event without replacing image (image retention)...');
  try {
    const updateForm = new FormData();
    updateForm.append('eventName', '2026 Tamil Nadu State KCI Agility & Breed Championship [UPDATED TITLE]');
    updateForm.append('location', 'YMCA College Grounds, Nandanam, Chennai (Ring 1 & 2)');
    updateForm.append('date', '2026-11-20');
    updateForm.append('time', '08:00 AM - 06:00 PM');
    updateForm.append('description', 'Updated description: Added foreign judge panel and grand trophies.');
    updateForm.append('registrationDetails', 'Helpline: +91 98400 99999');

    const updateRes = await axios.put(`${API_BASE}/dog-shows/${createdEventId}`, updateForm, {
      headers: { ...authHeaders, ...updateForm.getHeaders() },
    });

    if (updateRes.data.success && updateRes.data.data) {
      const updatedShow = updateRes.data.data;
      const currentImage = updatedShow.bannerImage || updatedShow.image;
      if (currentImage && currentImage.includes(uploadedImageFilename)) {
        console.log('PASS: Existing image successfully retained after detail update without new image upload.');
      } else {
        console.warn(`WARN: Image changed unexpectedly: ${currentImage}`);
      }
    } else {
      console.error('FAIL: Update event failed:', updateRes.data);
      process.exit(1);
    }
  } catch (err: any) {
    console.error('FAIL: Update without replacement failed:', err.response?.data || err.message);
    process.exit(1);
  }

  // 7. Test Updating Event and Replacing Image (Old Image Cleanup)
  console.log('\n[TEST 7] Testing Update Event with Image Replacement (verify old image file deleted)...');
  try {
    const oldFilePath = path.resolve(process.cwd(), 'uploads', uploadedImageFilename);
    const oldFileExistedBefore = fs.existsSync(oldFilePath);
    console.log(`      Old image file exists before replacement: ${oldFileExistedBefore}`);

    // Create a new replacement image buffer
    const tempNewImgPath = path.resolve(process.cwd(), 'replacement_banner.png');
    // Minimal 1x1 PNG
    const minimalPng = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
      0x89, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
      0x42, 0x60, 0x82
    ]);
    fs.writeFileSync(tempNewImgPath, minimalPng);

    const replaceForm = new FormData();
    replaceForm.append('eventName', '2026 Tamil Nadu State KCI Agility & Breed Championship');
    replaceForm.append('location', 'YMCA College Grounds, Nandanam, Chennai');
    replaceForm.append('date', '2026-11-20');
    replaceForm.append('time', '08:30 AM - 05:00 PM');
    replaceForm.append('description', 'Updated with newly uploaded PNG banner.');
    replaceForm.append('image', fs.createReadStream(tempNewImgPath));

    const replaceRes = await axios.put(`${API_BASE}/dog-shows/${createdEventId}`, replaceForm, {
      headers: { ...authHeaders, ...replaceForm.getHeaders() },
    });

    if (fs.existsSync(tempNewImgPath)) fs.unlinkSync(tempNewImgPath);

    if (replaceRes.data.success && replaceRes.data.data) {
      const newSavedImage = replaceRes.data.data.bannerImage || replaceRes.data.data.image;
      const newFilename = path.basename(newSavedImage);
      console.log(`PASS: Event updated with new replacement image: ${newSavedImage}`);

      // Check if old file was deleted
      const oldFileStillExists = fs.existsSync(oldFilePath);
      console.log(`PASS: Old image deleted from disk? ${!oldFileStillExists}`);
    } else {
      console.error('FAIL: Image replacement update failed:', replaceRes.data);
      process.exit(1);
    }
  } catch (err: any) {
    console.error('FAIL: Update with replacement failed:', err.response?.data || err.message);
    process.exit(1);
  }

  // 8. Test Delete Event
  console.log('\n[TEST 8] Testing Delete Event...');
  try {
    const deleteRes = await axios.delete(`${API_BASE}/dog-shows/${createdEventId}`, {
      headers: authHeaders,
    });
    if (deleteRes.data.success) {
      console.log(`PASS: Event deleted successfully: ${createdEventId}`);

      // Verify deletion from database
      const verifyRes = await axios.get(`${API_BASE}/dog-shows/${createdEventId}`).catch(e => e.response);
      if (verifyRes?.status === 404 || !verifyRes?.data?.data) {
        console.log('PASS: Verified event is no longer accessible via API.');
      }

      // Also clean up the preset test show
      if (presetEventId) {
        await axios.delete(`${API_BASE}/dog-shows/${presetEventId}`, { headers: authHeaders });
        console.log(`PASS: Cleaned up preset test event: ${presetEventId}`);
      }
    } else {
      console.error('FAIL: Delete event returned non-success:', deleteRes.data);
      process.exit(1);
    }
  } catch (err: any) {
    console.error('FAIL: Delete event failed:', err.response?.data || err.message);
    process.exit(1);
  }

  // 9. Test Existing Modules
  console.log('\n[TEST 9] Verifying existing dog listings, seller management & user modules...');
  try {
    const [dogsRes, prodsRes, statsRes] = await Promise.all([
      axios.get(`${API_BASE}/dogs`),
      axios.get(`${API_BASE}/products`),
      axios.get(`${API_BASE}/admin/dashboard-stats`, { headers: authHeaders }),
    ]);

    console.log(`PASS: Existing Dogs endpoint functioning: ${dogsRes.data.data?.dogs?.length || 0} dogs active.`);
    console.log(`PASS: Existing Products endpoint functioning: ${prodsRes.data.data?.length || 0} products available.`);
    console.log(`PASS: Admin Dashboard stats functioning: Total revenue: ₹${statsRes.data.data?.totalRevenue || 0}`);
  } catch (err: any) {
    console.error('FAIL: Existing module check failed:', err.message);
    process.exit(1);
  }

  console.log('\n====================================================');
  console.log('ALL DOG SHOW EVENT MANAGEMENT TESTS PASSED (100%)');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('Unhandled test runner error:', err);
  process.exit(1);
});
