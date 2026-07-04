package handlers

import (
	"github.com/RealMtrx/Discord-Handler-Go/bot"
	"github.com/fatih/color"
)

func LoadPrefixCommands(b *bot.Bot) int {
	count := len(b.PrefixCommands)
	if count == 0 {
		color.Yellow("[Prefix] No commands found")
	}
	color.Green("[Prefix] %d commands loaded", count)
	return count
}
