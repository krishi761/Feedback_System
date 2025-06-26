from src import create_app

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        app.run(debug=False, host='0.0.0.0', port=5000)
 