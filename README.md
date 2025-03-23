# Autocomplete API Documentation

## Base URL
```
http://35.200.185.69:8000
```

## Rate Limit
- **100 requests per minute** per client.
- If the limit is exceeded, the API returns a **429 Too Many Requests** error.

---

## Endpoints

### 1. Autocomplete v1
**Endpoint:**  
```
GET /v1/autocomplete?query=<string>
```
**Description:**  
- Accepts **only lowercase alphabetic characters (a-z)** in the `query` parameter.  
- Returns up to **10 matching results**.  

**Request Example:**  
```
GET /v1/autocomplete?query=aa
```
**Response Example (JSON):**  
```json
{
  "version": "v1",
  "count": 10,
  "results": [
    "aa", "aabdknlvkc", "aabrkcd", "aadgdqrwdy", "aagqg",
    "aaiha", "aainmxg", "aajfebume", "aajwv", "aakfubvxv"
  ]
}
```

---

### 2. Autocomplete v2
**Endpoint:**  
```
GET /v2/autocomplete?query=<string>
```
**Description:**  
- Accepts **only lowercase alphanumeric characters (a-z, 0-9)** in the `query` parameter.  
- Returns up to **12 matching results**.  

**Request Example:**  
```
GET /v2/autocomplete?query=a0
```
**Response Example (JSON):**  
```json
{
  "version": "v2",
  "count": 12,
  "results": [
    "a0", "a09p36zjy", "a0d2vhq3i", "a0ft3ec1tl", "a0lnv81gm",
    "a0pnt1", "a0qm", "a0twzs6", "a1nvj3fpg", "a1x1",
    "a2", "a2cqmcc7"
  ]
}
```

---

### 3. Autocomplete v3
**Endpoint:**  
```
GET /v3/autocomplete?query=<string>
```
**Description:**  
- Accepts **a wider range of characters**, including:  
  ```
  0 1 2 3 4 6 7 8 9 a c d e f g h i j k l m n o p q r s t u v w x y z + . - (space)
  ```
- Returns up to **15 matching results**.  

**Request Example:**  
```
GET /v3/autocomplete?query=a
```
**Response Example (JSON):**  
```json
{
  "version": "v3",
  "count": 15,
  "results": [
    "a", "a e+skbrns", "a ifs1.-", "a+woz7", "a-.",
    "a-g z", "a-m.ffwo", "a-o80", "a.", "a.-gowx3d",
    "a..rmw83", "a.1kh g", "a.2xf", "a.c", "a.gi3m"
  ]
}
```

---

## Error Handling

### 429 Too Many Requests
If the client exceeds **100 requests per minute**, the API returns a **429 error**.  

**Response Example:**  
```json
{
  "error": "Rate limit exceeded. Please try again later."
}
```

**Recommended Handling:**  
- Wait and retry after **1 minute**.  
- Check the `Retry-After` header (if provided) for the wait time.  
- Implement client-side rate limiting to avoid excessive requests.

