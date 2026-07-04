package events

import (
	"fmt"

	"github.com/RealMtrx/Discord-Handler-Go/bot"
	"github.com/RealMtrx/Discord-Handler-Go/core"
	"github.com/bwmarrin/discordgo"
)

func Ready(s *discordgo.Session, r *discordgo.Ready) {
	err := s.UpdateStatusComplex(discordgo.UpdateStatusData{
		Activities: []*discordgo.Activity{
			{Name: bot.App.Config.BotName, Type: discordgo.ActivityTypeGame},
		},
		Status: "online",
	})
	if err != nil {
		return
	}

	if bot.App.Config.ReadyWebhook != "" && bot.App.Config.ReadyWebhook != "#" {
		embed := core.WebhookEmbed{
			Color:       0x00FF00,
			Title:       "🟢 Bot is Online!",
			Description: "**Bot:** " + s.State.User.Username + "\n**Status:** Online and Ready",
			Fields: []core.WebhookField{
				{Name: "🤖 Bot Info", Value: "**ID:** " + s.State.User.ID, Inline: true},
				{Name: "🏠 Servers", Value: fmt.Sprintf("%d servers", len(s.State.Guilds)), Inline: true},
			},
			Footer:    core.WebhookFooter{Text: bot.App.Config.BotName + " • System Logger"},
			Timestamp: "",
		}
		core.SendWebhook(bot.App.Config.ReadyWebhook, embed)
	}
}
