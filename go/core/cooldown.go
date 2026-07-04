package core

import (
	"sync"
	"time"
)

type CooldownEntry struct {
	expiresAt time.Time
}

type CooldownManager struct {
	mu     sync.Mutex
	cooldowns map[string]map[string]*CooldownEntry
}

var Cooldowns = &CooldownManager{
	cooldowns: make(map[string]map[string]*CooldownEntry),
}

func (cm *CooldownManager) Check(userID, command string, cooldownMs int) (bool, int) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	if _, ok := cm.cooldowns[command]; !ok {
		cm.cooldowns[command] = make(map[string]*CooldownEntry)
	}

	entry, exists := cm.cooldowns[command][userID]
	now := time.Now()

	if exists && now.Before(entry.expiresAt) {
		remaining := int(entry.expiresAt.Sub(now).Seconds())
		return true, remaining
	}

	cm.cooldowns[command][userID] = &CooldownEntry{
		expiresAt: now.Add(time.Duration(cooldownMs) * time.Millisecond),
	}

	go func() {
		time.Sleep(time.Duration(cooldownMs) * time.Millisecond)
		cm.mu.Lock()
		delete(cm.cooldowns[command], userID)
		cm.mu.Unlock()
	}()

	return false, 0
}
