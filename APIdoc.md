# Autocomplete API Documentation

## Base URL
`http://35.200.185.69:8000`

## Rate Limit
- **100 requests/min** per client
- Exceeding limit returns **429 Too Many Requests**

## Endpoints

### **v1: Alphabetic Autocomplete**
**`GET /v1/autocomplete?query=<string>`**
- Input: Lowercase letters (`a-z`)
- Max results: **10**

#### Example Response:
```json
{
  "version": "v1",
  "count": 10,
  "results": ["aa", "aabdknlvkc", "aabrkcd", "aadgdqrwdy", "aagqg"]
}
```

### **v2: Alphanumeric Autocomplete**
**`GET /v2/autocomplete?query=<string>`**
- Input: Lowercase letters (`a-z`) & digits (`0-9`)
- Max results: **12**

#### Example Response:
```json
{
  "version": "v2",
  "count": 12,
  "results": ["a0", "a09p36zjy", "a0d2vhq3i", "a0ft3ec1tl"]
}
```

### **v3: Extended Autocomplete**
**`GET /v3/autocomplete?query=<string>`**
- Input: `0-9 a-z + . - (space)`
- Max results: **15**

#### Example Response:
```json
{
  "version": "v3",
  "count": 15,
  "results": ["a", "a e+skbrns", "a ifs1.-", "a+woz7"]
}
```

## Error Handling
### **429 Too Many Requests**
- Exceeding 100 requests/min results in:
```json
{
  "error": "Rate limit exceeded. Please try again later."
}
```
- Suggested Handling:
  - Wait & retry after **1 minute** in case of network failure
  - Implement client-side rate limiting

