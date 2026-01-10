// Your "Input" tab should look like this
const modifier = (text) => {
    globalThis.text = renderInput(text, storyCards, state, info);
    globalThis.text = AutoCards("input", globalThis.text);
    globalThis.text = LocalizedLanguages("input", globalThis.text);
    return { text: globalThis.text };
};
modifier(text);
