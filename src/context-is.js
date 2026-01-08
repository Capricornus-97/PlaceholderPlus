// Your "Context" tab should look like this
const modifier = (text) => {
    globalThis.text = renderContext(text, storyCards, state, info);
    InnerSelf("context");
    return { text: globalThis.text, stop: globalThis.stop };
};
modifier(text);
