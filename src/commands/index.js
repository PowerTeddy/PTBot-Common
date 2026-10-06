/**
 * Shared command registry (generated from the bot repo — do not edit by hand).
 * Regenerate: `npm run build:commands` from the PTBot Eris checkout.
 */
const registry = require("./registry.json");

/**
 * @returns {Array<Object>} All command entries, sorted by name.
 */
function allCommands() {
    return registry.commands;
}

/**
 * @param {string} name Command name.
 * @returns {Object|undefined} The command entry, if present.
 */
function getCommand(name) {
    return registry.commands.find((c) => c.name === name);
}

module.exports = { registryVersion: registry.version, allCommands, getCommand };
