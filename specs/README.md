# Figma Design Specs

This directory contains JSON spec files that define Figma component trees. Every design the AI builds is saved here **before** being sent to Figma.

## How it works

1. **AI saves spec** → `.cursor/specs/<name>.json`
2. **Spec is validated** → errors/warnings reported
3. **Spec is built in Figma** → `build_and_verify` or `build_from_spec`
4. **You can edit specs** → modify the JSON, then ask the AI to rebuild

## Editing specs

You can open any `.json` file here and modify it. Then tell the AI:
- "Rebuild login-screen" — validates and rebuilds from the updated spec
- "Validate my specs" — runs validation without building

## Validation

```bash
# Validate all specs
node .cursor/specs/validate-spec.cjs

# Validate a single spec
node .cursor/specs/validate-spec.cjs .cursor/specs/my-screen.json
```

## Spec format

See the `build_from_spec` tool documentation for the full schema. Quick reference:

```json
{
  "name": "Screen Name",
  "type": "frame",
  "width": 1440,
  "height": 900,
  "fill": {"r": 0.96, "g": 0.96, "b": 0.97},
  "autoLayout": {"mode": "VERTICAL", "itemSpacing": 24, "padding": 32},
  "children": [
    {"name": "Title", "type": "text", "characters": "Hello", "fontSize": 24}
  ]
}
```
