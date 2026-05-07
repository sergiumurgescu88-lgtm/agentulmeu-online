#!/usr/bin/env python3
"""
AgentulMeu.online — Flask Backend Server
Conectează dashboard.html la Hermes Agent pentru generare automată de agenți AI.

Utilizare:
    python server.py
    # Accesează: http://localhost:8080
"""

import os
import sys
import json
import subprocess
import shutil
from datetime import datetime
from pathlib import Path
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Încarcă variabile din .env dacă există
load_dotenv()

# ===== CONFIGURARE =====
app = Flask(__name__, static_folder='dist/public', static_url_path='')
CORS(app)

# Directoare
BASE_DIR = Path(__file__).parent.resolve()
PROFILES_DIR = BASE_DIR / "config" / "profiles"
OUTPUT_DIR = BASE_DIR / "output" / "OpenClaw"
LOGS_DIR = BASE_DIR / "output" / "logs"

# Creează directoarele dacă nu există
for d in [PROFILES_DIR, OUTPUT_DIR, LOGS_DIR]:
    d.mkdir(parents=True, exist_ok=True)

# Configurare Hermes Agent
HERMES_CMD = os.getenv("HERMES_CMD", "hermes")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "hermes3")

# ===== UTILITARE =====
def log_event(event_type: str, message: str, data: dict = None):
    """Scrie un log în fișier pentru debug și audit"""
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "event": event_type,
        "message": message,
        "data": data or {}
    }
    log_file = LOGS_DIR / f"server_{datetime.now().strftime('%Y%m%d')}.jsonl"
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")
    print(f"[{event_type.upper()}] {message}")

def run_hermes_command(args: list, timeout: int = 300) -> dict:
    """Rulează o comandă Hermes Agent și returnează output-ul"""
    try:
        cmd = [HERMES_CMD] + args
        log_event("CMD", f"Running: {' '.join(cmd)}")
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=BASE_DIR,
            env={**os.environ, "PYTHONIOENCODING": "utf-8"}
        )
        
        if result.returncode != 0:
            log_event("ERROR", f"Hermes command failed: {result.stderr}", {"args": args})
            return {
                "success": False,
                "error": result.stderr.strip(),
                "stdout": result.stdout.strip()
            }
        
        log_event("SUCCESS", "Hermes command completed", {"args": args})
        return {
            "success": True,
            "output": result.stdout.strip(),
            "stderr": result.stderr.strip()
        }
    
    except subprocess.TimeoutExpired:
        log_event("ERROR", "Hermes command timed out", {"args": args, "timeout": timeout})
        return {"success": False, "error": "Timeout: comanda a durat prea mult"}
    except FileNotFoundError:
        log_event("ERROR", f"Hermes command not found: {HERMES_CMD}")
        return {"success": False, "error": f"Hermes nu este instalat sau nu este în PATH. Încearcă: export PATH=\"$HOME/.local/bin:$PATH\""}
    except Exception as e:
        log_event("ERROR", f"Unexpected error: {str(e)}", {"args": args})
        return {"success": False, "error": str(e)}

# ===== API ENDPOINTS =====

@app.route('/')
def serve_dashboard():
    """Servește dashboard.html ca pagină principală"""
    return send_from_directory(BASE_DIR / 'dist' / 'public', 'dashboard.html')

