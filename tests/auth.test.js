const request = require('supertest');
const app = require('../server'); // Import Express app
const pool = require('../db'); // Import PostgreSQL connection

describe('Authentication Routes', () => {
    let token;

    // ✅ Runs before tests start (set up database state)
    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        try {
            await pool.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
        } catch (err) {
            console.error('Error setting up test database:', err);
        }
    });

    // ✅ TESTS
    it('should successfully sign up a user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('username', 'testuser');
        expect(res.body).toHaveProperty('email', 'test@example.com');
    });

    it('should log in the user and return a token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');

        token = res.body.token;
    });

    it('should allow access to a protected route with a valid token', async () => {
        const res = await request(app)
            .get('/api/protected')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Welcome to the protected route!');
    });

    it('should deny access to a protected route without a token', async () => {
        const res = await request(app)
            .get('/api/protected');

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Access denied. No token provided.');
    });

    afterAll(async () => {
        console.log("🔄 Closing PostgreSQL connection...");
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to ensure queries finish
        await pool.end();
        console.log("✅ PostgreSQL connection closed.");
    });
    
});
