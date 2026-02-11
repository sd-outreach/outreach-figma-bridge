---
name: 'Quark 2 Components'
description: 'Quark 2.20 component key mapping — loaded when design-system-config.mdc is in `library` mode and points to this file'
---

# Quark 2.20 — Component Key Mapping

Component keys from the **Components (Quark 2.20)** published Figma library.
Use these with `type: "instance"` + `componentKey` in build specs.

> **IMPORTANT**: Each variant in a component set has its **own unique componentKey**. The component SET key cannot be used to instantiate — you must use the specific variant's key from the lookup tables below. Always use `State=Default` unless specifically prototyping interaction states.
>
> Use `instanceOverrides` to change **component properties** (text content, icon visibility) — do NOT override style properties (fill colors, font styles, effects). Style values come from the library.

---

## Button

**Component Set Key**: `ae9ddac2ce6c6c50f6052bc633926746d689dbdf` (for reference only — cannot be used with `componentKey`)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **Style** | `Primary`, `Secondary`, `Tertiary`, `Destructive` | `Primary` |
| **Size** | `Medium`, `Small`, `X-small`, `XX-small` | `Small` |
| **State** | `Default`, `Hover`, `Focus`, `Active`, `Disabled`, `Loading` | `Default` |
| **Content** | `Text & icon`, `Icon only` | `Text & icon` |

> **Restriction**: XX-small size only supports `Icon only` content (no `Text & icon` variant exists for XX-small).

### Component Properties (overrideable via `instanceOverrides`)

| Property | Type | Default | Override Example |
|----------|------|---------|-----------------|
| **Text** (`Text#29041:790`) | TEXT | `"Button"` | `{"childName": "Text", "characters": "Save"}` |
| **Icon left** (`Icon left#50200:0`) | BOOLEAN | `false` (hidden) | `{"childName": "Icon left", "visible": true}` |
| **Icon right** (`Icon right#50200:277`) | BOOLEAN | `false` (hidden) | `{"childName": "Icon right", "visible": true}` |
| **Icon** (`Icon#29041:0`) | INSTANCE_SWAP | component `50571:91368` | Not supported via MCP bridge `instanceOverrides` — default icon is used |

### Internal Child Structure

```
Button (root instance)
├── Icon left  (FRAME, visible: false by default)
│     └── Icon left  (INSTANCE — icon component)
├── Text padding  (FRAME)
│     └── Text  (TEXT — default: "Button")
└── Icon right  (FRAME, visible: false by default)
      └── Icon right  (INSTANCE — icon component)
```

### Variant Key Lookup (State=Default only)

Use the key matching your desired **Style × Size × Content** combination. All keys below are for `State=Default`.

**Primary**

| Size | Content | Component Key |
|------|---------|--------------|
| Small | Text & icon | `2a3b0b76f00f104431ef867aa93a60a957b85b5b` |
| Small | Icon only | `d93d8cd1f853c2b2a6d2d6064d966fe699c88ded` |
| Medium | Text & icon | `582b7f7d187db0122afeb4a78584d163fdff779b` |
| Medium | Icon only | `52f4cf992fc78c27edaa6b31c1de94c3234f02a5` |
| X-small | Text & icon | `c24e74ba85bdd6e3cbca5acc351652e9c9bb40c8` |
| X-small | Icon only | `7b172da2c6dedaef46a35262c3e3b4f25342052a` |
| XX-small | Icon only | `10cfd719c243c7aff0b3c5787e137f4751087dfe` |

**Secondary**

| Size | Content | Component Key |
|------|---------|--------------|
| Small | Text & icon | `95c32ca5562673f1654fba1b6b2ff35a416c862b` |
| Small | Icon only | `6b9b115c6ce3532f47caf48d6ef986e867b57cb6` |
| Medium | Text & icon | `71db321500569388f9c54d5769d6928419b172e1` |
| Medium | Icon only | `1ef6f42670bff49cb720a34b2e10699ad6ba4221` |
| X-small | Text & icon | `b77452ac5c52631641af3b02c1b13113e9254294` |
| X-small | Icon only | `89cdf095d8e0de0d3413d6496edb3bc253dc9c8e` |
| XX-small | Icon only | `459348a8c73f19ab7b4b4d1304c8ee2494e33ba0` |

**Tertiary**

| Size | Content | Component Key |
|------|---------|--------------|
| Small | Text & icon | `2bffe09153c44d843f354d8a396d71051e9ed8ff` |
| Small | Icon only | `6e66491a7d5d7f3f71332e848314ff5aa9ea759f` |
| Medium | Text & icon | `e646e0178188601bb3ebc55e1fd023b5bf66db99` |
| Medium | Icon only | `25d9a66d8cfce7a495cdf6cfcabfead8455686d3` |
| X-small | Text & icon | `1af5a6c864b8e3e2f5a5366684dea5ae5277d541` |
| X-small | Icon only | `be1b6be25fe1adee3e4569a667d4cbbbaeeb7332` |
| XX-small | Icon only | `19067f22b46306aecadd682030423b8c9fe61bca` |

**Destructive**

| Size | Content | Component Key |
|------|---------|--------------|
| Small | Text & icon | `79d63531a1849ad9c499cb1cf73da022cdef8eee` |
| Small | Icon only | `deca4d4a997bdc5fd146ff649fee7ebf3cecb08b` |
| Medium | Text & icon | `8104fb4a62d1feb6f79484b69dd779ba5c996e1e` |
| Medium | Icon only | `3a2bc2da34bef6ff7864be3e5ad1c3f8e6a3fcbf` |
| X-small | Text & icon | `6aa3df2455b15cace696f29f85b48c56323e9b69` |
| X-small | Icon only | `e2b7f01a7e1e4c77b166ec3dedd175457a5fe7cc` |
| XX-small | Icon only | `46bf08f8def61985fe0255495f6c0b3b1016b561` |

### Quick Reference — How to Match Context to Variant

| When the user says... | Use Style | Use Size | Use Content |
|-----------------------|-----------|----------|-------------|
| "primary button", "main action", "CTA", "submit" | Primary | Small (default) | Text & icon |
| "secondary button", "cancel", "back" | Secondary | Small | Text & icon |
| "tertiary button", "text button", "link-style" | Tertiary | Small | Text & icon |
| "delete button", "remove", "danger" | Destructive | Small | Text & icon |
| "large button", "big button" | (context) | Medium | Text & icon |
| "small button", "compact" | (context) | X-small | Text & icon |
| "icon button", "icon-only" | (context) | (context) | Icon only |
| "tiny icon button", "toolbar icon" | (context) | XX-small | Icon only |

### Spec Example

```json
{
  "name": "Save Button",
  "type": "instance",
  "componentKey": "2a3b0b76f00f104431ef867aa93a60a957b85b5b",
  "instanceOverrides": [
    {"childName": "Text", "characters": "Save changes"}
  ]
}
```

---

## Button Group

**Component Set Key**: `cd4f4c1e9b991ba2585e740d3edb257e1aa40481` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **Count** | `2`, `3`, `4` | `2` |
| **Variant** | `Primary`, `Secondary`, `Tertiary` | `Primary` |
| **Size** | `Small`, `Medium` | `Small` |
| **Icon only** | `True`, `False` | `False` |
| **Horizontal** | `True`, `False` | `True` |

