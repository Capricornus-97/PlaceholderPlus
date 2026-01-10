// Your "Context" tab should look like this
const modifier = (text) => {
    globalThis.text = renderContext(text, storyCards, state, info);
    [globalThis.text, stop] = AutoCards("context", globalThis.text, stop);
    globalThis.text = LocalizedLanguages("context", globalThis.text);
    return { text: globalThis.text, stop };
};
modifier(text);
