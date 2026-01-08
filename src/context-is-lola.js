// Your "Context" tab should look like this
const modifier = (text) => {
    text = renderContext(text, storyCards, state, info);
    globalThis.text = LocalizedLanguages("context", text);
    InnerSelf("context");
    return { text: globalThis.text, stop: globalThis.stop };
};
modifier(text);