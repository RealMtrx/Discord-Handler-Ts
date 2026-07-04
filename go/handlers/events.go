package handlers

import (
	"github.com/RealMtrx/Discord-Handler-Go/bot"
	"github.com/RealMtrx/Discord-Handler-Go/events"
	"github.com/fatih/color"
)

func RegisterEvents(b *bot.Bot) int {
	b.Session.AddHandler(events.Ready)
	b.Session.AddHandler(events.InteractionCreate)
	b.Session.AddHandler(events.MessageCreate)
	b.Session.AddHandler(events.GuildCreate)
	b.Session.AddHandler(events.GuildDelete)

	count := 5
	color.Green("[Events] %d events loaded", count)
	return count
}
