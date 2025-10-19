# Global Custom HTML Attributes - Testing Guide

## Quick Testing Checklist

Use this checklist to verify the Global Custom Attributes feature is working correctly.

## Test 1: Core Paragraph Block - ARIA Label

### Steps:
1. Create a new post/page
2. Add a **Paragraph** block
3. Type some text: "This is a test paragraph"
4. Open block settings sidebar
5. Find and expand "Custom HTML Attributes" panel
6. Click "+ Add Attribute"
7. Enter:
   - Name: `aria-label`
   - Value: `Test paragraph for screen readers`
8. Save the post
9. View page source

### Expected Result:
```html
<p class="..." aria-label="Test paragraph for screen readers">This is a test paragraph</p>
```

### Pass/Fail: ___________

---

## Test 2: Core Button Block - rel="noopener noreferrer"

### Steps:
1. Add a **Button** block
2. Set button text: "Visit External Site"
3. Set URL: `https://example.com`
4. Open "Custom HTML Attributes" panel
5. Add attribute:
   - Name: `rel`
   - Value: `noopener noreferrer`
6. Save and view source

### Expected Result:
```html
<a class="wp-block-button__link" href="https://example.com" rel="noopener noreferrer">Visit External Site</a>
```

### Pass/Fail: ___________

---

## Test 3: Core Image Block - loading="lazy"

### Steps:
1. Add an **Image** block
2. Upload or select an image
3. Open "Custom HTML Attributes" panel
4. Add attribute:
   - Name: `loading`
   - Value: `lazy`
5. Save and view source

### Expected Result:
```html
<img src="..." alt="..." loading="lazy" />
```

### Pass/Fail: ___________

---

## Test 4: Multiple Attributes on One Block

### Steps:
1. Add a **Heading** block
2. Type: "Important Section"
3. Open "Custom HTML Attributes" panel
4. Add first attribute:
   - Name: `role`
   - Value: `banner`
5. Click "+ Add Attribute" again
6. Add second attribute:
   - Name: `aria-label`
   - Value: `Main section heading`
7. Add third attribute:
   - Name: `data-section`
   - Value: `main-content`
8. Save and view source

### Expected Result:
```html
<h2 class="..." role="banner" aria-label="Main section heading" data-section="main-content">Important Section</h2>
```

### Pass/Fail: ___________

---

## Test 5: Security - Blocked Dangerous Attribute

### Steps:
1. Add a **Paragraph** block
2. Open "Custom HTML Attributes" panel
3. Add attribute:
   - Name: `onclick`
   - Value: `alert('XSS')`
4. Observe the UI

### Expected Result:
- Red error notice appears: "This attribute could pose a security risk and is not allowed."
- Value field is disabled
- Attribute is NOT applied to HTML when saved

### Pass/Fail: ___________

---

## Test 6: Security - Protected WordPress Attribute

### Steps:
1. Add a **Group** block
2. Open "Custom HTML Attributes" panel
3. Add attribute:
   - Name: `class`
   - Value: `my-custom-class`
4. Observe the UI

### Expected Result:
- Error notice appears: "This attribute is managed by WordPress and cannot be modified here."
- Value field is disabled
- Attribute is NOT applied to HTML

### Pass/Fail: ___________

---

## Test 7: Remove Attribute

### Steps:
1. Add a **Button** block
2. Add two attributes:
   - `rel` = `nofollow`
   - `aria-label` = `Test button`
3. Click "Remove Attribute" on the first attribute
4. Save and view source

### Expected Result:
- First attribute is removed from UI
- Only `aria-label="Test button"` appears in HTML
- Block still works normally

### Pass/Fail: ___________

---

## Test 8: Empty Attributes Not Applied

### Steps:
1. Add a **Image** block
2. Open "Custom HTML Attributes" panel
3. Add attribute but leave both fields empty
4. Save and view source

### Expected Result:
- No additional attributes in HTML
- No errors in browser console
- Block saves normally

### Pass/Fail: ___________

---

## Test 9: Third-Party Block Compatibility

