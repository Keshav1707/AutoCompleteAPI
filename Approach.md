# Autocomplete API Crawler Documentation

## Overview
This project implements a recursive autocomplete crawler for three API versions (`v1`, `v2`, and `v3`). It systematically explores possible prefixes and stores the retrieved results.

## API Details
- **v1**: Supports only lowercase alphabets (`a-z`), returns at most **10** results.
- **v2**: Supports lowercase alphabets (`a-z`) and digits (`0-9`), returns at most **12** results.
- **v3**: Supports `0-9, a-z, +, ., -, (space)`, returns at most **15** results.
- **Rate Limit**: **100 requests per minute** (exceeding this returns `429 Too Many Requests`).

## Approach
1. **Recursive Query Expansion**: 
   - Start with a prefix (initially empty or "a").
   - Fetch autocomplete results and store them.
   - If the response contains fewer than the max allowed results, stop expanding.
   - Otherwise, take the last word from results and expand the prefix further.

2. **Lexicographic Traversal**:
   - Generate new prefixes by appending allowed characters.
   - Avoid revisiting prefixes using a `visited` set.

3. **Rate Limiting Handling**:
   - Introduce a **600ms delay** between requests to avoid exceeding the limit.
   - Handle `429 Too Many Requests` errors gracefully.
   - Proxy rotation can be used to evade rate limits, but the proxies tested were too slow for practical use.

4. **File Storage**:
   - Results are appended to `results.txt`.
   - A final summary with total requests made is saved.

## Findings
- **Request & Word Count Summary**:
  - **v1**: **32,447** requests, **18,632** words found.
  - **v2**: **8,634** requests, **13,730** words found.
  - **v3**: **5,549** requests, **2,428** words found.
- The approach ensures systematic exploration without redundant requests.
- API rate limiting is a constraint; an adaptive delay or batch processing may improve efficiency.
- The selection of the last word for further expansion is an effective way to avoid unnecessary branching.
- Proxy rotation was considered but was found to be impractical due to slow proxy speeds.

## Potential Improvements
- **Parallelization**: Introduce concurrent API calls while respecting rate limits.
- **Optimized Prefix Expansion**: Use a priority queue to explore promising prefixes first.
- **Dynamic Delay Adjustment**: Adjust delay based on observed `429` responses.
