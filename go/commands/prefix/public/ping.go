package public

import (
	"fmt"
	"net/http"
	"time"

	"github.com/RealMtrx/Discord-Handler-Go/bot"
	"github.com/bwmarrin/discordgo"
)

func RegisterPrefixPing(b *bot.Bot) {
	b.PrefixCommands["ping"] = &bot.PrefixCommand{
		Name: "ping",
		Handler: func(s *discordgo.Session, m *discordgo.MessageCreate, args []string) {
			sent, _ := s.ChannelMessageSend(m.ChannelID, "⏳ Loading...")

			restStart := time.Now()
			client := &http.Client{Timeout: 5 * time.Second}
			client.Get("https://discord.com/api/v10/users/@me")
			restEnd := time.Now()

			botLatency := sent.Timestamp.Sub(m.Timestamp).Milliseconds()
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

			s.ChannelMessageEditEmbed(m.ChannelID, sent.ID, embed)
		},
	}
}
