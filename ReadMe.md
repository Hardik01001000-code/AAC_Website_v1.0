AAC Website

This is the official repository for the AAC club website. This guide explains how to set up and run the project on a local development machine.

Local Setup

1. Prerequisites

Python 3.10+

Git

2. Clone the Repository

Open your terminal, navigate to where you want to store the project, and run the following command:

```bash
git clone https://github.com/Hardik01001000-code/AAC_Website_v1.0.git
```
```bash
cd AAC_Website_v1.0
```


3. Create a Virtual Environment

It is highly recommended to use a virtual environment to manage project dependencies.

# For Windows

```bash
python -m venv venv
```
```bash
.\venv\Scripts\activate
```

# For macOS/Linux

```bash
python3 -m venv venv
```
```bash
source venv/bin/activate
```


4. Install Dependencies

Install all the required Python packages from the requirements.txt file.

```bash
pip install -r requirements.txt
```


5. Create Your Local Environment File

This project uses a .env file to manage secret keys and settings.

Create a file named .env in the root of the project (the same directory as manage.py).

Copy and paste the following content into the file. This is for local development only.

```bash
# Generate a new, random secret key for your local development
SECRET_KEY='local-dev-secret-key-j#g&8rgrqz377y^a0ys&3az0'

# Set to True for development
DEBUG=True

# Local development hosts
ALLOWED_HOSTS=127.0.0.1,localhost

# Local development origins
CSRF_TRUSTED_ORIGINS=http://127.0.0.1:8000,http://localhost:8000

# This can be false for local development
SERVE_MEDIA=False
```

Note: The SECRET_KEY above is just an example. For better security, you can generate your own using an online Django key generator.

Running the Application

Once your setup is complete, you can run the development server.

1. Run Database Migrations

This command sets up your local db.sqlite3 database file.

```bash
python manage.py migrate
```


2. Run the Development Server

You're all set! Start the server with this command:

```bash
python manage.py runserver
```


You can now view your local version of the website by opening ```http://127.0.0.1:8000/``` in your web browser.
