# Feedback System

A full-stack feedback portal for employees and managers.

## Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Flask (Python 3.12), SQLAlchemy, JWT Auth
- **Database:** SQLite (dev), easily swappable for Postgres/MySQL
- **Containerization:** Docker

## Setup Instructions

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd feedback_system
```

### 2. Backend Setup

#### Local (with venv)

```sh
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Populate the database with mock data
flask db init
# Run the server
flask run
# Or you can use: python app.py
```

#### Docker

```sh
cd server
docker build -t feedback-backend .
# Populate the database with mock data (run once)
docker run --rm feedback-backend flask db init
# Run the server
docker run -p 5001:5000 feedback-backend
```

### 3. Frontend Setup

```sh
cd client
npm install
npm run dev
```

- The frontend will run on [http://localhost:5173](http://localhost:5173) by default.
- Update API URLs in the frontend if your backend runs on a different port.

## Design Decisions

- **Separation of Concerns:** Frontend and backend are in separate folders for clarity and easy deployment.
- **Authentication:** JWT-based, stateless, secure for API use.
- **Database Models:** Simple User, Team, Feedback models for extensibility.
- **Mock Data:** CLI command to populate the database for demo/testing.
- **Docker:** For easy deployment and consistent environments.
- **No secrets in code:** Use environment variables for sensitive config.

## Usage Notes

- To reset and repopulate the database, use the CLI command:
  ```sh
  flask db init
  ```
- For production, use a production-ready database and configure CORS appropriately.

---

MIT License
