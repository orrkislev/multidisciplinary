# Receipt: Project Reflection Generator

## Overview

Receipt is a reflection tool that transforms a completed project or learning experience into a "supermarket receipt" — a concise, itemized artifact that captures what happened, what was learned, and what it cost (in effort, time, assumptions). 

The core interaction model: **the AI generates, the user curates**. Instead of asking users to write elaborate reflections, we flood the interface with small, interactive fragments (sliders, chips, statements, fill-in-the-blanks) that the user accepts, rejects, or adjusts. The receipt assembles itself from their choices.

---

## Goals

### For the User
- Reflect on a completed project without the friction of blank-page writing
- Walk away with a tangible, shareable artifact
- Notice patterns in their process they might have missed
- Build a personal archive of learning moments over time

### For the System
- Capture rich signal through low-effort interactions
- Generate increasingly specific and relevant fragments as the session progresses
- Produce a receipt that feels personal, not generic

### Design Principles
- **Low input, high output**: Clicking/sliding is easier than writing
- **Curation over creation**: User selects from generated options
- **Progressive specificity**: AI gets sharper as it learns more
- **Playful bureaucracy**: The receipt format is intentionally mundane, removing preciousness from reflection

---

## User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         RECEIPT                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. SEED         User provides initial project description      │
│       ↓                                                         │
│  2. FLOOD        AI generates interactive fragments             │
│       ↓                                                         │
│  3. CURATE       User interacts: tap, slide, agree, skip        │
│       ↓                                                         │
│  4. REFINE       User edits receipt directly                    │
│       ↓                                                         │
│  5. PRINT        Export / save / share                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## UI Structure

### Layout
Split-screen interface:
- **Left panel (60%)**: Interactive fragment surface
- **Right panel (40%)**: Live-updating receipt

### Left Panel: Fragment Surface

The AI generates fragments in themed clusters. User interactions (tap, slide, select) send signals back to the AI and add items to the receipt.

#### Fragment Types

**1. Sliders**
```
┌─────────────────────────────────────────────────────┐
│ I knew what I was doing ○────────●───── I figured  │
│                                        it out      │
└─────────────────────────────────────────────────────┘
```
- Binary spectrum with draggable handle
- Position translates to receipt line item or modifier

