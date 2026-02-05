from fastapi import FastAPI

app = FastAPI(
    title="CRM Inmobiliario API",
    description="Backend del CRM Inmobiliario Familiar (TFM)",
    version="0.1.0"
)

@app.get("/")
def read_root():
    return {"message": "Welcome to CRM API", "status": "ok"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
