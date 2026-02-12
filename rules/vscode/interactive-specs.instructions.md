---
name: 'Interactive Specs'
description: 'Interactive spec workflow — save, validate, build, and sync spec files for transparency'
applyTo: '**'
---

## Interactive Spec Workflow

Every design built in Figma MUST go through the spec file workflow. This makes the process visible, editable, and collaborative.

### Directory

All specs live in `.cursor/specs/`. Each spec is a standalone `.json` file named after the design it represents.

### Naming Convention

Use lowercase kebab-case, descriptive of the screen or component:
- `login-screen.json`
- `user-profile-card.json`
- `settings-page.json`
- `onboarding-step-1.json`
- `nav-sidebar.json`

For multi-screen flows, use a shared prefix:
- `checkout-cart.json`
- `checkout-payment.json`
- `checkout-confirmation.json`

---

### T1. Save Before Build — ALWAYS

**Before calling `build_and_verify` or `build_from_spec`, the spec JSON MUST be written to `.cursor/specs/<name>.json`.**

Workflow:
1. Construct the spec object
2. **Write the spec to `.cursor/specs/<name>.json`** using the Write tool
3. Tell the user: "Saved spec to `.cursor/specs/<name>.json`" (so they know it exists and can review it)
4. Run validation: `node .cursor/specs/validate-spec.cjs .cursor/specs/<name>.json`
5. If validation has **errors**: fix the spec, re-save, re-validate — do NOT build until clean
6. If validation has only **warnings**: note them to the user, proceed to build
7. Build in Figma using `build_and_verify` (preferred) or `build_from_spec`

**NEVER skip the save step.** Even for small components or quick iterations, the spec must exist on disk.

### T2. Update Spec on Rebuild

When rebuilding a design (e.g. fixing issues, user requested changes):
1. Read the existing spec from disk: `.cursor/specs/<name>.json`
2. Modify the spec in memory
3. **Overwrite** `.cursor/specs/<name>.json` with the updated version
4. Tell the user what changed: "Updated `.cursor/specs/<name>.json` — changed X, Y, Z"
5. Re-validate
6. Delete the old Figma node(s) (per canvas hygiene rules)
7. Build the new version

### T3. User Edits a Spec

When the user says "rebuild <name>", "apply <name>", or similar — or when you detect that a spec file has been modified:
1. Read the spec from `.cursor/specs/<name>.json`
2. Run validation: `node .cursor/specs/validate-spec.cjs .cursor/specs/<name>.json`
3. **If errors**: Report them clearly to the user with the exact error messages. Do NOT build. Suggest fixes.
4. **If valid/warnings only**: Proceed to build in Figma
5. If there's an existing Figma build from a previous version of this spec, delete it first

### T4. Spec File Metadata

Each spec file should include metadata at the top level alongside the design tree. Add a `_meta` key (the plugin ignores keys starting with `_`):

```json
{
  "_meta": {
    "description": "Login screen with email/password form and social auth options",
    "figmaNodeId": "123:456",
    "lastBuilt": "2026-02-11T10:30:00Z",
    "version": 1
  },
  "name": "Login Screen",
  "type": "frame",
  ...
}
```

Update `_meta` after each successful build:
- Set `figmaNodeId` to the root node ID returned by the builder
- Set `lastBuilt` to the current ISO timestamp
- Increment `version`

### T5. Multi-Screen Tracking

When building multiple screens (e.g. from a PRD), create one spec file per screen. After all screens are built, create a manifest:

`.cursor/specs/_manifest.json`:
```json
{
  "project": "User Onboarding Flow",
  "screens": [
    {"file": "onboarding-welcome.json", "order": 1, "figmaNodeId": "10:20"},
    {"file": "onboarding-profile.json", "order": 2, "figmaNodeId": "10:30"},
    {"file": "onboarding-complete.json", "order": 3, "figmaNodeId": "10:40"}
  ],
  "lastUpdated": "2026-02-11T10:30:00Z"
}
```

### T6. What to Tell the User

At each step, communicate clearly:

| Step | What to say |
|---|---|
| Spec saved | "Saved spec to `.cursor/specs/login-screen.json` — you can review or edit it" |
| Validation passed | "Spec validated successfully (X nodes, depth Y)" |
| Validation warnings | "Spec has N warnings: [list]. Proceeding to build." |
| Validation errors | "Spec has N errors that need fixing: [list]. Here's what I'll fix: ..." |
| Build started | "Building in Figma..." |
| Build complete | "Built successfully. Updated spec with Figma node ID." |
| Rebuild from edit | "Detected changes in `login-screen.json`. Validating... Building..." |

### T7. Cleanup Old Specs

When a design is finalized and no longer needs iteration:
- Keep the spec file — it serves as documentation
- The user can delete old spec files manually

When a spec is explicitly abandoned:
- Delete both the spec file and any Figma nodes built from it

### T8. Validation-Only Mode

When the user says "validate my specs", "check specs", or similar:
1. Run `node .cursor/specs/validate-spec.cjs .cursor/specs/`
2. Report the results
3. Do NOT build anything

---

### Quick Reference

```
.cursor/specs/
├── README.md              # How this directory works
├── validate-spec.cjs       # Validation script
├── _manifest.json         # Multi-screen project tracker (optional)
├── login-screen.json      # Individual spec files
├── signup-screen.json
└── dashboard.json
```