**2. Skill/Concept Chips**
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ ✓ Color theory│ │ Composition  │ │ × Procreate  │
└──────────────┘ └──────────────┘ └──────────────┘
```
- Tappable pills generated from project description
- Tap to add to receipt, tap again to remove
- Can swipe to dismiss permanently

**3. Agree/Disagree Statements**
```
┌─────────────────────────────────────────────────────┐
│ "I surprised myself"                                │
│                                                     │
│    [ Disagree ]  [ Somewhat ]  [ Yes, exactly ]     │
└─────────────────────────────────────────────────────┘
```
- Statement + 3 response buttons
- Selection influences receipt generation

**4. Fill-in-the-Blank**
```
┌─────────────────────────────────────────────────────┐
│ The moment I almost quit was when                   │
│ ┌─────────────────────────────────────────────────┐ │
│ │ I couldn't get the colors right                 │ │
│ └─────────────────────────────────────────────────┘ │
│                                        [Add to receipt]│
└─────────────────────────────────────────────────────┘
```
- Short text input (character limited)
- Optional — user can skip

**5. Multiple Choice**
```
┌─────────────────────────────────────────────────────┐
│ This project was mostly about:                      │
│                                                     │
│ ○ Learning a skill                                  │
│ ● Expressing something                              │
│ ○ Solving a problem                                 │
│ ○ Exploring a question                              │
│ ○ Finishing something                               │
└─────────────────────────────────────────────────────┘
```
- Single or multi-select
- Influences receipt header/categorization

**6. AI-Suggested Line Items**
```
┌─────────────────────────────────────────────────────┐
│ 📝 Suggested receipt item:                          │
│                                                     │
│    "2x Abandoned approaches"                        │
│                                                     │
│    [ Add ]  [ Edit ]  [ Skip ]                      │
└─────────────────────────────────────────────────────┘
```
- AI proposes specific receipt lines
- User confirms, edits, or rejects

### Right Panel: Live Receipt

```
┌─────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════╗  │
│  ║         LEARNING RECEIPT                      ║  │
│  ║         ─────────────────                     ║  │
│  ║  Project: Portrait of my grandmother          ║  │
│  ║  Date: Nov 2024                               ║  │
│  ║  Duration: ~3 weeks                           ║  │
│  ║  ─────────────────────────────────────────    ║  │
│  ║                                               ║  │
│  ║  SKILLS ACQUIRED                              ║  │
│  ║  Color mixing (oil).............. 1x  ✎      ║  │
│  ║  Patience........................ 3x  ✎      ║  │
│  ║  Reference photo usage........... 1x  ✎      ║  │
│  ║                                               ║  │
│  ║  PROCESS                                      ║  │
│  ║  Abandoned approaches............ 2x  ✎      ║  │
│  ║  Breakthrough moments............ 1x  ✎      ║  │
│  ║  Days stuck...................... 4   ✎      ║  │
│  ║                                               ║  │
│  ║  COSTS                                        ║  │
│  ║  Assumptions challenged.......... 1x  ✎      ║  │
│  ║  Tutorials watched............... 6   ✎      ║  │
│  ║  Reference photos................ 12  ✎      ║  │
│  ║                                               ║  │
│  ║  ─────────────────────────────────────────    ║  │
│  ║  TOTAL: 1 finished painting                   ║  │
│  ║         + questions about light               ║  │
│  ║                                               ║  │
│  ║  ─────────────────────────────────────────    ║  │
│  ║  COUPON: 10% less hesitation next time        ║  │
│  ║  (Expires: never)                             ║  │
│  ║                                               ║  │
│  ║  Thank you for learning!                      ║  │
│  ╚═══════════════════════════════════════════════╝  │
│                                                     │
│            [ Edit ]  [ Export ]  [ Share ]          │
└─────────────────────────────────────────────────────┘
```

- Monospace / receipt aesthetic
- Each line item has edit button (✎)
- Updates live as user interacts with left panel
- Sections appear as relevant items are added

---

## State Management (Zustand)

```typescript
interface ReceiptState {
  // Project seed
  projectDescription: string;
  projectDuration: string;
  projectDate: string;
  
  // Generated fragments (from AI)
  fragments: Fragment[];
  
  // User responses
  responses: Response[];
  
  // Receipt data
  receipt: {
    title: string;
    date: string;
    duration: string;
    skills: LineItem[];
    process: LineItem[];
    costs: LineItem[];
    total: string;
    coupon: string;
  };
  
  // UI state
  currentCluster: string; // 'process' | 'skills' | 'costs' | 'feelings'
  isGenerating: boolean;
  
  // Actions
  setProjectSeed: (description: string, duration: string, date: string) => void;
  addFragment: (fragment: Fragment) => void;
  recordResponse: (fragmentId: string, response: any) => void;
  addReceiptItem: (section: string, item: LineItem) => void;
  updateReceiptItem: (section: string, index: number, item: LineItem) => void;
  removeReceiptItem: (section: string, index: number) => void;
  setTotal: (total: string) => void;
  setCoupon: (coupon: string) => void;
}

interface Fragment {
  id: string;
  type: 'slider' | 'chips' | 'statement' | 'fillin' | 'multichoice' | 'suggestion';
  cluster: string;
  content: any; // varies by type
  used: boolean;
  dismissed: boolean;
}

interface LineItem {
  label: string;
  quantity: string | number;
  editable: boolean;
}

interface Response {
  fragmentId: string;
  fragmentType: string;
  value: any;
  timestamp: number;
}
```

---

## AI Process

### Phase 1: Seed Analysis

**Trigger**: User submits initial project description

**System Prompt**:
```
You are helping a student reflect on a completed project. Based on their description, generate initial interactive fragments to help them articulate what they learned and experienced.

Project description: {{projectDescription}}
Duration: {{projectDuration}}

Generate a JSON response with the following fragment types:

1. "chips": An array of 8-12 skill/concept tags that might be relevant to this project. Be specific to the domain but also include meta-skills (patience, iteration, research, etc.)

2. "sliders": An array of 3-4 spectrum questions relevant to this type of project. Each has a "left" label and "right" label.

3. "statements": An array of 4-5 agree/disagree statements about the process and experience.