> 72 total variants. No TEXT or BOOLEAN component properties — only VARIANT axes. All overrides are variant-selection based.

### Variant Key Lookup (Horizontal=True, Icon only=False — most common)

**Primary**

| Count | Size | Component Key |
|-------|------|--------------|
| 2 | Small | `01c5fd658ba6b49ab320ccd252613452578ceaf4` |
| 2 | Medium | `14c9cb065e837d0d3f4d73cec1972558ada6113f` |
| 3 | Small | `699d2a13207a82279eb37a2943cc8cbcc0737ca7` |
| 3 | Medium | `19a85b35912a2b24c7d015242e7e7d488a3323be` |
| 4 | Small | `407448adb3e96a7d4c2e8818998b9d55186b3d62` |
| 4 | Medium | `3cf1be2aa40188355d5d730ac6c646a0a85a0058` |

**Secondary**

| Count | Size | Component Key |
|-------|------|--------------|
| 2 | Small | `b28cfe9f08d908dc4fa4e19c6ae9bf83dce4760b` |
| 2 | Medium | `0c2ad3e561076b547687f11cbea8b2450d5e01b0` |
| 3 | Small | `108645ac18736e41b8d93369faf2678ad19e516b` |
| 3 | Medium | `1276aca548d5b9c8c1c4edfc2f8489002a60fac3` |
| 4 | Small | `3bfedb98df394216ba0d99f97fee7bf31b9878fa` |
| 4 | Medium | `a9f8faa2d814d6cfa319cb3fcf665020026ecb32` |

**Tertiary**

| Count | Size | Component Key |
|-------|------|--------------|
| 2 | Small | `c2aca3c4d44e19bc0a87c0fa96f8ed56eb473597` |
| 2 | Medium | `48a8a024a782024a9d967f7d8507d9eeeb750a28` |
| 3 | Small | `da445eab2fa4003908e36d9c276ae328eb5966fc` |
| 3 | Medium | `1abe693b3c24feb7c86ab8b050a31cec09bf1b6f` |
| 4 | Small | `9691091c294d8d4230d68783644354ba58e57b3b` |
| 4 | Medium | `eda0848720fe9ffc4bb739fe2ee1d52f2a4173f5` |

### Quick Reference

| When the user says... | Use Variant | Use Count | Use Size |
|-----------------------|-------------|-----------|----------|
| "button group", "grouped buttons" | Primary | 2 | Small |
| "3-button group", "triple action" | Primary | 3 | Small |
| "secondary button group" | Secondary | 2 | Small |
| "large button group" | (context) | (context) | Medium |

---

## Button Select

**Component Set Key**: `aa19fb4818521a368a93014d2f63c4781f716738` (reference only)

A lightweight control that gives users a menu to choose from. Used when you have multiple select fields in a row that require less visual weight.

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **State** | `default`, `hover`, `focus state`, `active`, `disabled` | `default` |

### Component Properties

| Property | Type | Default | Override Example |
|----------|------|---------|-----------------|
| **show adornment** (`how adornment#58:0`) | BOOLEAN | `false` | `{"childName": "how adornment", "visible": true}` |
| **adornment** (`adornment#126:0`) | INSTANCE_SWAP | component `264:10692` | Not supported via MCP bridge |

### Variant Key Lookup (State=default only)

| State | Component Key |
|-------|--------------|
| default | `50b10e8235935ec2be517ecd3fc1c8121f5d1dd9` |

> Only the `default` state key is needed for static mockups. Other states (hover, focus, active, disabled) are for prototyping.

### Spec Example

```json
{
  "name": "Status Select",
  "type": "instance",
  "componentKey": "50b10e8235935ec2be517ecd3fc1c8121f5d1dd9"
}
```

---

## Toggle Button

**Component Set Key**: `622876f57ab7b8e8e16babb9fb65145d42b1029c` (reference only)

Toggle buttons are used to switch between multiple views or contextual states.

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `off`, `hover`, `focus`, `on`, `disabled` | `off` |
| **color** | `primary`, `default`, `inverse` | `primary` |
| **size** | `standard`, `medium` | `standard` |
| **adornment** | `text only`, `icon`, `icon left` | `text only` |

> 90 total variants.

### Component Properties

| Property | Type | Default | Override Example |
|----------|------|---------|-----------------|
| **text** (`text#29041:1258`) | TEXT | `"Toggle button"` | `{"childName": "text", "characters": "Grid view"}` |
| **icon** (`icon#29041:1185`) | INSTANCE_SWAP | component `50571:91368` | Not supported via MCP bridge |

### Variant Key Lookup (state=off only)

**primary**

| Size | Adornment | Component Key |
|------|-----------|--------------|
| standard | text only | `bc80f393a7f0b6873e531627e439d852b045df00` |
| standard | icon | `7509bf811dab0ee81b11defaa9e6d8a1a3fc09cb` |
| standard | icon left | `e0290cbd8e04ead8f5bd1623667c2a4b892d9011` |
| medium | text only | `2d5e3a2ab5308f1b162ce4ec48791a7842125826` |
| medium | icon | `4c9958acea39c0555f92c4038985a8218eed2c2f` |
| medium | icon left | `3c8a2fa64ed125f72fe46eb41b0646de87249e1a` |

**default**

| Size | Adornment | Component Key |
|------|-----------|--------------|
| standard | text only | `de4ad943c0b4438e4c4784507fa02e8ab7941e14` |
| standard | icon | `580ad66cf5b307c5f3bf64b87376712baecfb960` |
| standard | icon left | `82d2baa2ceeef12cd6d5f62ac1e558e8d89401e5` |
| medium | text only | `c9b8c06da53c5a2501d24e3f5625815ad056e994` |
| medium | icon | `b2d08bb547e0f008e1e094b036c2b72315f7ca65` |
| medium | icon left | `7b21991abafb4812e40a7a01646d4c02d73cb58e` |

**inverse**

| Size | Adornment | Component Key |
|------|-----------|--------------|
| standard | text only | `c613243897777531b362f6f44d7553a7a99f555e` |
| standard | icon | `fdb3677662e997ce48d7237e4cb1cfd3a0cb8fbd` |
| standard | icon left | `132223cd094412f4433f02cbfbd962735f9686ca` |
| medium | text only | `1382e627e109b5ed2cc7de089b5036c6a6baaed4` |
| medium | icon | `620534e41a07ce1392738cd7bbe087e83f1e9297` |
| medium | icon left | `0b40d73e16303a35c8d959d54c84af26b54ad7bf` |

### Quick Reference

| When the user says... | Use color | Use size | Use adornment |
|-----------------------|-----------|----------|---------------|
| "toggle", "toggle button" | primary | standard | text only |
| "view toggle", "grid/list toggle" | default | standard | icon left |
| "icon toggle" | primary | standard | icon |
| "large toggle" | (context) | medium | (context) |
| "toggle on dark background" | inverse | standard | (context) |

### Spec Example

```json
{
  "name": "View Toggle",
  "type": "instance",
  "componentKey": "e0290cbd8e04ead8f5bd1623667c2a4b892d9011",
  "instanceOverrides": [
    {"childName": "text", "characters": "Grid view"}
  ]
}
```

