# 🧾 API Documentation - Task Management App

Dokumentasi endpoint dari seluruh layanan di dalam proyek **Task Management App**, sebuah simple API berbasis Node.js dan TypeScript.

---

## Authentication

### POST /api/auth/register

Endpoint untuk mendaftarkan pengguna baru.

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "VYt0z@example.com",
  "password": "Password123"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Register success",
  "data": {
    "id": 2,
    "username": "johndoe",
    "email": "VYt0z@example.com",
    "password": "$2b$08$YCE4wXXWSizFZrkyml7PJeDs8Z4n9FOgLQWxAoSZqliLDfxh3Bf9K",
    "createdAt": "2025-04-19T03:11:03.929Z",
    "updatedAt": "2025-04-19T03:11:03.929Z"
  },
  "error": null
}
```

### POST /api/auth/login

Endpoint untuk login pengguna.

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "Password123"
}
```

---

**Response:**

```json
{
  "statusCode": 200,
  "message": "Login success",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "VYt0z@example.com",
    "password": "$2b$08$xmKQXJD2Oo5GSovAUjbPweU8TZ4j8yw3l.xLOaddsJFhlvB9ahzHm",
    "createdAt": "2024-08-29T09:28:43.825Z",
    "updatedAt": "2024-08-29T09:28:43.825Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ1MDMxODYzLCJleHAiOjE3NDUwMzU0NjN9.JDOd4LkUhG2RVLu6bB4mCwkM5BCP21tD5hSmBHn-Cfs"
  },
  "error": null
}
```

---

## User Management

### GET /api/users

Endpoint untuk mendapatkan daftar pengguna.

**Response:**

```json
{
  "statusCode": 200,
  "message": "Success fetching users",
  "data": [
    {
      "id": 1,
      "username": "ucup",
      "email": "ucup@gmail.com",
      "password": "$2b$08$xmKQXJD2Oo5GSovAUjbPweU8TZ4j8yw3l.xLOaddsJFhlvB9ahzHm",
      "createdAt": "2024-08-29T09:28:43.825Z",
      "updatedAt": "2024-08-29T09:28:43.825Z"
    },
    {
      "id": 2,
      "username": "diego",
      "email": "diego@gmail.com",
      "password": "$2b$08$YCE4wXXWSizFZrkyml7PJeDs8Z4n9FOgLQWxAoSZqliLDfxh3Bf9K",
      "createdAt": "2025-04-19T03:11:03.929Z",
      "updatedAt": "2025-04-19T03:11:03.929Z"
    }
  ],
  "error": null
}
```

---

### GET /api/users/profile

Endpoint untuk mendapatkan profil pengguna.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "statusCode": 200,
  "message": null,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "VYt0z@example.com"
  },
  "error": null
}
```

---

### PUT /api/users/profile

Endpoint untuk memperbarui profil pengguna.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "VYt0z@example.com"
  "password": "Password1234"
}
```

**Response:**

```json
{
  "statusCode": 201,
  "message": "User updated",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "VYt0z@example.com",
    "password": "$2b$08$6DWPLrUGXC4gsZsb8E4WEudxSLofl.TjpIf3dWw6zrINnwjIZ.sz.",
    "createdAt": "2024-08-29T09:28:43.825Z",
    "updatedAt": "2025-04-19T03:30:14.604Z"
  },
  "error": null
}
```

### DELETE /api/users/profile

Endpoint untuk menghapus akun pengguna.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "statusCode": 201,
  "message": "user johndoe deleted",
  "data": {
    "id": 2,
    "username": "johndoe",
    "email": "VYt0z@example.com",
    "password": "$2b$08$YCE4wXXWSizFZrkyml7PJeDs8Z4n9FOgLQWxAoSZqliLDfxh3Bf9K",
    "createdAt": "2025-04-19T03:11:03.929Z",
    "updatedAt": "2025-04-19T03:11:03.929Z"
  },
  "error": null
}
```

---

## Task Management

### POST /api/user/tasks

Endpoint untuk membuat tugas baru.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "Makan Malam",
  "description": "makan malam",
  "status": "IN_PROGRESS",
  "priority": "LOW",
  "dueDate": "08-30-2024 18:00:00"
}
```

