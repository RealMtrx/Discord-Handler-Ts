<div align="center">
  <h1>Discord Handler — TypeScript</h1>
  <p><strong>A production-ready Discord bot framework built with discord.js and MongoDB — slash commands, prefix commands, anti-crash, webhook logging, and a modular src/ architecture.</strong></p>

  <p>
    <a href="https://github.com/RealMtrx/Discord-Handler/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
    <a href="https://github.com/RealMtrx/Discord-Handler/releases"><img src="https://img.shields.io/badge/version-0.9.0--beta-yellow" alt="Version 0.9.0 Beta"></a>
    <a href="https://github.com/RealMtrx/Discord-Handler/stargazers"><img src="https://img.shields.io/github/stars/RealMtrx/Discord-Handler" alt="Stars"></a>
    <a href="https://github.com/RealMtrx/Discord-Handler/issues"><img src="https://img.shields.io/github/issues/RealMtrx/Discord-Handler" alt="Issues"></a>
    <a href="https://github.com/RealMtrx/Discord-Handler/network"><img src="https://img.shields.io/github/forks/RealMtrx/Discord-Handler" alt="Forks"></a>
    <a href="https://github.com/RealMtrx/Discord-Handler/graphs/contributors"><img src="https://img.shields.io/badge/ecosystem-26%20repos-brightgreen" alt="26 Repos"></a>
    <a href="https://discord.gg/0hu2"><img src="https://img.shields.io/badge/discord-0hu2-5865F2" alt="Discord"></a>
  </p>

  <br>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-project-structure">Structure</a> •
    <a href="#-api-reference">API</a> •
    <a href="#-database-edition">SQL Edition</a> •
    <a href="#-related-repositories">Ecosystem</a>
  </p>
</div>

---

## Overview

Discord Handler TypeScript is the **flagship TypeScript edition** and the **hub repository** of the multi-language Discord Handler ecosystem. Built on `discord.js` (^14) with full TypeScript strict mode, it provides a modular, event-driven foundation for Discord bots with dual command support (slash + prefix), MongoDB persistence via Mongoose (^8), webhook-based logging, and an anti-crash layer.

The entry point (`src/index.ts`) boots in a predictable async sequence: initialize the anti-crash handler, connect to MongoDB, load slash commands, prefix commands, events, and Mongoose models, present a startup report via chalk/boxen, and finally log in. A graceful shutdown handler for `SIGINT`/`SIGTERM` is also registered.

## Features

- **Dual Command System** — Slash commands via `Commands.ts` loader and prefix commands via `Prefix.ts` loader
- **Modular Architecture** — Separated concerns across `Core/`, `Database/`, `Events/`, `Handlers/`, `Models/`, and `Commands/`
- **TypeScript Strict Mode** — Full type safety with `strict: true` in `tsconfig.json`
- **Anti-Crash** — Global `process.on('uncaughtException')` / `unhandledRejection` interception via `AntiCrash.ts`
- **Webhook Logging** — Six dedicated webhooks: errors, slash commands, prefix commands, guild join, guild leave, and ready
- **MongoDB Integration** — Persistent storage via Mongoose (^8.0) ODM
- **Cooldown System** — Per-command cooldown tracked in `Core/commandUtils.ts`
- **Environment Configuration** — All secrets managed via `dotenv` in `src/config.ts`
- **Startup Dashboard** — Boxed startup report rendered with `chalk` and `boxen`

## Quick Start

```bash
git clone https://github.com/RealMtrx/Discord-Handler.git
cd Discord-Handler
npm install
```

Edit `src/config.ts` with your values:

```typescript
token: "your_bot_token",
clientId: "your_client_id",
botName: "Discord Handler",
prefix: "$",
ownerIds: ["owner_id_1", "owner_id_2"],
MONGODB_URI: "your_mongo_uri",
errorWebhook: "#",
slashCommandWebhook: "#",
prefixCommandWebhook: "#",
joinGuildWebhook: "#",
leaveGuildWebhook: "#",
readyWebhook: "#",
```

```bash
npm run dev    # Development with tsx
npm run build  # Production build (tsc)
npm start      # Run built version from dist/
```

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `discord.js` | ^14.11.0 | Discord API wrapper |
| `mongoose` | ^7.5.0 / ^8 | MongoDB ODM |
| `dotenv` | ^17.2.1 | Environment variable management |
| `chalk` | ^5.3.0 | Terminal colors |
| `boxen` | ^8.0.0 | Boxed UI for startup report |
| `typescript` | ^5.6.0 | TypeScript compiler (dev) |
| `tsx` | ^4.19.0 | TypeScript execution engine (dev) |

## Project Structure

