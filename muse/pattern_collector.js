// NOTICE: This file is protected under RCF-PL v1.2.3
// [RCF:PROTECTED]
// Pattern Collector v0.1

export class PatternCollector {
    constructor() {
        this.patterns = {};
    }

    collectEvent(event) {
        const key = `${event.type}:${event.value}`;
        if (!this.patterns[key]) {
            this.patterns[key] = {
                type: event.type,
                value: event.value,
                count: 0,
                last_seen: null
            };
        }
        this.patterns[key].count += 1;
        this.patterns[key].last_seen = Date.now();
        return this.patterns[key];
    }

    getPatterns() {
        return this.patterns;
    }
}
