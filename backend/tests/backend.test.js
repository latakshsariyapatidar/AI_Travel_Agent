import { jest } from '@jest/globals';
import request from 'supertest';

// Mock dependencies
jest.unstable_mockModule('../services/gemini.service.js', () => ({
    callGemini: jest.fn().mockResolvedValue({
        reply: "Mock reply",
        extractedFields: { destination: "Paris" }
    }),
    generateHistorySummary: jest.fn().mockResolvedValue("Mock summary")
}));

const mockLeadChain = {
    sort: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue([{ _id: "123", customer: { name: 'Test User' } }])
};

jest.unstable_mockModule('../models/Lead.model.js', () => ({
    Lead: {
        find: jest.fn().mockReturnValue(mockLeadChain),
        findOneAndUpdate: jest.fn().mockResolvedValue({}),
        findOne: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: "123" }) })
    }
}));

jest.unstable_mockModule('../models/LeadDraft.model.js', () => ({
    LeadDraft: {
        findOneAndUpdate: jest.fn().mockResolvedValue({}),
        findOne: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: "draft_123" }) })
    }
}));

jest.unstable_mockModule('../models/Conversation.model.js', () => ({
    Conversation: {
        findOneAndUpdate: jest.fn().mockResolvedValue({}),
    }
}));

// Need to dynamically import app after mocking
const { default: app } = await import('../app.js');
const { calculateScore } = await import('../services/score.service.js');

describe('Backend Tests', () => {

    describe('GET /health', () => {
        it('should return health status', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('success');
        });
    });

    describe('score.service.js', () => {
        it('should calculate score correctly for partial data', () => {
            const fields = { destination: 'Bali', travellers: 2 };
            const result = calculateScore(fields);
            expect(result.leadScore).toBe(30);
            expect(result.confidence).toBe('Low');
            expect(result.leadReady).toBe(false);
        });
        
        it('should set leadReady when qualified and contact info present', () => {
             const fields = { destination: 'Bali', travelDate: 'December', travellers: 2, budget: '100k', name: 'John', phone: '12345' };
             const result = calculateScore(fields);
             expect(result.leadScore).toBe(75);
             expect(result.leadReady).toBe(true);
        });
    });

    describe('POST /api/chat', () => {
        it('should process chat message and return response', async () => {
            const payload = {
                conversationId: 'test_conv_1',
                userMessage: 'I want to go to Paris',
                messages: []
            };

            const res = await request(app).post('/api/chat').send(payload);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.reply).toBe('Mock reply');
            expect(res.body.extractedFields.destination).toBe('Paris');
            expect(res.body.qualification.leadScore).toBe(20); 
        });

        it('should return 400 if missing fields', async () => {
            const res = await request(app).post('/api/chat').send({});
            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/leads', () => {
        it('should return list of leads', async () => {
            const res = await request(app).get('/api/leads');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.leads)).toBe(true);
            expect(res.body.leads[0].customer.name).toBe('Test User');
        });
    });
});
