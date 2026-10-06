/**
 * Builds src/commands/registry.json from the bot repo's command configs.
 * Usage: node scripts/build-commands.js [path-to-bot-repo]
 * The bot repo is the source of truth; the website consumes the output.
 */
const fs = require("fs");
const path = require("path");
const { toPermissionBitfield } = require("../src/discord/permissions");

const botDir = path.resolve(process.argv[2] ?? path.join(__dirname, "..", "..", "PTBot Eris"));
const commandsDir = path.join(botDir, "src", "commands");

/**
 * Normalizes one command config into the shared registry shape.
 * @param {string} name Command name.
 * @param {Object} config The command config.
 * @param {string} category Folder-derived category.
 * @returns {Object} Registry entry.
 */
function toEntry(name, config, category) {
    return {
        name,
        description: config.description ?? "",
        category,
        defaultState: config.defaultState ?? "on",
        global: config.global ?? false,
        test: config.test ?? false,
        owner: config.cmdtype === "owner",
        defaultPermissions: config.defaultMemberPermissions ?? null,
        defaultPermissionsBitfield: toPermissionBitfield(config.defaultMemberPermissions),
        options: (config.options ?? []).map((o) => ({
            type: o.type,
            name: o.name,
            description: o.description ?? "",
            required: o.required ?? false,
            autocomplete: o.autocomplete ?? false,
            choices: o.choices ?? null,
            minValue: o.minValue ?? o.min_value ?? null,
            maxValue: o.maxValue ?? o.max_value ?? null,
        })),
        usage: config.usage ?? null,
        examples: config.examples ?? null,
    };
}

const registry = [];
for (const dirent of fs.readdirSync(commandsDir, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;
    const dir = path.join(commandsDir, dirent.name);
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".js"))) {
        const mod = require(path.join(dir, file));
        if (!mod.config?.name) {
            throw new Error(`Missing config.name in ${dirent.name}/${file}`);
        }
        const entry = toEntry(mod.config.name, mod.config, dirent.name);

        // Roleplay actions live in actions/; attach them to the rp entry
        if (dirent.name === "roleplay" && mod.config.name === "rp") {
            const actionsDir = path.join(dir, "actions");
            entry.actions = fs.readdirSync(actionsDir)
                .filter((f) => f.endsWith(".js"))
                .map((f) => {
                    const action = require(path.join(actionsDir, f));
                    return {
                        name: f.slice(0, -3),
                        description: action.description ?? "",
                        users: action.users ?? "optional",
                    };
                })
                .sort((a, b) => a.name.localeCompare(b.name));
        }

        registry.push(entry);
    }
}
registry.sort((a, b) => a.name.localeCompare(b.name));

const outPath = path.join(__dirname, "..", "src", "commands", "registry.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ version: 1, generatedAt: new Date().toISOString(), commands: registry }, null, 2) + "\n");
console.log(`Wrote ${registry.length} commands to ${outPath}`);