```
Discord-Handler/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts                      # Entry point — async boot sequence
│   ├── config.ts                     # Bot configuration (token, prefixes, webhooks)
│   ├── types.ts                      # Shared type definitions (ExtendedClient, etc.)
│   ├── Core/
│   │   ├── commandUtils.ts           # Cooldown, error formatting, utility logging
│   │   ├── emojis.ts                 # Centralized emoji definitions
│   │   ├── errorWebhook.ts           # Error reporting via webhook
│   │   ├── joinGuildWebhook.ts       # Webhook on guild join
│   │   ├── leaveGuildWebhook.ts      # Webhook on guild leave
│   │   ├── prefixCommandWebhook.ts   # Prefix command usage logging
│   │   ├── readyWebhook.ts           # Ready event notification
│   │   └── slashCommandWebhook.ts    # Slash command usage logging
│   ├── Database/
│   │   └── mongo.ts                  # Mongoose connection setup
│   ├── Events/
│   │   ├── error.ts                  # Discord client error event
│   │   ├── guildCreate.ts            # Guild join handler
│   │   ├── guildDelete.ts            # Guild leave handler
│   │   ├── interactionCreate.ts      # Slash command dispatcher
│   │   ├── messageCreate.ts          # Prefix command dispatcher
│   │   └── ready.ts                  # Ready event handler
│   ├── Handlers/
│   │   ├── AntiCrash.ts              # Global error interception
│   │   ├── Commands.ts               # Slash command loader/registrar
│   │   ├── Events.ts                 # Event loader
│   │   ├── logger.ts                 # Startup report renderer
│   │   ├── Models.ts                 # Mongoose model loader
│   │   └── Prefix.ts                 # Prefix command loader
│   ├── Models/
│   │   └── userModel.ts              # Mongoose user schema
│   └── Commands/
│       ├── Prefix/Public/ping.ts     # Example prefix command
│       └── Slash/Public/ping.ts      # Example slash command
```

## API Reference

### Entry Point — `src/index.ts`

```typescript
async function main()
```

Creates a `Client` with `Guilds`, `GuildMessages`, and `MessageContent` intents plus `Channel` partials. Loads handlers sequentially: AntiCrash → MongoDB → slash commands → prefix commands → events → models. Logs in via `client.login(config.token)`. Handles `SIGINT` and `SIGTERM` for graceful shutdown.

### Configuration — `src/config.ts`

| Key | Type | Description |
|-----|------|-------------|
| `token` | `string` | Discord bot token |
| `clientId` | `string` | Discord application client ID |
| `botName` | `string` | Display name for startup report |
| `prefix` | `string` | Prefix for text commands |
| `ownerIds` | `string[]` | Array of bot owner Discord IDs |
| `MONGODB_URI` | `string` | MongoDB connection string |
| `errorWebhook` | `string` | Webhook URL for error reports |
| `slashCommandWebhook` | `string` | Webhook URL for slash command usage |
| `prefixCommandWebhook` | `string` | Webhook URL for prefix command usage |
| `joinGuildWebhook` | `string` | Webhook URL for guild joins |
| `leaveGuildWebhook` | `string` | Webhook URL for guild leaves |
| `readyWebhook` | `string` | Webhook URL for ready notifications |

### Events

| Event | File | Trigger |
|-------|------|---------|
| `ready` | `Events/ready.ts` | Bot goes online — logs startup, sends ready webhook |
| `guildCreate` | `Events/guildCreate.ts` | Bot joins a server — sends join webhook |
| `guildDelete` | `Events/guildDelete.ts` | Bot leaves a server — sends leave webhook |
| `interactionCreate` | `Events/interactionCreate.ts` | Slash command used — routes to command module |
| `messageCreate` | `Events/messageCreate.ts` | Message sent — checks prefix, routes to prefix command |
| `error` | `Events/error.ts` | Discord client error — logs to webhook |

### Handlers

- **AntiCrash** — Registers `process.on('uncaughtException')` and `process.on('unhandledRejection')` reporters
- **Commands** — Recursively walks `Commands/Slash/`, registers each command with `client.application.commands.create`
- **Prefix** — Recursively walks `Commands/Prefix/`, builds a `Collection` keyed by command name
- **Events** — Recursively walks `Events/`, attaches each to `client.on()`
- **Models** — Recursively walks `Models/`, imports each for Mongoose schema registration
- **logger** — `startupReport()` renders a boxed summary with command/event counts, MongoDB status, and anti-crash status

### Core Utilities

- **commandUtils** — `checkCooldown(client, commandName, userId)` and `formatError(error)` helpers
- **Webhook files** — Each webhook utility (`errorWebhook.ts`, `joinGuildWebhook.ts`, etc.) exports a `send()` function

## Adding Commands

### Slash Command

Create `src/Commands/Slash/[Category]/[name].ts`:

```typescript
import { SlashCommandBuilder } from "discord.js";
import type { ExtendedClient } from "../../types.js";

export default {
  data: new SlashCommandBuilder()
    .setName("yourcommand")
    .setDescription("Does something useful"),
  cooldown: 3000,
  async execute(client: ExtendedClient, interaction: any) {
    await interaction.reply("Done!");
  },
};
```

### Prefix Command

Create `src/Commands/Prefix/[Category]/[name].ts`:

