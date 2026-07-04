package events

import (
	"fmt"

	"github.com/RealMtrx/Discord-Handler-Go/bot"
	"github.com/RealMtrx/Discord-Handler-Go/core"
	"github.com/bwmarrin/discordgo"
)

func GuildCreate(s *discordgo.Session, g *discordgo.GuildCreate) {
	if bot.App.Config.JoinGuildWebhook != "" && bot.App.Config.JoinGuildWebhook != "#" {
		embed := core.WebhookEmbed{
			Color:       0x57F287,
			Title:       "🎉 Bot Joined New Server!",
			Description: "**Server:** " + g.Name + "\n**ID:** " + g.ID,
			Fields: []core.WebhookField{
				{Name: "👑 Owner", Value: "<@" + g.OwnerID + ">", Inline: true},
				{Name: "👥 Members", Value: fmt.Sprintf("%d members", g.MemberCount), Inline: true},
			},
			Footer: core.WebhookFooter{Text: bot.App.Config.BotName + " • Guild Join Logger"},
		}
		core.SendWebhook(bot.App.Config.JoinGuildWebhook, embed)
	}
}
