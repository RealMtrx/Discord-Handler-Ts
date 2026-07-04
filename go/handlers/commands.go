package handlers

import (
	"fmt"

	"github.com/RealMtrx/Discord-Handler-Go/bot"
	"github.com/bwmarrin/discordgo"
	"github.com/fatih/color"
)

func LoadSlashCommands(b *bot.Bot) int {
	cmds := []*discordgo.ApplicationCommand{}
	for _, cmd := range b.SlashCommands {
		cmds = append(cmds, cmd.Data)
	}
	count := len(cmds)

	if count == 0 {
		color.Yellow("[Slash] No commands found")
	}
	color.Green("[Slash] %d commands loaded", count)
	return count
}

func RegisterSlashCommands(b *bot.Bot) error {
	if len(b.SlashCommands) == 0 {
		return nil
	}

	cmds := make([]*discordgo.ApplicationCommand, 0, len(b.SlashCommands))
	for _, cmd := range b.SlashCommands {
		cmds = append(cmds, cmd.Data)
	}

	registered, err := b.Session.ApplicationCommandBulkOverwrite(
		b.Session.State.User.ID, "", cmds,
	)
	if err != nil {
		return fmt.Errorf("failed to register commands: %w", err)
	}

	color.Green("[Slash] Registered %d commands with Discord API", len(registered))
	return nil
}
