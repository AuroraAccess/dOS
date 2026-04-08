// NOTICE: This file is protected under RCF-PL v1.2.3
// [RCF:PROTECTED]
// Interaction Analyzer v0.1
// Определение типа взаимодействия на основе события

export class InteractionAnalyzer {
    classify(event) {
        if (event.text?.endsWith("?")) {
            return "question";
        }

        if (event.type === "command") {
            return "command";
        }

        if (event.type === "preference") {
            return "preference";
        }

        return "unknown";
    }

    analyze(event) {
        return {
            original: event,
            type: this.classify(event),
            timestamp: Date.now()
        };
    }
}
