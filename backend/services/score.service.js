
export function calculateScore(fields) {
    if (!fields) {
        return {
            leadScore: 0,
            confidence: "Low",
            reason: "No information provided yet.",
            summary: "User has not provided any details.",
            readyToCapture: false,
            leadReady: false
        };
    }

    let score = 0;
    const tags = [];
    const summaryBits = [];

    // Scoring rules
    if (fields.destination) {
        score += 20;
        tags.push("Destination");
        summaryBits.push(`wants to travel to ${fields.destination}`);
    }

    if (fields.travelDate) {
        const vaguePatterns = /next year|sometime|later|not sure|flexible|eventually|soon|whenever|tbd|to be determined|haven't decided|undecided|not decided|open|maybe|probably|roughly|still deciding|planning to|hope to|looking to|thinking|considering|no idea|don't know|unsure|unclear|pending|tba|someday|in a few months|idk|i guess|guess|uncertain|spring|summer|fall|autumn|winter|^[a-z]+\s*\?|\?\s*$/i;
        const isVague = vaguePatterns.test(fields.travelDate);
        score += isVague ? 5 : 15;
        tags.push(isVague ? "Vague date" : "Specific date");
        summaryBits.push(`around ${fields.travelDate}`);
    }
    if (fields.travellers) {
        score += 10;
        tags.push("Traveller count");
        summaryBits.push(`for ${fields.travellers} people`);
    }

    if (fields.duration) {
        score += 10;
        tags.push("Duration");
        summaryBits.push(`for ${fields.duration}`);
    }

    if (fields.budget) {
        score += 15;
        tags.push("Budget");
        summaryBits.push(`with a budget of ${fields.budget}`);
    }

    if (fields.tripType) {
        score += 10;
        tags.push("Trip type");
        summaryBits.push(`for a ${fields.tripType} trip`);
    }

    if (fields.specialRequirements) {
        score += 5;
        tags.push("Special requirements");
    }

    if (fields.name) {
        score += 5;
        tags.push("Name");
    }

    if (fields.phone) {
        score += 10;
        tags.push("Phone");
    }

    if (fields.email) {
        score += 5;
        tags.push("Email");
    }

    const leadScore = Math.min(score, 100);

    const confidence = leadScore >= 65 ? "High" : leadScore >= 50 ? "Medium" : "Low";

    const reason = tags.length > 0
        ? `Captured: ${tags.join(", ")}.`
        : "No actionable details yet.";

    const summary = summaryBits.length > 0
        ? `User ${summaryBits.join(", ")}.`
        : "Still exploring, no concrete plans yet.";

    return {
        leadScore,
        confidence,
        reason,
        summary,
        readyToCapture: leadScore >= 50 && !fields.name,
        leadReady: Boolean(leadScore >= 65 && fields.name && fields.phone)
    };
}