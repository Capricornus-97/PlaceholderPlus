// Your "Input" tab should look like this<br>
const modifier = (text) => {
    globalThis.text = renderInput(text, storyCards, state, info);
    InnerSelf("input");
    return { text: globalThis.text };
};
modifier(text);
