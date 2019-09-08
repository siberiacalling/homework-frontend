'use strict';

const filter = (input, ignoredTagsList) => {

    let allTags = Array.from(input.matchAll(/<(.*?)>/gi));

    if (allTags.length === 0) {
        return escapeAllExceptTags(input);
    }

    let maxNumOfIterations = allTags.reduce((counter, currentTag) => {
        return counter + (!isTagIgnored(currentTag[1], ignoredTagsList));
    }, 0);

    input = escapeAllExceptTags(input);
    if (maxNumOfIterations === 0) {
        return input;
    }

    let numberOfCurrentIteration = 0;
    for (let i = 0; i < maxNumOfIterations; i++) {
        numberOfCurrentIteration++;
        allTags = Array.from(input.matchAll(/<(.*?)>/gi));

        let tagForEscape = "";
        let tagForEscapeIndex = 0;

        for (let j = 0; j < allTags.length; j++) {
            if (!isTagIgnored(allTags[j][1], ignoredTagsList)) {
                tagForEscape = allTags[j][1];
                tagForEscapeIndex = j;
                break;
            }
        }
        input = replaceAt(input, allTags[tagForEscapeIndex].index, "&lt;");
        input = replaceAt(input, allTags[tagForEscapeIndex].index + tagForEscape.length + "&lt;".length, "&gt;");
    }
    return input;
};

const replaceAt = (string, index, replace) => {
    return string.substring(0, index) + replace + string.substring(index + 1);
};

const escapeAllExceptTags = (input) => {
    return input
        .replace(/&/g, "&amp;")
        .replace(/\s<\s/g, " &lt; ")
        .replace(/\s>\s/g, " &gt; ")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

const isTagIgnored = (currentTag, ignoredTags) => {
    let numberWordInString = countWords(currentTag);
    if (numberWordInString > 1) {
        currentTag = getFirstWord(currentTag);
    }

    if (currentTag.charAt(0) === "/") {
        let currentTagWithoutSlash = currentTag.substring(1);
        return (ignoredTags.includes(currentTagWithoutSlash));
    }
    return (ignoredTags.includes(currentTag));
};

const countWords = (str) => {
    return str.split(" ").length;
};

const getFirstWord = (str) => {
    let spacePosition = str.indexOf(" ");
    return spacePosition === -1 ? str : str.substr(0, spacePosition);
};