// Your "Context" tab should look like this
const modifier = (text) => {
    text = renderContext(text, storyCards, state, info);
    // Any other context modifier scripts can go here
    return { text };
};
modifier(text);
