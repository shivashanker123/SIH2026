from twilio.rest import Client

ACCOUNT_SID = "AC0052939813be3b46e42b8d5e26555d0d"
AUTH_TOKEN = "b9da6a5dcf74a9c82397c89ab568fc1c"
TWILIO_NUMBER = "+17372508034"       # your Twilio trial number
YOUR_NUMBER = "+918886538260"        # your verified personal number

NGROK_URL = "https://ventricle-sporty-antitoxic.ngrok-free.dev"

client = Client(ACCOUNT_SID, AUTH_TOKEN)

call = client.calls.create(
    to=YOUR_NUMBER,
    from_=TWILIO_NUMBER,
    url=f"{NGROK_URL}/ivrs/checkin"
)

print("Call SID:", call.sid)