### Steps:
1. Install a third-party block plugin (e.g., Gutenberg blocks from any plugin)
2. Add a block from that plugin
3. Open "Custom HTML Attributes" panel
4. Add an attribute:
   - Name: `data-test`
   - Value: `third-party-block`
5. Save and view source

### Expected Result:
- "Custom HTML Attributes" panel appears for third-party block
- Attribute is applied to the block's wrapper element
- No console errors

### Pass/Fail: ___________

---

## Test 10: Prolific Custom Block

### Steps:
1. Add a **Prolific Block** (e.g., Carousel, Timeline, etc.)
2. Configure the block normally
3. Open "Custom HTML Attributes" panel
4. Add attribute:
   - Name: `data-prolific`
   - Value: `custom-value`
5. Save and view source

### Expected Result:
- Panel appears and works normally
- Attribute is applied without breaking block functionality
- Block still works as expected on frontend

### Pass/Fail: ___________

---

## Test 11: Attribute Persistence After Edit

### Steps:
1. Add a **Paragraph** block with custom attribute `aria-label="Original"`
2. Save the post
3. Reload the editor
4. Select the paragraph block
5. Check "Custom HTML Attributes" panel

### Expected Result:
- Attribute still shows in panel: `aria-label` = `Original`
- Edit the value to `Updated`
- Save and reload
- Value persists as `Updated`

### Pass/Fail: ___________

---

## Test 12: Special Characters in Values

### Steps:
1. Add a **Button** block
2. Add attribute:
   - Name: `aria-label`
   - Value: `Click "here" to view & learn more!`
3. Save and view source

### Expected Result:
- Special characters are properly escaped in HTML
- Quotes and ampersands render correctly
- No HTML injection occurs

### Pass/Fail: ___________

---

## Test 13: Data Attributes

### Steps:
1. Add a **Group** block
2. Add multiple data attributes:
   - `data-analytics-id` = `hero-section`
   - `data-track` = `impression`
   - `data-value` = `100`
3. Save and view source

### Expected Result:
All data attributes appear correctly:
```html
<div class="..." data-analytics-id="hero-section" data-track="impression" data-value="100">
```

### Pass/Fail: ___________

---

## Test 14: Attribute Name Validation

### Steps:
1. Add a **Paragraph** block
2. Try adding invalid attribute names:
   - `123invalid` (starts with number)
   - `my attribute` (contains space)
   - `my@attribute` (contains invalid character)
3. Save and view source

### Expected Result:
- Invalid attributes are not applied to HTML
- No console errors
- Block saves normally

### Pass/Fail: ___________

---

## Test 15: Case Sensitivity

### Steps:
1. Add a **Button** block
2. Add attribute:
   - Name: `ARIA-LABEL` (uppercase)
   - Value: `Test Button`
3. Add another attribute:
   - Name: `data-VALUE` (mixed case)
   - Value: `Test Value`
4. Save and view source

### Expected Result:
- Attribute names preserve their case in HTML
- Values preserve their case
- Validation works regardless of case

### Pass/Fail: ___________

---

## Lighthouse Testing

### Test 16: External Link Security

### Steps:
1. Create a page with external links (buttons or link blocks)
2. Run Lighthouse audit - note any "Links to cross-origin destinations are unsafe" warnings
3. Add `rel="noopener noreferrer"` to all external links via Custom Attributes
4. Run Lighthouse audit again

### Expected Result:
- Warning disappears or score improves
- Links still work correctly
- No console errors

### Pass/Fail: ___________

---

### Test 17: Image Lazy Loading

### Steps:
1. Create a page with multiple images
2. Run Lighthouse audit - check performance score
3. Add `loading="lazy"` to below-fold images
4. Run Lighthouse audit again

### Expected Result:
- Performance score improves
- Images load as expected when scrolling
- Above-fold images load immediately

### Pass/Fail: ___________

---

### Test 18: Accessibility Score

### Steps:
1. Create a page with icon buttons (no text)
2. Run Lighthouse accessibility audit
3. Add `aria-label` attributes to all icon buttons
4. Run Lighthouse audit again

