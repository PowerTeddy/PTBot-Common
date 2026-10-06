/**
 * Dashboard toggles applicable per moderation command (mirrors each
 * command's options). Commands absent here have no toggles.
 * Source of truth: bot `src/util/moderation.js` COMMAND_FLAGS.
 * @type {Object<string, string[]>}
 */
const MOD_TOGGLES = {
    ban: ["notify", "requireReason", "requireDuration"],
    kick: ["notify", "requireReason"],
    mute: ["notify", "requireReason", "requireDuration"],
    unmute: ["notify", "requireReason"],
    unban: ["notify", "requireReason"],
    warn: ["notify", "requireReason", "requireDuration"],
    slowmode: ["requireReason"],
};

/**
 * Packed flag bits backing the toggles.
 * @type {Object<string, number>}
 */
const MOD_FLAG_BITS = { notify: 1, requireReason: 2, requireDuration: 4 };

/**
 * Moderation commands that DM their target.
 * @type {string[]}
 */
const NOTIFIABLE_COMMANDS = ["ban", "kick", "mute", "unmute", "unban", "warn"];

module.exports = { MOD_TOGGLES, MOD_FLAG_BITS, NOTIFIABLE_COMMANDS };
