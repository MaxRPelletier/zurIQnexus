# Configs

## Install libraries in backend

```bash
# activate VM with .\venv\Scripts\activate in windows
pip install -r requirements.txt
python app.py
```

## First, start the backend server by running:

```bash
# activate VM at backend with .\venv\Scripts\activate in windows
uvicorn main:app --reload
# python app.py
```

## Then, start the frontend server by running:

```bash
# yarn build
yarn dev
# yarn start for production port 4173
```

## You can now access the chat application at http://localhost:5173.
## You can now access the API at http://localhost:8000.