### Expected Result:
- Accessibility score improves
- "Buttons do not have an accessible name" warning disappears
- Screen readers can read button labels

### Pass/Fail: ___________

---

## Browser Compatibility Testing

### Test 19: Chrome/Edge

- [ ] All features work in Chrome
- [ ] All features work in Edge
- [ ] No console errors
- [ ] Attributes render correctly

### Test 20: Firefox

- [ ] All features work in Firefox
- [ ] No console errors
- [ ] Attributes render correctly

### Test 21: Safari

- [ ] All features work in Safari
- [ ] No console errors
- [ ] Attributes render correctly

---

## Accessibility Testing

### Test 22: Screen Reader Test

### Steps:
1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Add `aria-label` to a button without text
3. Navigate to the button with screen reader
4. Listen to announcement

### Expected Result:
- Screen reader announces the aria-label value
- Button is accessible via keyboard
- Focus indicator is visible

### Pass/Fail: ___________

---

### Test 23: Keyboard Navigation

### Steps:
1. Add multiple blocks with custom attributes
2. Navigate using Tab key only (no mouse)
3. Try to add/edit/remove attributes using keyboard only

### Expected Result:
- All UI controls are keyboard accessible
- Can add attributes with keyboard
- Can remove attributes with keyboard
- Proper focus management

### Pass/Fail: ___________

---

## Plugin Conflict Testing

### Test 24: Conflict with ACF

- [ ] Works with Advanced Custom Fields installed
- [ ] No JavaScript errors
- [ ] Both plugins function normally

### Test 25: Conflict with Yoast SEO

- [ ] Works with Yoast SEO installed
- [ ] No JavaScript errors
- [ ] Both plugins function normally

### Test 26: Conflict with Elementor

- [ ] Works with Elementor installed
- [ ] No JavaScript errors when using Gutenberg
- [ ] Both editors work independently

---

## Performance Testing

### Test 27: Editor Performance

### Steps:
1. Create a post with 50+ blocks
2. Add custom attributes to 10+ blocks
3. Measure editor responsiveness
4. Save the post

### Expected Result:
- No noticeable lag in editor
- Post saves in reasonable time
- No memory issues

### Pass/Fail: ___________

---

### Test 28: Frontend Performance

### Steps:
1. Create a page with 20+ blocks, all with custom attributes
2. Run performance test (Lighthouse or WebPageTest)
3. Check page load time

### Expected Result:
- No impact on page load time
- No additional HTTP requests
- No frontend JavaScript loaded

### Pass/Fail: ___________

---

## Edge Cases

### Test 29: Very Long Attribute Values

### Steps:
1. Add attribute with value over 500 characters
2. Save and view source

### Expected Result:
- Value is saved completely
- No truncation occurs
- Page source is valid HTML

### Pass/Fail: ___________

---

### Test 30: Special Unicode Characters

### Steps:
1. Add attribute with emoji and unicode:
   - Name: `aria-label`
   - Value: `Click here 👉 to continue ✓`
2. Save and view source

### Expected Result:
- Unicode characters preserved
- HTML is valid
- Characters render correctly

### Pass/Fail: ___________

---

## Summary

Total Tests: 30
Passed: _____
Failed: _____
Success Rate: _____%

## Issues Found

List any issues discovered during testing:

1.
2.
3.

## Additional Notes

Add any additional observations or feedback:

---

## Quick Reference - Common Test Attributes

Copy and paste these for quick testing:

**External Link:**
```
Name: rel
Value: noopener noreferrer
```

**Screen Reader Label:**
```
Name: aria-label
Value: Descriptive label here
```

**Lazy Load Image:**
```
Name: loading
Value: lazy
```

**High Priority Resource:**
```
Name: fetchpriority
Value: high
```

**ARIA Role:**
```
Name: role
Value: navigation
```

**Custom Data:**
```
Name: data-analytics
Value: custom-tracking-id
```

**SEO No-Follow:**
```
Name: rel
Value: nofollow
```

**Autocomplete:**
```
Name: autocomplete
Value: email
```
