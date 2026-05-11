---
name: ui-component-layer
description: Governs the architecture, styling, and logic of all React components. Ensures atomic design, strict RTL support, and dynamic content injection via SplashContext.
reference:
  - @css-layer/SKILL.md
  - @splash-layer/SKILL.md
  - @phrase-usage.md
allowed-tools: [read_file, write_file, list_dir]
---

# Mandatory Workflow
1. **Blueprint & Skill Alignment:** Before coding, the agent MUST read the specific component SKILL (e.g., @logo-component.md) and its blueprint.
2. **Context First:** All UI strings MUST be retrieved via `getPhrase` or `getParam` from `useSplash`. No hardcoded Hebrew/English in JSX.
3. **Style Contract:** Component styles MUST exist in `src/assets/css/components/[name].scss` and import `../_vars.scss`.

# Execution Flow
1. **RTL Compliance:** All layouts must be verified for RTL (Hebrew) compatibility. Use `flex-row-reverse` or logical properties where needed.
2. **Iconography:** Use the project-standard icon library (Lucide-React or the local SVG assets) as defined in the specific component skill.
3. **State Management:** Distinguish clearly between local UI state (e.g., `isMenuOpen`) and global Store state (e.g., `loggedinUser`).

# Global Directory Isolation
- *Components:* `src/components/`
- *Styles:* `src/assets/css/components/` (One SCSS file per component)
- *Logic/Utils:* `src/utils/`

# Files Structure
src/
├── components/          # React Components (.tsx)
├── assets/
│   └── css/
│       ├── components/  # Scoped SCSS files
│       ├── _vars.scss   # Global variables (Colors, Spacing)
│       └── main.scss    # Entry point
└── contexts/            # SplashContext, etc.