---

## Toggle Button Group

**Component Set Key**: `c69670997a26020b3eb2f0285732ead9bccd9c68` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **color** | `primary`, `secondary` | `primary` |
| **direction** | `horizontal`, `vertical` | `horizontal` |
| **variant** | `outlined`, `ghost` | `ghost` |
| **size** | `small`, `medium (deprecated)` | `medium (deprecated)` |
| **icon** | `no`, `yes` | `no` |

> 32 total variants. The `medium (deprecated)` size is deprecated — prefer `small`. No TEXT or BOOLEAN component properties.

### Variant Key Lookup (size=small only — recommended)

**primary**

| Direction | Variant | Icon | Component Key |
|-----------|---------|------|--------------|
| horizontal | outlined | no | `5e6d1159d036b365fc887ec8a603308551fe2b1c` |
| horizontal | outlined | yes | `8b88ba5e834a67f244f6bbf8c26529f1d7d7dd63` |
| horizontal | ghost | no | `fe19e353d464f94ccc04c87a7c7f3abc5372c6d0` |
| horizontal | ghost | yes | `c266ad0301504fddb71fb6ec435514c5f4a4d9c7` |
| vertical | outlined | no | `0febad82d1fcf4b6aa58cceda8601699cfd4527d` |
| vertical | outlined | yes | `968e092b9e61bae89b2d5c75acb0a68fcc5bc94c` |
| vertical | ghost | no | `df593d92c35d194c470dce380b82269022bf99c9` |
| vertical | ghost | yes | `64a355dd39cc37757d2a4a9b7391910cdaa307d7` |

**secondary**

| Direction | Variant | Icon | Component Key |
|-----------|---------|------|--------------|
| horizontal | outlined | no | `6be00f9ea6d38862cd9b516c971e529b49036fca` |
| horizontal | outlined | yes | `c3d58cb7d55c3703cb830ca1c5003eee48b35d55` |
| horizontal | ghost | no | `1c31ce8b7c7fa22c61508a64397d2d69706e9781` |
| horizontal | ghost | yes | `fac27d99c1bf6bbc95ca9b692a1b8acf094d63dd` |
| vertical | outlined | no | `c9edb19919fc6d1a50e291b34dac5898d1af0489` |
| vertical | outlined | yes | `99e94c8d7dc82f4ca35d0878443f7ac9c44daffd` |
| vertical | ghost | no | `ad3a53a27c85dd9bddd36aa986b93a2a0efdf93a` |
| vertical | ghost | yes | `e415058291cee9f1b07feac16f14625b669c53e2` |

### Quick Reference

| When the user says... | Use color | Use direction | Use variant | Use icon |
|-----------------------|-----------|---------------|-------------|----------|
| "toggle group", "segmented control" | primary | horizontal | ghost | no |
| "outlined toggle group" | primary | horizontal | outlined | no |
| "vertical toggle group" | primary | vertical | ghost | no |
| "icon toggle group" | primary | horizontal | ghost | yes |

### Spec Example

```json
{
  "name": "View Switcher",
  "type": "instance",
  "componentKey": "fe19e353d464f94ccc04c87a7c7f3abc5372c6d0"
}
```

---

## Split Button

**Component Set Key**: `7b2e02157365c2aaf9d81be17bd8a4beb9b7745f` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **Style** | `Primary`, `Secondary`, `Tertiary` | `Primary` |
| **Size** | `Small`, `Medium`, `X-small` | `Small` |

> 9 total variants. No TEXT or BOOLEAN component properties — only VARIANT axes.

### Variant Key Lookup (all variants)

| Style | Size | Component Key |
|-------|------|--------------|
| Primary | Small | `3b272d4c0ff9218ed7b1e9c55fd400b0ec75e92e` |
| Primary | Medium | `17f8f01ba2cf898a00d23a656ce1a594d6cc3016` |
| Primary | X-small | `e4d557e8af07f2e87c265675ba81bcdf9736cf48` |
| Secondary | Small | `09430a58f1ec1a5c389b9b28618f9095129b60aa` |
| Secondary | Medium | `4897d24bd2797dcc39536edfb2eb405ddafb257d` |
| Secondary | X-small | `da612422553abed64a1ac46a0e16833974ef836a` |
| Tertiary | Small | `77f498a56c4201641dacf3ed0e6f38d6ef35b9b1` |
| Tertiary | Medium | `2c291b48912dabe2e6dc85eb09f508fa4f062879` |
| Tertiary | X-small | `82a5d8bff9b77f7f39aa11d4e330ba0140aaa979` |

### Quick Reference

| When the user says... | Use Style | Use Size |
|-----------------------|-----------|----------|
| "split button", "dropdown button" | Primary | Small |
| "secondary split button" | Secondary | Small |
| "large split button" | (context) | Medium |
| "small split button", "compact split" | (context) | X-small |

### Spec Example

```json
{
  "name": "Actions Split",
  "type": "instance",
  "componentKey": "3b272d4c0ff9218ed7b1e9c55fd400b0ec75e92e"
}
```

---

## Checkbox

**Component Set Key**: `a4c41b8ea616cb2f79c79c9b21f2a014066bc9d7` (reference only — do not use for instantiation)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **label** | `yes`, `no` | `yes` |
| **help text** | `no`, `yes` | `no` |
| **size** | `standard`, `medium` | `standard` |
| **checkbox state** | `default`, `inactive`, `hover`, `focused` | `default` |
| **checkbox selection** | `inactive`, `active`, `indeterminate` | `inactive` |
| **edge (negative margin)** | `start`, `false (deprecated)` | `start` |

> All properties are VARIANT type only. No TEXT or BOOLEAN component properties — overrides are variant-selection based. For static mockups, always use `checkbox state=default` and `edge=start`.

### Variant Key Lookup (checkbox state=default, edge=start)

**Standard size**

| Label | Help Text | Selection | Component Key |
|-------|-----------|-----------|--------------|
| yes | no | inactive | `d901d3289708d284a38f95da260ed1e5f8bb2dd1` |
| yes | no | active | `44326672792fb66ea44466f95605dbe13bc85d8f` |
| yes | no | indeterminate | `ced97a30ca2b4fb4ab87444cb09a6c13f7207170` |
| yes | yes | inactive | `30a979ea4a8b3e767396031fbb38152279c7450a` |
| yes | yes | active | `76a54e28b38712fc8c1293707e499b3ddb42dc8b` |
| yes | yes | indeterminate | `d60ac65e4d1703c47fe93fbd002e39e9ffcdf35e` |
| no | no | inactive | `ea1a799cb92c619d433a9cb52bfa3981e10742ef` |
| no | no | active | `55930d7d37cadb2633782652dc8fd500b382c14e` |
| no | no | indeterminate | `80b5b4086a31fa3fc923b2ee17f3e80d11c679e7` |

**Medium size**

