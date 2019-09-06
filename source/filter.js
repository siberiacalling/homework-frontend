module.exports = function () {
    this.filter = filter;
    //etc
};
'use strict';

const replaceAt = (string, index, replace) => {
    return string.substring(0, index) + replace + string.substring(index + 1);
};

let escapeAllExceptTags = (input) => {
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

const filter = function (input, ignoredTagsList) {

    let allTags = input.matchAll(/<(.*?)>/gi);
    allTags = Array.from(allTags);

    if (allTags.length === 0) {
        input = escapeAllExceptTags(input);
        return input;
    }

    let maxNumOfIterations = 0;
    for (let i = 0; i < allTags.length; i++) {
        let tagInIgnoredTags = isTagIgnored(allTags[i][1], ignoredTagsList);
        if (!tagInIgnoredTags) {
            maxNumOfIterations += 1;
        }
    }
    input = escapeAllExceptTags(input);
    if (maxNumOfIterations === 0) {
        return input;
    }

    let numberOfCurrentIteration = 0;
    while (numberOfCurrentIteration !== maxNumOfIterations) {
        numberOfCurrentIteration++;
        allTags = input.matchAll(/<(.*?)>/gi);
        allTags = Array.from(allTags);

        let currentTag = allTags[0][1];
        let tagInIgnoredTags = isTagIgnored(currentTag, ignoredTagsList);
        if (tagInIgnoredTags === false) {
            input = replaceAt(input, allTags[0].index, "&lt;");
            input = replaceAt(input, allTags[0].index + currentTag.length + "&lt;".length, "&gt;");
        }
    }
    return input;
};