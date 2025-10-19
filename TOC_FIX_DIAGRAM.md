# Table of Contents Fix - Visual Diagram

## The Problem (Before Fix)

```
PAGE CONTENT:
┌─────────────────────────────┐
│ H1: "hello"                 │
│ H2: "hello"                 │
│ H3: "hello"                 │
└─────────────────────────────┘

TOC SETTINGS:
┌─────────────────────────────┐
│ ☐ Include H1                │
│ ☑ Include H2                │
│ ☑ Include H3                │
└─────────────────────────────┘

SERVER-SIDE PROCESSING (render.php):
┌─────────────────────────────────────────────┐
│ 1. H1 "hello" → SKIPPED (not in filter)    │
│    anchor_counts['hello'] = NOT INCREMENTED │
│                                             │
│ 2. H2 "hello" → First counted occurrence   │
│    anchor_counts['hello'] = 1              │
│    Generated anchor: "hello"                │
│    Added to TOC: ✓                          │
│                                             │
│ 3. H3 "hello" → Second counted occurrence  │
│    anchor_counts['hello'] = 2              │
│    Generated anchor: "hello-2"              │
│    Added to TOC: ✓                          │
└─────────────────────────────────────────────┘

FRONTEND PROCESSING (view.js):
┌─────────────────────────────────────────────┐
│ Processes ALL headings:                     │
│                                             │
│ 1. H1 "hello" → First occurrence           │
│    anchor_counts['hello'] = 1              │
│    Assigned ID: "hello"                     │
│                                             │
│ 2. H2 "hello" → Second occurrence          │
│    anchor_counts['hello'] = 2              │
│    Assigned ID: "hello-2"                   │
│                                             │
│ 3. H3 "hello" → Third occurrence           │
│    anchor_counts['hello'] = 3              │
│    Assigned ID: "hello-3"                   │
└─────────────────────────────────────────────┘

TOC OUTPUT:
┌─────────────────────────────┐
│ Table of Contents           │
│ • hello ────────────────┐   │ href="#hello"
│ • hello ────────────────┤   │ href="#hello-2"
└─────────────────────────┴───┘

ACTUAL HEADING IDs ON PAGE:
┌─────────────────────────────┐
│ <h1 id="hello">hello</h1>   │ ← TOC link points here (WRONG!)
│ <h2 id="hello-2">hello</h2> │ ← Should point here
│ <h3 id="hello-3">hello</h3> │
└─────────────────────────────┘

❌ PROBLEM: TOC link "#hello" points to H1, not H2!
```

---

## The Solution (After Fix)

```
PAGE CONTENT:
┌─────────────────────────────┐
│ H1: "hello"                 │
│ H2: "hello"                 │
│ H3: "hello"                 │
└─────────────────────────────┘

TOC SETTINGS:
┌─────────────────────────────┐
│ ☐ Include H1                │
│ ☑ Include H2                │
│ ☑ Include H3                │
└─────────────────────────────┘

SERVER-SIDE PROCESSING (render.php):
┌─────────────────────────────────────────────┐
│ Process ALL headings, track ALL anchors:    │
│                                             │
│ 1. H1 "hello" → First occurrence           │
│    anchor_counts['hello'] = 1              │
│    Generated anchor: "hello"                │
│    Filter check: NOT in levels → SKIP TOC   │
│                                             │
│ 2. H2 "hello" → Second occurrence          │
│    anchor_counts['hello'] = 2              │
│    Generated anchor: "hello-2"              │
│    Filter check: IN levels → ADD TO TOC ✓   │
│                                             │
│ 3. H3 "hello" → Third occurrence           │
│    anchor_counts['hello'] = 3              │
│    Generated anchor: "hello-3"              │
│    Filter check: IN levels → ADD TO TOC ✓   │
└─────────────────────────────────────────────┘

FRONTEND PROCESSING (view.js):
┌─────────────────────────────────────────────┐
│ Processes ALL headings (unchanged):         │
│                                             │
│ 1. H1 "hello" → First occurrence           │
│    anchor_counts['hello'] = 1              │
│    Assigned ID: "hello"                     │
│                                             │
│ 2. H2 "hello" → Second occurrence          │
│    anchor_counts['hello'] = 2              │
│    Assigned ID: "hello-2"                   │
│                                             │
│ 3. H3 "hello" → Third occurrence           │
│    anchor_counts['hello'] = 3              │
│    Assigned ID: "hello-3"                   │
└─────────────────────────────────────────────┘

TOC OUTPUT:
┌─────────────────────────────┐
│ Table of Contents           │
│ • hello ────────────────┐   │ href="#hello-2"
│ • hello ────────────────┤   │ href="#hello-3"
└─────────────────────────┴───┘

ACTUAL HEADING IDs ON PAGE:
┌─────────────────────────────┐
│ <h1 id="hello">hello</h1>   │
│ <h2 id="hello-2">hello</h2> │ ← TOC link points here (CORRECT!)
│ <h3 id="hello-3">hello</h3> │ ← TOC link points here (CORRECT!)
└─────────────────────────────┘

✅ FIXED: IDs now match between server and client!
```

