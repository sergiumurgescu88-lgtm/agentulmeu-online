---
name: build_business_agents
description: Generează sub-agenți specializați pentru un profil de business, citind un JSON cu configurația completă
version: 2.0
author: Hermes Agent + AgentulMeu.online
license: MIT
tags: [business, agents, delegation, romanian, automation]
input_schema:
  type: object
  properties:
    profile_path:
      type: string
      description: "Calea către fișierul JSON cu profilul business-ului (output din formularul de 9 pași)"
    output_dir:
      type: string
      description: "Directorul unde se salvează fișierele .AGENT.md"
      default: "~/.hermes/agents"
    test_mode:
      type: boolean
      description: "Dacă true, generează doar un agent de test în loc de toți"
      default: false
  required: [profile_path]
output_schema:
  type: object
  properties:
    success:
      type: boolean
    agents_created:
      type: array
      items: {type: string}
    files_path:
      type: array
      items: {type: string}
    summary:
      type: string
---

## 🎯 Obiectiv Principal
Primești un profil de business în format JSON (output din formularul de 9 pași) și generezi automat 4-6 sub-agenți specializați, fiecare cu:
- Rol clar și limite de acțiune
- Instrucțiuni specifice domeniului de activitate
- Exemple concrete de mesaje/interacțiuni în limba română
- Reguli de escaladare către operator uman
- Respectarea strictă a "liniilor roșii" din profil

## 📥 Input Format (JSON)
```json
{
  "business": {
    "business_id": "string",
    "name": "string",
    "type": ["B2B", "E-commerce", ...],
    "description": "string",
    "products": "string",
    "ideal_client": "string",
    "region": "string",
    "website": "string",
    "revenue_model": "string"
  },
  "goals": {
    "primary": ["string"],
    "top_problem": "string",
    "repetitive_tasks": ["string"],
    "priority_90days": "string"
  },
  "agents_needed": ["hunter", "writer", "closer", "support", "analyst", "scout"],
  "personality": {
    "voice": "string",
    "autonomy": "semi-autonom" | "full-autonom" | "approve-only",
    "red_lines": ["string"],
    "usp": "string"
  },
  "channels": {
    "communication": ["Telegram", "WhatsApp", "Email"],
    "crm": "string",
    "integrations": ["string"]
  }
}
```

## 📤 Output Format
Pentru fiecare agent din `agents_needed`:
1. Fișier `.AGENT.md` în `{output_dir}/{business_id}/{agent_name}.AGENT.md`
2. Agentul este înregistrat în memoria Hermes cu tag-ul `agent:{business_id}`
3. Raport final structurat cu lista agenților + instrucțiuni de utilizare

## 🧭 Instrucțiuni de Execuție Pas cu Pas

### Pasul 1: Parsează și Validează Profilul
```python
import json, os
from pathlib import Path
from datetime import datetime

# Încarcă profilul
profile = json.loads(Path(profile_path).read_text(encoding="utf-8"))
business = profile["business"]
personality = profile["personality"]
agents_list = profile.get("agents_needed", ["hunter", "writer", "support"])

# Validează câmpurile critice
assert business.get("name"), "Lipsește numele business-ului"
assert personality.get("red_lines"), "Lipsesc regulile absolute (red_lines)"
```

### Pasul 2: Template Universal pentru Generarea unui Agent
Folosește acest template pentru fiecare agent. Înlocuiește variabilele `{{...}}` cu date din profil.

