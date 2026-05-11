---
name: property-page
description: The core analytical engine of the system. A complex, stateful form for property evaluation that handles multi-stage data entry, real-time financial calculations, and responsive result visualization.
references:
  - @page-layer/SKILL.md  
  - @css-layer/SKILL.md
  - @state-management-layer/SKILL.md  
  - @splash-layer/SKILL.md
  - @phrase-usage.md
  - @api-layer/SKILL.md
  - @property-api.yaml
  - @ui-component-layer/SKILL.md  
  - @tab-component.md
  - @property-form-component.md
  - @property-metrics-component.md
  - @property-interests-component.md
  - @property-media-component.md
  - @property-yield-forecast-component.md
  - @property-amortization-schedule-component.md
  - @property-charts-component.md
  - @property-tour-component.md
---

# Requirements (Product Logic)

1. **Access Control & Security:**
- *Auth Guard:* Only `loggedinUser` can access. Non-logged-in users navigate to `/login`.

- *Ownership Validation:* If `propertyUUID` exists but does not belong to the user, trigger `logout` and navigate to `/login`.

- *Integrity:* If `propertyUUID` is invalid/not found, navigate to `/`.

2. **Initialization & Persistence:**
- *On Mount:* Fetch property data via `GET /api/property/:propertyUUID`.

- *New Property Flow:* If no UUID, initialize empty state. Create property on first field change via `POST /api/property`.

- *Update Flow:* Every field change triggers an auto-save via `PUT /api/property`.

- *Tour Mode:* If `loggedinUserState.tourCompletedTime` is null, initialize the `PropertyTour` overlay starting from the current step.

3. **Visual Structure & Components:**
- *Part 1: Header & Metrics*
  - `ScreenHeader`: Shows `property_cost_estimate_title` and subtitle.
  - `PropertyMetrics`: Displayed at the top. Shows Yield, Financing %, and Monthly Repayment.
  - Mobile Action: "Analysis" Button (PieChart icon) appears only if mandatory fields are valid.

- *Parts 2-8: Input Forms* 
  - `PropertyForm`: Handles basic details (City, Price, Equity, Income, Commitments).
  - `PropertyInterests`: Collapsible section for Mortgage/Interest rates.

- *Parts 9-11: Financial Results*
  - `PropertyYieldForecast`, `PropertyAmortizationSchedule`, `PropertyChart`.
  - `Logic`: These components are hidden if the server returns null for calculations (invalid deal).

- *Part 12: Media*
  - `PropertyMedia` for image uploads.

4. **Mobile Responsive Logic (Landscape Switch):**
- *Default*: Hide Forecast, Schedule, and Charts to save space.
- *Result Mode*: When "Analysis" is clicked:
  - CSS Class `.simulated-landscape-mobile` applied.
  - View switches to a 3-tab system (Yield, Amortization, Graph).
  - Header is hidden; a `Button` (variant: outline, icon: ChevronRight) provides a "Back" action to the form.

5. **Financial Logic Constraints:**
- *Mandatory Fields*: `apartmentType`, `price`, `calcEquity`, `calcIncomes`, `calcMortgagePeriod`.

- *Validation Feedback*: If `calcAmortizationSchedule` is `null`, display "Incomplete Data" overlay with `iconMissingData`.

- *Loading State*: While `isCalculating` is true, show `Overlay` with Lottie animation (`animCalculating`). Maintain input focus and cursor position after re-render.


# Files Structure
ROOT-PROJ
└── src/
    ├── pages/
    │   └── PropertyPage.tsx                  # Orchestrator: Handles ViewMode, Params, and Layout.
    ├── components/
    │   ├── layouts/
    │   │   ├── PropertyForm.tsx              # Input Group: Basic details & Financials.              
    │   │   ├── PropertyInterests.tsx         # Collapsible: Market assumptions.            
    │   │   ├── PropertyMetrics.tsx           # Summary: Sticky header metrics.            
    │   │   ├── PropertyYieldForecast.tsx            
    │   │   ├── PropertyAmortizationSchedule.tsx            
    │   │   ├── PropertyChart.tsx             # Visualization: Recharts/Canvas implementation. 
    │   │   ├── PropertyMedia.tsx                      
    │   │   └── PropertyTour.tsx 
    │   └── common/
    │       └── Notification.tsx              # Floating feedback component                 
    ├── services/
    │   ├── http.service.ts
    │   └── user.service.ts                   # API call: PUT /user
    ├── models/
    │   └── PropertyData.ts                   # The full interface (Server-driven fields).
    └── assets/
        └── css/
            └── main.css                      # Tailwind Theme (@theme)        


