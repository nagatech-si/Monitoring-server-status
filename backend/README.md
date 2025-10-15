# Server Monitoring Backend API

Backend API untuk Server Status Monitoring dengan Express.js dan MongoDB. Sistem ini mendukung pengelompokan server dalam groups.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Buat file `.env` dari `.env.example`:
```bash
cp .env.example .env
```

3. Edit file `.env` dan masukkan MongoDB URI Anda:
```
PORT=5003
MONGODB_URI=mongodb://localhost:27017/server-monitoring
NODE_ENV=development
```

Untuk MongoDB Atlas, gunakan format:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/server-monitoring?retryWrites=true&w=majority
```

4. Seed initial groups:
```bash
npm run seed-groups
```

5. Jalankan server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Groups

- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get single group
- `POST /api/groups` - Create new group
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `GET /api/groups/:id/servers` - Get servers by group

### Servers

- `GET /api/servers` - Get all servers (with group population)
- `GET /api/servers/:id` - Get single server
- `POST /api/servers` - Create new server
- `PUT /api/servers/:id` - Update server
- `DELETE /api/servers/:id` - Delete server
- `POST /api/servers/:id/check` - Check server status (ping)
- `GET /api/servers/:id/history` - Get server status history

### Request Examples

#### Create Group
```json
POST /api/groups
{
  "name": "NAGAGOLD",
  "description": "Server group untuk NAGAGOLD"
}
```

#### Create Server
```json
POST /api/servers
{
  "name": "Main Website",
  "url": "https://example.com",
  "groupId": "60f0e9b5c8a5a50015f1b1a1",
  "type": "website",
  "description": "Company main website"
}
```

#### Update Server
```json
PUT /api/servers/:id
{
  "name": "Updated Server Name",
  "status": "maintenance"
}
```

## Models

### Group
- name: String (required, unique)
- description: String
- timestamps: true

### Server
- name: String (required)
- url: String (required)
- groupId: ObjectId (required, ref: Group)
- type: String (website, api, database, other)
- status: String (operational, degraded, down, maintenance)
- responseTime: Number
- uptime: Number
- lastChecked: Date
- description: String
- timestamps: true

### StatusHistory
- serverId: ObjectId (ref: Server)
- status: String
- responseTime: Number
- timestamp: Date
- errorMessage: String

## Predefined Groups

Aplikasi ini secara default menyediakan 3 groups:
1. **NAGAGOLD** - Server group untuk NAGAGOLD
2. **PANTES** - Server group untuk PANTES  
3. **SURYAJAYA** - Server group untuk SURYAJAYA

## Notes

- Server akan otomatis ping URL setiap kali endpoint `/api/servers/:id/check` dipanggil
- History status disimpan di collection terpisah untuk tracking
- CORS sudah dikonfigurasi untuk frontend integration
- Group tidak bisa dihapus jika masih ada server di dalamnya
- Server data akan include group information melalui populate
