from flask_sqlalchemy import SQLAlchemy
import datetime
import enum

db = SQLAlchemy()

class SentimentEnum(enum.Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"

class User(db.Model):
    """User model for employees and managers."""
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False) 
    role = db.Column(db.String(20), nullable=False, default='employee') # 'employee' or 'manager'
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    manager = db.relationship('User', remote_side=[id], backref='team_members')
    feedback_received = db.relationship('Feedback', foreign_keys='Feedback.employee_id', backref='employee', lazy=True)
    feedback_given = db.relationship('Feedback', foreign_keys='Feedback.manager_id', backref='manager_who_gave_feedback', lazy=True)

    def __repr__(self):
        return f'<User {self.username} - {self.role}>'

class Feedback(db.Model):
    """Feedback model."""
    id = db.Column(db.Integer, primary_key=True)
    
    employee_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    strengths = db.Column(db.Text, nullable=False)
    areas_to_improve = db.Column(db.Text, nullable=False)
    sentiment = db.Column(db.Enum(SentimentEnum), nullable=False)
    
    created_at = db.Column(db.DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))
    
    acknowledged = db.Column(db.Boolean, default=False, nullable=False)

    def __repr__(self):
        return f'<Feedback for User ID {self.employee_id} from Manager ID {self.manager_id}>'backref