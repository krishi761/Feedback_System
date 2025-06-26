from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from .config import Config

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()

def create_app(config_class=Config):
    """
    Creates and configures the Flask application.
    This is the application factory pattern.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS. For development, you can allow all origins.
    # For production, you should restrict it to your frontend's domain.
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Initialize extensions with the app
    db.init_app(app)
    bcrypt.init_app(app)
    
    # Import and register blueprints or routes here
    from . import routes
    app.register_blueprint(routes.bp)

    # Import and register CLI commands
    from . import commands
    app.register_blueprint(commands.db_cli)

    return app