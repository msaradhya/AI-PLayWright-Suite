/**
 * Slack Sender Utility
 * Base class for sending messages to Slack channels
 * Supports both webhook and Web API (bot token) methods
 */

import { ConfigManager } from '../../../config/ConfigManager';

/**
 * Slack message block structure
 */
export interface SlackMessageBlock {
    type: string;
    text?: string | { type: string; text: string; emoji?: boolean };
    elements?: Array<{ type: string; text: string }>;
    fields?: Array<{ type: string; text: string }>;
}

/**
 * Slack message attachment (for rich formatting)
 */
export interface SlackAttachment {
    color?: string;
    title?: string;
    text?: string;
    fields?: Array<{
        title: string;
        value: string;
        short?: boolean;
    }>;
    footer?: string;
    ts?: number;
}

/**
 * Slack message structure
 */
export interface SlackMessage {
    text: string;
    blocks?: SlackMessageBlock[];
    attachments?: SlackAttachment[];
    channel?: string;
    username?: string;
    icon_emoji?: string;
}

/**
 * Slack send response
 */
export interface SlackSendResponse {
    ok: boolean;
    channel?: string;
    error?: string;
    timestamp?: string;
}

/**
 * Base Slack Sender class
 * Provides core functionality for sending messages to Slack
 */
export class SlackSender {
    protected readonly messageTexts: Array<string> = [];
    protected readonly channels: Array<string> = [];
    private readonly configManager = ConfigManager.getInstance();

    constructor(...channels: Array<string>) {
        this.channels.push(...channels);
    }

    /**
     * Get webhook URL from environment
     */
    protected getWebhookUrl(): string | undefined {
        return process.env.SLACK_WEBHOOK_URL;
    }

    /**
     * Get bot token from environment
     */
    protected getBotToken(): string | undefined {
        return process.env.SLACK_BOT_BEARER_TOKEN || process.env.SLACK_BOT_TOKEN;
    }

    /**
     * Add message texts to be sent
     */
    addMessageTexts(...texts: Array<string>): void {
        this.messageTexts.push(...texts);
    }

    /**
     * Clear all message texts
     */
    clearMessages(): void {
        this.messageTexts.length = 0;
    }

    /**
     * Send message using webhook (simpler, recommended for notifications)
     */
    async sendViaWebhook(message?: SlackMessage): Promise<SlackSendResponse> {
        const webhookUrl = this.getWebhookUrl();
        
        if (!webhookUrl) {
            console.log('⚠ Slack webhook URL not configured');
            return { ok: false, error: 'SLACK_WEBHOOK_URL not configured' };
        }

        const payload = message || this.buildDefaultMessage();

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('✓ Slack message sent via webhook');
                return { ok: true };
            } else {
                const errorText = await response.text();
                console.error('✗ Slack webhook error:', response.status, errorText);
                return { ok: false, error: errorText };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('✗ Slack webhook exception:', errorMessage);
            return { ok: false, error: errorMessage };
        }
    }

    /**
     * Send message using Slack Web API (requires bot token)
     * Supports sending to multiple channels
     */
    async sendViaBotApi(message?: SlackMessage): Promise<SlackSendResponse[]> {
        const token = this.getBotToken();
        
        if (!token) {
            console.log('⚠ Slack bot token not configured');
            return [{ ok: false, error: 'SLACK_BOT_TOKEN not configured' }];
        }

        const payload = message || this.buildDefaultMessage();
        const responses: SlackSendResponse[] = [];

        for (const channel of this.channels) {
            try {
                const response = await fetch('https://slack.com/api/chat.postMessage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...payload,
                        channel
                    })
                });

                const data = await response.json() as any;
                
                if (data.ok) {
                    console.log(`✓ Slack message sent to ${channel}`);
                    responses.push({ ok: true, channel, timestamp: data.ts });
                } else {
                    console.error(`✗ Slack API error for ${channel}:`, data.error);
                    responses.push({ ok: false, channel, error: data.error });
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`✗ Slack exception for ${channel}:`, errorMessage);
                responses.push({ ok: false, channel, error: errorMessage });
            }
        }

        return responses;
    }

    /**
     * Send using the best available method (webhook preferred for simplicity)
     */
    async send(message?: SlackMessage): Promise<SlackSendResponse | SlackSendResponse[]> {
        const webhookUrl = this.getWebhookUrl();
        const botToken = this.getBotToken();

        if (webhookUrl) {
            return this.sendViaWebhook(message);
        } else if (botToken && this.channels.length > 0) {
            return this.sendViaBotApi(message);
        } else {
            console.log('⚠ No Slack configuration available (set SLACK_WEBHOOK_URL or SLACK_BOT_TOKEN)');
            return { ok: false, error: 'No Slack configuration available' };
        }
    }

    /**
     * Build default message from added texts
     */
    protected buildDefaultMessage(): SlackMessage {
        const blocks: SlackMessageBlock[] = this.messageTexts.map(text => ({
            type: 'section',
            text: { type: 'mrkdwn', text }
        }));

        return {
            text: this.messageTexts[0] || 'Test Report',
            blocks
        };
    }

    /**
     * Create a simple text message
     */
    static createTextMessage(text: string): SlackMessage {
        return {
            text,
            blocks: [
                {
                    type: 'section',
                    text: { type: 'mrkdwn', text }
                }
            ]
        };
    }

    /**
     * Create a message with header
     */
    static createHeaderMessage(header: string, body: string): SlackMessage {
        return {
            text: header,
            blocks: [
                {
                    type: 'header',
                    text: { type: 'plain_text', text: header, emoji: true }
                },
                {
                    type: 'section',
                    text: { type: 'mrkdwn', text: body }
                }
            ]
        };
    }

    /**
     * Create a message with fields (key-value pairs)
     */
    static createFieldsMessage(header: string, fields: Array<{ label: string; value: string }>): SlackMessage {
        const fieldBlocks = fields.map(f => ({
            type: 'mrkdwn',
            text: `*${f.label}:* ${f.value}`
        }));

        return {
            text: header,
            blocks: [
                {
                    type: 'header',
                    text: { type: 'plain_text', text: header, emoji: true }
                },
                {
                    type: 'section',
                    fields: fieldBlocks
                }
            ]
        };
    }
}