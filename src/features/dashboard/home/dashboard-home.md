# Dashboard Home Feature

## Purpose

Frontend feature that displays a comprehensive dashboard home page with statistics cards, charts, recent activity lists, and archive queue management for authenticated users.

## Scope

- Display dashboard home page at `/dashboard`
- Render 8 statistics cards in responsive grid
- Display 3 chart visualizations using shadcn chart components (monthly trends, status distribution, archive progress)
- Show recent correspondences list (5 items)
- Show archive work queue (5 items pending)
- Show latest archived correspondences list (5 items)
- Support Arabic RTL layout
- Support light/dark mode via semantic tokens
- Responsive design (1 col mobile, 2 col tablet, 4 col desktop)

## Out of Scope

- Correspondence creation/editing
- Archive workflow execution
- User authentication (delegated to SessionService)
- Permission granularity (read-only dashboard for all active users)
- Any non-production chart data

## Architecture Compliance

✅ Feature structure follows convention (components, hooks, api, types)
✅ No Prisma in feature components
✅ API client wraps HTTP calls
✅ React Query for data fetching and caching
✅ Server-side backend enforces authorization
✅ Components use semantic tokens only (no hardcoded colors)
✅ Dark mode support via Tailwind CSS variables

## Files Created

### Frontend Feature Structure

- `src/features/dashboard/home/types.ts` – Frontend types/DTOs
- `src/features/dashboard/home/api/dashboard.api.ts` – HTTP client
- `src/features/dashboard/home/hooks/use-dashboard-stats.ts` – React Query hook
- `src/features/dashboard/home/components/dashboard-home-page.tsx` – Main page (client)
- `src/features/dashboard/home/components/dashboard-stat-card.tsx` – Stat card component
- `src/features/dashboard/home/components/monthly-correspondence-chart.tsx` – Monthly chart
- `src/features/dashboard/home/components/correspondence-status-chart.tsx` – Status chart
- `src/features/dashboard/home/components/archive-progress-chart.tsx` – Archive progress
- `src/features/dashboard/home/components/recent-correspondence-list.tsx` – Recent list
- `src/features/dashboard/home/components/archive-task-list.tsx` – Archive queue list
- `src/features/dashboard/home/components/recent-archive-list.tsx` – Latest archived records list

### Page Update

- `src/app/(dashboard)/dashboard/page.tsx` – Updated to use DashboardHomePage

## Database Impact

- None (read-only, uses existing backend queries)

## API Integration

- Calls: `GET /api/v1/dashboard/overview`
- Response: DashboardOverviewDTO with stats, charts data, and lists
- Error handling: Shows error card on API failure
- Loading state: Skeleton loaders during fetch

### Auth behavior

- Dashboard API no longer returns empty fallback payload on session failure.
- Unauthenticated access now follows standard protected-route error flow.

## Charts Implemented

### 1. Monthly Correspondence Chart

- Type: Recharts BarChart wrapped by shadcn ChartContainer
- X-axis: Last 12 months
- Series: Digital Generated, Scanned Physical
- Tooltip/Legend: shadcn ChartTooltip + ChartLegend

### 2. Status Distribution Chart

- Type: Recharts PieChart (donut style) wrapped by shadcn ChartContainer
- Statuses: DRAFT, GENERATED, RECEIVED, ARCHIVE_PENDING, ARCHIVED
- Shows: Count and percentage
- Tooltip/Legend: shadcn ChartTooltip + ChartLegend

### 3. Archive Progress Chart

- Type: Recharts AreaChart wrapped by shadcn ChartContainer + summary cards
- Percentage: (archived / (archived + pending)) \* 100
- Stats: Archived count, Pending count
- Color: semantic chart tokens only

## UI Components Used

✅ Card (shadcn/ui)
✅ Button (shadcn/ui)
✅ Skeleton (shadcn/ui for loading state)
✅ ChartContainer / ChartTooltip / ChartLegend (shadcn chart)
✅ Semantic tokens from globals.css

- Background, foreground, card, primary, secondary, muted, accent, border

## Responsive Layout

- Mobile (1 col): Stats stacked vertically
- Tablet (2 cols): Stats 2x4 grid, charts stacked
- Desktop (4 cols):
  - Row 1: 8 stat cards in 4-col grid
  - Row 2: 2 charts side-by-side
  - Row 3: Archive progress (1) + Recent list (2 cols)
  - Row 4: Archive queue full-width

## Dark Mode Support

✅ All colors use semantic tokens
✅ Automatic dark mode via globals.css variables
✅ No hardcoded colors
✅ Border/bg/text colors scale properly in dark mode
✅ Chart colors are theme-aware via chart CSS variables

## Styling Notes

- No Tailwind arbitrary values except radius where needed
- No hardcoded hex colors
- All colors from --color-\* CSS variables
- Spacing uses standard Tailwind scale (p-6, gap-4, etc.)
- Typography uses semantic scale (text-3xl, text-lg, text-sm)

## Performance Considerations

✅ React Query caching: 5 minute stale-time
✅ Auto-refetch: 10 minutes
✅ Refetch on window focus enabled
✅ Retry: 3 attempts
✅ No unnecessary re-renders
✅ Skeleton loading state prevents layout shift
✅ shadcn chart wrapper with Recharts primitives

## Frontend Status

✅ All 7 components created
✅ React Query hook configured
✅ API client implemented
✅ Page updated
✅ Responsive grid layout
✅ Dark mode support
✅ Loading/error states
✅ Arabic RTL ready

## Backend Status

- See: `src/server/modules/dashboard/overview/overview.md`

## Validation Performed

- [x] Date formatting: Arabic locale (ar-SA)
- [x] Number formatting: Arabic numerals (toLocaleString('ar-SA'))
- [x] Components are client-side ("use client")
- [x] No Prisma imports in feature
- [x] Semantic tokens only
- [x] Card import correct (from shadcn/ui)
- [x] Types match backend DTOs
- [x] API endpoint path correct
- [x] Query params: credentials='include' for auth

## Latest Changes

- Reworked dashboard into polished analytics layout with stronger hierarchy and spacing
- Replaced legacy chart rendering with shadcn chart components and Recharts primitives
- Added stat-card iconography using lucide-react
- Added latest archived correspondences panel
- Removed hardcoded status color classes from recent correspondence list
- Removed dashboard API empty-data fallback on auth failure

## Browser Support

- Modern browsers with CSS Grid support
- Dark mode via CSS variables (CSS custom properties)
- Fully functional without JavaScript dependency on charting library

## Remaining Issues

- None known at feature level

## Runtime Checklist (Pre-build)

- [ ] API returns correctly formatted DashboardOverviewDTO
- [ ] Numbers are Arabic locale formatted
- [ ] Dates are formatted as Arabic text
- [ ] Dark mode styles render properly
- [ ] Loading skeleton appears during fetch
- [ ] Error card displays on API failure
- [ ] Recent list shows 5 items max
- [ ] Archive queue shows 5 items max
- [ ] Monthly data shows 12 months
- [ ] Status chart shows all 5 statuses
- [ ] Stat cards layout responsive (1/2/4 cols)

## Next Safe Step

1. Run `npm run build` to verify TypeScript
2. Run `npm run lint` for code quality
3. Start dev server and navigate to `/dashboard`
4. Verify stats load and charts render
5. Test dark mode toggle
6. Test mobile responsive layout
