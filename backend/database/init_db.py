from __future__ import annotations

import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.security import hash_password
from app.core.config import get_settings
from app.database import Base, SessionLocal, engine
from app.models.domain import (
    Admin,
    Assignment,
    Course,
    Enrollment,
    GradingPolicy,
    Notification,
    PeerReview,
    Rubric,
    RubricCriteria,
    Student,
    Submission,
    SubmissionPolicy,
    Teacher,
    PasswordResetToken,
    User,
)


def seed_sample_data() -> None:
    settings = get_settings()
    if settings.environment != "development":
        print("Skipping seed data because environment is not development.")
        return

    db = SessionLocal()
    try:
        if db.query(Course).count() > 0:
            return

        # ── Existing Demo Accounts ──
        admin = Admin(
            name="Admin",
            email="admin@assignmentpp.com",
            password_hash=hash_password("Admin123"),
            role="admin",
            id_number="A-0001",
        )
        teacher_ada = Teacher(
            name="Prof. Ada",
            email="teacher@assignmentpp.com",
            password_hash=hash_password("Teacher123"),
            role="teacher",
            id_number="T-9001",
        )
        student_ali = Student(
            name="Ali Student",
            email="student@assignmentpp.com",
            password_hash=hash_password("Student123"),
            role="student",
            id_number="S-1001",
        )

        # ── New Teachers ──
        teacher_yusra = Teacher(
            name="Miss Yusra",
            email="yusra@assignmentpp.com",
            password_hash=hash_password("Yusra123"),
            role="teacher",
            id_number="T-2001",
        )
        teacher_sajjad = Teacher(
            name="Dr. Sajjad",
            email="sajjad@assignmentpp.com",
            password_hash=hash_password("Sajjad123"),
            role="teacher",
            id_number="T-2002",
        )

        # ── New Students ──
        student_shiza = Student(
            name="Shiza Khalid",
            email="bsai25108142@szabist.pk",
            password_hash=hash_password("Shiza123"),
            role="student",
            id_number="BSAI-25108142",
        )
        student_misbah = Student(
            name="Misbah Riaz",
            email="bsai25108117@szabist.pk",
            password_hash=hash_password("Misbah123"),
            role="student",
            id_number="BSAI-25108117",
        )
        student_sulaim = Student(
            name="Muhammad Sulaim",
            email="bsai25108126@szabist.pk",
            password_hash=hash_password("Sulaim123"),
            role="student",
            id_number="BSAI-25108126",
        )
        student_shehroz = Student(
            name="Muhammad Shehroz",
            email="bsai25108125@szabist.pk",
            password_hash=hash_password("Shehroz123"),
            role="student",
            id_number="BSAI-25108125",
        )

        all_students = [student_ali, student_shiza, student_misbah, student_sulaim, student_shehroz]
        all_teachers = [teacher_ada, teacher_yusra, teacher_sajjad]

        db.add_all([admin] + all_teachers + all_students)
        db.flush()

        # ── Courses ──
        course_se = Course(
            name="Software Engineering",
            description="Assignment++ demonstration course",
            code="SE-2026",
            teacher_id=teacher_ada.id,
        )
        course_oop = Course(
            name="Object Oriented Programming",
            description="Learn OOP concepts: classes, inheritance, polymorphism, and design patterns using Java/C++.",
            code="OOP-2026",
            teacher_id=teacher_yusra.id,
        )
        course_ps = Course(
            name="Probability & Statistics",
            description="Descriptive statistics, probability distributions, hypothesis testing, and regression analysis.",
            code="PS-2026",
            teacher_id=teacher_sajjad.id,
        )

        db.add_all([course_se, course_oop, course_ps])
        db.flush()

        # ── Enroll all students in all courses ──
        for stu in all_students:
            db.add(Enrollment(course_id=course_se.id, student_id=stu.id))
            db.add(Enrollment(course_id=course_oop.id, student_id=stu.id))
            db.add(Enrollment(course_id=course_ps.id, student_id=stu.id))

        # ── SE Assignments (Prof. Ada) ──
        a_se1 = Assignment(
            course_id=course_se.id,
            title="Build Assignment++ API",
            description="Create secure auth and role-based endpoints for teacher and student workflows.",
            due_date="2026-07-01",
            resources="FastAPI docs, course slides",
        )
        a_se2 = Assignment(
            course_id=course_se.id,
            title="Design Database Schema",
            description="Design and implement the full SQLAlchemy model layer with relationships and migrations.",
            due_date="2026-07-10",
            resources="SQLAlchemy docs, Alembic guide",
        )
        a_se3 = Assignment(
            course_id=course_se.id,
            title="Frontend Dashboard Integration",
            description="Build teacher and student dashboards with real data from the API.",
            due_date="2026-07-20",
            resources="Next.js docs, Tailwind CSS",
        )
        db.add_all([a_se1, a_se2, a_se3])
        db.flush()

        # Rubric for SE Assignment 1
        rubric_se1 = Rubric(assignment_id=a_se1.id, title="Backend Rubric")
        db.add(rubric_se1)
        db.flush()
        db.add_all([
            RubricCriteria(rubric_id=rubric_se1.id, criterion="Correctness", points=40, notes="Endpoints work as expected"),
            RubricCriteria(rubric_id=rubric_se1.id, criterion="Security", points=30, notes="JWT + RBAC enabled"),
            RubricCriteria(rubric_id=rubric_se1.id, criterion="Documentation", points=30, notes="Clear API usage"),
        ])

        # ── OOP Assignments (Miss Yusra) ──
        a_oop1 = Assignment(
            course_id=course_oop.id,
            title="OOP Assignment 1: Classes and Objects",
            description="Create a Student Management System using classes and objects. Implement proper encapsulation with getters/setters.",
            due_date="2026-06-20",
            resources="Java/OOP textbook Chapter 3-5, course slides",
        )
        a_oop2 = Assignment(
            course_id=course_oop.id,
            title="OOP Assignment 2: Inheritance & Polymorphism",
            description="Design a Shape hierarchy (Shape → Circle, Rectangle, Triangle). Demonstrate method overriding and dynamic dispatch.",
            due_date="2026-07-05",
            resources="Chapter 6-8, UML diagrams reference",
        )
        a_oop3 = Assignment(
            course_id=course_oop.id,
            title="OOP Assignment 3: Design Patterns",
            description="Implement Singleton, Factory, and Observer patterns in a mini banking application.",
            due_date="2026-07-20",
            resources="GoF Design Patterns book, course notes",
        )
        db.add_all([a_oop1, a_oop2, a_oop3])
        db.flush()

        # Rubrics for OOP assignments
        for a_oop, name in [(a_oop1, "OOP Rubric 1"), (a_oop2, "OOP Rubric 2"), (a_oop3, "OOP Rubric 3")]:
            rubric_oop = Rubric(assignment_id=a_oop.id, title=name)
            db.add(rubric_oop)
            db.flush()
            db.add_all([
                RubricCriteria(rubric_id=rubric_oop.id, criterion="Code Structure", points=35, notes="Clean class design and organization"),
                RubricCriteria(rubric_id=rubric_oop.id, criterion="OOP Concepts", points=35, notes="Correct use of encapsulation, inheritance, polymorphism"),
                RubricCriteria(rubric_id=rubric_oop.id, criterion="Documentation & Testing", points=30, notes="Comments, README, and test cases"),
            ])

        # ── Probability & Statistics Assignments (Dr. Sajjad) ──
        a_ps1 = Assignment(
            course_id=course_ps.id,
            title="Assignment 1: Descriptive Statistics",
            description="Collect a dataset (min 50 observations) and compute mean, median, mode, variance, standard deviation, and create visualizations (histogram, box plot).",
            due_date="2026-06-18",
            resources="Course slides Week 1-3, Python matplotlib/seaborn",
        )
        a_ps2 = Assignment(
            course_id=course_ps.id,
            title="Assignment 2: Probability Distributions",
            description="Solve problems on binomial, Poisson, and normal distributions. Use Python to simulate and verify results.",
            due_date="2026-07-02",
            resources="Chapter 4-6, scipy.stats documentation",
        )
        a_ps3 = Assignment(
            course_id=course_ps.id,
            title="Assignment 3: Hypothesis Testing",
            description="Perform t-tests, chi-square tests, and ANOVA on provided datasets. Write a report with conclusions.",
            due_date="2026-07-15",
            resources="Chapter 8-10, R/Python statistical packages",
        )
        db.add_all([a_ps1, a_ps2, a_ps3])
        db.flush()

        # Rubrics for PS assignments
        for a_ps, name in [(a_ps1, "PS Rubric 1"), (a_ps2, "PS Rubric 2"), (a_ps3, "PS Rubric 3")]:
            rubric_ps = Rubric(assignment_id=a_ps.id, title=name)
            db.add(rubric_ps)
            db.flush()
            db.add_all([
                RubricCriteria(rubric_id=rubric_ps.id, criterion="Mathematical Accuracy", points=40, notes="Correct formulas and calculations"),
                RubricCriteria(rubric_id=rubric_ps.id, criterion="Code/Implementation", points=30, notes="Clean Python/R code with proper outputs"),
                RubricCriteria(rubric_id=rubric_ps.id, criterion="Report & Interpretation", points=30, notes="Clear explanations and visualizations"),
            ])

        # ── Submissions ──
        # Ali → SE Assignment 1
        db.add(Submission(
            assignment_id=a_se1.id, student_id=student_ali.id,
            content="Implemented auth and protected APIs with proper validation.",
            file_name="solution.zip",
        ))

        # Shiza → OOP Assignment 1 + PS Assignment 1
        db.add(Submission(
            assignment_id=a_oop1.id, student_id=student_shiza.id,
            content="Student Management System with full CRUD operations using classes. Encapsulation enforced with private fields and public getters/setters.",
            file_name="shiza_oop1.zip",
        ))
        db.add(Submission(
            assignment_id=a_ps1.id, student_id=student_shiza.id,
            content="Analyzed a dataset of 60 student test scores. Mean=72.3, Median=74, SD=12.8. Included histogram and box plot in the report.",
            file_name="shiza_ps1.zip",
        ))

        # Misbah → OOP Assignment 1 + PS Assignment 2
        db.add(Submission(
            assignment_id=a_oop1.id, student_id=student_misbah.id,
            content="Implemented a Library Management System with Book, Member, and Librarian classes. Used composition for fine tracking.",
            file_name="misbah_oop1.zip",
        ))
        db.add(Submission(
            assignment_id=a_ps2.id, student_id=student_misbah.id,
            content="Solved 10 probability distribution problems. Used scipy to verify binomial and Poisson calculations. All results match expected values.",
            file_name="misbah_ps2.zip",
        ))

        # Sulaim → OOP Assignment 1 + SE Assignment 1
        db.add(Submission(
            assignment_id=a_oop1.id, student_id=student_sulaim.id,
            content="University Course Registration system with Student, Course, and Registration classes. Proper validation and relationship management.",
            file_name="sulaim_oop1.zip",
        ))
        db.add(Submission(
            assignment_id=a_se1.id, student_id=student_sulaim.id,
            content="Created full REST API with JWT auth, role-based guards, and proper error handling. All endpoints tested with Postman.",
            file_name="sulaim_se1.zip",
        ))

        # Shehroz → OOP Assignment 1 + PS Assignment 3
        db.add(Submission(
            assignment_id=a_oop1.id, student_id=student_shehroz.id,
            content="Hospital Management System with Doctor, Patient, and Appointment classes. Demonstrates inheritance with different doctor specializations.",
            file_name="shehroz_oop1.zip",
        ))
        db.add(Submission(
            assignment_id=a_ps3.id, student_id=student_shehroz.id,
            content="Performed t-test comparing two teaching methods (p=0.032, significant). Chi-square test on survey data. Full ANOVA on three groups. All assumptions checked.",
            file_name="shehroz_ps3.zip",
        ))

        # ── Notifications ──
        db.add_all([
            Notification(user_id=teacher_ada.id, title="New Submission", message="A student submitted Assignment 1 (Software Engineering)."),
            Notification(user_id=teacher_yusra.id, title="New Submissions", message="4 students submitted OOP Assignment 1."),
            Notification(user_id=teacher_sajjad.id, title="New Submissions", message="Students submitted Probability & Statistics assignments."),
            Notification(user_id=student_ali.id, title="Welcome", message="You are enrolled in Software Engineering."),
            Notification(user_id=student_shiza.id, title="Welcome", message="You are enrolled in OOP and Probability & Statistics."),
            Notification(user_id=student_misbah.id, title="Welcome", message="You are enrolled in OOP and Probability & Statistics."),
            Notification(user_id=student_sulaim.id, title="Welcome", message="You are enrolled in OOP and Software Engineering."),
            Notification(user_id=student_shehroz.id, title="Welcome", message="You are enrolled in OOP and Probability & Statistics."),
        ])

        db.commit()
        print("✅ Seed data created successfully!")
        print(f"   Users: {db.query(User).count()} ({db.query(Admin).count()} admin, {db.query(Teacher).count()} teachers, {db.query(Student).count()} students)")
        print(f"   Courses: {db.query(Course).count()}")
        print(f"   Assignments: {db.query(Assignment).count()}")
        print(f"   Submissions: {db.query(Submission).count()}")
    finally:
        db.close()


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    seed_sample_data()


if __name__ == "__main__":
    init_db()
    print("Database initialized with sample data.")
