package bot

import (
	"github.com/RealMtrx/Discord-Handler-Go/config"
	"github.com/bwmarrin/discordgo"
)

type SlashCommand struct {
	Data    *discordgo.ApplicationCommand
	Handler func(s *discordgo.Session, i *discordgo.InteractionCreate)
}

type PrefixCommand struct {
	Name    string
	Handler func(s *discordgo.Session, m *discordgo.MessageCreate, args []string)
}

type Bot struct {
	Session        *discordgo.Session
	Config         *config.Config
	SlashCommands  map[string]*SlashCommand
	PrefixCommands map[string]*PrefixCommand
}

var App *Bot

func New(cfg *config.Config) *Bot {
	App = &Bot{
		Config:         cfg,
		SlashCommands:  make(map[string]*SlashCommand),
		PrefixCommands: make(map[string]*PrefixCommand),
	}
	return App
}

func (b *Bot) Start() error {
	session, err := discordgo.New("Bot " + b.Config.Token)
	if err != nil {
		return err
	}

	session.Identify.Intents = discordgo.IntentsGuilds |
		discordgo.IntentsGuildMessages |
		discordgo.IntentsMessageContent

	b.Session = session
	return session.Open()
}