| Label | Help Text | Selection | Component Key |
|-------|-----------|-----------|--------------|
| yes | no | inactive | `de5ee28c57a8fe091214305fa07630e4df602135` |
| yes | no | active | `3b9795f915046c0bc82e3ef9836d9bc75fab373f` |
| yes | no | indeterminate | `eb1e20a45f1f86490ebf52cf403a48252c03b2a1` |
| yes | yes | inactive | `f76c86949de60c67875149b938660acc0b172e90` |
| yes | yes | active | `112684bbc3705ce382f9b912942fd8e8899ba09b` |
| yes | yes | indeterminate | `4fc33276600179860d2963b6feb05c21f228f699` |
| no | no | inactive | `dc58bf2f5d109435135f80f49149454b3f00962b` |
| no | no | active | `844324031b8b29b8745c151b7badb18ec6ed5dab` |
| no | no | indeterminate | `2040bca997fbc536d2cb00959284b5afd18b7629` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "checkbox" / "unchecked checkbox" | Standard, label=yes, help text=no, selection=inactive → `d901d3289708d284a38f95da260ed1e5f8bb2dd1` |
| "checked checkbox" | Standard, label=yes, help text=no, selection=active → `44326672792fb66ea44466f95605dbe13bc85d8f` |
| "indeterminate checkbox" | Standard, label=yes, help text=no, selection=indeterminate → `ced97a30ca2b4fb4ab87444cb09a6c13f7207170` |
| "checkbox with help text" | Standard, label=yes, help text=yes, selection=inactive → `30a979ea4a8b3e767396031fbb38152279c7450a` |
| "checkbox no label" / "standalone checkbox" | Standard, label=no, selection=inactive → `ea1a799cb92c619d433a9cb52bfa3981e10742ef` |
| "large checkbox" / "medium checkbox" | Medium, label=yes, help text=no, selection=inactive → `de5ee28c57a8fe091214305fa07630e4df602135` |

### Spec Example

```json
{
  "name": "Accept Terms Checkbox",
  "type": "instance",
  "componentKey": "d901d3289708d284a38f95da260ed1e5f8bb2dd1"
}
```

---

## Radio

**Component Set Key**: `8ec7ffb1e067a7a53e87ac5398ec43382701335a` (reference only — do not use for instantiation)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **label** | `yes`, `no` | `yes` |
| **help text** | `no`, `yes` | `no` |
| **size** | `Standard`, `medium` | `Standard` |
| **radio state** | `default`, `inactive`, `hover`, `focused` | `default` |
| **radio selection** | `inactive`, `active` | `inactive` |
| **edge** | `start`, `false (depricated)` | `start` |

> All properties are VARIANT type only. No TEXT or BOOLEAN component properties. For static mockups, always use `radio state=default` and `edge=start`.

### Variant Key Lookup (radio state=default, edge=start)

**Standard size**

| Label | Help Text | Selection | Component Key |
|-------|-----------|-----------|--------------|
| yes | no | inactive | `5d68dcfb72e14daf49c3cbed1cbdc3ca9061a6b4` |
| yes | no | active | `a3307696d9df5cb38b8a736278782c70e276b3a8` |
| yes | yes | inactive | `4c587c90fb7890cca5ecf235f7c6b5fbdd7f6f07` |
| yes | yes | active | `4305819cb1e5ea4aab00e36f8f78faa0ed2dc142` |
| no | no | inactive | `16691d69575ac1c0809497a2af22aa02b0eef426` |
| no | no | active | `e40aa8cc8bb1958b51d4270efd1dfe84cd891b17` |

**Medium size**

| Label | Help Text | Selection | Component Key |
|-------|-----------|-----------|--------------|
| yes | no | inactive | `a96a786d213418c69927ef1878923f87eb85f868` |
| yes | no | active | `570b36c7ec8c4398fc7444d92241603b70d7618d` |
| yes | yes | inactive | `0457bfc39accc151b36fb0125fcd1a9c99491f79` |
| yes | yes | active | `1ae124871fbffb3135b1c4857db51a551062da1c` |
| no | no | inactive | `349d4f6bcbb00e9658da0983cacaa6f7bd1f4fb2` |
| no | no | active | `280a0869911a4b97fbd76ae53e5d39e69f6eb8a7` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "radio" / "radio button" / "unselected radio" | Standard, label=yes, help text=no, selection=inactive → `5d68dcfb72e14daf49c3cbed1cbdc3ca9061a6b4` |
| "selected radio" / "active radio" | Standard, label=yes, help text=no, selection=active → `a3307696d9df5cb38b8a736278782c70e276b3a8` |
| "radio with help text" | Standard, label=yes, help text=yes, selection=inactive → `4c587c90fb7890cca5ecf235f7c6b5fbdd7f6f07` |
| "radio no label" / "standalone radio" | Standard, label=no, selection=inactive → `16691d69575ac1c0809497a2af22aa02b0eef426` |
| "large radio" / "medium radio" | Medium, label=yes, help text=no, selection=inactive → `a96a786d213418c69927ef1878923f87eb85f868` |

### Spec Example

```json
{
  "name": "Gender Selection Radio",
  "type": "instance",
  "componentKey": "5d68dcfb72e14daf49c3cbed1cbdc3ca9061a6b4"
}
```

---

## Switch

**Component Set Key**: `70b001fe5706d3d9aa8073ae6db48eda5d16ddac` (reference only — do not use for instantiation)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `default`, `hover`, `disabled` | `default` |
| **size** | `medium`, `small` | `small` |
| **active** | `on`, `off` | `on` |
| **Knob-Icon** | `True`, `False` | `True` |

> 24 total variants.

### Component Properties

| Property | Type | Default | `instanceOverrides` |
|----------|------|---------|-------------------|
| **label** (id: `label#38579:0`) | TEXT | `"Label"` | `{"childName": "label", "characters": "Dark Mode"}` |
| **show label** (id: `show label#38579:25`) | BOOLEAN | `true` | `{"childName": "show label", "visible": false}` |

### Variant Key Lookup (state=default)

| Size | Active | Knob-Icon | Component Key |
|------|--------|-----------|--------------|
| medium | on | True | `b8ce7261fb8208fefd0bcd2cd95b4e2307d77347` |
| medium | on | False | `08599804c1cbedf4a29167cc2911986376b651a9` |
| medium | off | True | `112f48ddbbf26b5b612ede4b1db84f99987772f5` |
| medium | off | False | `719326968517c03f2158f03bc612faee39a86270` |
| small | on | True | `a937ec4fded3ea96a8f1f156a88a2567727dd4c2` |
| small | on | False | `e9d24f197ad98c57c1b0722774cb03fb3f642e34` |
| small | off | True | `a9f2a18233641e4e1d551ea080400c30601445a3` |
| small | off | False | `d6a0aaa3afc62ed863ab4a21d38dd50ef491525b` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "switch" / "toggle" / "switch on" | Medium, on, Knob-Icon=True → `b8ce7261fb8208fefd0bcd2cd95b4e2307d77347` |
| "switch off" / "toggle off" | Medium, off, Knob-Icon=True → `112f48ddbbf26b5b612ede4b1db84f99987772f5` |
| "small switch" / "compact toggle" | Small, on, Knob-Icon=True → `a937ec4fded3ea96a8f1f156a88a2567727dd4c2` |
| "switch without icon" / "plain toggle" | Medium, on, Knob-Icon=False → `08599804c1cbedf4a29167cc2911986376b651a9` |