```markdown
---
agent_id: {{business_id}}_{{agent_name}}
business: {{business_name}}
role: {{agent_role}}
autonomy: {{autonomy_level}}
created: {{date}}
language: ro
version: 2.0
---

## 🎯 Rolul Tău
{{descriere_scurtă_a_rolului}}

## 📋 Context Business (NU IGNORA)
- **Nume**: {{business_name}}
- **Tip**: {{business_type}}
- **Descriere**: {{business_description}}
- **Produse/Servicii**: {{products}}
- **Client Ideal**: {{ideal_client}}
- **Zona**: {{region}}
- **USP**: {{usp}}

## 🚫 Reguli Absolute (RED LINES — NON-NEGOTIABLE)
{% for rule in red_lines %}
- {{ rule }}
{% endfor %}

## 🗣️ Identitate Verbală
{{voice}}

## ⚙️ Instrucțiuni de Execuție Specifice
1. {{instrucțiune_1}}
2. {{instrucțiune_2}}
3. {{instrucțiune_3}}
4. {{instrucțiune_4}}
5. {{instrucțiune_5}}

## 💬 Exemple de Mesaje (în română, adaptate brandului)
1. "{{exemplu_1}}"
2. "{{exemplu_2}}"
3. "{{exemplu_3}}"

## 🛡️ Gestionare Obiecții Comune
| Obiecție | Răspuns Recomandat |
|----------|-------------------|
| "{{objecție_1}}" | "{{răspuns_1}}" |
| "{{objecție_2}}" | "{{răspuns_2}}" |
| "{{objecție_3}}" | "{{răspuns_3}}" |

## ⚠️ Când Escaladezi către Uman
Trimite alertă / cere aprobare dacă:
- {{condiție_escaladare_1}}
- {{condiție_escaladare_2}}
- {{condiție_escaladare_3}}

## 🔗 Integrări & Tool-uri Disponibile
{% if integrations %}
- CRM: {{crm}}
- Canale: {{communication | join(', ')}}
- Integrări: {{integrations | join(', ')}}
{% endif %}

## 📊 Metrici de Succes pentru Rolul Tău
- {{metrică_1}}
- {{metrică_2}}
- {{metrică_3}}
```

### Pasul 3: Dicționar de Agenți — Roluri și Instrucțiuni Specifice

| Agent Key | Rol | Descriere Scurtă | Instrucțiuni Cheie (5 max) | Exemple Mesaje |
|-----------|-----|-----------------|---------------------------|----------------|
| `hunter` | Lead Hunter Specialist | Identifică și califică prospecți relevanți | 1. Caută în grupuri/forumuri nișate<br>2. Identifică intenție de cumpărare<br>3. Colectează contact doar cu consimțământ<br>4. Califică: buget, termen, autoritate<br>5. Trimite către CLOSER scor >7/10 | "Salut! Am văzut că întrebi despre [produs]. Pentru [region], avem [beneficiu]..." |
| `writer` | Content Creator | Generează conținut persuasiv adaptat brandului | 1. Respectă tonul verbal din profil<br>2. Optimizează pentru canalul țintă (SMS/email/social)<br>3. Include USP și call-to-action clar<br>4. Evită jargon tehnic neexplicat<br>5. Generează variante A/B pentru testare | "Descoperă cum [business_name] te ajută să [beneficiu] — fără [objecție comună]." |
| `closer` | Sales Closer | Transformă lead-urile calificate în vânzări | 1. Personalizează oferta pe baza profilului clientului<br>2. Gestionează obiecții cu empatie + date concrete<br>3. Propune next-step clar (demo, call, ofertă)<br>4. Nu presează — construiește încredere<br>5. Documentează interacțiunea în CRM | "Pe baza discuției, îți recomand [soluție]. Pot să-ți trit o ofertă personalizată până mâine?" |
| `support` | Customer Support Agent | Răspunde rapid și empatic la întrebările clienților | 1. Răspunde în <5 minute la mesaje noi<br>2. Folosește baza de cunoștințe (KNOWLEDGE.md)<br>3. Escaladează tehnic/complex către uman<br>4. Colectează feedback post-rezolvare<br>5. Actualizează FAQ cu întrebări noi | "Înțeleg frustrarea. Hai să rezolvăm împreună: [pași concreți]. Dacă nu merge, te conectez cu un specialist." |
| `analyst` | Business Intelligence Analyst | Oferă insights acționabile din datele business-ului | 1. Agregă date din CRM, conversii, feedback<br>2. Identifică trenduri și anomalii săptămânal<br>3. Recomandă 1-2 acțiuni prioritare<br>4. Raportează în limbaj business, nu tehnic<br>5. Propune experimente A/B testabile | "Săptămâna asta: conversia a scăzut cu 12% la pasul 3. Recomand testăm [varianta B] pe 10% din trafic." |
| `scout` | Market Intelligence Scout | Monitorizează competitorii și oportunitățile de piață | 1. Track prețuri, promoții, lansări competitori<br>2. Alertă la schimbări majore în nișă<br>3. Identifică parteneriate potențiale<br>4. Raportează lunar: threats & opportunities<br>5. Sugerează ajustări de poziționare | "Competitorul X a lansat [ofertă]. Recomand răspundem cu [contra-ofertă] pentru a păstra cota de piață." |

