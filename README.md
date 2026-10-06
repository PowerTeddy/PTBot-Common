# ptbot-common

Shared registry, constants, schemas and API contracts for PTBot (Discord bot + website). Zero runtime dependencies.

## Contents

- `src/commands/` — command registry (35 commands + 39 roleplay actions), **generated** from the bot repo. Do not edit by hand.
- `src/discord/` — permission bits, channel types (verified against oceanic.js).
- `src/schemas/` — `buildModels(mongoose)` → `{ Guild, User, Case }`. Works with mongoose 8 (bot) and 9 (website).
- `src/contracts/` — bot endpoint paths + request/response shapes.

## Regenerating the registry

```powershell
node scripts/build-commands.js "C:\Users\kendr\Projects\PT Bot Folder\PTBot Eris"
```

## Verifying

```powershell
node scripts/verify.js "C:\Users\kendr\Projects\PT Bot Folder\PTBot Eris"
```

Checks the registry against the live bot configs, and the constants against oceanic.js. Run after any bot command/config change, then bump `version` in `package.json`.

## Consuming

```js
const common = require("ptbot-common");
common.commands.getCommand("ban"); // registry entry
common.discord.toPermissionBitfield(["BAN_MEMBERS"]); // "4"
const { Guild } = common.buildModels(require("mongoose"));
```