Keep everything specific to their project, not generic. Use language from their description.
```

**Expected Output**:
```json
{
  "chips": [
    "oil painting",
    "color mixing", 
    "portrait proportions",
    "working from reference",
    "patience",
    "iteration",
    "self-critique",
    "natural lighting",
    "skin tones",
    "background composition"
  ],
  "sliders": [
    {
      "id": "slider-1",
      "left": "I followed tutorials closely",
      "right": "I experimented on my own"
    },
    {
      "id": "slider-2", 
      "left": "Technical challenge",
      "right": "Emotional challenge"
    },
    {
      "id": "slider-3",
      "left": "Planned it out",
      "right": "Discovered as I went"
    }
  ],
  "statements": [
    "I surprised myself at some point",
    "The hardest part wasn't what I expected",
    "I almost gave up at least once",
    "I learned more from mistakes than successes",
    "I want to do another project like this"
  ]
}
```

### Phase 2: Progressive Generation

**Trigger**: User has interacted with 5+ fragments

**System Prompt**:
```
Based on the user's project and their responses so far, generate more specific fragments and suggest receipt line items.

Project: {{projectDescription}}

User responses so far:
{{responses}}

Current receipt items:
{{receiptItems}}

Generate:
1. "suggestions": 2-3 specific receipt line items based on what they've revealed. Format as item + quantity.
2. "fillins": 1-2 fill-in-the-blank prompts that dig deeper into what they've indicated.
3. "chips": 3-5 more specific skills/concepts based on their responses.

Be specific. Reference their actual project. Don't repeat what's already on the receipt.
```

**Expected Output**:
```json
{
  "suggestions": [
    {
      "label": "Skin tone mixing sessions",
      "quantity": "?",
      "editable": true
    },
    {
      "label": "Reference photos consulted",
      "quantity": "many",
      "editable": true
    }
  ],
  "fillins": [
    "The moment it started working was when",
    "If I could redo one decision, it would be"
  ],
  "chips": [
    "glazing technique",
    "emotional likeness",
    "sitting with uncertainty"
  ]
}
```

### Phase 3: Receipt Completion

**Trigger**: User clicks "Finish" or has interacted with 15+ fragments

**System Prompt**:
```
Based on everything the user has shared, generate the final receipt elements:

Project: {{projectDescription}}
All responses: {{responses}}
Current receipt: {{receipt}}

Generate:
1. "total": A playful, specific summary line for the bottom of the receipt. Reference their actual project.
2. "coupon": A "discount" they've earned for next time — something they learned that will make future projects easier. Frame it as "X% off [something]" or "Free [something] next time"

Keep the tone warm but not cheesy. Match the receipt aesthetic — bureaucratic yet personal.
```

**Expected Output**:
```json
{
  "total": "1 finished portrait + newfound respect for natural light",
  "coupon": "15% off perfectionism (learned: done > perfect)"
}
```

---

## Component Structure

```
/app/receipt/page.tsx          # Main page
/components/receipt/
  ├── ReceiptLayout.tsx        # Split panel layout
  ├── SeedForm.tsx             # Initial project input
  ├── FragmentSurface.tsx      # Left panel container
  ├── fragments/
  │   ├── SliderFragment.tsx
  │   ├── ChipsFragment.tsx
  │   ├── StatementFragment.tsx
  │   ├── FillInFragment.tsx
  │   ├── MultiChoiceFragment.tsx
  │   └── SuggestionFragment.tsx
  ├── ReceiptPanel.tsx         # Right panel container
  ├── ReceiptDisplay.tsx       # The actual receipt
  ├── ReceiptLineItem.tsx      # Editable line item
  └── ReceiptExport.tsx        # Export/share options
/stores/receiptStore.ts        # Zustand store
/lib/receipt-ai.ts             # AI SDK functions
```

---

## API Routes

### POST /api/receipt/seed
Analyzes initial project description, returns first batch of fragments.

```typescript
// app/api/receipt/seed/route.ts
import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const SeedResponseSchema = z.object({
  chips: z.array(z.string()),
  sliders: z.array(z.object({
    id: z.string(),
    left: z.string(),
    right: z.string()
  })),
  statements: z.array(z.string())
});

