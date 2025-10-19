# Table of Contents Block - Fix Summary

## Issue Fixed

**Problem:** When filtering TOC to exclude certain heading levels (e.g., hide H1), if multiple headings had the same text, TOC links would point to the wrong headings.

**Example:**
- Page has H1 "hello" and H2 "hello"
- TOC set to exclude H1, show only H2-H6
- TOC displayed "hello" (H2) but clicking it scrolled to H1 "hello"
- **This was the wrong behavior**

## Root Cause

The anchor ID generation only tracked headings that matched the filter criteria. This caused a mismatch between:
- Server-side ID generation (only counting filtered headings)
- Client-side ID generation (counting ALL headings)

## Solution

Track anchor counts for ALL headings (regardless of filter), but only add filtered headings to the TOC output.

## Code Changes

### File 1: src/table-of-contents/render.php

**Location:** Lines 58-103 in the `prolific_toc_extract_headings` function

**Before:**
```php
$find_headings = function($blocks) use (&$find_headings, &$headings, &$anchor_counts, $levels) {
    foreach ($blocks as $block) {
        if ($block['blockName'] === 'core/heading') {
            $level = isset($block['attrs']['level']) ? $block['attrs']['level'] : 2;

            // Check if this level should be included
            if (in_array($level, $levels)) {
                // Extract text content from the heading
                $text = strip_tags($block['innerHTML']);
                $text = trim($text);

                if (!empty($text)) {
                    // Get or generate anchor
                    $base_anchor = isset($block['attrs']['anchor']) ?
                        $block['attrs']['anchor'] : prolific_toc_slugify($text);

                    // Handle duplicate anchors by appending counter
                    if (!isset($anchor_counts[$base_anchor])) {
                        $anchor_counts[$base_anchor] = 0;
                    }

                    $anchor_counts[$base_anchor]++;

                    // Only append number if this is a duplicate (count > 1)
                    if ($anchor_counts[$base_anchor] > 1) {
                        $anchor = $base_anchor . '-' . $anchor_counts[$base_anchor];
                    } else {
                        $anchor = $base_anchor;
                    }

                    $headings[] = array(
                        'text' => $text,
                        'level' => $level,
                        'anchor' => $anchor
                    );
                }
            }
        }
        // ... rest of function
    }
};
```

**After:**
```php
$find_headings = function($blocks) use (&$find_headings, &$headings, &$anchor_counts, $levels) {
    foreach ($blocks as $block) {
        if ($block['blockName'] === 'core/heading') {
            $level = isset($block['attrs']['level']) ? $block['attrs']['level'] : 2;

            // Extract text content from the heading
            $text = strip_tags($block['innerHTML']);
            $text = trim($text);

            if (!empty($text)) {
                // Get or generate anchor
                $base_anchor = isset($block['attrs']['anchor']) ?
                    $block['attrs']['anchor'] : prolific_toc_slugify($text);

                // CRITICAL: Track anchor counts for ALL headings, not just filtered ones
                // This ensures ID generation matches what happens in the frontend view.js
                if (!isset($anchor_counts[$base_anchor])) {
                    $anchor_counts[$base_anchor] = 0;
                }

                $anchor_counts[$base_anchor]++;

                // Only append number if this is a duplicate (count > 1)
                if ($anchor_counts[$base_anchor] > 1) {
                    $anchor = $base_anchor . '-' . $anchor_counts[$base_anchor];
                } else {
                    $anchor = $base_anchor;
                }

                // NOW check if this level should be included in TOC
                // We generate anchors for ALL headings, but only add filtered ones to the list
                if (in_array($level, $levels)) {
                    $headings[] = array(
                        'text' => $text,
                        'level' => $level,
                        'anchor' => $anchor
                    );
                }
            }
        }
        // ... rest of function
    }
};
```

**Key Change:** Moved the anchor counting logic BEFORE the `if (in_array($level, $levels))` check, then moved the TOC addition logic INSIDE that check.

---

### File 2: src/table-of-contents/edit.js

**Location:** Lines 93-144 in the `useSelect` hook

