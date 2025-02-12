<h1 style="text-align:center">Dokumentasi</h1>

# Teknologi
Teknologi yang digunakan untuk membangun RESTfull API (library management system) di antaranya:
1. Bahasa Pemrograman: Javascript;
2. Runtime: Node.js;
3. Framework: Express.js;
4. Database: PostgreSQL.
5. ORM : Sequelize
6. Testing : Jest

# Instalasi
Berikut adalah langkah-langkah instalasi dan cara menjalankan aplikasi.
1. **Unduh repositori:**
    ```shell
    git clone <repository-url>
    cd <folder-name>
    ```
2. **Install dependency:**
   Jalankan perintah berikut melalui terminal:
    ```shell
    npm install
    ```
3. **Konfigurasi environment:**
    - Duplikat file `.env.example`, lalu ubah namanya menjadi `.env`;
    - Sesuaikan konfigurasi database di dalam file `.env` seperti berikut:
      ```shell
      DB_HOST=
      DB_USERNAME=
      DB_NAME=
      DB_PASSWORD=
      DB_PORT=
      ```
4. **Jalankan perintah create database:**
    ```shell
    npx sequelize-cli db:create
    ```
5. **Jalankan migrasi tabel:**
Jalankan perintah untuk membuat tabel:
    ```shell
    npx sequelize-cli db:migrate
    ```
6. **Jalankan seeding data:**
   Pastikan untuk menjalankan perintah berikut **hanya sekali** agar tidak terjadi duplikasi data:
    ```shell
    npx sequelize-cli db:seed:all
    ```
7. **Jalankan aplikasi:**
   Gunakan perintah berikut untuk menjalankan aplikasi:
    ```shell
    npm run start
    ```
   Jika berhasil, maka akan muncul pesan seperti ini:
    ```
    App listening on port 5000.
    ```


# Relasi Antar Tabel

Diagram relasi antar tabel berikut menjelaskan bagaimana tabel-tabel saling berhubungan dalam database aplikasi ini:

1. **Books**
    - **Primary Key (PK):** `id`
    - **Relasi:**
        - Satu judul buku **dapat dipinjam oleh banyak anggota** di dalam tabel `Borrowings`.
    - **Jenis Relasi:** *One to Many*

2. **Members**
    - **Primary Key (PK):** `id`
    - **Relasi:**
        - Satu anggota **dapat memimjam banyak buku** di dalam tabel `Borrowings`.
    - **Jenis Relasi:** *One to Many*

3. **Borrowings**
    - **Primary Key (PK):** `id`
    - **Foreign Key (FK):**
        - `book_id`: Mengacu pada `id` pada tabel `Books`.
        - `member_id`: Mengacu pada `id` pada tabel `Members`.
    - **Relasi:**
        - Setiap pinjaman **mengacu pada satu buku** (*Many to One*) melalui `book_id`.
        - Setiap pinjaman **mengacu pada satu anggota** (*Many to One*) melalui `member_id`.


### Dokumentasi API
1. Daftar Buku
* Endpoint: GET /api/books
* Deskripsi: Menampilkan daftar buku
* Menampilkan daftar buku tanpa filter
   ```bash
   GET {base_url}/api/books
   ```
   Dengan menggunakan endpoint di atas, maka seluruh buku akan di tampilkan (tanpa filter).
   Dengan limit 10 data.
* Menampilkan daftar buku menggunakan filter
  * Query Parameters (opsional)
      * title (string) -> Filter berdasarkan judul (case-insensitive)
      * author (string) -> Filter berdasarkan penulis (case-insensitive)
      * page (integer) -> Nomor halaman
      * limit (integer) -> Jumlah data per halaman
  * Contoh penggunaan
    ```bash
      # Filter using page and limit
      GET {base_url}/api/books?page=2&limit=10
    
      # Filter using title
      GET {base_url}/api/books?title=The Great Gatsby
      
      # Filter using author
      GET {base_url}/api/books?author=J.R.R. Tolkien
      
      # Filter using title and author
      GET {base_url}/api/books?author=J.R.R. Tolkien&title=The Hobbit
    
      # Filter using page,limit,title, and author 
      GET {base_url}/api/books?page=1&limit=1&author=J.R.R. Tolkien&title=The Hobbit
    ```
* Response Success
    ```json
    {
      "data": [
        {
          "id": "b01302e1-8f1e-45ec-8515-da882a51b954",
          "title": "The Great Gatsby",
          "author": "F. Scott Fitzgerald",
          "published_year": 1925,
          "stock": 5,
          "isbn": "9780743273565",
          "available": true
        }
      ],
      "pagination": {
        "total": 20, 
        "page": 1,
        "limit": 1,
        "totalPages": 20
      }
    }
    ```
