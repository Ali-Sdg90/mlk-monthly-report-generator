MelkRadar Monthly Report Generator
Project Vision & Implementation Brief

Repository name:
mlk-monthly-report-generator

1. Project Vision

Build a small, focused, professional internal web application for MelkRadar that generates a monthly housing-market report from two spreadsheet files.

The application will be used repeatedly by a manager every month.

The intended workflow is:

1. Open the application.
2. Upload the two required spreadsheet files.
3. Validate both files immediately.
4. If the inputs are valid, enable the report-generation action.
5. Parse and normalize the spreadsheet data.
6. Perform the required simple calculations and comparisons.
7. Populate a three-page report.
8. Preview the report in the browser.
9. Download the complete report as a reliable three-page PDF.

The project is not conceptually complex, but it contains a considerable amount of detail-oriented UI and styling work.

The most important goals are:

- correct data extraction
- reliable validation
- accurate calculations
- extremely high visual fidelity to the provided report designs
- stable PDF generation
- a clean and simple codebase
- a polished user experience

Do not over-engineer the application.

There is no need for:

- authentication
- a database
- a backend dashboard
- an admin panel
- a test suite in this phase
- a generic report-builder architecture
- unnecessary abstractions

The app only needs to solve this reporting workflow very well.

2. Required Tech Stack

Use:

- React
- Vite
- SCSS

Use TypeScript if it keeps the code clear and practical. TypeScript is preferred.

Useful lightweight libraries may be added when they meaningfully simplify the implementation, for example:

- xlsx / SheetJS for reading spreadsheet files
- a suitable PDF or print-generation solution

Avoid adding dependencies without a clear reason.

3. Design Is the Primary Source of Truth

The repository contains a directory named:

design/

Inside it are the visual references for the report pages.

The report should be implemented by studying those images carefully.

The expected design references are:

- design/Page-01.\*
- design/Page-02.\*
- design/Page-03.\*

The exact file extensions may vary.

IMPORTANT:

Do not treat the written descriptions in this document as an exact visual specification.

The images inside the design directory are the primary source of truth for:

- layout
- spacing
- hierarchy
- typography
- alignment
- proportions
- border radius
- visual weight
- icon placement
- cards
- tables
- footer structure
- map placement
- decorative elements
- colors
- overall visual composition

Study each reference image carefully before implementing its page.

The goal is not merely to create something "similar".

The goal is to recreate the provided designs as closely as reasonably possible in HTML, SCSS, SVG, and local assets.

Visual fidelity is one of the highest-priority requirements of the project.

Take as much implementation time as necessary to get the report pages right.

4. Assets and Visual Elements

Only the provided design images should be assumed to exist initially.

Any missing visual element required to reproduce the design should be recreated locally.

Examples include:

- icons
- simple illustrations
- decorative shapes
- maps
- location illustrations
- arrows
- statistic icons
- separators
- badges
- logo treatment where necessary

Prefer:

- SVG
- CSS
- local vector assets

over low-quality raster approximations.

Do not use the complete reference image itself as the report page.

The report must be constructed as real HTML/CSS content so the data can change every month.

If an icon or graphic can be recreated accurately as a small SVG, create it as a local reusable asset.

Do not introduce unnecessary external asset dependencies.

5. Application Experience

The application itself should be minimal, elegant, and professional.

The app UI is separate from the PDF report design.

Use a MelkRadar-inspired visual language:

- predominantly white
- MelkRadar green accents
- dark navy / dark text
- generous whitespace
- subtle borders and shadows
- simple interaction states

The application should not feel cluttered.

The initial screen should be a pleasant upload page that immediately explains what the user needs to do.

6. Upload Flow

The user must upload two spreadsheet files:

A. All Cities file
B. Tehran Zones file

The supplied sample files in the project represent the expected data structure.

The first version should primarily support Excel files.

If CSV support is trivial and does not complicate the implementation, it may also be supported, but it is not more important than reliable Excel support.

7. Validation Experience

Validate the files immediately after upload.

Below the upload inputs, show a clean checklist for each file.

Possible validation items include:

- file successfully uploaded
- spreadsheet can be read
- expected number of sheets exists
- current-period sheet found
- previous-period sheet found
- required columns found
- data rows exist
- price values are parseable
- ratio values are parseable
- expected city data exists
- expected Tehran district data exists

Each successful condition should receive a clear success state.

Each failed condition should show a clear and friendly error state.

The user should never need to guess why a file is invalid.

The "Generate Report" button must remain disabled until both files are valid.

8. Input Data Model

The sample spreadsheets show the expected structure.

All Cities file:

Typical columns:

- City
- Sale Sqm Price
- Mortg. Sqm Price
- Ratio (Average)

It contains two periods/sheets:

- current period
- previous comparison period

Values may not always use exactly the same representation.

For example, prices may appear as:

- raw numbers
- numeric strings
- abbreviated strings such as 59M

The parser should normalize these safely.

Tehran Zones file:

Typical columns:

- CityZone
- Sale Sqm Price
- Mortg. Sqm Price
- Ratio (Average)

It contains two periods/sheets:

- current period
- previous comparison period

It should contain Tehran districts 1 through 22.

There may also be additional rows, such as Tehran suburbs.

The detailed Tehran report page should use districts 1 through 22 unless the design explicitly requires something else.

9. Data Normalization

Keep spreadsheet parsing separate from rendering.

Create a small normalization layer that converts raw spreadsheet values into one predictable internal format.

Handle:

- numbers
- numeric strings
- values such as "59M"
- ratios stored as decimals
- Persian and English digits where practical
- district-name parsing

Useful helper functions may include concepts such as:

- parsePriceValue
- parseRatioValue
- extractDistrictNumber
- formatMillionToman
- formatPercent
- calculateGrowthPercent
- calculatePercentagePointChange

Names may differ if better names are appropriate.

Do not scatter parsing logic across report components.

10. Calculations

The report primarily needs straightforward comparisons.

For prices:

growthPercent =
((current - previous) / previous) \* 100

For ratio values:

show the current ratio as a percentage.

For period comparison:

ratioChange =
(currentRatio - previousRatio) \* 100

This should be displayed as a percentage-point change, not as ordinary price growth.

Examples:

0.18 -> 18%

0.18 vs 0.20 ->
-2 percentage points

Keep calculations centralized and reusable.

11. Report Architecture

The generated report consists of exactly three pages in this phase.

Each page should be a separate React component.

A reasonable conceptual structure is:

- ReportPage01
- ReportPage02
- ReportPage03

Shared visual pieces may be extracted only when genuinely useful.

Examples:

- ReportFooter
- StatCard
- ChangeIndicator

Do not create excessive component abstraction merely for architectural purity.

12. Page 01 — Cover Page

Visual source of truth:

design/Page-01.\*

Recreate this page according to the reference image.

The page contains the report cover and overall MelkRadar identity.

The implementation should include the same types of content visible in the design, including:

- MelkRadar branding
- monthly housing market report title
- report period
- supporting description
- Iran map / geographic visual
- city/location markers
- bottom feature items
- website / branding footer elements
- decorative visual details

The exact placement, proportions, typography, whitespace, and composition should be derived from Page-01 itself.

Do not invent a new cover design when the reference already defines it.

Text that changes monthly should come from a small report configuration or derived period metadata where practical.

13. Page 02 — National / Cities Summary

Visual source of truth:

design/Page-02.\*

This page is driven primarily by the All Cities spreadsheet.

Study the image carefully and reproduce the layout.

For each displayed location, render the information required by the design, including:

- city / region name
- current sale price per square meter
- sale-price change vs previous period
- current full-mortgage price per square meter
- mortgage-price change vs previous period
- current mortgage-to-sale / rent-to-sale ratio
- ratio change vs previous period

The page should reproduce:

- row/card structure
- typography
- column relationships
- separators
- icons
- positive and negative change treatments
- visual hierarchy
- footer
- page metadata

Use green for positive change and red for decline where the design does so.

"Biggest Change This Month"

The lower part of the page contains highlighted monthly insights.

Derive these automatically from the data.

At minimum, calculate appropriate candidates for:

- highest sale-price growth
- highest mortgage-price growth
- largest decline in ratio