### Spec Example

```json
{
  "name": "Dark Mode Toggle",
  "type": "instance",
  "componentKey": "b8ce7261fb8208fefd0bcd2cd95b4e2307d77347",
  "instanceOverrides": [
    {"childName": "label", "characters": "Dark Mode"}
  ]
}
```

---

## Slider

**Component Set Key**: `5128ffad706863c56f3acdbfd4700042cf1aab89` (reference only — do not use for instantiation)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **style** | `primary`, `secondary` | `primary` |
| **direction** | `horizontal`, `vertical` | `horizontal` |
| **data type** | `discrete`, `continous` | `discrete` |
| **number of values** | `one value`, `two values` | `two values` |

> 16 total variants. All properties are VARIANT type only. No TEXT or BOOLEAN component properties.

### Variant Key Lookup (all variants)

**Horizontal**

| Style | Data Type | Values | Component Key |
|-------|-----------|--------|--------------|
| primary | discrete | one value | `499cd5c35054736fdffed48d633fb5d4310835f4` |
| primary | discrete | two values | `02199bc1e645683d53e6a38ed8ed6f0fc18d0ca6` |
| primary | continous | one value | `08b8c94de90833155032cc1d2eb4a2745dbd489b` |
| primary | continous | two values | `d94140cc539268c4e0fb1acb72c28a73b4f35057` |
| secondary | discrete | one value | `7441bec772f202a85bd61a27e388b5fd5d9afb47` |
| secondary | discrete | two values | `4097b67c9ec229cdd9fe444ebe9c93831d65c706` |
| secondary | continous | one value | `41a0fcf591449fb768d38dbd9656db8609133dc6` |
| secondary | continous | two values | `59bddefcafe85e4adbf42eaa3ea08e58a23a926f` |

**Vertical**

| Style | Data Type | Values | Component Key |
|-------|-----------|--------|--------------|
| primary | discrete | one value | `7c730b1a0feceb0722a514790e41764aedd13082` |
| primary | discrete | two values | `7dba0b0b961e3f7d96e29e9abbbb4a8e7d229e36` |
| primary | continous | one value | `ecf706b874d43623335fdd77974a9ebeeea6893a` |
| primary | continous | two values | `9b4785210ba01cd027439de5ccdcc3ae1aa3d422` |
| secondary | discrete | one value | `43295a4e425c83c3e8dbedb692369021215fd0cd` |
| secondary | discrete | two values | `133d75c5caef6115c723788a1ac6d1ada457c9ec` |
| secondary | continous | one value | `3e07ac48e34f6a5eb2c6384ed24836aea66f7f5e` |
| secondary | continous | two values | `6986dded991d66697f6605e5409277f2f7f42d11` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "slider" / "range slider" | Primary, horizontal, discrete, one value → `499cd5c35054736fdffed48d633fb5d4310835f4` |
| "range slider" / "dual slider" / "two-thumb slider" | Primary, horizontal, discrete, two values → `02199bc1e645683d53e6a38ed8ed6f0fc18d0ca6` |
| "continuous slider" / "smooth slider" | Primary, horizontal, continous, one value → `08b8c94de90833155032cc1d2eb4a2745dbd489b` |
| "vertical slider" | Primary, vertical, discrete, one value → `7c730b1a0feceb0722a514790e41764aedd13082` |
| "secondary slider" | Secondary, horizontal, discrete, one value → `7441bec772f202a85bd61a27e388b5fd5d9afb47` |

### Spec Example

```json
{
  "name": "Volume Slider",
  "type": "instance",
  "componentKey": "499cd5c35054736fdffed48d633fb5d4310835f4"
}
```

---

## Text Fields

**Component Set Key**: `1ab8a4f60a82b8fcb744a8677b2ce6fee9e27498` (reference only — do not use for instantiation)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `empty`, `hover`, `active`, `has value`, `disabled`, `empty error`, `has value error`, `has value disable` | `empty` |
| **style** | `outlined`, `line (deprecated)` | `outlined` |
| **size** | `medium`, `small` | `small` |
| **variation** | `text only`, `icon left` | `text only` |
| **helper text** | `no`, `yes` | `no` |
| **label** | `yes`, `no` | `yes` |

> All properties are VARIANT type only. For static mockups, always use `state=empty`, `style=outlined`. Use `variation=text only` unless an icon is needed.

### Variant Key Lookup (state=empty, style=outlined)

**Medium size**

| Variation | Helper Text | Label | Component Key |
|-----------|-------------|-------|--------------|
| icon left | no | yes | `cc4ce8d289b6b5c9bd5a954b3330d5adcea1bb7c` |
| text only | no | yes | `9609c0c0a1503368b1ff9e0d3c232e9c8251f5af` |
| text only | no | no | `5b3967934f2fc5af59f1794c0f5f19c7ee5957d4` |
| text only | yes | yes | `41e4ec8db9623ad5c9efb2f565ad08815b8f5fa6` |
| text only | yes | no | `bf9cdd2261577c64fbd11b92f056a2b211941bba` |

**Small size**

| Variation | Helper Text | Label | Component Key |
|-----------|-------------|-------|--------------|
| icon left | no | yes | `a6bb898acd1ff45a501cc9b68dbb79cc64789399` |
| text only | no | yes | `56b9138acb43d846b4f8c20994871107b7b3647c` |
| text only | no | no | `05559a8adb0683693bfb8e1dffb090483a852ba8` |
| text only | yes | yes | `39a2f7390bf07a7b4227e1f2c1620364e0231cd8` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "text field" / "input" / "text input" | Medium, text only, no helper, with label → `9609c0c0a1503368b1ff9e0d3c232e9c8251f5af` |
| "small text field" | Small, text only, no helper, with label → `56b9138acb43d846b4f8c20994871107b7b3647c` |
| "text field with icon" | Medium, icon left, no helper, with label → `cc4ce8d289b6b5c9bd5a954b3330d5adcea1bb7c` |
| "text field with helper" | Medium, text only, with helper, with label → `41e4ec8db9623ad5c9efb2f565ad08815b8f5fa6` |

### Spec Example

```json
{
  "name": "Email Input",
  "type": "instance",
  "componentKey": "9609c0c0a1503368b1ff9e0d3c232e9c8251f5af"
}
```

---

## Date Input

**Component Set Key**: `1b6fdc462d84a3ad8648de811610aa47e967479c` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **size** | `medium`, `small` | `small` |
| **style** | `outline`, `line (deprecated)` | `outline` |
| **state** | `empty`, `hover`, `active`, `has value`, `disable`, `error`, `has value disable` | `empty` |

> All VARIANT type only. For static mockups, use `style=outline`.

### Variant Key Lookup (style=outline)

| Size | State | Component Key |
|------|-------|--------------|
| medium | empty | `2d36fcbe463931c31b19207e0e8bc707f1aa1849` |
| medium | has value | `eda80cabb35f56a3246d80b8e3dde56930cf38e0` |
| small | empty | `2eec482df1fb08a564494108ae878e957b959eb3` |
| small | has value | `99cc875507b534fbcc467a9e351ca22aa719fec3` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "date picker" / "date input" / "date field" | Medium, outline, empty → `2d36fcbe463931c31b19207e0e8bc707f1aa1849` |
| "small date picker" | Small, outline, empty → `2eec482df1fb08a564494108ae878e957b959eb3` |

