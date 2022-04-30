# CS-387 Project

## Instructions
- Database
    - Setup a `neo4j` database and import the data
    - Enable `bolt` in `neo4j`'s `conf/neo4j.conf`
- Backend
    - Create `backend/password.py` and set the `PASSWORD` variable (must be `str`) to your local Neo4j DB's password
    - Run `neo4j console`
    - Run `uvicorn server:app`
- Frontend
    - Run `npm i` followed by `ng serve`