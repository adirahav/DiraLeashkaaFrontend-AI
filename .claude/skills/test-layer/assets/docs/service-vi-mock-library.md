---
name: service-api-mock-library
description: Mandatory reference for Frontend Service tests (.service.test.js). Focuses on API logic: 1. Axios request/response interception. 2. Endpoint URL validation. 3. Payload mapping. 4. HTTP Error status handling (400, 401, 500).
allowed_model: gemini-3-flash
allowed-tools: read_file, list_dir
---

# Frontend Service & API Test Standards

**Execution Rules for AI**
1. *Network Focus:* Service tests must verify the correct endpoint, method (GET/POST), and payload structure.
2. *Axios Mocking:* Always use the `mockAxios` patterns defined in the Global Infrastructure.
3. *Async Responses:* Always use `Promise.resolve()` or `Promise.reject()` to simulate network latency and responses.
4. *Data Integrity:* Verify that the service correctly maps the backend response to the frontend model.

## Request Assertion Strategy

**Verifying Payloads**
- Use `expect(axios.post).toHaveBeenCalledWith(url, payload, config)` to ensure the Service sends the correct data.
- For dynamic URLs (IDs in path), use template literal matching or `expect.stringContaining()`.

**Example:**
```javascript
it('should call create endpoint with correct data', async () => {
    const payload = { title: 'Test' };
    await MyService.create(payload);
    
    expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/resource'),
        expect.objectContaining(payload),
        expect.any(Object) // Headers/Config
    );
});
```

## Error Handling & Status Codes
Simulating Server Errors
- To test how the service reacts to failures, mock a rejected promise with a specific Axios error structure.

```JavaScript
it('should handle 400 Bad Request', async () => {
    const errorResponse = {
        response: {
            status: 400,
            data: { errorCode: 'INVALID_DATA' }
        }
    };
    vi.mocked(axios.post).mockRejectedValue(errorResponse);

    await expect(MyService.submit()).rejects.toMatchObject({
        errorCode: 'INVALID_DATA'
    });
});
```

## Environment & Configuration

**Endpoint Construction**

- Verify that the service uses the correct base URL from the environment configuration.

- Rule: Ensure Common/environments/environment is mocked correctly (refer to Global Infrastructure).

**Headers & Auth**
- If the service adds specific headers (e.g., Content-Type: multipart/form-data), verify them in the config argument of the Axios call.

**Transformation Logic**
Response Mapping
- If the Service transforms data (e.g., converting Snake_Case from DB to CamelCase for UI), the test MUST verify the output:
```JavaScript
it('should transform backend date to local format', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { created_at: '2023-01-01' } });
    const result = await MyService.getById(1);
    expect(result.createdAt).toBe('2023-01-01'); // CamelCase check
});
```