---

## Key Insight

### Before Fix
```
FILTER FIRST → COUNT SECOND
↓
Mismatch between server (filtered) and client (all)
```

### After Fix
```
COUNT ALL → FILTER FOR DISPLAY
↓
Server and client count the same way
```

---

## Code Logic Flow

### BEFORE (Broken)
```php
foreach ($blocks as $block) {
    if ($block is heading) {
        if (level is in filter) {           // ← Filter first
            count++;                        // ← Count only filtered
            generate anchor;
            add to TOC;
        }
    }
}
```

### AFTER (Fixed)
```php
foreach ($blocks as $block) {
    if ($block is heading) {
        count++;                            // ← Count ALL headings
        generate anchor;
        if (level is in filter) {           // ← Filter for display
            add to TOC;
        }
    }
}
```

---

## Real-World Example

### Test Page Setup
```
H1: Introduction          (not in filter)
H2: Overview              (in filter)
H2: Introduction          (in filter)
H3: Introduction          (in filter)
H2: Conclusion            (in filter)
```

### BEFORE FIX (Broken IDs)
```
Server counts:
  H1 "Introduction" → skipped
  H2 "Overview" → anchor "overview"
  H2 "Introduction" → anchor "introduction" (first counted)
  H3 "Introduction" → anchor "introduction-2"
  H2 "Conclusion" → anchor "conclusion"

Frontend assigns:
  H1 "Introduction" → id="introduction"
  H2 "Overview" → id="overview"
  H2 "Introduction" → id="introduction-2"
  H3 "Introduction" → id="introduction-3"
  H2 "Conclusion" → id="conclusion"

TOC links:
  • Overview → #overview ✓
  • Introduction → #introduction ✗ (points to H1!)
  • Introduction → #introduction-2 ✗ (points to H2, not H3!)
  • Conclusion → #conclusion ✓
```

### AFTER FIX (Correct IDs)
```
Server counts:
  H1 "Introduction" → anchor "introduction" (skip from TOC)
  H2 "Overview" → anchor "overview" (add to TOC)
  H2 "Introduction" → anchor "introduction-2" (add to TOC)
  H3 "Introduction" → anchor "introduction-3" (add to TOC)
  H2 "Conclusion" → anchor "conclusion" (add to TOC)

Frontend assigns:
  H1 "Introduction" → id="introduction"
  H2 "Overview" → id="overview"
  H2 "Introduction" → id="introduction-2"
  H3 "Introduction" → id="introduction-3"
  H2 "Conclusion" → id="conclusion"

TOC links:
  • Overview → #overview ✓
  • Introduction → #introduction-2 ✓ (correctly points to first filtered H2)
  • Introduction → #introduction-3 ✓ (correctly points to H3)
  • Conclusion → #conclusion ✓
```

---

## Summary

The fix ensures that anchor ID generation is **deterministic** and **consistent** across:
- Server-side rendering (PHP)
- Editor preview (JavaScript)
- Frontend ID assignment (JavaScript)

**The golden rule:** Always count ALL headings in document order, regardless of which ones are displayed in the TOC.
