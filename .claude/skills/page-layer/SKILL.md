---
name: page-layer-skill
description: Strict architectural guidelines for the Page Layer. Defines the responsibilities of "Smart Components" including API orchestration, authorization guards, and state management.
reference:
  - @ui-component-layer/SKILL.md
  - @service-layer/SKILL.md
  - @state-management-layer/SKILL.md
allowed_model: [gemini-3-flash]
---

# Page Layer Responsibilities
1. **Authorization & Guards** 
- *Identity Check:* Every page must verify the `loggedinUser` state. Unauthorized access must trigger an immediate redirect to `/login` or `/`.

- *Feature Access:* Pages are responsible for checking `isLock` or `isComingSoon` flags from the calculator metadata and preventing interaction if true.

2. **Data Orchestration (The "Smart" Hub)**
- *Centralized Fetching:* Primary API calls occur at the Page level. Child components should receive "finished" data as props.

- *Async Strategy:* - Use `useEffect` for initial mounting fetches.
  - Implement "Phase Loading" (Basic data first, calculation-heavy data second) for high-performance dashboards.

- *Loading UI:* The Page controls global loading states (Overlays/Skeletons) via the `app.slice`.

3. **Event & Logic Handling**
- *Action Controller:* Define event handlers (e.g., `handleDelete`, `onValueChange`) within the Page and pass them down.

- *Computed State:* Perform data transformations (filtering, sorting, aggregations) before rendering children to keep child components "dumb" and presentational.

- *Navigation:* All `react-router` logic (`useNavigate`, `useParams`) resides exclusively in the Page layer.

4. **Layout & Accessibility**
- *RTL Integrity:* Every page root must have `dir="rtl"` and proper text alignment.

- *Responsive Shell:* Use a standardized container: `max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10`.

- *Standard Components:* Every Page must utilize `ScreenHeader` for consistent titling using the `PhraseService`.


# Implementation Pattern
```TypeScript
const StandardPage = () => {
  // 1. Hooks & Store
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useFetchData();

  // 2. Guards
  if (!user) return <Navigate to="/login" />;

  // 3. Logic
  const handleAction = async (payload) => {
    await apiService.post(payload);
    refresh();
  };

  // 4. Render
  return (
    <main dir="rtl" className="page-container animate-in fade-in">
      <ScreenHeader 
        title={getPhrase('page_title')} 
        subtitle={getPhrase('page_subtitle')} 
      />
      
      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <PresentationalComponent 
          items={data} 
          onAction={handleAction} 
        />
      )}
    </main>
  );
};
```

# Business Rules
- *Naming:* Files must use `PascalCase` and end with `Page.tsx` (e.g., `PropertyPage.tsx`).

- *No Direct CSS:* All styling must be handled via Tailwind classes or the `cn` utility.

- *Separation of Concerns:* A Page should never contain complex UI internals (like SVG paths or raw HTML tables); these belong in the `ui-component-layer`.