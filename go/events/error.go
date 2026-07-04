package events

import (
	"github.com/RealMtrx/Discord-Handler-Go/core"
	"github.com/bwmarrin/discordgo"
)

func DiscordError(s *discordgo.Session, err *discordgo.Event) {
	embed := core.WebhookEmbed{
		Color:       0xFF0000,
		Title:       "❌ Discord Error",
		Description: "An error occurred in the Discord session",
		Footer:      core.WebhookFooter{Text: "Discord Handler • Error Logger"},
	}

	// Send to webhook silently (fire-and-forget)
	go core.SendWebhook("", embed)
}