### Spec Example

```json
{
  "name": "Start Date",
  "type": "instance",
  "componentKey": "2d36fcbe463931c31b19207e0e8bc707f1aa1849"
}
```

---

## Time Input

**Component Set Key**: `9dae2a134fd8b331c1a10d8d00738d43866c5105` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `empty`, `hover`, `active`, `has value`, `disable`, `error`, `has value disable` | `empty` |
| **size** | `medium`, `small` | `small` |
| **style** | `outline`, `line (deprecated)` | `outline` |

> All VARIANT type only. For static mockups, use `style=outline`.

### Variant Key Lookup (style=outline)

| Size | State | Component Key |
|------|-------|--------------|
| medium | empty | `7fadbf923c444896ab05db75fd224d40784240aa` |
| medium | has value | `74511a397044d08f4665b21002008e16c598dace` |
| small | empty | `b62295799c7aa3795919cad4d8fe1d400d70c77f` |
| small | has value | `63e849226bc1d07c7ec764f594a43c9fffa68362` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "time input" / "time picker" / "time field" | Medium, outline, empty → `7fadbf923c444896ab05db75fd224d40784240aa` |
| "small time input" | Small, outline, empty → `b62295799c7aa3795919cad4d8fe1d400d70c77f` |

### Spec Example

```json
{
  "name": "Meeting Time",
  "type": "instance",
  "componentKey": "7fadbf923c444896ab05db75fd224d40784240aa"
}
```

---

## Date Time Input

**Component Set Key**: `2d0401244482d6d6d85f3502ca6ae0da0033e532` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `default`, `error` | `default` |
| **type** | `date time input` | `date time input` |

> Simple 2-variant component. Combines a date input + time input side by side.

### Variant Key Lookup

| State | Component Key |
|-------|--------------|
| default | `d5e4f428dc9e09953dc8e1d17bf2d5657f350708` |
| error | `abddb31aac9755dec3381ed3745f3ffcf8d79aba` |

### Spec Example

```json
{
  "name": "Event Date Time",
  "type": "instance",
  "componentKey": "d5e4f428dc9e09953dc8e1d17bf2d5657f350708"
}
```

---

## Currency Input

**Component Set Key**: `b71418b56fa89e2a1700eb2a83c9b861b9973824` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **size** | `medium`, `small` | `small` |
| **style** | `outline`, `line (deprecated)` | `outline` |
| **state** | `empty`, `hover`, `active`, `has value`, `disable`, `error`, `has value disable` | `empty` |

> All VARIANT type only. For static mockups, use `style=outline`.

### Variant Key Lookup (style=outline)

| Size | State | Component Key |
|------|-------|--------------|
| medium | empty | `183dfaab49c1317f8d09af7c6fe243569c84e7fb` |
| medium | has value | `7c2f25a3f922c1514ef609e1753cab37903b72c8` |
| small | empty | `90230f75a81ba306fb55f6881833d68675de164f` |
| small | has value | `7ef35b42782de32b9d0a7835024b5db1a61382a4` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "currency" / "money input" / "amount field" | Medium, outline, empty → `183dfaab49c1317f8d09af7c6fe243569c84e7fb` |
| "small currency" | Small, outline, empty → `90230f75a81ba306fb55f6881833d68675de164f` |

### Spec Example

```json
{
  "name": "Invoice Amount",
  "type": "instance",
  "componentKey": "183dfaab49c1317f8d09af7c6fe243569c84e7fb"
}
```

---

## Number Input

**Component Set Key**: `394f55e3fb1e9fb8e83da0a5f342762138fc69d7` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **size** | `medium`, `small` | `small` |
| **style** | `outline`, `line (deprecated)` | `outline` |
| **state** | `empty`, `hover`, `active`, `has value`, `disable`, `error`, `has value disable` | `empty` |

> All VARIANT type only. For static mockups, use `style=outline`.

### Variant Key Lookup (style=outline)

| Size | State | Component Key |
|------|-------|--------------|
| medium | empty | `bf0d20323d43f892db6232e7b5a5023b600bbc74` |
| medium | has value | `c22d8bf22a2e16faae5a93c583c168062fb3fe9e` |
| small | empty | `9657fc645e8a1e52a8f062cfd81c145eff1b5b0d` |
| small | has value | `6aa433d4d9cb66359aca535f37d733912394c2bf` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "number input" / "numeric field" / "quantity" | Medium, outline, empty → `bf0d20323d43f892db6232e7b5a5023b600bbc74` |
| "small number input" | Small, outline, empty → `9657fc645e8a1e52a8f062cfd81c145eff1b5b0d` |

### Spec Example

```json
{
  "name": "Quantity Field",
  "type": "instance",
  "componentKey": "bf0d20323d43f892db6232e7b5a5023b600bbc74"
}
```

---

## Password Input

**Component Set Key**: `998abb53bec9965de81c016ba22ee8c8310e47f1` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **size** | `medium`, `small` | `small` |
| **style** | `outline`, `underline (deprecated)` | `outline` |
| **state** | `empty`, `hover`, `active`, `has value`, `disable`, `error`, `has value disable` | `empty` |

> All VARIANT type only. For static mockups, use `style=outline`.

### Variant Key Lookup (style=outline)

| Size | State | Component Key |
|------|-------|--------------|
| medium | empty | `1650f33a07899ce2da285c9cfb735da4028f76f0` |
| medium | has value | `45c13d453136737f7084cb220f28dba9c506f6bc` |
| small | empty | `0fcc00835d597ee9a7ad90d575e0e5629af4ee58` |
| small | has value | `81f3d611fd57b8143663839dfbd8be4143de9fcb` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "password" / "password field" / "password input" | Medium, outline, empty → `1650f33a07899ce2da285c9cfb735da4028f76f0` |
| "small password" | Small, outline, empty → `0fcc00835d597ee9a7ad90d575e0e5629af4ee58` |

### Spec Example

```json
{
  "name": "Password Field",
  "type": "instance",
  "componentKey": "1650f33a07899ce2da285c9cfb735da4028f76f0"
}
```

---

## Color Picker (Color Input)

**Component Set Key**: `ec727f01845cd42d2c99b6146b23a06ac9e4e1e3` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **size** | `medium`, `small` | `small` |
| **style** | `outline`, `line (deprecated)` | `outline` |
| **state** | `empty`, `hover`, `active`, `has value`, `disable`, `error`, `has value disable` | `empty` |

> All VARIANT type only. For static mockups, use `style=outline`.

### Variant Key Lookup (style=outline)

| Size | State | Component Key |
|------|-------|--------------|
| medium | empty | `6e1cb258a4b5885fb8da26a0b08549348162a8d2` |
| medium | has value | `577a4196d4a091490c0d81f26c85ed663e380fd3` |
| small | empty | `3baac990776735c0554dc6d1eb534972cfca4a2a` |
| small | has value | `5641cd2eab49f6cf77c9c4bb0252dcb188cafefb` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "color picker" / "color input" / "color field" | Medium, outline, empty → `6e1cb258a4b5885fb8da26a0b08549348162a8d2` |
| "small color picker" | Small, outline, empty → `3baac990776735c0554dc6d1eb534972cfca4a2a` |