* Contoh Response Gagal
    ```json
    {
        "status": "fail",
        "message": "\"page\" must be a number"
    }
    ```
  
2. Tambah Anggota
* Endpoint: POST /api/members
* Deskripsi: Menambah anggota baru
* Request body
  ```json
   {
        "name": "name",
        "email": "email",
        "phone": "phone",
        "address": "address"
   }
  ``` 
* Validasi
    ```json
    {
      "name": "string|required",
      "email": "string|required|email|unique",
      "phone": "string|required|phone",
      "address": "string|required"
    }
    ```
* Response Success
    ```json
    {
	  "status": "success",
	  "data": {
		  "id": "70454636-d086-4d36-b44a-f736829a19be"
       }
      }
    ```
* Contoh Response Gagal
    ```json
    {
        "status": "fail",
        "message": "email already exists"
    }
    ```

3. Pinjam Buku
* Endpoint: POST /api/borrowings
* Deskripsi: Meminjam Buku
* Request body
  ```json
    {
    "book_id": "book_id",
    "member_id": "member_id"
    }
  ``` 
* Validasi
    ```json
    {
      "book_id": "string|required|uuid",
      "member_id": "string|required|uuid"
    }
    ```
* Response Success
    ```json
    {
	  "status": "success",
	  "data": {
		  "id": "70454636-d086-4d36-b44a-f736829a19be"
       }
    }
    ```
* Contoh Response Gagal
    ```json
    {
      "status": "fail",
      "message": "Book doesn't exist"
    }
    ```
    ```json
    {
	  "status": "fail",
	  "message": "Maximum 3 books per member"
    }
    ```

4. Kembalikan Buku
* Endpoint: PUT /api/borrowings/:id/return
* Deskripsi: Mengembalikan buku
* Request body
  ```json
    {
    "member_id": "member_id"
    }
  ``` 
* Validasi
    ```json
    {
      "member_id": "string|required|uuid"
    }
    ```
* Response Success
    ```json
    {
	  "status": "success",
	  "message": "Borrowing updated successfully"
    }
    ```
* Contoh Response Gagal
    ```json
    {
      "status": "fail",
      "message": "Borrowing doesn't exist"
    }
    ```

5. Riwayat Peminjaman Buku 
* Endpoint: GET /api/members/:id/borrowings
* Deskripsi: Menampilkan riwayat peminjaman buku oleh anggota
* Menampilkan riwayat peminjaman tanpa filter
   ```bash
   GET {base_url}/api/members/:id/borrowings
   ```
  Dengan menggunakan endpoint di atas, maka seluruh riwayat peminjaman buku akan di tampilkan (tanpa filter).
  Dengan limit 10 data.
* Menampilkan riwayat peminjaman menggunakan filter
    * Query Parameters (opsional)
        * status (string) -> Filter berdasarkan status (BORROWED, RETURNED)
        * page (integer) -> Nomor halaman
        * limit (integer) -> Jumlah data per halaman
    * Contoh penggunaan
      ```bash
        # Filter using page and limit
        GET {base_url}/api/members/:id/borrowings?page=2&limit=10
      
        # Filter using status
        GET {base_url}/api/members/:id/borrowings?status=BORROWED
        
        # Filter using page,limit, and status 
        GET {base_url}/api/members/:id/borrowings?page=1&limit=1&status=RETURNED
      ```
  * Response Success
      ```json
      {
        "data": {
          "borrowings": [
              {
                  "id": "405bf006-d9db-473a-affc-8a5142109192",
                  "book_id": "b01302e1-8f1e-45ec-8515-da882a51b954",
                  "member_id": "70454636-d086-4d36-b44a-f736829a19be",
                  "borrow_date": "2025-02-13",
                  "return_date": "2025-02-13",
                  "status": "RETURNED",
                  "created_at": "2025-02-12T22:43:09.830Z",
                  "updated_at": "2025-02-12T22:54:37.674Z",
                  "Book": {
                      "id": "b01302e1-8f1e-45ec-8515-da882a51b954",
                      "title": "The Great Gatsby",
                      "author": "F. Scott Fitzgerald",
                      "published_year": 1925,
                      "isbn": "9780743273565"
                  }
              }
          ]
        },
        "pagination": {
          "total": 1,
          "page": 1,
          "limit": 10,
          "totalPages": 1
      }
    }
    ```
* Contoh Response Gagal
    ```json
    {
	  "status": "fail",
	  "message": "\"status\" must be one of [RETURNED, BORROWED]"
    }
    ```  

