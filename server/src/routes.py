from flask import Blueprint, request, jsonify, current_app
from . import db, bcrypt
from .models import User, Team, Feedback
from .auth import token_required
from sqlalchemy import func
import datetime
import jwt

# Create a Blueprint
bp = Blueprint('api', __name__)

@bp.route('/')
def index():
    return "Welcome to the Feedback Tool API!"

@bp.route('/login', methods=['POST'])
def login():
    """User login, returns a JWT."""
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password required'}), 400

    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    # Check if user exists and password hash matches
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    # Generate JWT
    token = jwt.encode({
        'id': user.id,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    }, current_app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({'token': token, 'user': user.to_dict()})


@bp.route('/dashboard', methods=['GET'])
@token_required
def get_dashboard(current_user):
    """Provides dashboard data for the logged-in user."""
    if current_user.role == 'manager':
        team = Team.query.filter_by(manager_id=current_user.id).first()
        if not team:
            return jsonify({'team_name': 'No Team Assigned', 'feedback_count': 0, 'sentiment_trends': {}, 'team_members': []})

        team_members = User.query.filter_by(team_id=team.id, role='employee').all()
        member_ids = [member.id for member in team_members]

        feedback_count = Feedback.query.filter(Feedback.recipient_id.in_(member_ids)).count() if member_ids else 0
        sentiment_trends = db.session.query(
            Feedback.sentiment, func.count(Feedback.sentiment)
        ).filter(Feedback.recipient_id.in_(member_ids)).group_by(Feedback.sentiment).all() if member_ids else []

        dashboard_data = {
            'team_name': team.name,
            'feedback_count': feedback_count,
            'sentiment_trends': {sentiment: count for sentiment, count in sentiment_trends},
            'team_members': [
                {
                    **member.to_dict(),
                    'feedback_history': [
                        f.to_dict() for f in Feedback.query.filter_by(recipient_id=member.id).order_by(Feedback.created_at.desc()).all()
                    ]
                }
                for member in team_members
            ]
        }
        return jsonify(dashboard_data)

    elif current_user.role == 'employee':
        feedback_received = Feedback.query.filter_by(recipient_id=current_user.id).order_by(Feedback.created_at.desc()).all()
        dashboard_data = {'feedback_timeline': [f.to_dict() for f in feedback_received]}
        return jsonify(dashboard_data)

    return jsonify({'message': 'Invalid role'}), 403

@bp.route('/feedback', methods=['POST'])
@token_required
def submit_feedback(current_user):
    """(Manager Only) Submit feedback for a team member."""
    if current_user.role != 'manager':
        return jsonify({'message': 'Only managers can submit feedback'}), 403

    data = request.get_json()
    if not data or not all(k in data for k in ['recipient_id', 'strengths', 'areas_to_improve', 'sentiment']):
        return jsonify({'message': 'Missing required fields'}), 400
    
    recipient = User.query.get(data['recipient_id'])
    team = Team.query.filter_by(manager_id=current_user.id).first()

    if not recipient or not team or recipient.team_id != team.id:
        return jsonify({'message': 'Recipient is not on your team'}), 403

    new_feedback = Feedback(
        author_id=current_user.id,
        recipient_id=data['recipient_id'],
        strengths=data['strengths'],
        areas_to_improve=data['areas_to_improve'],
        sentiment=data['sentiment']
    )
    db.session.add(new_feedback)
    db.session.commit()
    return jsonify(new_feedback.to_dict()), 201

@bp.route('/feedback/<int:feedback_id>', methods=['PUT'])
@token_required
def update_feedback(current_user, feedback_id):
    """(Manager Only) Update previously submitted feedback."""
    feedback = Feedback.query.get_or_404(feedback_id)

    if current_user.role != 'manager' or feedback.author_id != current_user.id:
        return jsonify({'message': 'Unauthorized to update this feedback'}), 403

    data = request.get_json()
    feedback.strengths = data.get('strengths', feedback.strengths)
    feedback.areas_to_improve = data.get('areas_to_improve', feedback.areas_to_improve)
    feedback.sentiment = data.get('sentiment', feedback.sentiment)
    
    db.session.commit()
    return jsonify(feedback.to_dict())

@bp.route('/feedback/acknowledge/<int:feedback_id>', methods=['PUT'])
@token_required
def acknowledge_feedback(current_user, feedback_id):
    """(Employee Only) Acknowledge feedback."""
    feedback = Feedback.query.get_or_404(feedback_id)

    if current_user.role != 'employee' or feedback.recipient_id != current_user.id:
        return jsonify({'message': 'Unauthorized to acknowledge this feedback'}), 403

    feedback.acknowledged = True
    db.session.commit()
    return jsonify(feedback.to_dict())

@bp.route('/team', methods=['GET'])
@token_required
def get_team(current_user):
    """(Manager Only) View team members."""
    if current_user.role != 'manager':
        return jsonify({'message': 'Only managers can view teams'}), 403

    team = Team.query.filter_by(manager_id=current_user.id).first()
    if not team:
        return jsonify({'message': 'You do not manage a team'}), 404
    
    team_members = User.query.filter_by(team_id=team.id, role='employee').all()
    return jsonify([member.to_dict() for member in team_members])