### Spec Example

```json
{
  "name": "Brand Color Picker",
  "type": "instance",
  "componentKey": "6e1cb258a4b5885fb8da26a0b08549348162a8d2"
}
```

---

## Range Input

**Component Set Key**: `25093e8d8f566461d33fc68b626025b00dccbe39` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **type** | `date`, `day and time`, `time` | `date` |
| **state** | `default`, `error` | `default` |

> Combines two date/time inputs side-by-side for range selection. Not a slider — see Slider for that.

### Variant Key Lookup

| Type | State | Component Key |
|------|-------|--------------|
| date | default | `85b6f368d579dafad7e42d0a67d98ffa796ddd76` |
| day and time | default | `04b05835cc189c06423fc31695fc0f114b17990c` |
| time | default | `59e105080f8b95d497f595438914c2eee450974a` |
| date | error | `8bab603c3f984be8de372d2af0070da15d547c5b` |
| time | error | `94a955adf7ff0eaeb7730fad0ff85b027c878b4a` |
| day and time | error | `6c145b86ae696b64f4256dfb275fb0d4b385133c` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "date range" / "date range picker" | Date, default → `85b6f368d579dafad7e42d0a67d98ffa796ddd76` |
| "time range" | Time, default → `59e105080f8b95d497f595438914c2eee450974a` |
| "date time range" | Day and time, default → `04b05835cc189c06423fc31695fc0f114b17990c` |

### Spec Example

```json
{
  "name": "Booking Date Range",
  "type": "instance",
  "componentKey": "85b6f368d579dafad7e42d0a67d98ffa796ddd76"
}
```

---

## Phone Number (Select / Phone Number)

**Component Set Key**: `9ea0add1ecca6e08ead6a0df79befb35f7f6a60a` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **selected** | `yes`, `no` | `yes` |
| **state** | `default`, `hover`, `active` | `default` |
| **size** | `medium`, `small` | `medium` |

### Component Properties (non-VARIANT)

| Property | Type | Default |
|----------|------|---------|
| `phone number#44823:0` | TEXT | `(000) 000-0000` |

> Override phone number text: `instanceOverrides: [{ childName: "phone number", characters: "(555) 123-4567" }]`

### Variant Key Lookup (state=default)

| Selected | Size | Component Key |
|----------|------|--------------|
| yes | medium | `5f1d52670598f72e96d6c15a5dd2429e587fefd5` |
| yes | small | `27cae631ed524288064f66c09cb941cf66b1b0ed` |
| no | medium | `eb19723d2562f13e1e00cdce92899f515df69b2f` |
| no | small | `bbf4f41ae417f5b4c2d0f18f4aecb5187866c7bc` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "phone number" / "phone input" / "phone field" | Selected=yes, medium → `5f1d52670598f72e96d6c15a5dd2429e587fefd5` |
| "small phone number" | Selected=yes, small → `27cae631ed524288064f66c09cb941cf66b1b0ed` |

### Spec Example

```json
{
  "name": "Phone Number Field",
  "type": "instance",
  "componentKey": "5f1d52670598f72e96d6c15a5dd2429e587fefd5",
  "instanceOverrides": [
    { "childName": "phone number", "characters": "(555) 123-4567" }
  ]
}
```

---

## Multiline Text Fields

**Component Set Key**: `fa38f64ef9a6749ea0af2ad59376ff0d11a334a9` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `empty`, `hover`, `active`, `has value`, `disabled`, `empty error`, `has value error` | `empty` |
| **style** | `required`, `Required`, `line (deprecated)` | `required` |

> `required` and `Required` are outline-style variants (naming inconsistency in the library). Use lowercase `required` as default. `line (deprecated)` is legacy.

### Variant Key Lookup (style=required)

| State | Component Key |
|-------|--------------|
| empty | `6b45995df0df1e45ceaa5555d5b63ee0fbe1de23` |
| has value | `d448e53b2176b4b9aed08931b682aabb0d9647fd` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "textarea" / "multiline" / "multiline text" / "text area" | Empty → `6b45995df0df1e45ceaa5555d5b63ee0fbe1de23` |

### Spec Example

```json
{
  "name": "Notes Field",
  "type": "instance",
  "componentKey": "6b45995df0df1e45ceaa5555d5b63ee0fbe1de23"
}
```

---

## Select

**Component Set Key**: `b1800e160cef6e411fc6c1e3cf47e028bc19d8b5` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `empty`, `hover`, `active`, `has value`, `disabled`, `empty error`, `has value error`, `has value disabled` | `empty` |
| **size** | `medium`, `small` | `small` |
| **style** | `outlined`, `line (deprecated)` | `outlined` |
| **label** | `yes`, `no` | `yes` |
| **required** | `no`, `yes` | `no` |

> All VARIANT type only. For static mockups, use `style=outlined`, `required=no`.

### Variant Key Lookup (style=outlined, required=no)

**Medium size**

| State | Label | Component Key |
|-------|-------|--------------|
| empty | yes | `3a37212ceafbc372a24b44e6a9c601d7b0038725` |
| empty | no | `850a298e53d788b903a8c5ab43a401bb8f3326ac` |
| has value | yes | `952b4b43c9c50d5b65d8248ab87f75441ebccb79` |
| has value | no | `fd5f3589103204e54d262021988ffa74f0d2a780` |

**Small size**

| State | Label | Component Key |
|-------|-------|--------------|
| empty | yes | `46a417c69f0f8622a59e1e70d25f832e557a7b51` |
| empty | no | `473ae78649be21fead3c255679b7ace62dcfa9e8` |
| has value | yes | `1215afcd3e81bd84b2adb695f2727c9c2eb73101` |
| has value | no | `e8a48bae44a65209ba97359fb799c7cf145948fd` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "select" / "dropdown" / "select field" | Medium, outlined, empty, label=yes → `3a37212ceafbc372a24b44e6a9c601d7b0038725` |
| "small select" | Small, outlined, empty, label=yes → `46a417c69f0f8622a59e1e70d25f832e557a7b51` |
| "select no label" | Medium, outlined, empty, label=no → `850a298e53d788b903a8c5ab43a401bb8f3326ac` |

### Spec Example

```json
{
  "name": "Country Select",
  "type": "instance",
  "componentKey": "3a37212ceafbc372a24b44e6a9c601d7b0038725"
}
```

---

## Autocomplete

**Component Set Key**: `2485e57afb67c00890d60582ce6ba20d2ff1e4c6` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **state** | `default`, `hover`, `active`, `error`, `error active`, `disabled` | `default` |
| **has value** | `false`, `true` | `false` |
| **multiple values** | `false`, `true` | `false` |
| **free solo** | `false`, `true` | `false` |
| **size** | `small`, `medium` | `small` |

### Component Properties (non-VARIANT)

| Property | Type | Default |
|----------|------|---------|
| `show start adornment#36838:0` | BOOLEAN | `false` |
| `input value#36898:16` | TEXT | `Input value` |
| `placeholder text#36898:48` | TEXT | `Placeholder text` |
| `start adornment#36898:95` | INSTANCE_SWAP | (icon) |
| `show menu#36943:0` | BOOLEAN | `false` |
| `input label#37114:0` | TEXT | `Label` |

