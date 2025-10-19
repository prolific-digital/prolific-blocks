# Table of Contents - Heading Filter Fix

## Problem Description

When filtering TOC headings by level (e.g., excluding H1 but showing H2-H6), if multiple headings had identical text, the TOC links would point to the wrong headings.

### Example Scenario

**Page Content:**
- H1: "hello"
- H2: "hello"
- H3: "hello"

**TOC Settings:** Filter to show only H2 and H3 (exclude H1)

**Expected Behavior:**
- TOC should link to H2 "hello" (first filtered heading)
- Clicking should scroll to the H2, not the H1

**Previous (Broken) Behavior:**
- TOC displayed H2 "hello"
- But clicking it scrolled to H1 "hello" instead
- This was the WRONG heading

## Root Cause

The issue was in the anchor ID generation logic in `render.php`:

### Previous Logic (BROKEN)
```php
if (in_array($level, $levels)) {
    // Only track anchor counts for FILTERED headings
    if (!isset($anchor_counts[$base_anchor])) {
        $anchor_counts[$base_anchor] = 0;
    }
    $anchor_counts[$base_anchor]++;
    // Generate anchor and add to TOC
}
```

**Problem:** Anchor counts only tracked filtered headings, causing mismatches:
1. H1 "hello" - Skipped, not counted
2. H2 "hello" - First occurrence in filtered list, gets anchor "hello"
3. But on the frontend, ALL headings get IDs:
   - H1 gets id="hello"
   - H2 gets id="hello-2"
4. TOC link points to "hello" (the H1) instead of "hello-2" (the H2)

## Solution

Track anchor counts for ALL headings, but only add filtered ones to the TOC.

### New Logic (FIXED)
```php
// Process ALL headings first
if (!isset($anchor_counts[$base_anchor])) {
    $anchor_counts[$base_anchor] = 0;
}
$anchor_counts[$base_anchor]++;

// Generate anchor with proper counter
$anchor = $anchor_counts[$base_anchor] > 1
    ? $base_anchor . '-' . $anchor_counts[$base_anchor]
    : $base_anchor;

// THEN filter which ones to include in TOC
if (in_array($level, $levels)) {
    $headings[] = array(
        'text' => $text,
        'level' => $level,
        'anchor' => $anchor
    );
}
```

**Solution:** Now the IDs match between server-side and client-side:
1. H1 "hello" - Gets anchor "hello" (not added to TOC)
2. H2 "hello" - Gets anchor "hello-2" (added to TOC with correct link)
3. H3 "hello" - Gets anchor "hello-3" (added to TOC with correct link)

## Files Modified

### 1. `/src/table-of-contents/render.php`
- Updated `prolific_toc_extract_headings()` function
- Moved anchor count tracking BEFORE level filtering
- Ensures all headings are counted, but only filtered ones are added to TOC

### 2. `/src/table-of-contents/edit.js`
- Updated `useSelect` hook that extracts headings
- Moved anchor count tracking BEFORE level filtering
- Ensures editor preview matches server-side behavior

### 3. `/src/table-of-contents/view.js`
- No changes needed
- Already processes ALL headings to generate IDs
- This was the correct behavior that server-side needed to match

## Test Cases

### Test Case 1: Duplicate Text with H1 Filtered Out
**Setup:**
- H1: "hello"
- H2: "hello"
- TOC Settings: Exclude H1, Include H2

**Expected Result:**
- TOC shows one entry: "hello"
- Link href="#hello-2"
- Clicking scrolls to H2, not H1
- ✅ FIXED

### Test Case 2: Multiple Duplicates with Mixed Filtering
**Setup:**
- H1: "hello"
- H2: "hello"
- H3: "hello"
- H2: "hello"
- TOC Settings: Exclude H1, Include H2-H6

**Expected Result:**
- TOC shows:
  - "hello" (links to first H2 with id="hello-2")
  - "hello" (links to H3 with id="hello-3")
  - "hello" (links to second H2 with id="hello-4")
- All links point to correct headings
- ✅ FIXED

### Test Case 3: All Levels Enabled
**Setup:**
- H1: "hello"
- H2: "hello"
- TOC Settings: Include all levels (H1-H6)

**Expected Result:**
- TOC shows:
  - "hello" (links to H1 with id="hello")
  - "hello" (links to H2 with id="hello-2")
- ✅ FIXED

### Test Case 4: Custom Anchors
**Setup:**
- H1: "hello" (custom anchor: "custom-1")
- H2: "hello" (no custom anchor)
- TOC Settings: Exclude H1, Include H2

**Expected Result:**
- H1 gets id="custom-1" (not in TOC)
- H2 gets id="hello" (shown in TOC)
- TOC links to correct H2
- ✅ FIXED

## Implementation Details

### Consistency Across Three Layers

1. **Server-side (render.php)**
   - Processes ALL headings in order
   - Tracks anchor counts globally
   - Filters which ones appear in TOC
   - Generates correct links

2. **Editor Preview (edit.js)**
   - Mirrors server-side logic
   - Processes ALL headings in order
   - Tracks anchor counts globally
   - Shows accurate preview

3. **Frontend (view.js)**
   - Processes ALL h1-h6 elements
   - Adds missing IDs using same logic
   - Ensures IDs match server-side
   - Already was working correctly

### Key Principle

**All heading ID generation must happen in document order, regardless of filtering.**

The filter only determines which headings appear in the TOC, not which headings get counted for duplicate detection.

## Verification Steps

1. Create a test page with duplicate heading text
2. Add H1, H2, H3 all with text "hello"
3. Add TOC block
4. Set TOC to exclude H1 (only show H2-H6)
5. Save and view the page
6. Click the first TOC entry
7. Verify it scrolls to H2, not H1
8. Check browser console for any errors
9. Inspect heading IDs in browser DevTools:
   - H1 should have id="hello"
   - H2 should have id="hello-2"
   - H3 should have id="hello-3"
10. Verify TOC link href matches H2 id

## Additional Notes

- This fix maintains backward compatibility
- No database migrations needed
- No changes to block attributes
- Works with custom anchor IDs
- Handles nested blocks correctly
- Performance impact: minimal (same number of iterations)

## Related Code Patterns

This same pattern should be used anywhere we:
1. Generate IDs from text content
2. Need to handle duplicates
3. Have filtering/display logic

**Always:** Count ALL items globally before applying display filters.
