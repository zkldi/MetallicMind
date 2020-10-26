function FormatScore(score) {
    let ratingString = `Rating: ${score.calculatedData.rating.toFixed(2)}\nLamp Rating: ${score.calculatedData.lampRating ? score.calculatedData.lampRating.toFixed(2): "N/A"}`;

    if (score.calculatedData.gameSpecific) {
        for (const cust in score.calculatedData.gameSpecific) {
            if (score.calculatedData.gameSpecific[cust] || score.calculatedData.gameSpecific[cust] === 0){
                ratingString += `\n${cust}: ${score.calculatedData.gameSpecific[cust].toFixed(2)}`;
            }
        }
    }

    return `${score.scoreData.percent.toFixed(2)}% [${score.scoreData.score}]\n${score.scoreData.grade} [${score.scoreData.lamp}]\n${ratingString}`;
}

module.exports = FormatScore;