import os

# Get the absolute path of the directory where the script is located
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Base configuration class."""
    # Secret key for signing cookies, JWT, etc.
    # IMPORTANT: Change this in a production environment!
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-super-secret-key-change-it'
    
    # SQLAlchemy configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'feedback.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

