#!/usr/bin/env python3
"""
Telegram Bot Polling — Fallback când webhook-ul nu funcționează
Utilizare: python telegram_poll.py
"""
import os
import sys
import json
import time
import requests

TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8074799639:AAHlsOx6YefNX9WYVWBO0s_qTHS6Be1KAv0")
TELEGRAM_API = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}"
API_BASE = "https://agentulmeu.online"

def send_message(chat_id, text):
    try:
        requests.post(
            f"{TELEGRAM_API}/sendMessage",
            json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"},
            timeout=30
        )
    except Exception as e:
        print(f"Eroare trimitere: {e}")

def main():
    print(f"🤖 Telegram Polling Bot pornit...")
    print(f"   Token: {TELEGRAM_TOKEN[:15]}...")
    print(f"   API: {API_BASE}")
    
    offset = 0
    while True:
        try:
            resp = requests.get(
                f"{TELEGRAM_API}/getUpdates",
                params={"offset": offset, "limit": 10, "timeout": 30},
                timeout=40
            )
            data = resp.json()
            
            if not data.get("ok"):
                print(f"❌ Eroare Telegram: {data}")
                time.sleep(5)
                continue
            
            for update in data.get("result", []):
                offset = update["update_id"] + 1
                
                if "message" not in update:
                    continue
                
                msg = update["message"]
                chat_id = msg["chat"]["id"]
                text = msg.get("text", "")
                
                print(f"📩 {chat_id}: {text[:50]}")
                
                # Trimite către API-ul nostru
                try:
                    api_resp = requests.post(
                        f"{API_BASE}/api/telegram/webhook",
                        json=update,
                        timeout=60
                    )
                    print(f"   API: {api_resp.status_code}")
                except Exception as e:
                    print(f"   API Error: {e}")
                    send_message(chat_id, "⚠️ Server temporar indisponibil. Încearcă în câteva secunde.")
        
        except KeyboardInterrupt:
            print("\n👋 Oprit.")
            break
        except Exception as e:
            print(f"❌ Eroare: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
