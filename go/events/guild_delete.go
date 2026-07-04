package events

import (
	"fmt"

	"github.com/RealMtrx/Discord-Handler-Go/bot"
	"github.com/RealMtrx/Discord-Handler-Go/core"
	"github.com/bwmarrin/discordgo"
)

func GuildDelete(s *discordgo.Session, g *discordgo.GuildDelete) {
	if bot.App.Config.LeaveGuildWebhook != "" && bot.App.Config.LeaveGuildWebhook != "#" {
		embed := core.WebhookEmbed{
			Color:       0xFF0000,
			Title:       "👋 Bot Left Server",
			Description: "**Server:** " + g.ID,
			Fields: []core.WebhookField{
				{Name: "📊 Remaining Servers", Value: fmt.Sprintf("%d servers", len(s.State.Guilds)), Inline: true},
			},
			Footer: core.WebhookFooter{Text: bot.App.Config.BotName + " • Guild Leave Logger"},
		}
		core.SendWebhook(bot.App.Config.LeaveGuildWebhook, embed)
	}
}
