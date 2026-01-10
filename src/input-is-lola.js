// Your "Input" tab should look like this
const modifier = (text) => {
    globalThis.text = renderInput(text, storyCards, state, info);
    globalThis.text = LocalizedLanguages("input", globalThis.text);
    InnerSelf("input");
    return { text: globalThis.text };
};
modifier(text);