**Before:**
```javascript
const headings = useSelect((select) => {
    const { getBlocks } = select('core/block-editor');
    const allBlocks = getBlocks();

    const headingBlocks = [];

    const findHeadings = (blocks) => {
        blocks.forEach((block) => {
            if (block.name === 'core/heading') {
                const level = block.attributes.level || 2;
                const text = getHeadingText(block);

                // Only include if we have text and the level is enabled
                if (text) {
                    headingBlocks.push({
                        level,
                        text,
                        anchor: block.attributes.anchor || slugify(text),
                        clientId: block.clientId
                    });
                }
            }

            // Recursively check inner blocks
            if (block.innerBlocks && block.innerBlocks.length > 0) {
                findHeadings(block.innerBlocks);
            }
        });
    };

    findHeadings(allBlocks);
    return headingBlocks;
}, []);
```

**After:**
```javascript
const headings = useSelect((select) => {
    const { getBlocks } = select('core/block-editor');
    const allBlocks = getBlocks();

    const headingBlocks = [];
    const anchorCounts = {};

    const findHeadings = (blocks) => {
        blocks.forEach((block) => {
            if (block.name === 'core/heading') {
                const level = block.attributes.level || 2;
                const text = getHeadingText(block);

                // Process ALL headings to track anchor counts
                if (text) {
                    // Get or generate base anchor
                    const baseAnchor = block.attributes.anchor || slugify(text);

                    // CRITICAL: Track anchor counts for ALL headings, not just filtered ones
                    // This ensures ID generation matches server-side render.php
                    if (!anchorCounts[baseAnchor]) {
                        anchorCounts[baseAnchor] = 0;
                    }

                    anchorCounts[baseAnchor]++;

                    // Generate final anchor with counter if duplicate
                    const anchor = anchorCounts[baseAnchor] > 1
                        ? `${baseAnchor}-${anchorCounts[baseAnchor]}`
                        : baseAnchor;

                    // Add ALL headings to the list (filtering happens later)
                    headingBlocks.push({
                        level,
                        text,
                        anchor,
                        clientId: block.clientId
                    });
                }
            }

            // Recursively check inner blocks
            if (block.innerBlocks && block.innerBlocks.length > 0) {
                findHeadings(block.innerBlocks);
            }
        });
    };

    findHeadings(allBlocks);
    return headingBlocks;
}, []);
```

**Key Changes:**
1. Added `anchorCounts` object to track duplicates
2. Generate proper anchors with counters for ALL headings
3. Add ALL headings to the array (filtering happens later via `filteredHeadings`)

---

### File 3: src/table-of-contents/view.js

**No changes required** - This file already processes ALL headings correctly.

## How It Works Now

### Scenario: H1 "hello", H2 "hello", H3 "hello" (filter excludes H1)

**Before (Broken):**
1. Server-side: Skip H1 (not in filter)
2. Server-side: H2 "hello" → first counted → anchor "hello"
3. Frontend: H1 gets id="hello" (processes all headings)
4. Frontend: H2 gets id="hello-2"
5. **BUG:** TOC links to "#hello" (the H1) instead of "#hello-2" (the H2)

**After (Fixed):**
1. Server-side: H1 "hello" → count 1 → anchor "hello" (skip from TOC)
2. Server-side: H2 "hello" → count 2 → anchor "hello-2" (add to TOC)
3. Frontend: H1 gets id="hello"
4. Frontend: H2 gets id="hello-2"
5. **WORKS:** TOC links to "#hello-2" which correctly points to the H2

## Testing Verification

Create a test page with:
```
H1: hello
H2: hello
H3: hello
```

TOC Settings: Exclude H1, Include H2-H6

**Expected Results:**
- H1 has `id="hello"` (not in TOC)
- H2 has `id="hello-2"` (first TOC entry)
- H3 has `id="hello-3"` (second TOC entry)
- Clicking "hello" (first entry) scrolls to H2
- Clicking "hello" (second entry) scrolls to H3

## Impact

- **Backward Compatible:** Yes
- **Breaking Changes:** None
- **Performance:** No impact (same number of iterations)
- **Database Changes:** None required
- **Build Required:** Yes (npm run build)

## Files Modified

1. `/src/table-of-contents/render.php` - Server-side rendering
2. `/src/table-of-contents/edit.js` - Editor preview
3. `/build/table-of-contents/*` - Compiled output (auto-generated)

## Build Command

```bash
cd /Users/chrismiller/Local Sites/sandbox/app/public/wp-content/plugins/prolific-blocks
npm run build
```

## Related Documentation

- TOC_HEADING_FILTER_FIX.md - Detailed explanation
- TOC_TESTING_GUIDE.md - Comprehensive testing instructions
