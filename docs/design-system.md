# K&H Online Store — Design System & Component Guidelines

## Architectural Foundations

### 1. Spacing & Grid System
- Standard container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Editorial rhythm: Baseline 4px/8px scale (`gap-4`, `gap-6`, `gap-8`, `gap-12`, `py-12`, `py-16`, `py-24`)
- Clean separation: Generous whitespace around luxury product imagery and editorial banners.

### 2. Component Token Specifications
- **Buttons**:
  - *Primary*: `bg-[#B77D83] hover:bg-[#a66a71] text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-all duration-200`
  - *Secondary / Dark*: `bg-[#292626] hover:bg-[#3d3838] text-white font-medium px-6 py-3 rounded-lg transition-all`
  - *Luxury Outline*: `border border-[#C5A477] text-[#292626] hover:bg-[#FFF9F5] px-6 py-3 rounded-lg transition-all`
  - *Ghost / Light*: `bg-[#F5E7E5] text-[#292626] hover:bg-[#ebd5d2] px-4 py-2 rounded-lg`
- **Product Cards**:
  - Elevated crisp white container with subtle blush border: `bg-white rounded-xl border border-[#F5E7E5] hover:border-[#C5A477]/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group`
  - Aspect ratio for fashion & home: `aspect-[3/4]` or `aspect-square` with `object-cover` and graceful hover zoom (`group-hover:scale-105 transition-transform duration-500`)
  - Badges: `bg-[#B77D83] text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider`
- **Inputs & Forms**:
  - `bg-white border border-[#F5E7E5] focus:border-[#B77D83] focus:ring-2 focus:ring-[#B77D83]/20 rounded-lg px-4 py-2.5 text-[#292626] outline-none transition-all`
- **Modals & Drawers**:
  - Backdrop: `bg-black/40 backdrop-blur-sm`
  - Sheet/Modal surface: `bg-[#FFF9F5] rounded-2xl border border-[#F5E7E5] shadow-2xl`

### 3. RTL & Multilingual Principles
- Logical CSS properties or explicit RTL-aware utilities (`rtl:space-x-reverse`, `rtl:text-right`, `ltr:text-left`, `dir="rtl"` vs `dir="ltr"`).
- Symmetrical layout flipping between Arabic (`ar`) and English/French (`en`, `fr`).
- Number and currency formatting using official Tunisian locale rules: `79.000 د.ت` / `79,000 TND`.