export async function POST(req: Request) {
  const { projectDescription, projectDuration } = await req.json();

  const result = await streamObject({
    model: openai('gpt-4o'),
    schema: SeedResponseSchema,
    prompt: `You are helping a student reflect on a completed project...
    
    Project description: ${projectDescription}
    Duration: ${projectDuration}
    
    Generate initial fragments...`
  });

  return result.toTextStreamResponse();
}
```

### POST /api/receipt/generate
Generates additional fragments based on user responses.

### POST /api/receipt/complete
Generates final total and coupon.

---

## Example Session

### Step 1: Seed

**User inputs:**
- Project: "I painted a portrait of my grandmother from an old photograph. Oil on canvas. First time doing a realistic portrait."
- Duration: "About 3 weeks"

### Step 2: Initial Fragments Appear

**Chips:**
`oil painting` `portrait proportions` `color mixing` `working from reference` `skin tones` `patience` `realistic rendering` `emotional connection` `natural lighting` `background composition` `iteration`

**Sliders:**
- "I followed references closely" ↔ "I interpreted freely"
- "Technical challenge" ↔ "Emotional challenge"  
- "I knew the process" ↔ "I figured it out as I went"

**Statements:**
- "I surprised myself at some point"
- "The hardest part wasn't what I expected"
- "I almost gave up at least once"
- "I feel closer to my grandmother after this"

### Step 3: User Interacts

- Taps: `oil painting`, `color mixing`, `patience`, `skin tones`, `emotional connection`
- Slides "Technical ↔ Emotional" toward emotional
- Agrees strongly with "I surprised myself"
- Agrees with "I almost gave up at least once"

### Step 4: Receipt Updates Live

```
SKILLS ACQUIRED
Color mixing (oil).............. 1x
Skin tones...................... 1x
Patience........................ 1x

PROCESS  
Emotional challenge............. ✓
Surprise moment................. 1x
Near-abandonment................ 1x
```

### Step 5: AI Generates More Fragments

**New suggestions appear:**
- Suggested line item: "Hours staring at reference photo: ___"
- Fill-in: "The moment I almost quit was when ___"
- Fill-in: "What surprised me was ___"
- New chips: `glazing technique` `likeness capture` `sitting with grief`

### Step 6: User Continues

- Fills in: "The moment I almost quit was when I couldn't get her eyes right"
- Fills in: "What surprised me was how much I remembered about her while painting"
- Adds "sitting with grief" chip
- Edits suggested "Hours staring at reference: 12"

### Step 7: Final Receipt

```
╔═══════════════════════════════════════════════════╗
║         LEARNING RECEIPT                          ║
║         ─────────────────                         ║
║  Project: Portrait of my grandmother              ║
║  Date: November 2024                              ║
║  Duration: ~3 weeks                               ║
║  ─────────────────────────────────────────        ║
║                                                   ║
║  SKILLS ACQUIRED                                  ║
║  Color mixing (oil).................. 1x         ║
║  Skin tones.......................... 1x         ║
║  Patience............................ 3x         ║
║  Capturing likeness.................. 1x         ║
║                                                   ║
║  PROCESS                                          ║
║  Near-abandonment (the eyes)......... 1x         ║
║  Surprise moments.................... 1x         ║
║  Hours with reference photo.......... 12         ║
║  Memories surfaced................... many       ║
║                                                   ║
║  COSTS                                            ║
║  Emotional weight.................... high       ║
║  Assumptions about painting.......... 2x         ║
║  Tubes of titanium white............. 1.5        ║
║                                                   ║
║  ─────────────────────────────────────────        ║
║  TOTAL: 1 finished portrait                       ║
║         + memories I didn't know I had            ║
║                                                   ║
║  ─────────────────────────────────────────        ║
║  COUPON: 20% off fear of eyes                     ║
║  (Valid for: all future portraits)               ║
║                                                   ║
║  Thank you for learning!                          ║
╚═══════════════════════════════════════════════════╝
```

---

## Export Options

- **Image**: Download as PNG (receipt aesthetic)
- **PDF**: Printable version
- **Markdown**: Plain text for notes/journal
- **Share link**: Public or private URL
- **Add to portfolio**: If portfolio feature exists

---

## Future Considerations

- **Receipt history**: Archive of past receipts, viewable as a collection
- **Patterns**: "You've mentioned 'patience' in 4 of your last 6 receipts"
- **Templates**: Different receipt styles (minimal, detailed, playful)
- **Collaborative**: Team project receipts with multiple contributors
- **Integration**: Connect with project management tools, pull in actual time data