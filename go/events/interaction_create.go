package events

import (
	"fmt"

	"github.com/RealMtrx/Discord-Handler-Go/bot"
	"github.com/RealMtrx/Discord-Handler-Go/core"
	"github.com/bwmarrin/discordgo"
)

func InteractionCreate(s *discordgo.Session, i *discordgo.InteractionCreate) {
	if i.Type != discordgo.InteractionApplicationCommand {
		return
	}

	data := i.ApplicationCommandData()
	cmd, exists := bot.App.SlashCommands[data.Name]
	if !exists {
		return
	}

	userID := ""
	if i.Member != nil && i.Member.User != nil {
		userID = i.Member.User.ID
	} else if i.User != nil {
		userID = i.User.ID
	} else {
		return
	}

	onCooldown, remaining := core.Cooldowns.Check(userID, data.Name, 3000)
	if onCooldown {
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Content: "⏰ Please wait " + fmt.Sprintf("%d", remaining) + " seconds before using this command again.",
				Flags:   1 << 6,
			},
		})
		return
	}

	cmd.Handler(s, i)
}
