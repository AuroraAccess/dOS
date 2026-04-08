// NOTICE: This file is protected under RCF-PL v1.2.3
// [RCF:PROTECTED]
// Muse Rule Engine v0.1
// Простая логика: повтор -> усиление паттерна

export class MuseRules {
    apply(pattern) {
        const weight = this.calculateWeight(pattern.count);
        return {
            ...pattern,
            weight
        };
    }

    calculateWeight(count) {
        if (count < 2) return 1;
        if (count < 5) return 2;
        if (count < 10) return 3;
        return 4;
    }
}