@app.route('/dashboard.html')
def serve_dashboard_direct():
    """Servește dashboard.html direct"""
    return send_from_directory(BASE_DIR / 'dist' / 'public', 'dashboard.html')

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint pentru verificarea statusului serverului"""
    return jsonify({
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "hermes_available": shutil.which(HERMES_CMD) is not None,
        "ollama_url": OLLAMA_URL,
        "profiles_count": len(list(PROFILES_DIR.glob("*.json")))
    })

@app.route('/api/profile', methods=['POST'])
def save_profile():
    """Salvează profilul de business din formular"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No JSON data received"}), 400
        
        # Generează nume fișier unic
        business_name = data.get("business", {}).get("name", "unknown").lower().replace(" ", "_")
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{business_name}_{timestamp}.json"
        filepath = PROFILES_DIR / filename
        
        # Adaugă metadata
        data["_meta"] = {
            "created_at": datetime.now().isoformat(),
            "filename": filename,
            "version": "1.0"
        }
        
        # Salvează fișierul
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        log_event("PROFILE_SAVED", f"Saved profile: {filename}", {"business": business_name})
        
        return jsonify({
            "success": True,
            "filename": filename,
            "filepath": str(filepath),
            "message": f"Profil salvat: {filename}"
        })
    
    except Exception as e:
        log_event("ERROR", f"Failed to save profile: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/generate', methods=['POST'])
def generate_agents():
    """
    Trigger skill-ul build_business_agents în Hermes Agent
    Body: { "profile_filename": "neoterm_20240507_120000.json", "files": ["SOUL.md", "IDENTITY.md"] }
    """
    try:
        data = request.get_json()
        profile_filename = data.get("profile_filename")
        files_to_generate = data.get("files", [])
        
        if not profile_filename:
            return jsonify({"success": False, "error": "Missing profile_filename"}), 400
        
        profile_path = PROFILES_DIR / profile_filename
        if not profile_path.exists():
            return jsonify({"success": False, "error": f"Profile not found: {profile_filename}"}), 404
        
        # Construiește comanda Hermes
        args = [
            "run",
            f"skill=build_business_agents",
            f"--arg", f"profile_path=\"{profile_path}\"",
            f"--arg", f"output_dir=\"{OUTPUT_DIR}\""
        ]
        
        if files_to_generate:
            files_arg = ",".join(files_to_generate)
            args.extend(["--arg", f"files=\"{files_arg}\""])
        
        result = run_hermes_command(args, timeout=600)
        
        if result["success"]:
            generated_files = []
            output_lines = result.get("output", "").split("\n")
            for line in output_lines:
                if ".AGENT.md" in line or (".md" in line and "Generated" in line):
                    generated_files.append(line.strip())
            
            return jsonify({
                "success": True,
                "message": "Agenți generați cu succes!",
                "output": result["output"],
                "generated_files": generated_files,
                "output_dir": str(OUTPUT_DIR)
            })
        else:
            return jsonify({
                "success": False,
                "error": result.get("error", "Unknown error"),
                "details": result.get("stderr", "")
            }), 500
    
    except Exception as e:
        log_event("ERROR", f"Generate endpoint failed: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/files/list', methods=['GET'])
def list_generated_files():
    """Listează fișierele .md generate pentru un business"""
    business_id = request.args.get("business_id")
    if not business_id:
        return jsonify({"success": False, "error": "Missing business_id"}), 400
    
    business_dir = OUTPUT_DIR / business_id
    if not business_dir.exists():
        return jsonify({"files": [], "message": "No files generated yet for this business"})
    
    files = []
    for f in business_dir.glob("*.md"):
        files.append({
            "name": f.name,
            "size": f.stat().st_size,
            "modified": datetime.fromtimestamp(f.stat().st_mtime).isoformat(),
            "path": str(f)
        })
    
    return jsonify({"success": True, "files": sorted(files, key=lambda x: x["name"])})

@app.route('/api/files/download/<path:filename>', methods=['GET'])
def download_file(filename):
    """Descarcă un fișier generat"""
    safe_filename = Path(filename).name
    file_path = OUTPUT_DIR / safe_filename
    
    if not file_path.exists():
        for business_dir in OUTPUT_DIR.iterdir():
            if business_dir.is_dir():
                candidate = business_dir / safe_filename
                if candidate.exists():
                    file_path = candidate
                    break
    
    if not file_path.exists():
        return jsonify({"success": False, "error": f"File not found: {filename}"}), 404
    
    return send_file(
        file_path,
        as_attachment=True,
        download_name=safe_filename,
        mimetype="text/markdown"
    )

@app.route('/api/hermes/status', methods=['GET'])
def hermes_status():
    """Verifică dacă Hermes Agent este accesibil și configurat corect"""
    hermes_available = shutil.which(HERMES_CMD) is not None
    
    version_output = None
    if hermes_available:
        try:
            result = subprocess.run(
                [HERMES_CMD, "--version"],
                capture_output=True,
                text=True,
                timeout=10
            )
            version_output = result.stdout.strip() or result.stderr.strip()
        except Exception as e:
            version_output = f"Error: {str(e)}"
    
    ollama_status = "unknown"
    try:
        import requests
        resp = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
        if resp.status_code == 200:
            ollama_status = "connected"
        else:
            ollama_status = f"http_{resp.status_code}"
    except Exception as e:
        ollama_status = f"error: {str(e)}"
    
    return jsonify({
        "hermes_available": hermes_available,
        "hermes_version": version_output,
        "ollama_status": ollama_status,
        "ollama_url": OLLAMA_URL,
        "model": DEFAULT_MODEL,
        "profiles_count": len(list(PROFILES_DIR.glob("*.json"))),
        "output_files_count": sum(1 for _ in OUTPUT_DIR.rglob("*.md"))
    })

# ===== TEST ENDPOINT — Generare Rapidă =====

TEST_PROFILE = {
    "business": {
        "business_id": "neoterm_test",
        "name": "NeoTerm Test",
        "type": ["B2C", "construction"],
        "description": "Instalăm izolație celulozică ISOGREEN în case noi și renovate",
        "products": "Izolație celulozică — 80 lei/mp",
        "ideal_client": "Proprietari case noi, 35-55 ani, Oltenia",
        "region": "Dolj, Olt, Gorj",
        "website": "https://neoterm.ro",
        "revenue_model": "Servicii + produse"
    },
    "goals": {
        "primary": ["leads", "sales"],
        "top_problem": "Pierd timp cu răspunsuri repetitive",
        "repetitive_tasks": ["Verificare stoc", "Trimitere proforme"],
        "priority_90days": "Automatizarea fluxului de lead-uri"
    },
    "agents_needed": ["hunter", "writer", "support"],
    "personality": {
        "voice": "Prietenos și clar",
        "autonomy": "semi-autonom",
        "red_lines": [
            "Nu oferi informații false",
            "Nu promite ce nu poți livra",
            "Respectă confidențialitatea datelor"
        ],
        "usp": "Garanție 15 ani + instalare în 48h"
    },
    "channels": {
        "communication": ["Telegram", "Email"],
        "crm": "Google Sheets",
        "integrations": []
    }
}

@app.route('/api/test-generate', methods=['POST'])
def test_generate():
    """
    Endpoint de test rapid: generează agenți cu profil hardcodat
    Folosește skill-ul build_business_agents prin Hermes
    """
    try:
        # Salvează profilul de test
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        test_filename = f"test_{timestamp}.json"
        test_path = PROFILES_DIR / test_filename
        
        with open(test_path, "w", encoding="utf-8") as f:
            json.dump(TEST_PROFILE, f, indent=2, ensure_ascii=False)
        
        log_event("TEST_PROFILE", f"Saved test profile: {test_filename}")
        
        # Verifică dacă Hermes este disponibil
        hermes_path = shutil.which(HERMES_CMD)
        if not hermes_path:
            log_event("ERROR", "Hermes not found in PATH")
            return jsonify({
                "success": False,
                "error": "Hermes nu este instalat. Verifică: export PATH=\"$HOME/.local/bin:$PATH\"",
                "files": [],
                "output_dir": str(OUTPUT_DIR)
            }), 500
        
        # Construiește comanda Hermes
        agents_to_generate = ",".join(TEST_PROFILE["agents_needed"])
        
        # Scrie fișierele .AGENT.md direct (simplificat pentru test)
        business_id = TEST_PROFILE["business"]["business_id"]
        business_dir = OUTPUT_DIR / business_id
        business_dir.mkdir(parents=True, exist_ok=True)
        
        generated_files = []
        for agent_name in TEST_PROFILE["agents_needed"]:
            agent_file = business_dir / f"{agent_name}.AGENT.md"
            
            # Conținut agent generat
            agent_content = f"""---
agent_id: {business_id}_{agent_name}
business: {TEST_PROFILE["business"]["name"]}
role: {agent_name.upper()}
autonomy: {TEST_PROFILE["personality"]["autonomy"]}
created: {datetime.now().strftime("%Y-%m-%d")}
language: ro
---

## 🎯 Rolul Tău
Ești agentul {agent_name.upper()} pentru {TEST_PROFILE["business"]["name"]}.

## 📋 Context Business
- Nume: {TEST_PROFILE["business"]["name"]}
- Tip: {', '.join(TEST_PROFILE["business"]["type"])}
- Descriere: {TEST_PROFILE["business"]["description"]}
- Client ideal: {TEST_PROFILE["business"]["ideal_client"]}
- Zona: {TEST_PROFILE["business"]["region"]}
- USP: {TEST_PROFILE["personality"]["usp"]}

## 🚫 Reguli Absolute
{chr(10).join(f"- {r}" for r in TEST_PROFILE["personality"]["red_lines"])}

## 🗣️ Ton Verbal
{TEST_PROFILE["personality"]["voice"]}

## ⚙️ Instrucțiuni Specifice
[Generatează prin Hermes cu skill-ul build_business_agents]

## 💬 Exemple Mesaje (în română)
1. "Salut! Suntem {TEST_PROFILE["business"]["name"]}. Cum te putem ajuta cu {TEST_PROFILE["business"]["products"]}?"
2. "Pentru {TEST_PROFILE["business"]["region"]}, oferim {TEST_PROFILE["personality"]["usp"]}."
3. "Dorești o evaluare gratuită? Răspunde cu DA și te contactăm în 24h."

## 📊 Metrici
- Lead-uri calificate / săptămână
- Rata de conversie
- Scor satisfacție client
"""
            agent_file.write_text(agent_content, encoding="utf-8")
            generated_files.append(f"{business_id}/{agent_name}.AGENT.md")
            log_event("TEST_AGENT", f"Generated test agent file: {agent_file}")
        
        # Încearcă și generarea prin Hermes CLI (opțional)
        try:
            hermes_result = subprocess.run(
                [
                    HERMES_CMD,
                    "run",
                    "skill=build_business_agents",
                    "--arg", f'profile_path="{test_path}"',
                    "--arg", f'output_dir="{OUTPUT_DIR}"',
                ],
                capture_output=True,
                text=True,
                timeout=120,
            )
            hermes_output = hermes_result.stdout.strip() if hermes_result.stdout else ""
            hermes_stderr = hermes_result.stderr.strip() if hermes_result.stderr else ""
            
            log_event("TEST_HERMES", f"Hermes exit code: {hermes_result.returncode}", {
                "stdout": hermes_output[:500] if hermes_output else "",
                "stderr": hermes_stderr[:500] if hermes_stderr else "",
            })
        except Exception as e:
            log_event("TEST_HERMES", f"Hermes generation skipped: {str(e)}")
            hermes_output = "Generare Hermes a fost sărită — fișiere create direct."
        
        # Verifică fișierele generate
        all_files = []
        if business_dir.exists():
            for f in business_dir.glob("*.md"):
                all_files.append({
                    "name": f.name,
                    "size": f.stat().st_size,
                    "path": str(f),
                })
        
        return jsonify({
            "success": True,
            "message": f"✅ {len(generated_files)} agenți test generați cu succes!",
            "profile": test_filename,
            "business_id": business_id,
            "files": all_files,
            "output_dir": str(OUTPUT_DIR / business_id),
            "hermes_output": hermes_output[:1000] if hermes_output else "",
            "test_profile": TEST_PROFILE,
        })
    
    except Exception as e:
        log_event("ERROR", f"Test generate failed: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e),
            "files": [],
        }), 500

@app.route('/api/logs/recent', methods=['GET'])
def get_recent_logs():
    """Returnează ultimele log-uri pentru frontend (debug)"""
    limit = int(request.args.get("limit", 20))
    logs = []
    
    log_files = sorted(LOGS_DIR.glob("server_*.jsonl"), reverse=True)
    if log_files:
        with open(log_files[0], "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    try:
                        logs.append(json.loads(line))
                    except:
                        continue
                if len(logs) >= limit:
                    break
    
    return jsonify({"success": True, "logs": logs})

# ===== CHAT ENDPOINT =====

@app.route('/api/chat', methods=['POST'])
def chat_with_agent():
    """
    Chat cu un agent AI prin Ollama local
    Body: { agent_id, agent_type, business_id, message, history }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No JSON data"}), 400
        
        agent_id = data.get("agent_id", "default")
        agent_type = data.get("agent_type", "hunter")
        business_id = data.get("business_id", "default")
        message = data.get("message", "")
        history = data.get("history", [])
        
        if not message:
            return jsonify({"success": False, "error": "Empty message"}), 400
        
        # Construiește prompt-ul sistem
        agent_names = {
            "hunter": "Lead Hunter Specialist",
            "writer": "Content Creator",
            "closer": "Sales Closer",
            "support": "Customer Support Agent",
            "analyst": "Business Intelligence Analyst",
            "scout": "Market Intelligence Scout",
        }
        
        system_prompt = f"""Ești {agent_names.get(agent_type, 'AI Agent')} pentru business-ul {business_id}.
Rol: {agent_names.get(agent_type, 'Agent AI')}
Răspunde ÎNTOTDEAUNA în limba română, cu diacritice.
Fii concis, clar și acționabil.
Nu folosi jargon tehnic fără explicații.
Dacă nu știi ceva, spune direct — nu inventa."""
        
        # Construiește mesajele pentru Ollama
        ollama_messages = [{"role": "system", "content": system_prompt}]
        
        # Adaugă istoricul (max 10 mesaje)
        for h in history[-10:]:
            if h.get("role") in ["user", "assistant"]:
                ollama_messages.append({"role": h["role"], "content": h["content"]})
        
        # Adaugă mesajul curent
        ollama_messages.append({"role": "user", "content": message})
        
        log_event("CHAT", f"Agent: {agent_type}, Business: {business_id}, Message: {message[:100]}")
        
        # Detectează modelul disponibil
        model_name = "llama3.2:1b"
        try:
            import requests
            models_resp = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
            if models_resp.status_code == 200:
                available_models = [m.get("name", "") for m in models_resp.json().get("models", [])]
                if available_models:
                    # Folosește primul model disponibil
                    model_name = available_models[0]
                    log_event("CHAT", f"Using model: {model_name}")
                else:
                    return jsonify({
                        "success": False,
                        "error": "Niciun model Ollama disponibil",
                        "response": "⚠️ Nu există modele Ollama descărcate.\n\nDescarcă un model:\nollama pull llama3.2:1b\n\nSau:\nollama pull llama3.2"
                    }), 503
        except Exception as e:
            log_event("CHAT_WARN", f"Could not detect model: {e}")
        
        # Trimite către Ollama API
        try:
            ollama_response = requests.post(
                f"{OLLAMA_URL}/api/chat",
                json={
                    "model": model_name,
                    "messages": ollama_messages,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "num_predict": 500,
                    }
                },
                timeout=60
            )
            
            if ollama_response.status_code == 200:
                result = ollama_response.json()
                response_text = result.get("message", {}).get("content", "")
                
                log_event("CHAT_SUCCESS", f"Response: {response_text[:200]}")
                
                return jsonify({
                    "success": True,
                    "response": response_text,
                    "agent_id": agent_id,
                    "agent_type": agent_type,
                    "model": "llama3.2:1b",
                })
            else:
                error_msg = f"Ollama HTTP {ollama_response.status_code}: {ollama_response.text[:200]}"
                log_event("CHAT_ERROR", error_msg)
                return jsonify({
                    "success": False,
                    "error": error_msg,
                    "response": "Eroare la comunicarea cu Ollama. Verifică că Ollama rulează (ollama serve)."
                }), 500
                
        except requests.exceptions.ConnectionError:
            log_event("CHAT_ERROR", "Cannot connect to Ollama")
            return jsonify({
                "success": False,
                "error": "Ollama nu este accesibil",
                "response": "⚠️ Ollama nu este pornit.\n\nPornește Ollama cu:\nollama serve\n\nApoi descarcă modelul:\nollama pull llama3.2:1b"
            }), 503
            
        except requests.exceptions.Timeout:
            log_event("CHAT_ERROR", "Ollama timeout")
            return jsonify({
                "success": False,
                "error": "Timeout — modelul a durat prea mult să răspundă",
                "response": "Modelul a durat prea mult. Încearcă din nou."
            }), 504
    
    except Exception as e:
        log_event("ERROR", f"Chat endpoint failed: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e),
            "response": "Eroare internă server."
        }), 500

# ===== ERROR HANDLERS =====
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(e):
    log_event("ERROR", f"Internal server error: {str(e)}")
    return jsonify({"error": "Internal server error", "details": str(e)}), 500

# ===== MAIN =====
if __name__ == '__main__':
    port = int(os.getenv("PORT", 8080))
    host = os.getenv("HOST", "127.0.0.1")
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    
    print(f"""
╔════════════════════════════════════════════════════╗
║  🤖 AgentulMeu.online — Flask Backend Server      ║
╠════════════════════════════════════════════════════╣
║  URL:        http://{host}:{port}                  ║
║  Hermes:     {HERMES_CMD}                          ║
║  Ollama:     {OLLAMA_URL}                          ║
║  Profiles:   {PROFILES_DIR}                        ║
║  Output:     {OUTPUT_DIR}                          ║
╠════════════════════════════════════════════════════╣
║  Endpoints:                                        ║
║  • GET  /              → Dashboard UI              ║
║  • GET  /api/health    → Server status             ║
║  • POST /api/profile   → Save business profile     ║
║  • POST /api/generate  → Trigger Hermes skill      ║
║  • GET  /api/files/*   → List/download files       ║
║  • GET  /api/logs      → Recent logs (debug)       ║
╚════════════════════════════════════════════════════╝
    """)
    
    log_event("SERVER_START", f"Server started on {host}:{port}")
    
    app.run(host=host, port=port, debug=debug, threaded=True)
