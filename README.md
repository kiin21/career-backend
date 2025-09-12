# Combine filters: Location + Salary + Company

```bash
curl -X GET "http://localhost:3000/api/v1/jobs" \
  -G \
  --data-urlencode 'filters={"location":["Ho Chi Minh City","Hanoi"],"salary":{"min":800a00,"max":120000000},"company":{"ids":[1, 2, 3, 4, 5]}}' \
  --data-urlencode 'sort=[{"orderBy":"created_at","order":"DESC"}]' \
  --data-urlencode 'search=soft' \
  --data-urlencode 'page=1' \
  --data-urlencode 'limit=20' \
  -H "Content-Type: application/json"
```


curl -X POST "https://7560ee5a436c.ngrok-free.app/api/v1/jobs?page=1&limit=20" \
  -H "Content-Type: application/json" \
  -H "x-request-id: $(uuidgen)" \
  -d '{
    "search": "software engineer",
    "location": ["Ho Chi Minh City", "Hanoi"],
    "salary": {
      "min": 800000,
      "max": 120000000
    },
    "company": {
      "ids": [1, 2, 3, 4, 5]
    },
    "sort": [
      {
        "orderBy": "created_at",
        "order": "DESC"
      }
    ]
  }'


curl "https://7560ee5a436c.ngrok-free.app/api/v1/jobs/1" 