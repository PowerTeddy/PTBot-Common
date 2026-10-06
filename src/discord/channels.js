/**
 * Discord channel types (subset stable across API versions).
 * Source of truth: oceanic.js `Constants.ChannelTypes`.
 * @type {Object<string, number>}
 */
const CHANNEL_TYPES = {
    GUILD_TEXT: 0,
    DM: 1,
    GUILD_VOICE: 2,
    GROUP_DM: 3,
    GUILD_CATEGORY: 4,
    GUILD_ANNOUNCEMENT: 5,
    GUILD_STORE: 6,
    ANNOUNCEMENT_THREAD: 10,
    PUBLIC_THREAD: 11,
    PRIVATE_THREAD: 12,
    GUILD_STAGE_VOICE: 13,
    GUILD_DIRECTORY: 14,
    GUILD_FORUM: 15,
    GUILD_MEDIA: 16,
};

/**
 * Channel types that can hold server messages for purge-style features.
 * @type {number[]}
 */
const TEXTABLE_GUILD_CHANNELS = [
    CHANNEL_TYPES.GUILD_TEXT,
    CHANNEL_TYPES.GUILD_ANNOUNCEMENT,
    CHANNEL_TYPES.GUILD_FORUM,
    CHANNEL_TYPES.GUILD_MEDIA,
];

module.exports = { CHANNEL_TYPES, TEXTABLE_GUILD_CHANNELS };
