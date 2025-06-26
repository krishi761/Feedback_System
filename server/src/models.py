from . import db
from sqlalchemy import func, ForeignKey
from sqlalchemy.orm import relationship

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    full_name = db.Column(db.String(120), nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    team_id = db.Column(db.Integer, ForeignKey('team.id', use_alter=True), nullable=True)
    managed_team = relationship("Team", back_populates="manager", foreign_keys="Team.manager_id")
    authored_feedback = relationship("Feedback", foreign_keys="Feedback.author_id", back_populates="author")
    received_feedback = relationship("Feedback", foreign_keys="Feedback.recipient_id", back_populates="recipient")
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'full_name': self.full_name,
            'role': self.role,
            'team_id': self.team_id
        }

class Team(db.Model):
    __tablename__ = 'team'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    manager_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=False)
    manager = relationship("User", back_populates="managed_team", foreign_keys=[manager_id])
    members = relationship("User", backref="team", foreign_keys=[User.team_id])

class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True)
    strengths = db.Column(db.Text, nullable=False)
    areas_to_improve = db.Column(db.Text, nullable=False)
    sentiment = db.Column(db.String(20), nullable=False)
    acknowledged = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    author_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=False)
    recipient_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=False)
    author = relationship('User', back_populates="authored_feedback", foreign_keys=[author_id])
    recipient = relationship('User', back_populates="received_feedback", foreign_keys=[recipient_id])
    def to_dict(self):
        return {
            'id': self.id,
            'strengths': self.strengths,
            'areas_to_improve': self.areas_to_improve,
            'sentiment': self.sentiment,
            'author': self.author.full_name,
            'recipient': self.recipient.full_name,
            'acknowledged': self.acknowledged,
            'created_at': self.created_at.isoformat()
        }
