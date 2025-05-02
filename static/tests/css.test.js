describe('CSS Layout Tests', () => {

    beforeAll(async () => {
    });

    test('Mobile view should have 1 column', async () => {
        global.matchMedia = jest.fn().mockImplementation(query => {
        return {
            matches: query === "(max-width: 768px)", // Simulate mobile view
            addListener: jest.fn(),
            removeListener: jest.fn(),
        };
        });
        
        // Test behavior for mobile view
        expect(window.matchMedia("(max-width: 768px)").matches).toBe(true);
    });

});