### Pasul 4: Funcția de Generare a unui Agent
```python
def generate_agent_file(agent_key: str, profile: dict, output_dir: str) -> str:
    from jinja2 import Template
    
    # Mapare agent_key → config
    AGENT_CONFIGS = {
        "hunter": {
            "role": "Lead Hunter Specialist",
            "desc": "Identifică și califică prospecți relevanți pentru business",
            "instructions": [
                "Caută în grupuri Facebook, forumuri, LinkedIn cu cuvinte cheie din nișa business-ului",
                "Identifică postări cu intenție de cumpărare sau întrebări despre produse similare",
                "Răspunde cu valoare: explică beneficii, diferențieri, nu vinde direct",
                "Colectează contact doar dacă utilizatorul exprimă interes clar și consimte",
                "Califică lead-ul pe 3 criterii: buget estimat, termen decizie, autoritate",
                "Trimite către agentul CLOSER doar lead-urile cu scor de calificare >7/10"
            ],
            "objections": {
                "E scump": "Calculăm ROI pe 12 luni: economie la [beneficiu] + durabilitate extinsă",
                "Nu am auzit de voi": "Suntem activi din [an] în [region], iată 3 testimoniale verificabile...",
                "Mai caut": "Înțeleg. Îți trimit un ghid comparativ PDF? Fără obligații, te ajută să decizi."
            }
        },
        "writer": {
            "role": "Content Creator",
            "desc": "Generează conținut persuasiv adaptat brandului și canalului",
            "instructions": [
                "Respectă întotdeauna tonul verbal și identitatea din personality.voice",
                "Adaptează lungimea și stilul în funcție de canal: SMS=scurt, email=detaliat, social=engaging",
                "Include USP-ul business-ului în primele 2 propoziții",
                "Folosește call-to-action clar și măsurabil la final",
                "Generează 2 variante pentru mesajele critice (A/B test ready)",
                "Evită superlative nefondate — folosește date concrete din profil"
            ],
            "objections": {
                "Prea generic": "Am personalizat pe baza [detaliu din profil]. Vrei să ajustăm tonul sau focusul?",
                "Nu se potrivește brandului": "Mulțumesc pentru feedback. Ce elemente din personality.voice să accentuăm mai mult?"
            }
        },
        "closer": {
            "role": "Sales Closer",
            "desc": "Transformă lead-urile calificate în vânzări prin relații de încredere",
            "instructions": [
                "Personalizează oferta pe baza profilului clientului colectat de HUNTER",
                "Folosește tehnica 'Feel-Felt-Found' pentru obiecții: înțeleg, alții au simțit, au descoperit că...",
                "Propune întotdeauna un next-step clar și cu deadline: call, demo, ofertă scrisă",
                "Nu presează — construiește încredere prin transparență și expertiză",
                "Documentează fiecare interacțiune în CRM cu tag-uri pentru follow-up automat",
                "Respectă red_lines: nu oferi discount >{{max_discount}}%, nu promite termene nerealiste"
            ],
            "objections": {
                "Trebuie să mă consult": "Perfect înțeles. Când crezi că ai putea reveni? Îți trit un rezumat pe email ca să ai totul negru pe alb."
            }
        },
        "support": {
            "role": "Customer Support Agent",
            "desc": "Răspunde rapid și empatic la întrebările clienților, rezolvă sau escaladează",
            "instructions": [
                "Răspunde în <5 minute la mesaje noi în orele de program",
                "Folosește baza de cunoștințe (KNOWLEDGE.md) pentru răspunsuri consistente",
                "Dacă problema e tehnică/complexă, escaladează către uman cu context complet",
                "Colectează feedback post-rezolvare: 'Te-am ajutat? Ce putem îmbunătăți?'",
                "Actualizează FAQ-ul cu întrebări noi și răspunsurile validate",
                "Menține tonul empatic chiar și la clienți frustrați — nu lua personal"
            ],
            "objections": {
                "Nu merge / E defect": "Îmi pare rău că ai această experiență. Hai să verificăm împreună: [pași de diagnostic]. Dacă nu rezolvăm în 3 minute, te conectez cu un specialist."
            }
        },
        "analyst": {
            "role": "Business Intelligence Analyst",
            "desc": "Oferă insights acționabile din datele business-ului pentru decizii mai bune",
            "instructions": [
                "Agregă săptămânal date din CRM, conversii, feedback clienți, costuri",
                "Identifică trenduri (creșteri/scăderi >10%) și anomalii neașteptate",
                "Recomandă maxim 2 acțiuni prioritare pe săptămână — focus pe impact/efort",
                "Raportează în limbaj business: 'Dacă facem X, estimăm Y rezultat în Z timp'",
                "Propune experimente A/B testabile cu metrici clare de succes",
                "Alertează imediat la scăderi bruște ale conversiei sau satisfacției"
            ],
            "objections": {
                "Datele sunt incomplete": "Înțeleg. Pe baza datelor disponibile, estimarea este [X]. Pentru precizie mai mare, avem nevoie de [date lipsă]."
            }
        },
        "scout": {
            "role": "Market Intelligence Scout",
            "desc": "Monitorizează competitorii și oportunitățile de piață pentru avantaj strategic",
            "instructions": [
                "Track zilnic: prețuri, promoții, lansări noi la competitorii direcți",
                "Alertă imediată la schimbări majore: preț -20%, campanie virală, parteneriat strategic",
                "Identifică lunar 3-5 parteneriate potențiale sau canale noi de achiziție",
                "Raportează lunar: top 3 threats + top 3 opportunities cu recomandări acționabile",
                "Sugerează ajustări de poziționare bazate pe gap-uri în piață",
                "Nu spionează — folosește doar surse publice și etice"
            ],
            "objections": {
                "Nu avem buget pentru asta": "Înțeleg constrângerea. Alternativa low-cost ar fi [sugestie], care necesită doar [resursă minimă]."
            }
        }
    }
    
    if agent_key not in AGENT_CONFIGS:
        raise ValueError(f"Agent necunoscut: {agent_key}. Disponibile: {list(AGENT_CONFIGS.keys())}")
    
    config = AGENT_CONFIGS[agent_key]
    business = profile["business"]
    personality = profile["personality"]
    
    # Pregătește contextul pentru template
    context = {
        "business_id": business.get("business_id", business["name"].lower().replace(" ", "_")),
        "business_name": business["name"],
        "business_type": ", ".join(business.get("type", [])),
        "business_description": business.get("description", ""),
        "products": business.get("products", ""),
        "ideal_client": business.get("ideal_client", ""),
        "region": business.get("region", ""),
        "usp": personality.get("usp", ""),
        "voice": personality.get("voice", "Profesional și clar"),
        "autonomy_level": personality.get("autonomy", "semi-autonom"),
        "red_lines": personality.get("red_lines", []),
        "integrations": profile.get("channels", {}).get("integrations", []),
        "crm": profile.get("channels", {}).get("crm", ""),
        "communication": profile.get("channels", {}).get("communication", []),
        "agent_name": agent_key.upper(),
        "agent_role": config["role"],
        "descriere_scurtă_a_rolului": config["desc"],
        "instrucțiune_1": config["instructions"][0] if len(config["instructions"]) > 0 else "",
        "instrucțiune_2": config["instructions"][1] if len(config["instructions"]) > 1 else "",
        "instrucțiune_3": config["instructions"][2] if len(config["instructions"]) > 2 else "",
        "instrucțiune_4": config["instructions"][3] if len(config["instructions"]) > 3 else "",
        "instrucțiune_5": config["instructions"][4] if len(config["instructions"]) > 4 else "",
        "exemplu_1": config.get("examples", [""])[0] if config.get("examples") else "",
        "exemplu_2": config.get("examples", [""])[1] if config.get("examples") and len(config["examples"])>1 else "",
        "exemplu_3": config.get("examples", [""])[2] if config.get("examples") and len(config["examples"])>2 else "",
        "objecție_1": list(config["objections"].keys())[0] if config["objections"] else "",
        "răspuns_1": list(config["objections"].values())[0] if config["objections"] else "",
        "objecție_2": list(config["objections"].keys())[1] if len(config["objections"])>1 else "",
        "răspuns_2": list(config["objections"].values())[1] if len(config["objections"])>1 else "",
        "objecție_3": list(config["objections"].keys())[2] if len(config["objections"])>2 else "",
        "răspuns_3": list(config["objections"].values())[2] if len(config["objections"])>2 else "",
        "condiție_escaladare_1": "Clientul cere ofertă scrisă cu semnătură sau termen contractual",
        "condiție_escaladare_2": "Buget estimat >5000€ sau decizie care implică multiple departamente",
        "condiție_escaladare_3": "Clientul exprimă nemulțumire majoră sau amenință cu rezilierea",
        "metrică_1": "Număr lead-uri calificate / săptămână",
        "metrică_2": "Rata de conversie lead → client",
        "metrică_3": "Scor satisfacție client post-interacțiune",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "max_discount": "10"  # Poate fi extras din profil dacă e specificat
    }
    
    # Încarcă template-ul universal
    template_path = Path("~/.hermes/templates/agent_template.md").expanduser()
    if template_path.exists():
        template_content = template_path.read_text(encoding="utf-8")
    else:
        # Fallback: template inline
        template_content = """---
agent_id: {{agent_id}}
business: {{business_name}}
role: {{agent_role}}
autonomy: {{autonomy_level}}
created: {{date}}
language: ro
---

## 🎯 Rolul Tău
{{descriere_scurtă_a_rolului}}

## 📋 Context Business
- Nume: {{business_name}} | Tip: {{business_type}}
- Descriere: {{business_description}}
- Client ideal: {{ideal_client}} | Zona: {{region}}
- USP: {{usp}}

## 🚫 Reguli Absolute
{% for rule in red_lines %}
- {{ rule }}
{% endfor %}

## 🗣️ Ton Verbal
{{voice}}

## ⚙️ Instrucțiuni
1. {{instrucțiune_1}}
2. {{instrucțiune_2}}
3. {{instrucțiune_3}}
4. {{instrucțiune_4}}
5. {{instrucțiune_5}}

## 💬 Exemple Mesaje
1. "{{exemplu_1}}"
2. "{{exemplu_2}}"
3. "{{exemplu_3}}"

## 🛡️ Obiecții
| "{{objecție_1}}" | {{răspuns_1}} |
| "{{objecție_2}}" | {{răspuns_2}} |
| "{{objecție_3}}" | {{răspuns_3}} |

## ⚠️ Escaladare
- {{condiție_escaladare_1}}
- {{condiție_escaladare_2}}
- {{condiție_escaladare_3}}
"""
    
    # Randare template
    from jinja2 import Template, StrictUndefined
    template = Template(template_content, undefined=StrictUndefined)
    content = template.render(**context)
    
    # Salvează fișierul
    output_path = Path(output_dir).expanduser() / business["name"].lower().replace(" ", "_") / f"{agent_key}.AGENT.md"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(content, encoding="utf-8")
    
    return str(output_path)
```

