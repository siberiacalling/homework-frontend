'use strict';

const filter = (input, ignoredTagsList) => {

    let allTags = Array.from(input.matchAll(/<(.*?)>/gi), elem => {
        return {tag: elem[1], index: elem.index};
    });

    if (allTags.length === 0) {
        return escapeAllExceptTags(input);
    }

    const maxNumOfIterations = allTags.reduce((acc, curr) => isTagForbidden(curr.tag, ignoredTagsList) ? acc + 1 : acc, 0);

    input = escapeAllExceptTags(input);
    if (maxNumOfIterations === 0) {
        return input;
    }

    for (let i = 0; i < maxNumOfIterations; i++) {
        allTags = Array.from(input.matchAll(/<(.*?)>/gi), elem => {
            return {tag: elem[1], index: elem.index};
        });

        let tagForEscape = "";
        let tagForEscapeIndex = 0;

        for (let j = 0; j < allTags.length; j++) {
            if (isTagForbidden(allTags[j].tag, ignoredTagsList)) {
                tagForEscape = allTags[j].tag;
                tagForEscapeIndex = j;
                break;
            }
        }

        const LESS_THAN_ESCAPE = "&lt;";
        const GREATER_THAN_ESCAPE = "&gt;";
        input = replaceAt(input, allTags[tagForEscapeIndex].index, LESS_THAN_ESCAPE);
        input = replaceAt(input, allTags[tagForEscapeIndex].index + tagForEscape.length + LESS_THAN_ESCAPE.length, GREATER_THAN_ESCAPE);
    }
    return input;
};

const replaceAt = (string, index, replace) => {
    return string.substring(0, index) + replace + string.substring(index + 1);
};

const escapeAllExceptTags = (input) => {
    const AMPERSAND_ESCAPE = "&amp;";
    const LESS_THAN_SPACE_ESCAPE = " &lt; ";
    const GREATER_THAN_SPACE_ESCAPE = " &gt; ";
    const DOUBLE_QUOTE_ESCAPE = "&quot;";
    const SINGLE_QUOTE_ESCAPE = "&#39;";

    return input
        .replace(/&/g, AMPERSAND_ESCAPE)
        .replace(/\s<\s/g, LESS_THAN_SPACE_ESCAPE)
        .replace(/\s>\s/g, GREATER_THAN_SPACE_ESCAPE)
        .replace(/"/g, DOUBLE_QUOTE_ESCAPE)
        .replace(/'/g, SINGLE_QUOTE_ESCAPE);
};

const isTagForbidden = (currentTag, ignoredTags) => {
    currentTag = getFirstWord(currentTag);

    if (currentTag.charAt(0) === "/") {
        const currentTagWithoutSlash = currentTag.substring(1);
        return !ignoredTags.includes(currentTagWithoutSlash);
    }
    return !ignoredTags.includes(currentTag);
};

const getFirstWord = (str) => {
    const spacePosition = str.indexOf(" ");
    return spacePosition === -1 ? str : str.substr(0, spacePosition);
};