# HandLend Backend

FastAPI + SQLite backend for the HandLend humanitarian funding platform.

## Requirements

- Python 3.11+

## Setup & Run

```bash
# 1. Navigate to this directory
cd apps/backend

# 2. Create and activate a virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the server
uvicorn main:app --reload --port 8000
```

The API will be available at http://localhost:8000

Interactive docs (Swagger UI): http://localhost:8000/docs

Alternative docs (ReDoc): http://localhost:8000/redoc

## Database

SQLite file `handlend.db` is created automatically in the `apps/backend/` directory on first run.

The database is seeded with demo data on startup (only when empty):
- 3 disasters (Chile, Peru, Paraguay)
- 3 logistics companies
- 2 active missions
- Sample funding commitment, timeline events, operator, and operational plan

To reset the database, delete `handlend.db` and restart the server.

## API Endpoints

### Donor-facing
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/disasters` | List all active disasters |
| GET | `/api/disasters/{id}/companies` | List companies for a disaster |
| GET | `/api/companies/{id}` | Company profile with assessment |
| POST | `/api/contributions/intent` | Create pending funding commitment |
| POST | `/api/contributions/confirm` | Confirm commitment with tx hash |
| GET | `/api/missions/{id}/timeline` | Timeline events for a mission |

### Operator-facing
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/deliveries` | Create single delivery event |
| POST | `/api/deliveries/sync-batch` | Batch sync (deduplicates by client_event_id) |
| GET | `/api/deliveries/{id}/settlement-state` | Settlement + validation state |

### Coordinator-facing
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/coordinator/organization` | Get organization (first or 404) |
| POST | `/api/coordinator/organization` | Create/update organization |
| GET | `/api/coordinator/plans` | List operational plans |
| POST | `/api/coordinator/plans` | Create/update plan |
| GET | `/api/coordinator/operators` | List operators |
| POST | `/api/coordinator/operators` | Create operator |
| PUT | `/api/coordinator/operators/{id}` | Update operator |
| GET | `/api/coordinator/dashboard` | Dashboard summary |

### System
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |

## Example Requests

### Create a funding intent
```bash
curl -X POST http://localhost:8000/api/contributions/intent \
  -H "Content-Type: application/json" \
  -d '{"mission_id": 1, "donor_address": "0xAbcd...", "amount_usdc": 100}'
```

### Confirm a contribution
```bash
curl -X POST http://localhost:8000/api/contributions/confirm \
  -H "Content-Type: application/json" \
  -d '{"intent_id": 2, "tx_hash": "0xdeadbeef..."}'
```

### Sync a batch of delivery events
```bash
curl -X POST http://localhost:8000/api/deliveries/sync-batch \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      {
        "mission_id": 1,
        "operator_id": 1,
        "lot_id": "LOT-001",
        "qr_result": "QR-DATA",
        "gps_lat": -33.0472,
        "gps_lng": -71.6127,
        "gps_status": "ok",
        "sync_status": "synced",
        "client_event_id": "client-uuid-001"
      }
    ]
  }'
```
