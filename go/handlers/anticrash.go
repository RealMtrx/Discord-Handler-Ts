package handlers

import (
	"fmt"
	"log"
	"os"
	"runtime/debug"

	"github.com/fatih/color"
)

func SetupAntiCrash() {
	log.SetOutput(os.Stdout)
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	defer func() {
		if r := recover(); r != nil {
			color.Red("[AntiCrash] Panic recovered: %v\n%s", r, debug.Stack())
		}
	}()

	color.Green("[AntiCrash] Active")
}

func RecoverPanic() {
	if r := recover(); r != nil {
		color.Red("[AntiCrash] Panic: %v\n%s", r, debug.Stack())
		fmt.Println("[AntiCrash] Attempting to continue...")
	}
}
