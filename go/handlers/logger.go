package handlers

import (
	"fmt"
	"time"

	"github.com/fatih/color"
)

type StartupData struct {
	Name         string
	SlashCount   int
	PrefixCount  int
	EventsCount  int
	ModelsCount  int
	MongoStatus  bool
}

func StartupReport(data StartupData) {
	fmt.Println()
	color.Cyan("╔══════════════════════════════════╗")
	color.Cyan("║     Discord Handler - Go         ║")
	color.Cyan("╚══════════════════════════════════╝")
	fmt.Println()

	lines := []struct {
		label string
		ok    bool
	}{
		{fmt.Sprintf("Slash Commands: %d", data.SlashCount), true},
		{fmt.Sprintf("Prefix Commands: %d", data.PrefixCount), true},
		{fmt.Sprintf("Events Loaded: %d", data.EventsCount), true},
		{fmt.Sprintf("Models Loaded: %d", data.ModelsCount), true},
		{"AntiCrash: Active", true},
		{fmt.Sprintf("MongoDB: Connected = %v", data.MongoStatus), data.MongoStatus},
	}

	for _, l := range lines {
		if l.ok {
			color.Green("  ✅ %s", l.label)
		} else {
			color.Red("  ❌ %s", l.label)
		}
	}

	fmt.Println()
	color.Magenta("[ %s ] Bot is now online and fully operational.", time.Now().Format("02/01/2006 15:04:05"))
}
