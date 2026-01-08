// Your "Input" tab should look like this
const modifier = (text) => {
    text = renderInput(text, storyCards, state, info)
    // Any other input modifier scripts can go here
    return { text };
};
modifier(text);
