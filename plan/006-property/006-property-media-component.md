# Plan: PropertyMedia - Extraction & Refactor

## Task Overview
Refactor `PropertyMedia` into a state-aware media manager. It handles asynchronous uploads to Cloudinary and synchronizes the resulting metadata with the global Property Store.

*Reference:* Use the specialized knowledge in
    - @ui-component-layer/SKILL.md
    - @state-management-layer/SKILL.md
    - Individual Specs: 
        - @property-media-component.md
    
## Import Layout from AI Studio
Refactor raw components from `raw_from_ai_studio` into the following project structure. 
**Strictly follow Tailwind Utility-First principles and the cn utility for class merging.**

## Implementation Steps
**Step 1: Structural Setup & Visibility**
- *Props:* Receive `viewMode`, `activeResultTab`.

- *Store Integration:* Access `property.media` and `isCalculating` via Zustand hooks.

- *Visibility:* Mobile logic - `block` if `viewMode === 'form'` or `activeResultTab === 'media'`.

**Step 2: State & Action Logic**
- *Local State:* `const [isUploading, setIsUploading] = useState(false)`.

- *Handlers:*

    - `handleUpload:` Calls `mediaService.upload`, then updates the store using `updatePropertyField`.

    - `handleRemove:` Filters the current `media` array and updates the store.

**Step 3: Component Refactor (PropertyMedia.tsx)**
- Apply the structure from @property-media-component.md.

- *Header:* `SectionHeader` (label: `property_images_title`, variant: `slate`).

- *Grid:* Responsive `Card` grid with `MAX_MEDIA_COUNT = 4` logic.

- *Interactions:* - Standard `input type="file"` (hidden).

- Drag & Drop listeners on the `Card` container.

**Step 4: Styling & RTL (Tailwind)**
- Hover effects for the "Trash" icon.

- Loading states for the "Add Image" tile.


## *Mandatory "STOP-AND-ASK" Gate*
You must strictly follow the "STOP-AND-ASK" gate before generating any code.
1. Write at least 3+ clarifying questions. 

CRITICAL INSTRUCTION: After presenting your questions, you must STOP and wait for my explicit approval and answers. Do not proceed to code generation or the 'Flow Implementation' phase. Do not assume any defaults or start the implementation until I give you the green light.

## AI Agent Pre-Flight Validation & Discussion Log
**Strict Instruction:** All discussions, clarifying questions, and logic validations must be written directly into the Discussion Log section of this file. Do not provide answers or questions in the chat interface alone.

**Format for Discussion:**
- Each entry must start with a timestamped header.
- Maintain a running log of our decisions.

---
# Discussion Log:

## 2026-05-19 — AI Pre-Flight Questions (STOP-AND-ASK Gate)

*AI says:*

After reading the plan, the spec (`property-media-component.md`), and the current codebase state, I identified the following ambiguities that must be resolved before writing any code.

---

### Q1 — `activeResultTab === 'media'`: Does a new mobile tab need to be added?

The plan says mobile visibility should show when `activeResultTab === 'media'`.
However, `activeResultTab` in `PropertyPage.tsx` is currently typed as `'yield' | 'amortization' | 'graph'`,
and the mobile tab bar only renders three tabs (Yield, Amortization, Graph).

**Options:**
- **A** — Add a fourth `'media'` option to the type and a new tab button in the mobile nav bar in `PropertyPage.tsx` (breaking change to the tab system).
- **B** — Keep mobile visibility as `viewMode === 'form'` only (no `activeResultTab === 'media'` condition), matching what the current component already does.
- **C** — Other (please describe).

> *Your answer:* (B) Keep the visibility condition linked strictly to viewMode === 'form'. Completely remove the activeResultTab === 'media' logic from the plan, as there is no Media tab in the results dashboard view.

Reasoning:
- You are absolutely correct. The specification has a structural typo here. Media upload boxes live exclusively inside the setup/editing stage (Form Mode), helping the user attach files before running calculations. There is no reason to display a media viewer as a real-time numerical "calculation result" tab next to complex data matrices like Yield Forecasts or Amortization charts.
- Preserving Tab Integrity: Eliminating this dead branch prevents us from introducing a useless fou

---

### Q2 — Store Architecture: Create `property.slice.ts` or keep props pattern?

The plan says: *"Access `property.media` and `isCalculating` via Zustand hooks"* and update via `updatePropertyField`.
But today, the store only has `auth.slice.ts` and `app.slice.ts`. There is no `property.slice.ts`.
`isCalculating` and `images` are both local state owned by `PropertyPage` and passed as props.

**Options:**
- **A** — Create a new `property.slice.ts` with `media` (and optionally `isCalculating`) and migrate state into it. `PropertyMedia` reads directly from the store.
- **B** — Keep the current pattern: `PropertyPage` owns the state and passes `list`, `onUpload`, and `onRemove` as props to `PropertyMedia`. The component spec's callback-based API (`onUpload`, `onRemove`) already supports this.
- **C** — Hybrid: only `media` moves to the store; `isCalculating` stays as a prop from `PropertyPage`.

