'use strict';

const filter = (input, ignoredTagsList) => {

    let allTags = Array.from(input.matchAll(/<(.*?)>/gi));

    if (allTags.length === 0) {
        return escapeAllExceptTags(input);
    }

    let maxNumOfIterations = 0;

    allTags.forEach(function (currentTag) {
        let tagInIgnoredTags = isTagIgnored(currentTag[1], ignoredTagsList);
        if (!tagInIgnoredTags) {
            maxNumOfIterations++;
        }
    });

    input = escapeAllExceptTags(input);
    if (maxNumOfIterations === 0) {
        return input;
    }

    let numberOfCurrentIteration = 0;
    while (numberOfCurrentIteration !== maxNumOfIterations) {
        numberOfCurrentIteration++;
        allTags = Array.from(input.matchAll(/<(.*?)>/gi));

        let currentTag = allTags[0][1];
        let tagInIgnoredTags = isTagIgnored(currentTag, ignoredTagsList);
        if (!tagInIgnoredTags) {
            input = replaceAt(input, allTags[0].index, "&lt;");
            input = replaceAt(input, allTags[0].index + currentTag.length + "&lt;".length, "&gt;");
        }
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
    let tagInIgnoredTags;
    if (currentTag.charAt(0) === '/') {
        let currentTagWithoutSlash = currentTag.substring(1);
        tagInIgnoredTags = (ignoredTags.indexOf(currentTagWithoutSlash) > -1);
    } else {
        tagInIgnoredTags = (ignoredTags.indexOf(currentTag) > -1);
    }
    return tagInIgnoredTags;
};