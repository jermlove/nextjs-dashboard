
import { betterAuth } from 'better-auth';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { passkey } from '@better-auth/passkey';
import { nextCookies } from 'better-auth/next-js';
import * as schema from './auth-schema';
import { createAuthMiddleware } from 'better-auth/api';
import { logWithContext, shallowLog } from './app/lib/utils';


// Set up Neon client and Drizzle ORM for Neon
const sql = neon(process.env.POSTGRES_URL!);
const db = drizzle({client: sql});

export const auth = betterAuth({
    // Optionally: appName: 'Next.js Dashboard',
    // baseURL and secret are read from env by default
    database: drizzleAdapter(
        db, { 
            provider: 'pg', // Use 'neon' to clarify intent, but 'postgresql' is also valid
            schema, // Pass the schema object directly
        }        
    ),
    // databaseHooks: {    // Optional hooks for database operations, useful for logging, analytics, etc.
    //     verification: {
    //         create: {
    //             before: async ({ data, request }) => {
    //                 const context = "databaseHooks.verification.create.before";
    //                 logWithContext(context, "Creating verification record. Data:", shallowLog(data));
    //                 logWithContext(context, "Creating verification request details:", shallowLog(request));
    //                 // You can modify the data here if needed before it's inserted into the database                    
    //             },
    //             after: async ({ data, request }) => {
    //                 const context = "databaseHooks.verification.create.after";      
    //                 logWithContext(context, "Created verification record:", shallowLog(data));
    //                 logWithContext(context, "Created verification request details:", shallowLog(request));
    //                 // You can perform actions here after the record has been created, such as sending an email 
    //             },               
    //         },
    //         update: {
    //             before: async ({ data, request }) => {
    //                 const context = "databaseHooks.verification.update.before";
    //                 logWithContext(context, "Updating verification record:", shallowLog(data));
    //                 logWithContext(context, "Updating verification request details:", shallowLog(request));
    //                 // You can modify the data here if needed before it's updated in the database                    
    //             },
    //             after: async ({ data, request }) => {
    //                 const context = "databaseHooks.verification.update.after";
    //                 logWithContext(context, "Updated verification record:", shallowLog(data));
    //                 logWithContext(context, "Updated verification request details:", shallowLog(request));                        
    //                 // You can perform actions here after the record has been updated
    //             }
    //         },
    //         delete: {
    //             before: async ({ data, request }) => {
    //                 const context = "databaseHooks.verification.delete.before";
    //                 logWithContext(context, "Deleting verification record:", shallowLog(data)); 
    //                 logWithContext(context, "Deleting verification request details:", shallowLog(request));
    //             },
    //             after: async ({ data, request }) => {
    //                 const context = "databaseHooks.verification.delete.after";
    //                 logWithContext(context, "Deleted verification record:", shallowLog(data));
    //                 logWithContext(context, "Deleted verification request details:", shallowLog(request));
    //             }
    //         }            
    //     }
    // },
    emailAndPassword: {
        enabled: true,
        async sendResetPassword(data, request) {
            // Send an email to the user with a link to reset their password
        },
    },
    socialProviders: {
        // google: {
        //     clientId: process.env.GOOGLE_CLIENT_ID!,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        // },
        // linkedin: {
        //     clientId: process.env.LINKEDIN_CLIENT_ID!,
        //     clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
        // },
        microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID!,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,            
            authority: process.env.MICROSOFT_AUTHORITY!, // e.g., "https://login.microsoftonline.com/{tenantId}"
            tenantId: process.env.MICROSOFT_TENANT_ID!, // e.g., "4273f212-1e06-4eaf-9f4e-5aeb44a891f1"
            // scope: ["openid", "profile", "email", "User.Read", "offline_access"], // Adjust scopes as needed
            mapProfileToUser: (profile) => {
                logWithContext("betterAuth.microsoft.mapProfileToUser", "Mapping Microsoft CIAM profile to user object:", profile);
                return {
                    id: profile.oid, // Use the 'oid' claim as the unique identifier for the user
                    name: profile.name,
                    firstName: profile.given_name,
                    lastName: profile.family_name,
                    email: profile.email || profile.preferred_username, // Microsoft may return email in different fields depending on the account type
                    picture: profile.picture,
                };
            }
        },
    },
    hooks: { // Optional hooks for auth operations, useful for logging, analytics, etc.
        before: createAuthMiddleware(async (ctx) => {
            // Execute before processing the request
            const debugInfo = {
                method: ctx.method,
                path: ctx.path,
                id: ctx.params.id,
                query : ctx.query,   
                headers: ctx.headers, // Log request headers (will be masked by shallowLog)
                // profile: ctx.context?.profile, // This will show the user profile data that was retrieved or created during the auth operation                          
            }
            const context = "authHooks.before";
            logWithContext(context, "Auth operation started. Debug info:", debugInfo);            
        }),
        after: createAuthMiddleware(async (ctx) => {
			// Execute after processing the request            
            const context = "authHooks.after";
            if (ctx.path.includes("/callback/")) {
                const session = ctx.context.newSession;
                if (session) {
                    // session.user contains profile info mapped by Better Auth
                    logWithContext(context, "User from Microsoft CIAM:", shallowLog(session.user));
                }
            }
            const returned = ctx.context.returned;
			logWithContext(context, "Auth operation completed. Response:", shallowLog(returned));
		})
    },
    // logger: { // Optional custom logger, you can integrate with any logging library or service
    //     disabled: false,
    //     disableColors: false,
    //     level: 'debug',
    //     log: (level, message, ...args) => // Custom logging implementation
	// 		console.log(`[${level}] ${message}`, ...args),        
    // },
    plugins: [
        // magicLink({
        //     async sendMagicLink({ email, url }) {
        //         // TODO: Implement email sending logic here
        //         // e.g., use nodemailer, resend, or any transactional email provider
        //         // await sendEmail({ to: email, subject: 'Sign in', html: `<a href="${url}">Sign in</a>` });
        //     },
        // }),
        passkey(),
        nextCookies(),
    ],
    // Optionally: session, hooks, advanced, etc. per best practices
});