> Override text: `instanceOverrides: [{ childName: "input label", characters: "Search..." }, { childName: "placeholder text", characters: "Type to search" }]`

### Variant Key Lookup (state=default)

**Single value, no free solo**

| Has Value | Size | Component Key |
|-----------|------|--------------|
| false | small | `514b08240e38811104e20e3bc91d43bb235ef7bd` |
| false | medium | `6a525d86a5460479099dde0c2a7b4767ec117d3e` |
| true | small | `1e4cc05a52c86c5c094ef17d5dd26933f52b8422` |
| true | medium | `91f70d74c288df0ed2e59e2255980f36ed372fa9` |

**Single value, free solo**

| Has Value | Size | Component Key |
|-----------|------|--------------|
| false | small | `f24b75a847d6be29245c47e351f34d0671057ced` |
| false | medium | `4b4d91d9ad2aab289a275a3b9f7ff4d611244170` |
| true | small | `41adccef24f34c9d9de8520bb1a4b33286d92d2d` |
| true | medium | `f590055184cb3579b50ca1e24a7736c6d0fc1e63` |

**Multiple values, no free solo**

| Size | Component Key |
|------|--------------|
| small | `cde36f218f6471b1a2de6fdb29734e0bc8d12e9d` |
| medium | `0ca4e730338e375cdf032bf028b265c2521f1abb` |

**Multiple values, free solo**

| Size | Component Key |
|------|--------------|
| small | `dca40b8d02b3ae998a00fe06c74a28e8f0cce3be` |
| medium | `fef1036c59ba8177ad22b40480ad1a5c0034b60b` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "autocomplete" / "combobox" / "search select" | Small, default, no value, single, no free solo → `514b08240e38811104e20e3bc91d43bb235ef7bd` |
| "medium autocomplete" | Medium, default, no value → `6a525d86a5460479099dde0c2a7b4767ec117d3e` |
| "multi autocomplete" / "tag input" | Small, default, multiple values → `cde36f218f6471b1a2de6fdb29734e0bc8d12e9d` |
| "free solo autocomplete" | Small, default, free solo → `f24b75a847d6be29245c47e351f34d0671057ced` |

### Spec Example

```json
{
  "name": "Tag Autocomplete",
  "type": "instance",
  "componentKey": "514b08240e38811104e20e3bc91d43bb235ef7bd",
  "instanceOverrides": [
    { "childName": "input label", "characters": "Tags" },
    { "childName": "placeholder text", "characters": "Search tags..." }
  ]
}
```

---

## Upload

**Component Set Key**: `cc7595fa6460213f4cd536cbda7d6826ba2acaa0` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **type** | `logo upload`, `drag and drop` | `logo upload` |
| **state** | `default`, `error`, `loading`, `has value`, `active` | `default` |

> All VARIANT type only.

### Variant Key Lookup

| Type | State | Component Key |
|------|-------|--------------|
| logo upload | default | `626c7d66123e1489ea494bd509bc413602bbd6e0` |
| logo upload | has value | `25fdd0e7de7657e36817bff79f6181967f9ab751` |
| drag and drop | default | `bfc8726370204ecdf3de4cbbd640ea94623fbbd7` |
| drag and drop | has value | `fe1912a3d8fe20d743f76f90390dcb19f605ce19` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "upload" / "file upload" / "drag and drop" | Drag and drop, default → `bfc8726370204ecdf3de4cbbd640ea94623fbbd7` |
| "logo upload" / "image upload" | Logo upload, default → `626c7d66123e1489ea494bd509bc413602bbd6e0` |

### Spec Example

```json
{
  "name": "File Upload Zone",
  "type": "instance",
  "componentKey": "bfc8726370204ecdf3de4cbbd640ea94623fbbd7"
}
```

---

## Selectable List Cards (List Item)

**Component Set Key**: `e475e984fe23d09b8f4f207b1b3019a4da49781b` (reference only)

### Variant Axes

| Axis | Options | Default |
|------|---------|---------|
| **Card type** | `Outlined`, `Elevated` | `Outlined` |
| **Style** | `one line`, `two line`, `three line` | `one line` |
| **State** | `default`, `selected`, `hover`, `focus` | `default` |
| **Select** | `single`, `multi`, `on/off` | `single` |

> All VARIANT type only. For static mockups, use `State=default`.

### Variant Key Lookup (State=default, Outlined)

| Style | Select | Component Key |
|-------|--------|--------------|
| one line | single | `b9a2bce424a4cd28e4fe827834e2870acf6935a3` |
| two line | single | `2845ecd95a19434a2cdc4f013253813dd5f8c6e6` |
| three line | single | `c2996b37cc9f2f28e80b98892371ef9779b6c1e3` |
| one line | multi | (not available — use two line or elevated) |
| two line | multi | `7678f70350135e00c3d42598739b9ed69d997ffd` |
| three line | multi | `39c5af71d55d947f358fd22d7b1f689947a72bd8` |
| one line | on/off | `f62f51dd5683156bcfe2a4f550890bd0bec8a271` |
| two line | on/off | `fcb6d6050f6fc885de82d5ebd9048380a67f9b52` |
| three line | on/off | `e950b184319c5c95dcbd3bce2df829b0b69fd13c` |

### Variant Key Lookup (State=default, Elevated)

| Style | Select | Component Key |
|-------|--------|--------------|
| one line | single | `5662d2b3e29c7f05d92009aa3f2b8c909e34ae16` |
| two line | single | `92f0d2a4955fa7afac142683bf093a7251dcbe6a` |
| three line | single | `fd056f9efce0ccdef6f19990d395d47d2414e699` |
| one line | multi | `8087fdcf0e4b8cafa78f6a104d3bc4da43ca44cc` |
| two line | multi | `f7b9fcf7d1bc95186c519e6d66b86cfa2d483d73` |
| three line | multi | `b38935e2f1768c11a470379a9797bdbd9103738c` |
| one line | on/off | `da9906d0f3668200860305f6bb578ff5e0a33812` |
| two line | on/off | `8574482e53fae2afdf11a332d42f2d6fda3e31ec` |
| three line | on/off | `3294815b28381422ce015b5c3cfc164df010f0bc` |

### Quick Reference

| User says... | Use variant |
|---|---|
| "list card" / "selectable card" / "list item" | Outlined, one line, single → `b9a2bce424a4cd28e4fe827834e2870acf6935a3` |
| "multi select list" / "checklist card" | Outlined, two line, multi → `7678f70350135e00c3d42598739b9ed69d997ffd` |
| "toggle list" / "on/off list" | Outlined, one line, on/off → `f62f51dd5683156bcfe2a4f550890bd0bec8a271` |
| "elevated card" | Elevated, one line, single → `5662d2b3e29c7f05d92009aa3f2b8c909e34ae16` |

### Spec Example

```json
{
  "name": "Plan Selection Card",
  "type": "instance",
  "componentKey": "b9a2bce424a4cd28e4fe827834e2870acf6935a3"
}
```

---