> *Your answer:* (B) Keep the current parent-driven pattern. PropertyPage.tsx will continue to own the state and pass list, onUpload, and onRemove down as props to PropertyMedia. Do NOT engineer a global store slice for media files.

Reasoning:
- Preventing Scope Creep: Since a dedicated property.slice.ts does not currently exist in your Zustand architecture, initializing an entire global store slice solely to sync a minor array of 4 image placeholders introduces unnecessary boilerplate and fragments your state machine.
- Component Encapsulation & Reusability: The presentation specification for @property-media-component.md is already built around a decoupled, callback-based API contract (list, onUpload, onRemove). Keeping it prop-driven means the component remains simple, light, and perfectly aligned with its original design boundaries, requiring zero global state wireframing.

Final Instructions:
Claude must construct the component around pure visual presentation boundaries, consuming direct handlers from the parent page mount site:

1. Define the Presentation Props Interface (PropertyMedia.tsx)
```TypeScript
interface PropertyMediaProps {
  viewMode: 'form' | 'results';
  list: string[]; // Array of secure Cloudinary image URLs passed down from Parent
  onUpload: (newUrl: string) => void;
  onRemove: (targetUrl: string) => void;
  isCalculating?: boolean; // Optional visual blocker flag
}

export const PropertyMedia: React.FC<PropertyMediaProps> = ({ 
  viewMode, 
  list, 
  onUpload, 
  onRemove,
  isCalculating = false 
}) => {
  const { getPhrase } = useSplash();
  const [isUploading, setIsUploading] = useState(false);
  const MAX_MEDIA_COUNT = 4;

  // Render strictly during input setup phase
  if (viewMode !== 'form') return null;
```

2. Clean Execution Call Site (PropertyPage.tsx)
Claude will feed local parent hook states directly into the media manager module:
```TypeScript
{/* SECTION 10: Input Form Image Upload Core Grid */}
<PropertyMedia
  viewMode={viewMode}
  list={propertyImagesState} // Local reactive parent array
  onUpload={(url) => {
    // Append the newly retrieved Cloudinary secure asset URL safely
    setPropertyImagesState((prev) => [...prev, url]);
  }}
  onRemove={(url) => {
    // Purge the image link seamlessly from the local pipeline
    setPropertyImagesState((prev) => prev.filter((item) => item !== url));
  }}
  isCalculating={isCalculating}
/>
---

### Q3 — Media Data Shape: How to migrate the initial hardcoded image?

Currently `images` is `string[]` (bare URLs). The spec requires an array of objects:
`{ url, publicId, width, height, format }`.

The existing initial image in `PropertyPage.tsx` is:
```ts
useState<string[]>(['https://res.cloudinary.com/do5lkisxf/image/upload/v1740137110/...'])
```
This is a Cloudinary URL, so `publicId` can be extracted from it, but `width`, `height`, and `format` are unknown without an API call.

**Options:**
- **A** — Keep the initial seed image as a partial object `{ url, publicId: '' }` (other fields zero/empty). Display still works since we only need `url` to render.
- **B** — Drop the hardcoded initial image entirely. Start with an empty array and let the user upload fresh.
- **C** — Other (please describe).

> *Your answer:* (A) Keep the initial seed image, but migrate its state declaration structure into a strongly-typed object matching the new specification contract ({ url, publicId, ... }). Hardcode fallback/empty values for the metadata fields (width: 0, height: 0, format: 'jpg', type: 'image') so it renders immediately without breaking the type system.

Reasoning:
- Preserving Product Context: The raw AI Studio code you provided confirms that mediaService.upload returns a rich data object and that the view relies on item.publicId to execute deletions (onRemove(publicId)). Dropping the initial seed image entirely (Option B) degrades the user experience by stripping away default placeholder data that anchors the UI during demos or initial loads.
- Type Safety Over Boilerplate: Providing a complete mock object structure for the initial seed ensures that your state hooks match the TS/JSX contract perfectly from mount to unmount, preventing optional chaining bugs or undefined references when rendering the <Media /> item cards.

Final Instructions:
Claude must upgrade the component to modern, utility-first Tailwind styling with full TypeScript typing. The template must eliminate tracking sync hooks (useEffect state mirroring) and treat the incoming list as a single, immutable source of truth:

1. Standardized Media Data Model (src/types/property.types.ts)
```TypeScript
export interface CloudinaryMediaNode {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  type: string;
}
```

2. Migrating Parent State Seed (PropertyPage.tsx)
Claude must initialize the parent state as an array of full data objects, parsing the public ID out of the hardcoded asset link natively:

```TypeScript
const [propertyMediaState, setPropertyMediaState] = useState<CloudinaryMediaNode[]>([
  {
    url: 'https://res.cloudinary.com/do5lkisxf/image/upload/v1740137110/some_mock_id.jpg',
    publicId: 'some_mock_id', // Extracted token for supporting immediate deletion triggers
    width: 1200,
    height: 800,
    format: 'jpg',
    type: 'image'
  }
]);
```

3. Fully Refactored Presentation Layer Component (PropertyMedia.tsx)
Claude will rewrite the layout into clean Tailwind utility classes, removing the old .media-list and .file-upload stylesheets, and wrapping the view layer in a clean responsive grid box:

---

### Q4 — Handler Ownership: Internal or Callback Props?

The plan (Step 2) says `handleUpload` and `handleRemove` live **inside** `PropertyMedia` and call `updatePropertyField` directly.
The spec's component signature shows **callback props** (`onUpload`, `onRemove`) that let the parent control state.
These two models are mutually exclusive if there is no property store slice yet.

**Options:**
- **A** — Internal handlers: `PropertyMedia` owns upload/remove logic, calls the store (requires Q2-A or Q2-C first).
- **B** — Callback props: `PropertyMedia` calls `onUpload(mediaObj)` / `onRemove(publicId)`; `PropertyPage` updates its own state. Simpler, no new store slice needed.

> *Your answer:* (B) Callback props. Let PropertyMedia handle the immediate asynchronous API request/local upload loading animation states, then yield the resulting object via onUpload(mediaObj) or pass the extraction token via onRemove(publicId). PropertyPage.tsx retains full authority over updating its own state array.

Reasoning:
- Perfect Alignment with Q2 & Q3: Because we decided to avoid creating an artificial, bloat-inducing global store slice for property metrics (Q2-B) and committed to treating the image stream as a strongly-typed parent payload (Q3-A), utilizing callback props is the only logical choice.
- Separation of Concerns: PropertyMedia maintains operational local states—like triggering the native OS file picker, listening to drag-and-drop actions, and displaying the spinning loading ticker (isUploading). Once Cloudinary dispatches the valid asset payload back, the presentation layer hands it off to the parent. This keeps the child view generic, self-contained, and completely decoupled from parent-side side effects.

Final Instructions:
Claude must mount the action callbacks cleanly within the refactored media component tree, ensuring local states handle animations while parent callbacks manipulate data arrays:

```TypeScript
// inside PropertyMedia.tsx execution loop...

