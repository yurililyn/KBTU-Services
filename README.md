# KBTU Services

A platform for KBTU students to offer and request services in educational goals (e.g., tutoring, laptop repair, design).

##  Team Members
1. Khan Maksim - Backend
2. Artem Guchshin - Frontend
3. Amir Yerlan - UI Design

##  Tech Stack
* Backend: Django, Django REST Framework, SQLite DB
* Frontend: Angular, TypeScript, CSS

## Run
### Backend
1. cd backend
2. python -m venv venv
3. source venv/bin/activate  # venv\Scripts\activate для Windows
4. pip install -r requirements.txt
5. python manage.py migrate
6. python manage.py runserver

### Frontend
ng serve