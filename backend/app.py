from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# Configure SQLite (quick hackathon-friendly DB)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///datathon.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# -------------------
# Models
# -------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    requested = db.Column(db.Boolean, default=False)

# -------------------
# Auth Routes
# -------------------
@app.route("/auth/register", methods=["POST"])
def register():
    data = request.json
    user = User(username=data["username"], password=data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"status": "success", "message": "User registered", "user": {"id": user.id, "username": user.username}})

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"], password=data["password"]).first()
    if user:
        return jsonify({"status": "success", "message": "Login successful", "user": {"id": user.id, "username": user.username}})
    return jsonify({"status": "error", "message": "Invalid credentials"}), 401

# -------------------
# Post Routes
# -------------------
@app.route("/posts/create", methods=["POST"])
def create_post():
    data = request.json
    post = Post(title=data["title"], author_id=data["author_id"])
    db.session.add(post)
    db.session.commit()
    return jsonify({"status": "success", "post": {"id": post.id, "title": post.title}})

@app.route("/posts/list", methods=["GET"])
def list_posts():
    posts = Post.query.all()
    return jsonify({"status": "success", "posts": [{"id": p.id, "title": p.title, "requested": p.requested} for p in posts]})

@app.route("/posts/request/<int:post_id>", methods=["POST"])
def request_item(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"status": "error", "message": "Post not found"}), 404
    post.requested = True
    db.session.commit()
    return jsonify({"status": "success", "message": f"Post {post_id} requested"})

# -------------------
# User Routes
# -------------------
@app.route("/users/<int:user_id>", methods=["GET"])
def user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404
    posts = Post.query.filter_by(author_id=user.id).all()
    return jsonify({
        "status": "success",
        "profile": {
            "id": user.id,
            "username": user.username,
            "posts": [{"id": p.id, "title": p.title} for p in posts]
        }
    })

# -------------------
# Entry Point
# -------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables if not exist

        # --- Demo Data Seeding ---
        if not User.query.first():  # Only seed if DB is empty
            demo_user = User(username="Gabriel", password="test123")
            db.session.add(demo_user)
            db.session.commit()

            demo_post1 = Post(title="First Demo Post", author_id=demo_user.id)
            demo_post2 = Post(title="Second Demo Post", author_id=demo_user.id)
            db.session.add_all([demo_post1, demo_post2])
            db.session.commit()

            print("Seeded demo user and posts!")

    app.run(debug=True)
