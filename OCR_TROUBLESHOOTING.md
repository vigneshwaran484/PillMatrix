# OCR Troubleshooting Guide 🔍

## Issue: OCR Extract Text Not Working

### Quick Fixes

#### 1. **Test OCR Functionality**
Navigate to: **http://localhost:5173/ocr-test**

This dedicated test page will help you:
- ✅ Upload images
- ✅ See detailed console logs
- ✅ View extraction progress
- ✅ Check for errors
- ✅ Verify Tesseract.js is working

#### 2. **Check Browser Console**
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Look for these messages:

**Success:**
```
🔍 Starting OCR extraction...
📸 Image data length: 123456 characters
🔧 Creating Tesseract worker...
✅ Worker created successfully!
📊 recognizing text: 50%
📊 recognizing text: 100%
✅ OCR extraction complete!
📝 Extracted text: [your text]
📊 Confidence: 85.50%
```

**Error:**
```
❌ OCR extraction failed: [error message]
```

### Common Issues & Solutions

#### Issue 1: "Failed to extract text"

**Possible Causes:**
- Image file is corrupted
- Image is too large
- Network issue loading Tesseract.js
- Browser compatibility

**Solutions:**
1. **Try a different image**
   - Use a clear, well-lit photo
   - Ensure text is readable
   - Try a smaller file size (< 5MB)

2. **Refresh the page**
   - Hard refresh: `Ctrl + Shift + R`
   - Clear cache and reload

3. **Check internet connection**
   - Tesseract.js downloads language data on first use
   - Requires stable internet connection

4. **Try different browser**
   - Chrome (recommended)
   - Firefox
   - Edge

#### Issue 2: "No text could be extracted"

**Possible Causes:**
- Image has no readable text
- Text is too blurry
- Poor image quality
- Handwriting is illegible

**Solutions:**
1. **Improve image quality**
   - Use better lighting
   - Hold camera steady
   - Get closer to the text
   - Use higher resolution

2. **Try printed text first**
   - Test with typed/printed prescription
   - Verify OCR is working
   - Then try handwritten

3. **Adjust image**
   - Rotate if needed
   - Crop to text area
   - Increase contrast

#### Issue 3: Button stays in "Extracting..." state

**Possible Causes:**
- Tesseract.js worker crashed
- Large image taking too long
- Memory issue

**Solutions:**
1. **Refresh the page**
2. **Use smaller image** (< 2MB recommended)
3. **Close other tabs** to free memory
4. **Wait longer** (can take 10-30 seconds for large images)

#### Issue 4: Extracted text is gibberish

**Possible Causes:**
- Poor image quality
- Wrong language setting
- Unusual font/handwriting

**Solutions:**
1. **Manually edit** the extracted text
2. **Use clearer image**
3. **Type manually** if OCR fails repeatedly

### Best Practices for OCR

#### Image Quality ✅
- **Resolution**: At least 300 DPI
- **Lighting**: Bright, even lighting
- **Focus**: Sharp, clear text
- **Angle**: Straight-on, not tilted
- **Background**: Plain, contrasting background

#### What Works Best:
- ✅ Typed/printed prescriptions
- ✅ Clear handwriting
- ✅ Black text on white paper
- ✅ Well-lit photos
- ✅ High-resolution images

#### What Doesn't Work Well:
- ❌ Very messy handwriting
- ❌ Blurry images
- ❌ Poor lighting/shadows
- ❌ Tilted/rotated images
- ❌ Low resolution
- ❌ Colored backgrounds

### Testing Steps

#### Step 1: Test with Sample Image
1. Go to `/ocr-test`
2. Upload this sample prescription:
```
Rx
Tab. Metformin 500mg
1-0-1 (Twice daily)
Duration: 7 days

Tab. Lisinopril 10mg
1-0-0 (Once daily)
Duration: 30 days

Diagnosis: Type 2 Diabetes, Hypertension
```
3. Take a clear photo of this text
4. Upload and test

#### Step 2: Check Console Logs
Look for:
- ✅ Worker creation
- ✅ Progress updates
- ✅ Successful extraction
- ✅ Text output

#### Step 3: Verify Text Output
- Check if text is readable
- Verify confidence score (> 70% is good)
- Look for medication names

### Technical Debugging

#### Check Tesseract.js Installation
```bash
npm list tesseract.js
```

Should show:
```
tesseract.js@5.x.x
```

#### Reinstall if needed
```bash
npm uninstall tesseract.js
npm install tesseract.js
```

#### Check Network Tab
1. Open DevTools → Network tab
2. Look for `eng.traineddata.gz` download
3. Should be ~4MB file
4. Status should be 200 OK

#### Memory Issues
If browser crashes or freezes:
1. Close other tabs
2. Use smaller images
3. Restart browser
4. Clear browser cache

### Error Messages Explained

#### "Failed to load language data"
- **Cause**: Network issue or CORS problem
- **Fix**: Check internet connection, refresh page

#### "Worker creation failed"
- **Cause**: Browser doesn't support Web Workers
- **Fix**: Update browser or use different one

#### "Out of memory"
- **Cause**: Image too large
- **Fix**: Compress image, close other tabs

#### "Invalid image format"
- **Cause**: Unsupported file type
- **Fix**: Convert to JPG or PNG

### Alternative Solutions

#### If OCR Continues to Fail:

1. **Manual Entry**
   - Skip OCR extraction
   - Manually add medications
   - Still saves to database

2. **Use PrescriptionWriter**
   - Traditional form-based entry
   - No OCR required
   - More reliable for complex prescriptions

3. **Hybrid Approach**
   - Extract what you can with OCR
   - Manually correct/complete
   - Best of both worlds

### Performance Tips

#### For Faster OCR:
1. **Crop images** to text area only
2. **Reduce resolution** to 1024px max width
3. **Use JPG** instead of PNG
4. **Close other tabs** to free memory
5. **Use Chrome** for best performance

#### Expected Processing Times:
- Small image (< 500KB): 5-10 seconds
- Medium image (500KB - 2MB): 10-20 seconds
- Large image (> 2MB): 20-40 seconds

### Browser Compatibility

#### Fully Supported:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

#### Not Supported:
- ❌ Internet Explorer
- ❌ Very old browsers

### Getting Help

#### Debug Information to Provide:
1. Browser name and version
2. Image file size
3. Console error messages
4. Screenshot of issue
5. Steps to reproduce

#### Where to Check:
1. Browser console (F12)
2. Network tab (for download issues)
3. `/ocr-test` page (for detailed logs)

### Success Checklist

Before reporting an issue, verify:
- [ ] Image is clear and readable
- [ ] File size < 5MB
- [ ] Browser is up to date
- [ ] Internet connection is stable
- [ ] Tried `/ocr-test` page
- [ ] Checked browser console
- [ ] Tried different image
- [ ] Refreshed the page

### Summary

**Most Common Fix:**
1. Go to `/ocr-test`
2. Upload a clear, printed prescription
3. Check console for errors
4. If it works there, it should work in the uploader

**If All Else Fails:**
- Use manual entry mode
- Skip OCR and type medications directly
- Still creates digital prescription

The OCR feature is a convenience tool - if it doesn't work perfectly, you can always enter data manually! 🎯
