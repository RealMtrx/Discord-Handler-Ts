package core

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type WebhookEmbed struct {
	Title       string              `json:"title"`
	Description string              `json:"description"`
	Color       int                 `json:"color"`
	Fields      []WebhookField      `json:"fields"`
	Footer      WebhookFooter       `json:"footer"`
	Timestamp   string              `json:"timestamp"`
	Thumbnail   *WebhookThumbnail   `json:"thumbnail,omitempty"`
}

type WebhookField struct {
	Name   string `json:"name"`
	Value  string `json:"value"`
	Inline bool   `json:"inline"`
}

type WebhookFooter struct {
	Text string `json:"text"`
}

type WebhookThumbnail struct {
	URL string `json:"url"`
}

type WebhookPayload struct {
	Embeds []WebhookEmbed `json:"embeds"`
}

func SendWebhook(url string, embed WebhookEmbed) error {
	if url == "" || url == "#" {
		return nil
	}

	payload := WebhookPayload{Embeds: []WebhookEmbed{embed}}
	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(data))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("webhook returned status %d", resp.StatusCode)
	}
	return nil
}
