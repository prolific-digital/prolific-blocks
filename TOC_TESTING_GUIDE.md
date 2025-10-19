# Table of Contents Block - Testing Guide

## Fix Overview

Fixed the heading filter issue where TOC links pointed to wrong headings when:
- Multiple headings had identical text
- Some heading levels were filtered out (e.g., exclude H1)

## Quick Test

### Setup Test Page

1. Create a new WordPress page
2. Add the following heading blocks:

```
H1: hello
H2: hello
H3: hello
H2: world
```

3. Add a Table of Contents block
4. Configure TOC settings:
   - Exclude H1 (uncheck "Include H1")
   - Include H2-H6 (check all others)
5. Save and publish the page

### Expected Results

**In the Editor Preview:**
- TOC should show 3 entries:
  - "hello" (H2)
  - "hello" (H3)
  - "world" (H2)

**On the Frontend:**
1. Inspect the heading IDs in browser DevTools:
   - H1 "hello" should have `id="hello"`
   - H2 "hello" should have `id="hello-2"`
   - H3 "hello" should have `id="hello-3"`
   - H2 "world" should have `id="world"`

2. Check the TOC links:
   - First "hello" link should have `href="#hello-2"`
   - Second "hello" link should have `href="#hello-3"`
   - "world" link should have `href="#world"`

3. Click the first "hello" link in TOC:
   - Should scroll to the H2 "hello" (NOT the H1)
   - Browser should scroll to the second heading on the page

## Comprehensive Test Cases

### Test Case 1: All Same Text, H1 Filtered

**Headings:**
- H1: "test"
- H2: "test"
- H3: "test"
- H2: "test"

**TOC Settings:** Exclude H1, Include H2-H6

**Expected IDs:**
- H1: `id="test"`
- H2: `id="test-2"`
- H3: `id="test-3"`
- H2: `id="test-4"`

**Expected TOC:**
- "test" → `#test-2` (first H2)
- "test" → `#test-3` (H3)
- "test" → `#test-4` (second H2)

**Verify:** Click each TOC link and confirm it scrolls to the correct heading.

### Test Case 2: Mix of Unique and Duplicate Text

**Headings:**
- H1: "Introduction"
- H2: "Overview"
- H2: "Introduction"
- H3: "Introduction"
- H2: "Conclusion"

**TOC Settings:** Exclude H1, Include H2-H6

**Expected IDs:**
- H1 "Introduction": `id="introduction"`
- H2 "Overview": `id="overview"`
- H2 "Introduction": `id="introduction-2"`
- H3 "Introduction": `id="introduction-3"`
- H2 "Conclusion": `id="conclusion"`

**Expected TOC:**
- "Overview" → `#overview`
- "Introduction" → `#introduction-2`
- "Introduction" → `#introduction-3`
- "Conclusion" → `#conclusion`

### Test Case 3: All Levels Enabled

**Headings:**
- H1: "hello"
- H2: "hello"

**TOC Settings:** Include ALL levels (H1-H6)

**Expected IDs:**
- H1: `id="hello"`
- H2: `id="hello-2"`

**Expected TOC:**
- "hello" → `#hello` (H1)
- "hello" → `#hello-2` (H2)

### Test Case 4: Custom Anchors

**Headings:**
- H1: "hello" (set custom anchor: "custom-h1")
- H2: "hello" (no custom anchor)
- H2: "hello" (no custom anchor)

**TOC Settings:** Exclude H1, Include H2-H6

**Expected IDs:**
- H1: `id="custom-h1"`
- H2: `id="hello"`
- H2: `id="hello-2"`

**Expected TOC:**
- "hello" → `#hello` (first H2)
- "hello" → `#hello-2` (second H2)

### Test Case 5: Special Characters in Text

**Headings:**
- H1: "What's New?"
- H2: "What's New?"
- H3: "What's New?"

**TOC Settings:** Exclude H1, Include H2-H6

**Expected IDs:**
- H1: `id="whats-new"`
- H2: `id="whats-new-2"`
- H3: `id="whats-new-3"`

