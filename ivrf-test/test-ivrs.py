from flask import Flask, request, Response

app = Flask(__name__)

NGROK_URL = "https://ventricle-sporty-antitoxic.ngrok-free.dev"

@app.route("/ivrs/checkin", methods=["POST"])
def checkin():
    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather numDigits="1" action="{NGROK_URL}/ivrs/checkin-response" method="POST" timeout="20">
        <Say>On a scale of 1 to 5, how safe do you feel today? Please press a number.</Say>
    </Gather>
    <Say>We did not receive any input. Goodbye.</Say>
</Response>"""
    return Response(twiml, mimetype="text/xml")

@app.route("/ivrs/checkin-response", methods=["POST"])
def checkin_response():
    digit_pressed = request.form.get("Digits")
    caller_number = request.form.get("From")
    print(f"GOT RESPONSE -> From: {caller_number}, Pressed: {digit_pressed}")

    twiml = """<?xml version="1.0" encoding="UTF-8"?>
<Response><Say>Thank you. Your response has been recorded. Goodbye.</Say></Response>"""
    return Response(twiml, mimetype="text/xml")

if __name__ == "__main__":
    app.run(port=5000)