const executeUploadPipeline = async (files: FileList) => {
  setIsUploading(true); // 1. Own local visual animation state
  try {
    // 2. Execute the third-party network upload seamlessly
    const res = await mediaService.upload(files);
    
    const newMediaNode: CloudinaryMediaNode = {
      url: res.secure_url,
      width: res.width,
      height: res.height,
      format: res.format,
      type: res.resource_type,
      publicId: res.public_id,
    };

    // 3. Forward the complete strongly-typed data node upstream to the parent page state hook
    onUpload(newMediaNode);
  } catch (err) {
    // Error handling alert display system triggers here...
  } finally {
    setIsUploading(false); // Clear loading locks
  }
};
```

---

### Q5 — Error Phrase Key: Is `property_media_error` defined in splash?

The spec says upload failures should show an alert using the phrase key `property_media_error`.

**Question:** Is this key already seeded in the splash/phrases backend, or do I need to use a fallback string only?
If it is missing, should I hard-code a temporary Hebrew string, or skip the error alert and just log to console for now?

> *Your answer:* The key is seeded. Ensure that a clear English translation is explicitly passed as the secondary fallback argument.

---

*Waiting for your answers before proceeding to any code.*

---

## 2026-05-20 — Implementation Decisions (Post-Q&A)

| # | Decision |
|---|----------|
| Q1 | Mobile visibility = `viewMode !== 'form'` → `return null`. No `activeResultTab` branch. |
| Q2 | Props pattern kept. No `property.slice.ts` created. `PropertyPage` owns state. |
| Q3 | Seed image migrated to `CloudinaryMediaNode` with `publicId` extracted from URL; `width/height` set to `0`. |
| Q4 | Callback props. `PropertyMedia` owns `isUploading` + Cloudinary call; calls `onUpload(node)` / `onRemove(publicId)`. |
| Q5 | `getPhrase('property_media_error', 'Image upload failed. Please try again.')` — key is seeded. |

### Files Changed
| File | Change |
|------|--------|
| `src/types/property.types.ts` | Added `CloudinaryMediaNode` interface |
| `src/services/media.service.ts` | **Created** — Cloudinary unsigned upload (CloudName: `do5lkisxf`, Preset: `rb7pszuz`) |
| `src/components/layout/PropertyMedia.tsx` | **Full rewrite** — typed props, Cloudinary pipeline, drag-and-drop, upload spinner, error phrase |
| `src/pages/PropertyPage.tsx` | `images: string[]` → `propertyMediaState: CloudinaryMediaNode[]`; replaced handlers; updated JSX |

*Implementation complete.*