module.exports = {
    mongoose: process.env.MONGO_URL,
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV,
    host: process.env.HOST,
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    },
    jwtSecret: process.env.JWT_SECRET,
}