Follow Page-02 for the exact visual arrangement.

14. Page 03 — Tehran Detailed Report

Visual source of truth:

design/Page-03.\*

This page is driven primarily by the Tehran Zones spreadsheet, with Tehran-level summary data taken from the All Cities spreadsheet when appropriate.

Recreate the page according to the reference image.

The page includes:

- large Tehran heading
- comparison-period text
- three top summary statistics
- Tehran district map / diagram
- complete detailed district table
- analysis / insight area
- footer

Top summary metrics should correspond to the design, such as:

- current Tehran sale price
- current Tehran mortgage price
- current ratio
- their changes vs the previous period

Prefer the Tehran row from the All Cities file for Tehran-wide summary statistics when available.

If necessary, use a clear fallback strategy based on the Tehran Zones data.

15. Tehran District Table

Use Tehran districts 1 through 22.

Sort them numerically.

For each district, the table should be able to show the values represented in the design, including:

- district number/name
- current sale price
- previous sale price
- sale-price change
- current mortgage price
- previous mortgage price
- mortgage-price change
- current ratio
- previous ratio
- ratio change in percentage points

Follow Page-03 for:

- column ordering
- alignment
- typography
- spacing
- arrow direction
- positive/negative colors
- table density

16. Tehran Map

Page-03 contains a stylized district map.

Create a local implementation that visually resembles the provided design.

SVG is preferred.

It does not need GIS-grade geographic precision.

Its role is visual and communicative.

The result should:

- look polished
- contain district labels
- sit naturally in the page composition
- resemble the reference closely

Do not add a heavy mapping library for this.

17. Generated Insight Text

Where the design contains a short analytical sentence, generate a concise insight automatically from the parsed data.

For example:

- district with highest sale-price growth
- districts with highest ratio
- another obvious monthly extreme visible in the reference

Keep this deterministic and simple.

Do not add AI or natural-language-generation services.

18. Report Formatting

Report values should be formatted consistently.

Prices:

Display in million toman per square meter where the design expects that unit.

Ratios:

Display as percentages.

Changes:

- price changes -> percent
- ratio changes -> percentage points

Persian digit formatting is preferred for visible report content if it can be implemented cleanly.

The report is RTL and should use appropriate RTL layout and typography.

19. Responsive Application UI

The application interface should work reasonably on mobile.

Do not turn mobile support into a major engineering task.

Required:

- upload controls fit small screens
- buttons remain usable
- validation checklist remains readable
- report preview can be viewed sensibly

The report itself should remain a fixed print layout.

Do not redesign the PDF pages according to phone width.

20. PDF Generation — Critical Requirement

PDF reliability is one of the most important technical requirements.

The downloaded report must:

- always contain the three intended pages
- preserve the report page dimensions
- preserve layout and spacing
- preserve page breaks
- avoid clipped content
- avoid accidental extra pages
- avoid viewport-dependent scaling
- avoid browser-window-size dependence
- avoid device-size dependence
- retain good visual quality

The PDF must not change depending on whether the user uses:

- a 4K monitor
- a small laptop
- a phone
- browser zoom
- a narrow browser window

Design the report using explicit print dimensions.

A4 portrait is appropriate unless the reference proportions clearly require another print size.

Use a dedicated print/export layout if needed.

Prefer vector/text-based PDF output and native print layout behavior over taking low-resolution screenshots of the DOM.

If a library is used, select a practical solution that produces predictable results without adding unnecessary infrastructure.

The user should ultimately have one clear action such as:

Download PDF

and receive the complete report.

21. Report Preview

After validation and generation, show the generated pages in the app.

A desktop preview may scale the visual representation of the fixed report pages to fit the viewport.

Scaling the preview is fine.

The underlying report layout itself must remain fixed and unchanged.

Do not couple report measurements to preview dimensions.

22. Project Structure

Keep the repository understandable.

A structure similar to the following is reasonable:

src/
assets/
components/
report/
pages/
shared/
utils/
spreadsheet/
report/
styles/
config/
App.tsx

design/
Page-01._
Page-02._
Page-03.\*

Do not force this exact structure if a slightly different organization is cleaner.

Keep clear separation between:

