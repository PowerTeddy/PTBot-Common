/**
 * Verifies the shared package against live sources of truth:
 * - registry.json matches the bot repo's command configs
 * - permission bits match oceanic.js
 * - channel types match oceanic.js
 * Usage: node scripts/verify.js [path-to-bot-repo]
 */
const assert = require("assert");
const path = require("path");
const botDir = path.resolve(process.argv[2] ?? path.join(__dirname, "..", "..", "PTBot Eris"));

const { registryVersion, allCommands } = require("../src/commands");
const { PERMISSION_BITS } = require("../src/discord/permissions");
const { CHANNEL_TYPES } = require("../src/discord/channels");

const oceanic = require(path.join(botDir, "node_modules", "oceanic.js"));

// 1. permission bits match oceanic
for (const [name, bits] of Object.entries(oceanic.Constants.Permissions)) {
    assert.equal(PERMISSION_BITS[name], bits.toString(), `perm ${name}`);
}
console.log(`permissions OK (${Object.keys(PERMISSION_BITS).length})`);

// 2. channel types match oceanic
for (const [name, value] of Object.entries(CHANNEL_TYPES)) {
    assert.equal(oceanic.Constants.ChannelTypes[name], value, `channel ${name}`);
}
console.log("channels OK");

// 3. registry matches live bot configs
const live = new Map();
const commandsDir = path.join(botDir, "src", "commands");
const fs = require("fs");
for (const dirent of fs.readdirSync(commandsDir, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;
    for (const file of fs.readdirSync(path.join(commandsDir, dirent.name)).filter((f) => f.endsWith(".js"))) {
        const mod = require(path.join(commandsDir, dirent.name, file));
        if (mod.config?.name) live.set(mod.config.name, { config: mod.config, category: dirent.name });
    }
}
const entries = allCommands();
assert.equal(entries.length, live.size, "command count");
for (const entry of entries) {
    const found = live.get(entry.name);
    assert.ok(found, `registry-only command: ${entry.name}`);
    assert.equal(entry.description, found.config.description ?? "", `desc ${entry.name}`);
    assert.equal(entry.category, found.category, `category ${entry.name}`);
    assert.equal(entry.options.length, (found.config.options ?? []).length, `options ${entry.name}`);
}
console.log(`registry OK (${entries.length} commands, v${registryVersion})`);

console.log("VERIFY PASSED");
