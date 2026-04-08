# Muse Learning System (v0.1)

## Purpose
Provide initial learning logic for Muse without AI/ML.  
Muse tracks patterns and updates them through Pulse.

---

## Modules

### 1. Pattern Collector
- collects incoming events
- groups repeated patterns
- updates counts + last_seen

File: [pattern_collector.js](pattern_collector.js)

---

### 2. Interaction Analyzer
- detects interaction type: question / command / preference
- creates analysis object

File: [interaction_analayzer.js](interaction_analayzer.js)

---

### 3. Pulse Data Contract
Defines:
- event format  
- pattern format  
- analysis format  
- update format  

File: [data_contract.json](data_contract.json)

---

### 4. Muse Rules (Update Logic)
Simple rule set:
- repeated events increase pattern weight
- weight based on count

File: [muse_rules.js](muse_rules.js)