# Component Specification
```TypeScript
// Usage in Router
<Route path="/property" element={<PropertyPage />} />

// Core State Interface (Simplified)
/**
 * PropertyState Interface
 * Represents the complete data structure of a property investment analysis.
 */
export interface PropertyState {
  // --- Identifiers & Metadata ---
  uuid?: string;                    // Unique identifier for the property
  updatedByField?: string;          // Tracks the last modified field to maintain UI focus/cursor position
  media?: PropertyMediaItem[];      // List of uploaded images or documents

  // --- Part 1: Basic Property Details (Primary Inputs) ---
  city: string;                     // The selected city for the property
  settlementName?: string;          // Specific neighborhood or settlement
  address?: string;                 // Full street address
  apartmentType: 'יחידה' | 'חליפית' | 'השקעה' | '';       // Transaction category
  propertyPrice: number | null;     // Acquisition price
  equity: number;                   // User's available cash/equity for this deal
  additionalInfo?: string;          // General notes or descriptions

  // --- Part 2: Financing & Household Data ---
  income: number;                   // Total monthly household net income
  commitments: number;              // Total monthly debts/commitments (loans, alimony, etc.)
  selectedFundingSources: string[]; // List of selected IDs from FINANCIAL_DEFAULTS (e.g., parental loan)
  mortgagePeriod: string;           // Amortization period in years (stored as string for select inputs)
  
  // --- Part 3: Acquisition Expenses (Closing Costs) ---
  lawyerPercent: number;            // Legal fees percentage
  lawyerValue: number;              // Calculated legal fees in currency
  realtorPercent: number;           // Brokerage fees percentage
  realtorValue: number;             // Calculated brokerage fees in currency
  mortgageConsultant: number;       // Flat fee for mortgage advisory
  renovation: number;               // Estimated budget for repairs/renovations
  purchaseTax?: number;             // Calculated tax based on price and apartmentType
  
  // --- Part 4: Recurring Rental Data & Protection ---
  expectedRentPercent: number;      // Gross rental yield target (%)
  expectedRentValue: number;        // Monthly rental income
  lifeInsurance: number;            // Monthly mortgage life insurance premium
  buildingInsurance: number;        // Monthly property insurance premium

  // --- Part 5: Financial Assumptions (Market & Interests) ---
  interest: number;                 // Base annual mortgage interest rate
  interest5y: number;               // Estimated interest rate in 5 years
  interest10y: number;              // Estimated interest rate in 10 years
  avgInterestTaking: number;        // Average interest at the time of borrowing
  avgInterestRepayment: number;     // Projected interest during repayment phase
  index: number;                    // Projected annual inflation/CPI index
  expectedYield: number;            // Projected annual property value appreciation
  saleCosts: number;                // Estimated costs to sell the property (%)
  depreciation: number;             // Annual property depreciation for tax/valuation (%)

  // --- Part 6: Calculated Financial Engines (Server-Generated) ---
  // If these are null, the UI triggers the "Incomplete Data" or "Lock" state
  calcYieldForecast: YieldForecastData[] | null;        // Data for charts and yield tables
  calcAmortizationSchedule: AmortizationEntry[] | null; // Month-by-month mortgage breakdown
  
  // High-level metrics for the sticky dashboard header
  metrics?: {
    mortgageAmount: number;               // propertyPrice - (equity - expenses)
    actualFinancingPercent: number;       // LTV (Loan to Value)
    monthlyMortgageRepayment: number;     // Total monthly bank payment
    monthlyCashFlow: number;              // Rent - (Mortgage + Insurance)
    totalYield10y: number;                // Cumulative equity growth over 10 years
    maxFinancingPercent: number;          // Regulatory ceiling based on apartmentType
  };

  // --- UI Configuration & Persistence ---
  showInterestsContainer: boolean;        // Persisted state: whether the Interests section is expanded
  showMortgagePrepayment: boolean;        // Flag to enable/disable advanced mortgage calculation logic
}

/** * Supporting Structures 
 */

export interface PropertyMediaItem {
  publicId: string;       // Cloudinary or storage unique ID
  url: string;            // Public URL for the asset
}

export interface YieldForecastData {
  month: number;
  year: number;
  propertyValue: number;  // Appreciated value
  rent: number;           // Adjusted for inflation/index
  expenses: number;       // Recurring costs
  financingCosts: number; // Monthly repayment
  valueAtRealization: number; // Net value after selling costs
  bettermentTax: number;  // Projected capital gains tax
  profit: number;         // Net cash profit upon sale
  totalYield: number;     // ROI on total price
  yieldOnEquity: number;  // Cash-on-Cash return
}

export interface AmortizationEntry {
  month: number;
  startPrincipal: number;     // Principal at start of month
  interest: number;           // Applied interest rate
  repayment: number;          // Total monthly payment
  principalRepayment: number; // Portion covering principal
  interestRepayment: number;  // Portion covering interest
  endPrincipal: number;       // Remaining debt after payment
}