- spreadsheet parsing
- validation
- normalization
- calculations
- report data
- report rendering
- PDF export
- ordinary application UI

23. CI/CD

Add a simple GitHub-based CI/CD setup.

The repository should automatically:

1. validate the project on pushes / pull requests
2. build the Vite application
3. release new versions using semantic-release
4. deploy the production build to GitHub Pages

Keep this setup simple and dependable.

24. Semantic Release

Use semantic-release for automatic versioning and releases.

Use Conventional Commits as the source of release type.

Expected behavior:

- fix: -> patch release
- feat: -> minor release
- breaking change -> major release

The release workflow should:

- determine the next semantic version
- generate / update release notes or changelog as appropriate
- create the Git tag
- create the GitHub Release
- deploy the corresponding production application to GitHub Pages

Do not require manual version editing for normal releases.

25. GitHub Pages

Configure Vite correctly for GitHub Pages deployment.

Remember that this is a repository site, so asset paths and Vite base configuration must work correctly for:

mlk-monthly-report-generator

The deployed site should work correctly when opened from the GitHub Pages URL.

Do not build a deployment solution that only works at the domain root.

26. Husky and Commit Structure

Use Husky only for keeping commit messages consistent.

Do not create a complicated local hook system.

Add a commit-msg hook using commitlint.

Use Conventional Commits.

Examples of valid commits:

feat: add spreadsheet upload flow
fix: correct ratio calculation
style: improve report page spacing
refactor: simplify report parser
docs: update setup instructions
chore: update dependencies

The purpose of Husky in this project is simply to stop incorrectly structured commit messages before they enter the repository.

Do not add heavy pre-commit lint/test pipelines unless genuinely needed.

27. Code Quality

Keep the code:

- readable
- predictable
- maintainable
- reasonably typed
- easy for another developer to understand

Avoid:

- giant components
- duplicated spreadsheet logic
- excessive utility abstractions
- premature generic architecture
- overuse of state-management libraries

React state is likely enough.

Do not add Redux or another global-state framework unless there is a real technical need.

28. Testing

A dedicated automated test suite is not required in this phase.

Do not spend project time building unit, integration, or E2E test infrastructure.

Instead, focus on:

- working implementation
- correct calculations
- correct validation
- careful manual verification
- visual comparison against the design files
- PDF export correctness

29. README

Add a concise but professional README covering:

- project purpose
- tech stack
- local setup
- development command
- production build command
- expected spreadsheet inputs
- report-generation workflow
- deployment / release behavior

30. Implementation Priorities

Use this priority order when making trade-offs:

1. Visual fidelity to design/Page-01, Page-02, and Page-03
2. Correct spreadsheet parsing
3. Correct monthly calculations
4. Reliable PDF generation
5. Clear validation UX
6. Clean and simple code
7. Good application polish
8. Basic mobile usability

9. Working Philosophy

This is a focused internal utility.

It should feel polished and dependable, not overbuilt.

There is a lot of detailed styling and repetitive implementation work in recreating the report.

That is expected.

Do not simplify away important visual details merely to finish faster.

Take the time needed to inspect the design references, compare the implementation against them, and refine spacing, typography, proportions, assets, and layout.

At the same time, do not introduce architectural complexity that does not help the user.

The final result should feel like a small professional product that does one job extremely well.

32. Definition of Done

The first version is complete when:

- the app runs locally
- both provided spreadsheet formats can be uploaded
- both files are validated clearly
- invalid files cannot generate a report
- valid files can generate report data
- all three report pages render
- Page-01 closely matches design/Page-01
- Page-02 closely matches design/Page-02
- Page-03 closely matches design/Page-03
- spreadsheet values correctly populate the report
- calculations are correct
- report preview works
- the complete report downloads as a stable three-page PDF
- PDF layout is independent of the user's screen size
- the upload experience works reasonably on mobile
- Conventional Commit messages are enforced with Husky + commitlint
- semantic-release manages versions and GitHub releases
- GitHub Actions builds and deploys the app to GitHub Pages
- the repository includes a clear README

Build this carefully, verify the output against the design references, and prefer a simple reliable solution over unnecessary complexity.
