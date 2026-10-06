/**
 * Discord permission bitfields. Values are strings because Discord sends
 * `default_member_permissions` as a bitfield string, and BigInts do not
 * survive JSON. Source of truth: oceanic.js `Constants.Permissions`.
 * @type {Object<string, string>}
 */
const PERMISSION_BITS = {
    CREATE_INSTANT_INVITE: "1",
    KICK_MEMBERS: "2",
    BAN_MEMBERS: "4",
    ADMINISTRATOR: "8",
    MANAGE_CHANNELS: "16",
    MANAGE_GUILD: "32",
    ADD_REACTIONS: "64",
    VIEW_AUDIT_LOG: "128",
    PRIORITY_SPEAKER: "256",
    STREAM: "512",
    VIEW_CHANNEL: "1024",
    SEND_MESSAGES: "2048",
    SEND_TTS_MESSAGES: "4096",
    MANAGE_MESSAGES: "8192",
    EMBED_LINKS: "16384",
    ATTACH_FILES: "32768",
    READ_MESSAGE_HISTORY: "65536",
    MENTION_EVERYONE: "131072",
    USE_EXTERNAL_EMOJIS: "262144",
    VIEW_GUILD_INSIGHTS: "524288",
    CONNECT: "1048576",
    SPEAK: "2097152",
    MUTE_MEMBERS: "4194304",
    DEAFEN_MEMBERS: "8388608",
    MOVE_MEMBERS: "16777216",
    USE_VAD: "33554432",
    CHANGE_NICKNAME: "67108864",
    MANAGE_NICKNAMES: "134217728",
    MANAGE_ROLES: "268435456",
    MANAGE_WEBHOOKS: "536870912",
    MANAGE_GUILD_EXPRESSIONS: "1073741824",
    USE_APPLICATION_COMMANDS: "2147483648",
    REQUEST_TO_SPEAK: "4294967296",
    MANAGE_EVENTS: "8589934592",
    MANAGE_THREADS: "17179869184",
    CREATE_PUBLIC_THREADS: "34359738368",
    CREATE_PRIVATE_THREADS: "68719476736",
    USE_EXTERNAL_STICKERS: "137438953472",
    SEND_MESSAGES_IN_THREADS: "274877906944",
    USE_EMBEDDED_ACTIVITIES: "549755813888",
    MODERATE_MEMBERS: "1099511627776",
    VIEW_CREATOR_MONETIZATION_ANALYTICS: "2199023255552",
    USE_SOUNDBOARD: "4398046511104",
    CREATE_GUILD_EXPRESSIONS: "8796093022208",
    CREATE_EVENTS: "17592186044416",
    USE_EXTERNAL_SOUNDS: "35184372088832",
    SEND_VOICE_MESSAGES: "70368744177664",
    USE_CLYDE_AI: "140737488355328",
    SET_VOICE_CHANNEL_STATUS: "281474976710656",
    SEND_POLLS: "562949953421312",
    USE_EXTERNAL_APPS: "1125899906842624",
    PIN_MESSAGES: "2251799813685248",
    BYPASS_SLOWMODE: "4503599627370496",
    MANAGE_OFFICIAL_MESSAGES: "9007199254740992",
};

/**
 * ORs permission names into the bitfield string Discord expects for
 * `default_member_permissions`. Plain numeric strings pass through.
 * @param {string|string[]|null|undefined} permissions Permission name(s).
 * @returns {string|null} Bitfield string, or `null` when empty.
 */
function toPermissionBitfield(permissions) {
    if (permissions === null || permissions === undefined) return null;
    if (typeof permissions === "string" && /^\d+$/.test(permissions)) return permissions;
    const names = Array.isArray(permissions) ? permissions : [permissions];
    if (!names.length) return null;
    return names.reduce((bits, name) => bits | BigInt(PERMISSION_BITS[name]), 0n).toString();
}

module.exports = { PERMISSION_BITS, toPermissionBitfield };
