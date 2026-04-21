# Design System Document: AI Learning Assistant

## 1. Overview & Creative North Star
This design system is built upon the Creative North Star of **"The Kinetic Void."** In this vision, the interface is not a flat plane but a deep, pressurized space where data behaves like light. We are moving away from the "SaaS-template" look of boxes-within-boxes. Instead, we treat the AI dashboard as a high-end command center—think orbital mechanics meets luxury editorial.

To break the "template" feel, we employ **intentional asymmetry**. Align large display type to the far left while anchoring technical data to the right. Overlap glass containers to create a sense of three-dimensional depth. This is a "living" system where the interface feels powered by the very AI it teaches.

---

## 2. Colors & Surface Philosophy
The palette is rooted in absolute depth, using `surface` (`#0e0e0f`) as our infinite canvas. Neon accents—Cyan (`primary`), Purple (`secondary`), and Lime (`tertiary`)—are used sparingly as "energy sources" rather than decorative fills.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to define sections. We define boundaries through:
- **Tonal Shifts:** Place a `surface-container-low` (`#131314`) card on a `background` (`#0e0e0f`) to create a soft edge.
- **Negative Space:** Use the spacing scale to let elements breathe, allowing the eye to find the "invisible" grid.

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of tinted obsidian.
- **Base:** `surface` (`#0e0e0f`)
- **Primary Containers:** `surface-container` (`#1a191b`)
- **Elevated Content:** `surface-container-high` (`#201f21`)
- **Active/Interactive Elements:** `surface-bright` (`#2c2c2d`)

### The Glass & Gradient Rule
For gamified elements or floating modals, use **Glassmorphism**. Combine `surface-variant` (`#262627`) at 40% opacity with a `backdrop-filter: blur(20px)`. 
Apply **Signature Textures** to hero CTAs by using a linear gradient from `primary` (`#a1faff`) to `primary-container` (`#00f4fe`) at a 135-degree angle. This adds "soul" and dimension that flat hex codes cannot provide.

---

## 3. Typography: The Editorial Tech-Stack
We use a high-contrast typographic pairing to balance futuristic aesthetics with extreme legibility.

- **The Voice (`Space Grotesk`):** Used for all `display` and `headline` tokens. Its geometric quirks feel engineered and high-tech. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero titles to command authority.
- **The Engine (`Manrope`):** Used for `title`, `body`, and `label` tokens. It is a modern sans-serif that remains crisp even at the smallest `label-sm` (0.6875rem) size.

**Hierarchy Note:** Always pair a `display-sm` headline with a `label-md` in `primary` color (all caps) sitting directly above it. This "Tag + Title" pairing is a signature layout of this design system.

---

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering**, not shadows.

- **The Layering Principle:** To "lift" a component, move it one step up the surface-container scale. A card using `surface-container-highest` (`#262627`) sitting on `surface` feels naturally closer to the user.
- **Ambient Shadows:** Only for floating elements (modals/tooltips). Use a blur of 40px and 8% opacity. The shadow color must be a tinted version of the `primary` glow rather than black, simulating light emission from the UI.
- **The "Ghost Border":** If a boundary is strictly required for accessibility, use the `outline-variant` (`#484849`) at 15% opacity. It should feel like a faint suggestion of a line, not a hard barrier.

---

## 5. Components

### Buttons
- **Primary (The Pulse):** Background: `primary` (`#a1faff`), Text: `on_primary` (`#006165`). Apply a `box-shadow` using the `primary` color at 20% opacity to create a "glow" effect.
- **Secondary (The Outline):** Background: Transparent. Ghost Border: `secondary` (`#d873ff`) at 30%. Text: `secondary`.
- **Corner Radius:** Use `md` (0.75rem) for standard buttons and `full` for gamified action chips.

### Stylized Input Fields
Forbid the "four-sided box." Use a `surface-container-highest` background with a 2px bottom-accent of `primary` when focused. The label should float in `label-sm` using the `on_surface_variant` color.

### Glassmorphism Cards
- **Construction:** `surface-container` at 60% opacity, `backdrop-blur: 12px`.
- **Interaction:** On hover, the "Ghost Border" opacity should increase from 10% to 40% using the `primary` color. 
- **No Dividers:** Never use a line to separate content within a card. Use a 1.5rem (`xl`) vertical gap to distinguish the header from the body.

### Progress & Gamification
- **The Conduit:** Progress bars should use `tertiary` (`#8eff71`) with a subtle pulse animation.
- **Status Chips:** Use `secondary_container` for "In Progress" and `tertiary_container` for "Completed," keeping text contrast high with `on_secondary_fixed` and `on_tertiary_fixed`.

---

## 6. Do's and Don'ts

### Do:
- **Use Intentional Asymmetry:** Offset your grids. Let an image bleed off the edge of a `surface-container`.
- **Embrace the Dark:** Let 80% of the screen be `surface` or `surface-container-low`. The impact of your neon accents depends on the surrounding darkness.
- **Nesting Surfaces:** Place `surface-container-lowest` elements inside `surface-container-high` sections to create "wells" of content.

### Don't:
- **No Pure White Text:** Avoid using `#ffffff` for long-form body text. Use `on_surface_variant` (`#adaaab`) to reduce eye strain in dark mode.
- **No Hard Borders:** Never use a 100% opaque border. It breaks the "Kinetic Void" illusion.
- **No Default Grids:** Don't just center everything. High-end editorial design is about the tension between elements. Use the `xl` (1.5rem) roundedness to soften the tech-heavy aesthetic.