```typescript
import type { ExtendedClient } from "../../types.js";

export default {
  name: "yourcommand",
  description: "Does something useful",
  cooldown: 3000,
  async run(client: ExtendedClient, message: any, args: string[]) {
    message.reply("Done!");
  },
};
```

The `Commands.ts` and `Prefix.ts` handlers automatically discover and register new files on the next restart. No manual wiring is needed.

## Database Edition

A **Sequelize (SQL)** variant of this handler is available for teams that prefer a relational database over MongoDB:

[RealMtrx/Discord-Handler-Ts-Sequelize](https://github.com/RealMtrx/Discord-Handler-Ts-Sequelize)

It replaces `Database/mongo.ts` with a Sequelize-based connection and supports SQLite, PostgreSQL, MySQL, MariaDB, and MSSQL out of the box. All other modules — events, commands, handlers, core utilities — remain identical.

## Related Repositories

The Discord Handler ecosystem spans **26 repositories** across 13 languages, each available in both MongoDB and Sequelize editions.

### Base Repositories (MongoDB)

| Language | Repository |
|----------|------------|
| C++ | [RealMtrx/Discord-Handler-Cpp](https://github.com/RealMtrx/Discord-Handler-Cpp) |
| C# | [RealMtrx/Discord-Handler-Cs](https://github.com/RealMtrx/Discord-Handler-Cs) |
| Dart | [RealMtrx/Discord-Handler-Dart](https://github.com/RealMtrx/Discord-Handler-Dart) |
| Go | [RealMtrx/Discord-Handler-Go](https://github.com/RealMtrx/Discord-Handler-Go) |
| Java | [RealMtrx/Discord-Handler-Java](https://github.com/RealMtrx/Discord-Handler-Java) |
| JavaScript | [RealMtrx/Discord-Handler-Js](https://github.com/RealMtrx/Discord-Handler-Js) |
| Kotlin | [RealMtrx/Discord-Handler-Kt](https://github.com/RealMtrx/Discord-Handler-Kt) |
| Lua | [RealMtrx/Discord-Handler-Lua](https://github.com/RealMtrx/Discord-Handler-Lua) |
| PHP | [RealMtrx/Discord-Handler-Php](https://github.com/RealMtrx/Discord-Handler-Php) |
| Python | [RealMtrx/Discord-Handler-Py](https://github.com/RealMtrx/Discord-Handler-Py) |
| Ruby | [RealMtrx/Discord-Handler-Rb](https://github.com/RealMtrx/Discord-Handler-Rb) |
| Rust | [RealMtrx/Discord-Handler-Rs](https://github.com/RealMtrx/Discord-Handler-Rs) |
| TypeScript | [RealMtrx/Discord-Handler](https://github.com/RealMtrx/Discord-Handler) ← hub |

### Sequelize (SQL) Editions

| Language | Repository |
|----------|------------|
| C++ | [RealMtrx/Discord-Handler-Cpp-Sequelize](https://github.com/RealMtrx/Discord-Handler-Cpp-Sequelize) |
| C# | [RealMtrx/Discord-Handler-Cs-Sequelize](https://github.com/RealMtrx/Discord-Handler-Cs-Sequelize) |
| Dart | [RealMtrx/Discord-Handler-Dart-Sequelize](https://github.com/RealMtrx/Discord-Handler-Dart-Sequelize) |
| Go | [RealMtrx/Discord-Handler-Go-Sequelize](https://github.com/RealMtrx/Discord-Handler-Go-Sequelize) |
| Java | [RealMtrx/Discord-Handler-Java-Sequelize](https://github.com/RealMtrx/Discord-Handler-Java-Sequelize) |
| JavaScript | [RealMtrx/Discord-Handler-Js-Sequelize](https://github.com/RealMtrx/Discord-Handler-Js-Sequelize) |
| Kotlin | [RealMtrx/Discord-Handler-Kt-Sequelize](https://github.com/RealMtrx/Discord-Handler-Kt-Sequelize) |
| Lua | [RealMtrx/Discord-Handler-Lua-Sequelize](https://github.com/RealMtrx/Discord-Handler-Lua-Sequelize) |
| PHP | [RealMtrx/Discord-Handler-Php-Sequelize](https://github.com/RealMtrx/Discord-Handler-Php-Sequelize) |
| Python | [RealMtrx/Discord-Handler-Py-Sequelize](https://github.com/RealMtrx/Discord-Handler-Py-Sequelize) |
| Ruby | [RealMtrx/Discord-Handler-Rb-Sequelize](https://github.com/RealMtrx/Discord-Handler-Rb-Sequelize) |
| Rust | [RealMtrx/Discord-Handler-Rs-Sequelize](https://github.com/RealMtrx/Discord-Handler-Rs-Sequelize) |
| TypeScript | [RealMtrx/Discord-Handler-Ts-Sequelize](https://github.com/RealMtrx/Discord-Handler-Ts-Sequelize) |

> **[RealMtrx/Discord-Handler](https://github.com/RealMtrx/Discord-Handler)** — the TypeScript hub and flagship repository. Star it to support the ecosystem.

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built by **Mtrx** — Discord: **0hu2**
