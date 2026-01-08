// Your "Input" tab should look like this
const modifier = (text) => {
    text = renderInput(text, storyCards, state, info);
    globalThis.text = LocalizedLanguages("input", text);
    InnerSelf("input");
    return { text: globalThis.text };
};
modifier(text);