**Response:**

```json
{
  "statusCode": 201,
  "message": "Task created",
  "data": {
    "id": 8,
    "userId": 3,
    "title": "Makan Malam",
    "description": "makan malam",
    "status": "IN_PROGRESS",
    "priority": "LOW",
    "dueDate": "2024-08-30T11:00:00.000Z",
    "createdAt": "2025-04-19T03:37:04.507Z",
    "updatedAt": "2025-04-19T03:37:04.507Z"
  },
  "error": null
}
```

### GET /api/user/tasks

Endpoint untuk mendapatkan semua tugas.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Tasks retrieved",
  "data": [
    {
      "id": 8,
      "userId": 3,
      "title": "Makan Malam",
      "description": "makan malam",
      "status": "IN_PROGRESS",
      "priority": "LOW",
      "dueDate": "2024-08-30T11:00:00.000Z",
      "createdAt": "2025-04-19T03:37:04.507Z",
      "updatedAt": "2025-04-19T03:37:04.507Z"
    },
    {
      "id": 9,
      "userId": 3,
      "title": "Berenang",
      "description": "Berenang",
      "status": "IN_PROGRESS",
      "priority": "MEDIUM",
      "dueDate": "2024-08-30T06:00:00.000Z",
      "createdAt": "2025-04-19T03:40:30.416Z",
      "updatedAt": "2025-04-19T03:40:30.416Z"
    }
  ],
  "error": null
}
```

---

### GET /api/user/tasks/:taskId

Endpoint untuk mendapatkan tugas berdasarkan ID.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Task retrieved successfully",
  "data": {
    "id": 8,
    "userId": 3,
    "title": "Makan Malam",
    "description": "makan malam",
    "status": "IN_PROGRESS",
    "priority": "LOW",
    "dueDate": "2024-08-30T11:00:00.000Z",
    "createdAt": "2025-04-19T03:37:04.507Z",
    "updatedAt": "2025-04-19T03:37:04.507Z"
  },
  "error": null
}
```

---

### PUT /api/user/tasks/:taskId

Endpoint untuk memperbarui tugas.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "Makan Malam",
  "description": "makan malam",
  "status": "IN_PROGRESS",
  "priority": "LOW",
  "dueDate": "2024-08-30T11:00:00.000Z"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Task updated successfully",
  "data": {
    "id": 8,
    "userId": 3,
    "title": "Makan Malam",
    "description": "makan malam",
    "status": "IN_PROGRESS",
    "priority": "LOW",
    "dueDate": "2024-08-30T11:00:00.000Z",
    "createdAt": "2025-04-19T03:37:04.507Z",
    "updatedAt": "2025-04-19T03:44:34.710Z"
  },
  "error": null
}
```

---

### PATCH /api/user/tasks/:taskId/status

Endpoint untuk memperbarui status tugas.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "status": "COMPLETED"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Task status updated successfully",
  "data": {
    "id": 8,
    "userId": 3,
    "title": "Makan Malam",
    "description": "makan malam",
    "status": "COMPLETED",
    "priority": "LOW",
    "dueDate": "2024-08-30T11:00:00.000Z",
    "createdAt": "2025-04-19T03:37:04.507Z",
    "updatedAt": "2025-04-19T03:46:01.893Z"
  },
  "error": null
}
```

---

### DELETE /api/user/tasks/:taskId

