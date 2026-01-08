// Your "Input" tab should look like this
const modifier = (text) => {
    text = renderInput(text, storyCards, state, info);
    text = AutoCards("input", text);
    text = LocalizedLanguages("input", text);
    return { text };
};
modifier(text);
