// Your "Context" tab should look like this
const modifier = (text) => {
    text = renderContext(text, storyCards, state, info);
    [text, stop] = AutoCards("context", text, stop);
    text = LocalizedLanguages("context", text);
    return { text, stop };
};
modifier(text);