Endpoint untuk menghapus tugas.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Task deleted successfully",
  "data": {
    "id": 8,
    "userId": 3,
    "title": "Makan Malam",
    "description": "makan malam",
    "status": "COMPLETED",
    "priority": "LOW",
    "dueDate": "2024-08-30T11:00:00.000Z",
    "createdAt": "2025-04-19T03:37:04.507Z",
    "updatedAt": "2025-04-19T03:46:01.893Z"
  },
  "error": null
}
```

---

## Category Management

### POST /api/user/category

Endpoint untuk membuat kategori baru.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "Work"
}
```

**Response:**

```json
{
  "statusCode": 201,
  "message": "Category created successfully",
  "data": {
    "id": 3,
    "userId": 3,
    "name": "Work",
    "createdAt": "2025-04-19T03:52:16.210Z"
  },
  "error": null
}
```

---

### GET /api/user/category

Endpoint untuk mendapatkan semua kategori.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 3,
      "userId": 3,
      "name": "Work",
      "createdAt": "2025-04-19T03:52:16.210Z"
    },
    {
      "id": 4,
      "userId": 3,
      "name": "life",
      "createdAt": "2025-04-19T03:53:55.485Z"
    }
  ],
  "error": null
}
```

---

### GET /api/user/category/:categoryId

Endpoint untuk mendapatkan kategori berdasarkan ID.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Category retrieved successfully",
  "data": {
    "id": 3,
    "userId": 3,
    "name": "Work",
    "createdAt": "2025-04-19T03:52:16.210Z"
  },
  "error": null
}
```

---

### PUT /api/user/category/:categoryId

Endpoint untuk memperbarui kategori.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "Life"
}
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Category updated successfully",
  "data": {
    "id": 3,
    "userId": 3,
    "name": "Life",
    "createdAt": "2025-04-19T03:52:16.210Z"
  },
  "error": null
}
```

---

### DELETE /api/user/category/:categoryId

Endpoint untuk menghapus kategori.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Category deleted successfully.",
  "data": {
    "id": 3,
    "userId": 3,
    "name": "Life",
    "createdAt": "2025-04-19T03:52:16.210Z"
  },
  "error": null
}
```

---

## Task Category Management

### POST /api/user/task-categories

Endpoint untuk membuat relasi antara tugas dan kategori.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "taskId": 9,
  "categoryId": 4
}
```

**Response:**

```json
{
  "statusCode": 201,
  "message": "TaskCategory created successfully",
  "data": {
    "id": 9,
    "taskId": 9,
    "categoryId": 4
  },
  "error": null
}
```

---

### GET /api/user/task-categories

Endpoint untuk mendapatkan semua relasi antara tugas dan kategori.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "statusCode": 201,
  "message": "TaskCategory created successfully",
  "data": {
    "id": 9,
    "taskId": 9,
    "categoryId": 4
  },
  "error": null
}
```

---

### GET /api/user/:taskId/categories

Endpoint untuk mendapatkan relasi antara tugas dan kategori berdasarkan ID.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Request success",
  "data": {
    "taskId": "9",
    "taskName": "Berenang",
    "categories": ["life"]
  },
  "error": null
}
```

---

### GET /api/user/task-categories/:categoryId/tasks

Endpoint untuk mendapatkan tugas berdasarkan kategori.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "Task found successfully",
  "data": {
    "categoryId": "4",
    "tasks": [
      {
        "taskId": 9,
        "title": "Berenang"
      }
    ]
  },
  "error": null
}
```

---

### PUT /api/user/task-categories/:taskCategoryId

Endpoint untuk memperbarui relasi antara tugas dan kategori.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "taskId": 6,
  "categoryId": 2
}
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "TaskCategory updated successfully",
  "data": {
    "id": 8,
    "taskId": 6,
    "categoryId": 2
  },
  "error": null
}
```

---

### DELETE /api/user/task-categories/:taskCategoryId

Endpoint untuk menghapus relasi antara tugas dan kategori.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "statusCode": 200,
  "message": "TaskCategory deleted successfully",
  "data": {
    "id": 8,
    "taskId": 6,
    "categoryId": 2
  },
  "error": null
}
```

---
