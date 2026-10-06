/**
 * Bot HTTP API contracts shared with the website. Paths use `:guildid`.
 * All mutating routes require API-key auth (`Authorization: Bearer <key>`
 * or `X-API-Key: <key>`). Errors are non-2xx + `{ message }`.
 */
const ENDPOINTS = {
    toggleCommand: "POST /:guildid/togglecommand",
    resyncCommands: "POST /:guildid/resynccommands",
    getRpActions: "GET /:guildid/rpactions",
    setRpActions: "POST /:guildid/rpactions",
    getModSettings: "GET /:guildid/modsettings",
    setModSettings: "POST /:guildid/modsettings",
};

/**
 * @typedef {Object} ToggleResult
 * @property {string} command Command name.
 * @property {boolean} [enabled] New state (bulk form).
 * @property {string} [error] Per-item error (bulk form).
 *
 * @typedef {Object} ResyncResult
 * @property {string} guildID Guild ID.
 * @property {string} message Human-readable summary.
 * @property {number} count Total changed.
 * @property {string[]} created Created command names.
 * @property {string[]} updated Updated command names.
 * @property {string[]} deleted Deleted command names.
 *
 * @typedef {Object} RpActionState
 * @property {string} name Action name.
 * @property {string} description Action description.
 * @property {boolean} enabled Whether enabled in the guild.
 *
 * @typedef {Object} ModCommandToggles
 * @property {boolean} [notify] DM the target.
 * @property {boolean} [requireReason] Reject reasonless use.
 * @property {boolean} [requireDuration] Reject durationless use.
 */

module.exports = { ENDPOINTS };