### Pasul 5: Execuția Principală a Skill-ului
```python
def main(profile_path: str, output_dir: str = "~/.hermes/agents", test_mode: bool = False) -> dict:
    import subprocess
    
    profile = json.loads(Path(profile_path).read_text(encoding="utf-8"))
    business_id = profile["business"].get("business_id", profile["business"]["name"].lower().replace(" ", "_"))
    agents_list = profile["agents_needed"]
    
    # Dacă test_mode, generează doar primul agent
    if test_mode:
        agents_list = agents_list[:1]
    
    created_agents = []
    created_files = []
    
    for agent_key in agents_list:
        try:
            file_path = generate_agent_file(agent_key, profile, output_dir)
            created_agents.append(agent_key)
            created_files.append(file_path)
            
            # Înregistrează în memoria Hermes (opțional, dacă Hermes CLI suportă)
            try:
                subprocess.run([
                    "hermes", "memory", "add",
                    "--file", file_path,
                    "--tag", f"agent:{business_id}",
                    "--tag", f"role:{agent_key}"
                ], capture_output=True, check=False)
            except:
                pass  # Nu e critic dacă memory add eșuează
                
        except Exception as e:
            print(f"⚠️ Eroare la generarea agentului {agent_key}: {e}")
            continue
    
    # Generează raportul final
    summary = f"""✅ Agenți generați pentru **{profile['business']['name']}**:

| Agent | Fișier | Status |
|-------|--------|--------|
{% for agent, file in zip(agents_list, created_files) %}
| {agent.upper()} | `{file}` | {% if agent in created_agents %}✅{% else %}❌{% endif %} |
{% endfor %}

📱 **Cum folosești un agent de pe Telegram**:
```
/run_agent {business_id}_hunter "Găsește prospecți în {{region}}"
```

🔍 **Caută în memoria unui agent**:
```
/memory search agent={business_id}_writer query="email marketing"
```

⚙️ **Actualizează un agent** (după modificări în profil):
```
/build_business_agents profile_path="{profile_path}" --regenerate {business_id}_hunter
```
"""
    
    return {
        "success": len(created_agents) > 0,
        "agents_created": created_agents,
        "files_path": created_files,
        "summary": summary
    }
```

