# Deprecated APIs Fixed for Angular 17 Upgrade

This file documents all deprecated API changes applied during the Angular 12 → 17 upgrade.

## 1. entryComponents removed (Angular 17)
`entryComponents` arrays are no longer supported in Ivy. They have been removed from module declarations.

**File changed:** `src/app/runner/runner.module.ts`
- Removed `entryComponents: [AddProfileDialogComponent, AppUpdateDialogComponent]` from `@NgModule`
- Dialogs are now declared in `declarations` only (Ivy handles runtime compilation automatically)

## 2. TestBed.get() → TestBed.inject() (deprecated Angular 11+)
`TestBed.get()` was deprecated in Angular 11 and removed in Angular 17.

**Files changed (11 files):**
- `src/app/core/services/app.service.spec.ts`
- `src/app/core/services/browse-dialog.service.spec.ts`
- `src/app/core/services/node-proxy.registry.spec.ts`
- `src/app/core/services/profile.service.spec.ts`
- `src/app/core/services/script.service.spec.ts`
- `src/app/core/services/status.service.spec.ts`
- `src/app/core/services/settings.service.spec.ts`
- `src/electron/services/node-app.service.spec.ts`
- `src/electron/services/node-browse-dialog.service.spec.ts`
- `src/electron/services/node-profile.service.spec.ts`
- `src/electron/services/node-settings.service.spec.ts`

**Change:** `TestBed.get(Service)` → `TestBed.inject(Service)`

## 3. waitForAsync removed (removed in Angular 14+)
`waitForAsync` was deprecated in Angular 11 and removed in Angular 14. Replaced with `fakeAsync` from `zone.js/testing`.

**Files changed (11 files):**
- `src/app/app.component.spec.ts`
- `src/app/shared/components/browse-directory-field/browse-directory-field.component.spec.ts`
- `src/app/runner/components/add-profile-dialog/add-profile-dialog.component.spec.ts`
- `src/app/runner/components/app-update-dialog/app-update-dialog.component.spec.ts`
- `src/app/runner/components/script-form/script-form.component.spec.ts`
- `src/app/runner/components/script-page/script-page.component.spec.ts`
- `src/app/runner/components/script-log/script-log.component.spec.ts`
- `src/app/runner/components/status-bar/status-bar.component.spec.ts`
- `src/app/runner/components/script-tree/script-tree.component.spec.ts`
- `src/app/runner/components/settings-pane/settings-pane.component.spec.ts`
- `src/app/runner/components/script-tabs-container/script-tabs-container.component.spec.ts`

**Changes:**
- Import: `waitForAsync` → `fakeAsync`
- `beforeEach(waitForAsync(...))` → `beforeEach(fakeAsync(...))`
- Test body `it('...', () => { ... })` left synchronous (no wrapper needed)

## 4. zone.js/dist/zone-testing → zone.js/testing (deprecated)
The old path `zone.js/dist/zone-testing` is deprecated. The new path is `zone.js/testing`.

**File changed:** `src/test.ts`
- Import: `import 'zone.js/dist/zone-testing'` → `import 'zone.js/testing'`

## 5. debugElement.nativeElement (no change needed)
Checked `src/app/app.component.spec.ts` line 28: `fixture.debugElement.nativeElement` is still valid in Angular 17.
No changes required.

## 6. BrowserAnimationsModule duplicate (no change needed in App, but removed from SharedModule)
`BrowserAnimationsModule` should only be imported in the root `AppModule`, not in shared/lazy modules.

**File changed:** `src/app/shared/shared.module.ts`
- Removed `BrowserAnimationsModule` import and usage from `SharedModule`
- It remains in `AppModule` (which is correct)

## 7. zone.js/dist/zone-testing import (covered in #4)
See item #4 above for the `test.ts` fix.

## 8. Moment adapter deprecation notice
`@angular/material-moment-adapter` is deprecated in favor of date-fns. A TODO comment was added to track the future migration.

**File changed:** `src/app/core/core.module.ts`
- Added: `// TODO Phase 4: Migrate from @angular/material-moment-adapter to date-fns adapter`
