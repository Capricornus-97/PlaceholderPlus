// Your "Context" tab should look like this
const modifier = (text) => {
    globalThis.text = renderContext(text, storyCards, state, info);
    globalThis.text = LocalizedLanguages("context", globalThis.text);
    InnerSelf("context");
    return { text: globalThis.text, stop: globalThis.stop };
};
modifier(text);