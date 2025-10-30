import Database from '../db';
import { env } from './env';
import logger from './logger';

interface RedditTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
}

interface RedditMeResponse {
    name: string;
    id: string;
    icon_img: string;
    created_utc: number;
    link_karma: number;
    comment_karma: number;
}

export class RedditApiClient {
    private userId: string;
    private db: Database;
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private accessTokenExpiresAt: Date | null = null;
    private accountId: string | null = null;

    constructor(userId: string, db: Database) {
        this.userId = userId;
        this.db = db;
    }

    async initialize() {
        // Fetch the user's Reddit account from the database
        const accounts = await this.db.accounts.getByUserIdAndProvider(
            this.userId,
            'reddit',
        );

        if (!accounts.length) {
            throw new Error('No Reddit account found for user');
        }

        const account = accounts[0];
        this.accountId = account.id;
        this.accessToken = account.accessToken;
        this.refreshToken = account.refreshToken;
        this.accessTokenExpiresAt = account.accessTokenExpiresAt;

        logger.info(
            `Initialized Reddit API client for user ${this.userId}, token expires at ${this.accessTokenExpiresAt}`,
        );
    }

    private async refreshAccessToken(): Promise<void> {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }

        logger.info(`Refreshing Reddit access token for user ${this.userId}`);

        const auth = Buffer.from(
            `${env!.REDDIT_CLIENT_ID}:${env!.REDDIT_CLIENT_SECRET}`,
        ).toString('base64');

        const response = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'nnn-api/1.0.0',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: this.refreshToken,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            logger.error(
                `Failed to refresh Reddit token: ${response.status} ${errorText}`,
            );
            throw new Error(`Failed to refresh token: ${response.status}`);
        }

        const data = (await response.json()) as RedditTokenResponse;

        // Update tokens
        this.accessToken = data.access_token;
        this.accessTokenExpiresAt = new Date(
            Date.now() + data.expires_in * 1000,
        );

        // Reddit may or may not return a new refresh token
        if (data.refresh_token) {
            this.refreshToken = data.refresh_token;
        }

        // Update tokens in the database
        if (this.accountId) {
            await this.db.accounts.updateTokens(this.accountId, {
                accessToken: this.accessToken,
                refreshToken: this.refreshToken || undefined,
                accessTokenExpiresAt: this.accessTokenExpiresAt,
            });

            logger.info(
                `Successfully refreshed and saved Reddit token for user ${this.userId}`,
            );
        }
    }

    private async ensureValidToken(): Promise<void> {
        // Check if token is expired or about to expire (within 5 minutes)
        const now = new Date();
        const expiryThreshold = new Date(now.getTime() + 5 * 60 * 1000);

        if (
            !this.accessToken ||
            !this.accessTokenExpiresAt ||
            this.accessTokenExpiresAt <= expiryThreshold
        ) {
            logger.info('Access token expired or about to expire, refreshing...');
            await this.refreshAccessToken();
        }
    }

    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {},
    ): Promise<T> {
        await this.ensureValidToken();

        const url = `https://oauth.reddit.com${endpoint}`;
        const headers = {
            Authorization: `Bearer ${this.accessToken}`,
            'User-Agent': 'nnn-api/1.0.0',
            ...options.headers,
        };

        logger.info(`Making Reddit API request to ${endpoint}`);

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            logger.error(
                `Reddit API request failed: ${response.status} ${errorText}`,
            );
            throw new Error(`Reddit API request failed: ${response.status}`);
        }

        return response.json() as Promise<T>;
    }

    async getMe(): Promise<RedditMeResponse> {
        return this.makeRequest<RedditMeResponse>('/api/v1/me');
    }
}

export async function createRedditClient(
    userId: string,
    db: Database,
): Promise<RedditApiClient> {
    const client = new RedditApiClient(userId, db);
    await client.initialize();
    return client;
}
