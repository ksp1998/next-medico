export { default } from 'next-auth/middleware'

export const config = {
    matcher: [
        '/((?!api|login|setup|forgot-password|images).*)',
    ]
}