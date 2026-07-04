package public

import (
	"fmt"
	"net/http"
	"time"

	"github.com/RealMtrx/Discord-Handler-Go/bot"
	"github.com/bwmarrin/discordgo"
)

func RegisterSlashPing(b *bot.Bot) {
	b.SlashCommands["ping"] = &bot.SlashCommand{
		Data: &discordgo.ApplicationCommand{
			Name:        "ping",
			Description: "Show bot latency and API response times",
		},
		Handler: func(s *discordgo.Session, i *discordgo.InteractionCreate) {
			start := time.Now()

			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseDeferredChannelMessageWithSource,
			})

			restStart := time.Now()
			client := &http.Client{Timeout: 5 * time.Second}
			client.Get("https://discord.com/api/v10/users/@me")
			restEnd := time.Now()

			botLatency := time.Since(start).Milliseconds()
			wsLatency := s.HeartbeatLatency().Milliseconds()
			restLatency := restEnd.Sub(restStart).Milliseconds()

			embed := &discordgo.MessageEmbed{
				Title: "🏓 Pong!",
				Color: 0x00FF00,
				Fields: []*discordgo.MessageEmbedField{
					{Name: "🤖 Bot Latency", Value: fmt.Sprintf("`%dms`", botLatency), Inline: true},
					{Name: "📡 WebSocket Latency", Value: fmt.Sprintf("`%dms`", wsLatency), Inline: true},
					{Name: "🌐 REST API Latency", Value: fmt.Sprintf("`%dms`", restLatency), Inline: true},
				},
				Timestamp: time.Now().Format(time.RFC3339),
			}

			s.InteractionResponseEdit(i.Interaction, &discordgo.WebhookEdit{
				Embeds: &[]*discordgo.MessageEmbed{embed},
			})
		},
	}
}