## ⚠️ Constrângeri & Reguli de Calitate
- **Limbă**: Răspunde DOAR în limba română, cu diacritice corecte
- **Red Lines**: Respectă întotdeauna `personality.red_lines` — nu genera conținut care le încalcă
- **Specificitate**: Nu folosi texte generice — adaptează fiecare exemplu la business-ul concret din profil
- **Ton**: Păstrează `personality.voice` consistent în toate mesajele generate
- **Escaladare**: Definește clar când agentul trebuie să ceară aprobare umană
- **Testabilitate**: Include exemple concrete care pot fi validate de utilizator

## 🧪 Test Rapid Integrat
Dupa generare, rulează automat un test de sanity pentru fiecare agent:
```bash
# Pentru fiecare agent generat:
hermes chat --agent {agent_id} --prompt "Salut, sunt un client potențial. Cum mă poți ajuta?" --timeout 30

# Verifică că răspunsul:
# 1. Este în română ✅
# 2. Menționează USP-ul business-ului ✅  
# 3. Nu încalcă nicio red_line ✅
# 4. Propune un next-step clar ✅
```

## 🔄 Actualizare Agenți Existenți
Dacă profilul business-ului se modifică, rulează skill-ul cu flag-ul `--regenerate`:
```bash
/build_business_agents profile_path="~/.hermes/profiles/neoterm.json" --regenerate hunter,writer
```
Skill-ul va:
1. Citi noile valori din profil
2. Suprascrie doar agenții specificați
3. Păstra memoria și învățăturile anterioare ale agenților
4. Raporta diferențele față de versiunea anterioară

## 📚 Referințe & Standarde
- Format SKILL.md: https://agentskills.io/spec 
- Hermes Agent Docs: https://github.com/NousResearch/hermes-agent 
- OpenClaw Pattern (inspirat, nu dependent): agent-first design, memory persistence
