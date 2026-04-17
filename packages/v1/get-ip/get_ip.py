import requests

def main(params, context):
    try:
        response = requests.get("https://ifconfig.me/ip", timeout=5)
        response.raise_for_status()
        ip_address = response.text.strip()
        return {
            "ip": ip_address,
            "success": True
        }
    except Exception as e:
        return {
            "error": str(e),
            "success": False
        }
