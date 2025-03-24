# Autocomplete API & Crawler Documentation

## Base URL
`http://35.200.185.69:8000`

## Rate Limit
- **100 requests/min** per client
- Exceeding the limit returns **429 Too Many Requests**

## API Endpoints

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
  - Wait & retry after **1 minute**
  - Implement client-side rate limiting

## Crawler Implementation
This project implements a recursive autocomplete crawler for all three API versions, systematically exploring possible prefixes and storing retrieved results.

### **Approach**
1. **Recursive Query Expansion**:
   - Start with an initial prefix.
   - Fetch autocomplete results and store them.
   - If the response contains fewer than the max allowed results, stop expanding.
   - Otherwise, take the last word from results and expand the prefix further.

2. **Lexicographic Traversal**:
   - Generate new prefixes by appending allowed characters.
   - Avoid revisiting prefixes using a `visited` set.

3. **Rate Limiting Handling**:
   - Introduce a **600ms delay** between requests.
   - Handle `429 Too Many Requests` errors gracefully.
   - Proxy rotation could be used to avoid rate limits, but the ones tested were too slow for practical use.

4. **File Storage**:
   - Results are appended to `results.txt`.
   - A summary with total requests made is saved.

## Findings
- **Request & Word Count Summary**:
  - **v1**: **32,447** requests, **18,632** words found.
  - **v2**: **8,634** requests, **13,730** words found.
  - **v3**: **5,549** requests, **2,428** words found.
- The selection of the last word for further expansion avoids unnecessary branching.
- Adaptive delay or batch processing may improve efficiency.

## Potential Improvements
- **Parallelization**: Introduce concurrent API calls while respecting rate limits.
- **Optimized Prefix Expansion**: Use a priority queue to explore promising prefixes first.
- **Dynamic Delay Adjustment**: Adjust delay based on observed `429` responses.

