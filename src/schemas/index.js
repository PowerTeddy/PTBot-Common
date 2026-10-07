/**
 * Shared Mongoose schemas. Exported as factories taking the host app's
 * `mongoose` instance (bot uses v8, website uses v9 — schemas are plain
 * definitions and work with both). Models are cached per connection to
 * avoid OverwriteModelError.
 */

/**
 * @param {import("mongoose")} mongoose Host app's mongoose instance.
 * @returns {{Guild: import("mongoose").Model, User: import("mongoose").Model, Case: import("mongoose").Model}} The models.
 */
function buildModels(mongoose) {
    if (mongoose.models.Guild && mongoose.models.User && mongoose.models.Case) {
        return { Guild: mongoose.models.Guild, User: mongoose.models.User, Case: mongoose.models.Case };
    }

    const guildSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        guildID: { type: mongoose.SchemaTypes.String, required: true, unique: true },
        guildName: { type: mongoose.SchemaTypes.String, required: false },
        welcomeChannel: { type: mongoose.SchemaTypes.String, required: false },
        welcomeBackground: { type: mongoose.SchemaTypes.String, required: false },
        logGoodbyeChannel: { type: mongoose.SchemaTypes.String, required: false },
        goodbyeBackground: { type: mongoose.SchemaTypes.String, required: false },
        modlogChannel: { type: mongoose.SchemaTypes.String, required: false },
        logmemberChannel: { type: mongoose.SchemaTypes.String, required: false },
        disabledRpActions: { type: [mongoose.SchemaTypes.String], required: false, default: [] },
        // packed moderation flags: 1 = notify, 2 = require reason, 4 = require duration
        modFlags: { type: mongoose.SchemaTypes.Number, required: false, default: 1 },
        // per-command notify overrides (command name -> boolean)
        modNotify: { type: Map, of: Boolean, default: {} },
        // per-command dashboard toggles (command name -> packed bits)
        modCommands: { type: Map, of: Number, default: {} },
        // per-guild moderation case counter
        caseSeq: { type: mongoose.SchemaTypes.Number, required: false, default: 0 },
        lastSyncedAt: { type: mongoose.SchemaTypes.Date, required: false, default: null },
    });

    const userSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        userID: { type: mongoose.SchemaTypes.String, required: true, unique: true },
        username: { type: mongoose.SchemaTypes.String, required: false },
        // action name -> times performed
        doneCounts: { type: Map, of: Number, default: {} },
        // action name -> times received
        receivedCounts: { type: Map, of: Number, default: {} },
    });

    const caseSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        guildID: { type: mongoose.SchemaTypes.String, required: true, index: true },
        // per-guild sequential case number
        caseId: { type: mongoose.SchemaTypes.Number, required: true },
        userID: { type: mongoose.SchemaTypes.String, required: true, index: true },
        moderatorID: { type: mongoose.SchemaTypes.String, required: true },
        action: { type: mongoose.SchemaTypes.String, required: true, index: true },
        reason: { type: mongoose.SchemaTypes.String, required: false, default: "No reason" },
        expiresAt: { type: mongoose.SchemaTypes.Date, required: false, default: null },
        // false once explicitly undone (unban/unmute, warning deleted).
        // Expiry is NOT stored here — derive it at read time
        // (`expiresAt` > now), so it can never go stale.
        active: { type: mongoose.SchemaTypes.Boolean, required: false, default: true },
        createdAt: { type: mongoose.SchemaTypes.Date, required: false, default: Date.now },
    });
    caseSchema.index({ guildID: 1, caseId: 1 }, { unique: true });
    // /cases listing: per-user filter + newest-first sort
    caseSchema.index({ guildID: 1, userID: 1, action: 1, caseId: -1 });
    // undo lookups (unban/unmute close this user's active cases)
    caseSchema.index({ guildID: 1, userID: 1, action: 1, active: 1 });
    // boot expiry sweep: all expirable active cases
    caseSchema.index({ active: 1, expiresAt: 1 });

    return {
        Guild: mongoose.model("Guild", guildSchema, "guilds"),
        User: mongoose.model("User", userSchema, "users"),
        Case: mongoose.model("Case", caseSchema, "cases"),
    };
}

module.exports = { buildModels };
