package handlers

import "github.com/fatih/color"

func LoadModels() int {
	// Go models are imported and registered at compile time,
	// so we just report they're available.
	count := 1
	color.Green("[Models] %d model loaded", count)
	return count
}
