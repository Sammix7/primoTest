#--web true
#--kind python:default

import requests

def main(args):
    """Returns the IP address from ifconfig.me"""
    try:
        response = requests.get('https://ifconfig.me/ip', timeout=5)
        response.raise_for_status()
        ip_address = response.text.strip()
        return {
            'statusCode': 200,
            'body': {
                'ip': ip_address
            }
        }
    except requests.RequestException as e:
        return {
            'statusCode': 500,
            'body': {
                'error': f'Failed to fetch IP address: {str(e)}'
            }
        }
