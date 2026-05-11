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
    
*AI says:*