**Expected TOC:**
- "What's New?" → `#whats-new-2` (H2)
- "What's New?" → `#whats-new-3` (H3)

## Testing in the Editor

1. Open WordPress Block Editor
2. Add headings and TOC block as described above
3. Open TOC block settings in the sidebar
4. Toggle different heading level checkboxes
5. Observe that preview updates correctly
6. Verify preview shows correct headings based on filters

## Testing Behavior Features

### Smooth Scroll

1. Enable "Smooth Scroll" in TOC settings
2. Click a TOC link
3. Verify smooth scrolling animation

### Scroll Offset

1. Set "Scroll Offset" to 100px
2. Click a TOC link
3. Verify heading stops 100px from top of viewport

### Collapsible

1. Enable "Collapsible" in TOC settings
2. Click the toggle button
3. Verify TOC content expands/collapses

### Active Section Highlighting

1. Scroll through the page
2. Observe TOC links highlighting as you scroll
3. Verify correct link highlights based on scroll position

## Browser Testing

Test in multiple browsers:
- Chrome
- Firefox
- Safari
- Edge

Verify:
- Links work correctly
- Smooth scroll works
- Active highlighting works
- No console errors

## Mobile Testing

1. View page on mobile device or responsive mode
2. Verify TOC displays correctly
3. Test tapping TOC links
4. Verify scrolling works on mobile

## Edge Cases to Test

### Empty Headings

- Add a heading with no text
- Verify it's ignored by TOC

### Headings in Nested Blocks

- Add headings inside columns or groups
- Verify they appear in TOC correctly

### Multiple TOC Blocks

- Add multiple TOC blocks on same page
- Verify each works independently
- Check for ID conflicts

### TOC Before/After Headings

- Place TOC at top of page (before headings)
- Place TOC in middle of page
- Place TOC at bottom of page
- Verify all scenarios work

## Debugging Tips

### Check IDs in Browser

```javascript
// Run in browser console
document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
  console.log(h.tagName, h.textContent, h.id);
});
```

### Check TOC Links

```javascript
// Run in browser console
document.querySelectorAll('.toc-link').forEach(link => {
  console.log(link.textContent, link.getAttribute('href'));
});
```

### Verify Link Targets Exist

```javascript
// Run in browser console
document.querySelectorAll('.toc-link').forEach(link => {
  const href = link.getAttribute('href');
  const target = document.querySelector(href);
  if (!target) {
    console.error('Broken link:', href);
  } else {
    console.log('Valid link:', href, '→', target.textContent);
  }
});
```

## Success Criteria

The fix is successful when:

1. ✅ TOC links point to correct headings (matching anchor IDs)
2. ✅ Clicking TOC links scrolls to correct heading
3. ✅ Filtering heading levels works correctly
4. ✅ Duplicate heading text is handled properly
5. ✅ Editor preview matches frontend behavior
6. ✅ No JavaScript console errors
7. ✅ Smooth scroll and other features still work
8. ✅ Works across all browsers and devices

## What Was Fixed

### Before (Broken)

```php
// Only counted filtered headings
if (in_array($level, $levels)) {
    $anchor_counts[$base_anchor]++;
    // Generate anchor
}
```

Result: H1 "hello" not counted, H2 "hello" gets ID "hello", but frontend gives H1 the "hello" ID.

### After (Fixed)

```php
// Count ALL headings
$anchor_counts[$base_anchor]++;
// Generate anchor

// THEN filter
if (in_array($level, $levels)) {
    // Add to TOC
}
```

Result: H1 "hello" gets ID "hello", H2 "hello" gets ID "hello-2", TOC correctly links to "hello-2".

## Files Modified

1. **src/table-of-contents/render.php**
   - Updated `prolific_toc_extract_headings()` function
   - Moved anchor counting before filtering

2. **src/table-of-contents/edit.js**
   - Updated `useSelect` hook
   - Moved anchor counting before filtering
   - Ensures editor preview matches server-side

3. **build/table-of-contents/** (automatically generated)
   - Rebuilt files with npm run build
