---
name: property-media-component
description: Media management gallery for property images. Supports multi-file upload via Cloudinary, drag-and-drop interaction, and secure image removal.
references:
  - @ui-component-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @phrase-usage.md
---

# Requirements (Product Logic)
1. **Section Architecture & Layout**
- *Visibility:* 
    - Always visible in `viewMode === 'form'`.
    - Desktop: `hidden lg:block` otherwise.

- *Header:* SectionHeader | Label: `property_images_title` | Icon: `Upload` | Variant: `slate`.

- *Container:* Uses `Card` with responsive grid (`grid-cols-2` to `lg:grid-cols-6`).

- *Constraints:* `MAX_MEDIA_COUNT = 4`. Hide upload trigger if limit reached.

- *Loading State:* Apply `backdrop-blur` overlay when `isCalculating` is true.

2. **Media Actions (Cloudinary Integration)**
- Upload Logic:
    - Service: Cloudinary (Unsigned).
    - Params: CloudName: `do5lkisxf`, Preset: `rb7pszuz`.
    - Metadata: Store `url`, `publicId`, `width`, `height`, and `format`.
- Removal Logic:
    - Triggers `onRemove(publicId)`.
    - Local state optimization for immediate UI feedback.

3. **Interaction Design**
- Drag & Drop: Full area support (`onDrop`) for file uploads.

- Loading State: Show `LoadingIcon` or spinner inside the upload tile during transit.

- Error Handling: Show standardized alert if upload fails using `property_media_error`.


# File Structure
ROOT-PROJ/
└── src/
    ├── layouts/
    │   └── PropertyMedia.tsx
    ├── store/
    │   └── slices/
    │       └── property.slice.ts      # Actions: updatePropertyField
    ├── services/
    │   └── media.service.ts           # Cloudinary API calls
    └── assets/
        └── css/
            └── main.css               # Tailwind Theme (@theme) 


# Component Specification
```TypeScript

<PropertyMedia 
  list={property.media}           // Array of objects {url, publicId, ...}
  viewMode={viewMode}             // 'form' | 'view'
  onUpload={(mediaObj) => {}}     // Callback to update parent/store
  onRemove={(publicId) => {}}     // Callback to update parent/store
  isCalculating={isCalculating}   // Toggles global blur overlay
/>
