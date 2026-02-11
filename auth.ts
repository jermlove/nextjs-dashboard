
import { betterAuth } from 'better-auth';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink } from 'better-auth/plugins/magic-link';
import { passkey } from '@better-auth/passkey';
import { nextCookies } from 'better-auth/next-js';


// Set up Neon client and Drizzle ORM for Neon
const sql = neon(process.env.POSTGRES_URL!);
const db = drizzle({client: sql});

export const auth = betterAuth({
    // Optionally: appName: 'Next.js Dashboard',
    // baseURL and secret are read from env by default
    database: drizzleAdapter(
        db, { 
            provider: 'pg', // Use 'neon' to clarify intent, but 'postgresql' is also valid
        }        
    ),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        linkedin: {
            clientId: process.env.LINKEDIN_CLIENT_ID!,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
        },
        microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID!,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
        },
    },
    plugins: [
        magicLink({
            async sendMagicLink({ email, url }) {
                // TODO: Implement email sending logic here
                // e.g., use nodemailer, resend, or any transactional email provider
                // await sendEmail({ to: email, subject: 'Sign in', html: `<a href="${url}">Sign in</a>` });
            },
        }),
        passkey(),
        nextCookies(),
    ],
    // Optionally: session, hooks, advanced, etc. per best practices
});