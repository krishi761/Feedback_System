from flask import Blueprint
from . import db, bcrypt
from .models import User, Team, Feedback

# Create a Blueprint for CLI commands
db_cli = Blueprint('db_cli', __name__, cli_group='db')

@db_cli.cli.command('init')
def init_db():
    db.drop_all()
    db.create_all()
    populate_mock_data()
    print('Initialized and populated the database.')

def populate_mock_data():
    hashed_password = bcrypt.generate_password_hash('password').decode('utf-8')
    manager1 = User(username='manager_jane', full_name="Jane Smith", password_hash=hashed_password, role='manager')
    manager2 = User(username='manager_doe', full_name="John Doe", password_hash=hashed_password, role='manager')
    db.session.add_all([manager1, manager2])
    db.session.commit()
    team1 = Team(name='Alpha Team', manager_id=manager1.id)
    team2 = Team(name='Bravo Team', manager_id=manager2.id)
    db.session.add_all([team1, team2])
    db.session.commit()
    employee1 = User(username='employee_alice', full_name="Alice Inchains", password_hash=hashed_password, role='employee', team_id=team1.id)
    employee2 = User(username='employee_bob', full_name="Bob Ross", password_hash=hashed_password, role='employee', team_id=team1.id)
    employee3 = User(username='employee_charlie', full_name="Charlie Chaplin", password_hash=hashed_password, role='employee', team_id=team2.id)
    db.session.add_all([employee1, employee2, employee3])
    db.session.commit()
    feedback1 = Feedback(
        strengths='Excellent communication skills and team collaboration.',
        areas_to_improve='Could take more initiative on leading new projects.',
        sentiment='positive',
        author_id=manager1.id,
        recipient_id=employee1.id
    )
    feedback2 = Feedback(
        strengths='Strong technical abilities and problem-solving.',
        areas_to_improve='Time management could be improved on larger tasks.',
        sentiment='neutral',
        author_id=manager1.id,
        recipient_id=employee2.id,
        acknowledged=True
    )
    feedback3 = Feedback(
        strengths='Very creative and brings new ideas to the team.',
        areas_to_improve='Needs to be more thorough in testing before deployment.',
        sentiment='positive',
        author_id=manager2.id,
        recipient_id=employee3.id
    )
    db.session.add_all([feedback1, feedback2, feedback3])
    db.session.commit()
