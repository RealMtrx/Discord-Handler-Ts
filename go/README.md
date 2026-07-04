# Discord Handler - Go

A modular Discord bot handler built with Go using discordgo, featuring both slash commands and prefix commands with a robust architecture.

## Features

- **Dual Command System**: Support for both slash commands and prefix commands
- **Modular Architecture**: Clean separation of concerns with dedicated handlers
- **Event-Driven**: Fully event-driven architecture
- **MongoDB**: Database integration with MongoDB driver

## Project Structure

```
Discord-Handler-Go/
├── main.go                 # Entry point
├── config/
│   └── config.go           # Configuration
├── bot/
│   └── bot.go              # Bot struct and session
├── handlers/
│   ├── commands.go          # Slash command loader
│   ├── prefix.go            # Prefix command loader
│   ├── events.go            # Event registration
│   ├── anticrash.go         # Panic recovery
│   └── logger.go            # Startup report
├── core/
│   ├── emojis.go            # Emoji constants
│   ├── cooldown.go          # Cooldown system
│   └── webhooks.go          # Discord webhook sender
├── events/
│   ├── ready.go             # Bot ready event
│   ├── interaction_create.go # Slash command handler
│   ├── message_create.go    # Prefix command handler
│   ├── guild_create.go      # Guild join event
│   └── guild_delete.go      # Guild leave event
├── database/
│   └── mongo.go             # MongoDB connection
├── models/
│   └── user.go              # User model
├── commands/
│   ├── slash/
│   │   └── public/
│   │       └── ping.go      # Slash ping command
│   └── prefix/
│       └── public/
│           └── ping.go      # Prefix ping command
├── go.mod
└── go.sum
```

## Installation

```bash
git clone https://github.com/RealMtrx/Discord-Handler-Go.git
cd Discord-Handler-Go
go mod tidy
go build -o Discord-Handler-Go
./Discord-Handler-Go
```

## Configuration

Create a `.env` file based on the settings in `config/config.go`.

## Commands

- `/ping` - Show bot latency and API response times
- `$ping` - Show bot latency and API response times
