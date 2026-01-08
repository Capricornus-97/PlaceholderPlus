# Placeholder Plus advanced and niche setup guide

In the "Input" script code mentioned in the [Installation](#installation) section, there is a part that says `renderInput(text, storyCards, state, info)`. In the "Context" script code, there is `renderContext(text, storyCards, state, info)`. This is the basic way to run Placeholder Plus. For the "full" way to run Placeholder Plus, add the following lines **before** the one that mentions `renderInput`. Do the same for the "Context" script.

```js
let prerenderCards = true;
let interactiveMode = false;
```

Then, in your "Input" script, change your `renderInput(text, storyCards, state, info)` to `renderInput(text, storyCards, state, info, prerenderCards, interactiveMode)`. In your "Context" script, change `renderContext(text, storyCards, state, info)` to `renderContext(text, storyCards, state, info, interactiveMode)`.

For reference, your "Input" script code could look something like this (not necessarily exactly like this):

```javascript
const modifier = (text) => {
  let prerenderCards = true;
  let interactiveMode = false;
  text = renderInput(text, storyCards, state, info, prerenderCards, interactiveMode)
  return { text };
};
modifier(text);
```

## `prerenderCards`: turn off story cards pre-rendering

By default, &lt;&lt;placeholders&gt;&gt; in story cards are filled in on the first turn. However, if you have hundreds of story cards, pre-rendering all of them in the first turn could be too much work at a time, and cause AI Dungeon's script engine to fail. In this case, you may want to turn off pre-rendering so that &lt;&lt;placeholders&gt;&gt; in cards are filled in on-demand rather than all filled in during the first turn, giving the script engine a little more work each turn, but much less work during the first turn. The downside to this is that players see the raw &lt;&lt;placeholders&gt;&gt; rather than normal text where the placeholders have been filled in. Only the AI sees the &lt;&lt;placeholders&gt;&gt; filled in.

However, if we completely turn off pre-rendering, any &lt;&lt;placeholder&gt;&gt; used in the "Triggers" field of your story card would also become non-functional. So, you can also turn off pre-rendering *except* for the "Triggers" field. This should make the workload lighter for the script engine while still allowing you to use &lt;&lt;placeholders&gt;&gt; to customize what triggers your story card for each player.

To do this, set `prerenderCards` like this:
- To fully turn off pre-rendering, set `prerenderCards = false;`.
- To turn off pre-rendering except for triggers, set `prerenderCards = "keys-only";`.

## `interactiveMode`

Placeholder Plus has an "interactive mode". This does three things:

- Usually, Placeholder Plus computes all the variables on the first turn, and then saves them for reuse in subsequent turns. If you turn on interactive mode, Placeholder Plus would re-compute the variables at every turn. This means that if the player knows how to modify your variable definition card, this allows them to change the variables used by your &lt;&lt;placeholder&gt;&gt; at any turn.
- Usually, Placeholder Plus only fills in &lt;&lt;placeholders&gt;&gt; in the input during the first turn, i.e. the opening of your scenario. With interactive mode on, &lt;&lt;placeholders&gt;&gt; in the input are always filled in. That means you can put &lt;&lt;placeholders&gt;&gt; in your Say, Do, and Story actions and they will be filled in.
- Completely turns off story card pre-rendering, regardless of what `prerenderCards` is set to.

Interactive mode is mainly intended for experimenting with your own scenario, so you could change your variables in your variable definition card anytime, and write a placeholder in your action input and see how it's rendered.

The main downside is that randomized variables would end up having different values at every turn. You usually don't want this, because e.g. if you randomize the player's weapon, you want to decide on a random weapon at the start of the adventure and stick with it, not change to a different random weapon at every turn.

To turn on interactive mode, simply set `interactiveMode = true;`.

## `onVarLoad`

If you can write JavaScript, Placeholder Plus also offers a hook that is run when Placeholder Plus' template variables are loaded. For both `renderInput()` and `renderContext()`, you can pass a function as one last argument after `interactiveMode`. The function is given a single argument, which is an object containing all the template variables. You may use this object to further manipulate and change these variables before they are used to render &lt;&lt;placeholders&gt;&gt;, or you can use it to read variables for other uses (e.g. if you have other scripts that you want to behave differently depending on what a player enters into placeholders).
