# Placeholder Plus

Expanded placeholder functionality for AI Dungeon scenarios.

Features:

- 🔀 Switch plot elements without using multiple choice. You could switch entire paragraphs, or just a word or two.
- ⚧️ Simple way to adapt pronouns based on player's gender choices. Works for non-binary genders and non-conforming pronouns.
- ⚙️ Default values for placeholders that your players can leave empty. This allows you to keep more placeholders optional for the player's convenience.
- ✨ Neater reuse of the same placeholders in different places.
- 🎲 Random elements in your plot components.
- More: touch up player inputs using modifiers, do math, simple scripting.

## What does it look like?

*This section is written as a showcase of what Placeholder Plus can do, not as a proper guide of how to do them. For that, see the [installation guide](#installation) and the [writing guide](writing-guide.md).*

### ✨ Neater

When using AID's built-in \${placeholders}, when you use the same placeholder in multiple places, it could look messy:

> How much \${Enter a material to be chucked:} would a \${Enter a material to be chucked:}chuck chuck if a \${Enter a material to be chucked:}chuck could chuck \${Enter a material to be chucked:}?

But with Placeholder Plus' &lt;&lt;placeholders&gt;&gt;, it could look and read much neater:

> How much &lt;&lt;material&gt;&gt; would a &lt;&lt;material&gt;&gt;chuck chuck if a &lt;&lt;material&gt;&gt;chuck could chuck &lt;&lt;material&gt;&gt;?

To achieve this, Placeholder Plus has a special story card where you define all your variables, like so:

![](var-def-card.png)

    material=${Enter a material to be chucked:}

The right hand side of the equal sign is just a regular ol' \${placeholder}. The left hand side of the equal sign is the name you want to give it, known as a 'variable'. In this case we're calling it `material`. With that set up, you can replace every `${Enter a material to be chucked:}` with a simple `<<material>>`.

### ⚧️ Pronoun adaptation

Placeholder Plus provides an easy way to adapt your plot components to different pronouns. No more maintaining two or more multiple-choice options for different genders!

Suppose you are writing a romance scenario with a love interest named 'Alex' with customizable gender.

In the Placeholder Plus story card, you define the person with a name, and then define their gender:

    person alex=Alex
    alex.gender=${Alex's gender ("Alex is ___."), optional pronouns in parentheses.}

You can use it like this in your plot components:

> &lt;&lt;alex.They&gt;&gt; &lt;&lt;alex.are&gt;&gt; a top student at your university. You are really impressed with &lt;&lt;alex.them&gt;&gt;. &lt;&lt;alex.They&gt;&gt; seem&lt;&lt;alex.s&gt;&gt; to really like you too!

If the player enters `woman`, the plot component will end up looking like this:

> She is a top student at your university. You are really impressed with her. She seems to really like you too!

The player may also specify pronouns in parentheses. E.g. `male (they / them)`:

> They are a top student at your university. You are really impressed with them. They seem to really like you too!

For non-binary genders, some built-in genders default to he/him, some default to she/her, and everything else defaults to they/them.

### ⚙️ Default values for placeholders

&lt;&lt;Placeholder&gt;&gt; variables can be given default values if the player doesn't enter anything.

Suppose you ask for the player's age, and default to 25 if they don't enter anything. You can use the `default` modifier:

    default("25") player_age=${Your age (25 if left empty)}

You could even use another variable's value as your default value. Suppose you are writing a scenario with a dorm roommate, one may assume that the roommate is of the same gender as the player by default, so you could define `roommate.gender` like this:

    default(player.gender) roommate.gender=${Your roommate's gender (same as yours if left empty)}

### 🎲 Random elements and defaults

Maybe you don't want one fixed default age, you want a random default age within a given range. You can use the `randNum` modifier:

    randNum(20, 29) player_age=${Your age (random 20-29 if left empty)}

This would generate a random age between 20 and 29 if the player doesn't enter an age.

You could also pick a random item from a given list of choices using the `random` modifier:

    random("strawberry", 1, "apple", 1, "banana", 2) fruit=${What fruit are you eating? (random 🍓🍎🍌 if left empty)}

This would pick a random fruit among `strawberry`, `apple`, and `banana`. The numbers here represent the odds / how likely each item would be chosen, so `banana` here is twice as likely to be chosen as `strawberry`.

If you just want a random element that the player doesn't get to choose at all, simply set the variable to be empty:

    random("strawberry", 1, "apple", 1, "banana", 2) fruit=
    randNum(1, 6) dice_roll=

### 🔀 Switching plot elements

You can use &lt;&lt;placeholders&gt;&gt; to switch between, show, or hide words, sentences, lines, and even entire paragraphs.

#### Matching player inputs — switch-case placeholders

Suppose you are writing a fantasy scenario with three classes: warrior, archer, and mage.

You could define the variable like so:

    player_class=${What is your class? (warrior, archer, or mage)}

In your plot components, you can switch between different weapons based on the player's chosen class:

> Your weapon is a &lt;&lt;player_class; "warrior" -> "sword"; "archer" -> "bow"; "mage" -> "staff"; "unknown"&gt;&gt;!

What's happening here is you are telling Placeholder Plus to check the variable `player_class`, and see if it matches one of the things you have given on the right. If it matches `warrior`, the &lt;&lt;placeholder&gt;&gt; will end up saying `sword`. If it matches `archer`, the &lt;&lt;placeholder&gt;&gt; will say `bow`. If it matches `mage`, the &lt;&lt;placeholder&gt;&gt; will say `staff`. If it hasn't matched any of those so far, it will say `unknown`.

#### Checking conditions / rules — if-else placeholders

Suppose you are writing a Thanksgiving Day dinner scenario. You may want to assign the player to a different table depending on their age.

Placeholder Plus usually reads everything as text by default, but here you actually need it to treat age as a number. You can use the `integer`, `decimal`, or `number` modifiers in the definition.

    integer player_age=${Your age:}

Now you can do math with `player_age`!

Now you can switch between the kids' table and the grownups' table like this:

> It's Thanksgiving Day. &lt;&lt;; player_age < 18 -> "You got assigned to the kids' table."; "You get to sit at the grownups' table."&gt;&gt;

What's happening here? Let's break it down.
- This is the format for the if-else placeholder: `<<; condition -> if_its_true_show_this; otherwise_show_this>>`
- Here, the condition you are checking for is `player_age < 18`, i.e. whether or not the player character is younger than 18 years old.
- If the player character is indeed younger than 18, the &lt;&lt;placeholder&gt;&gt; would say "You got assigned to the kids' table."
- Otherwise, the &lt;&lt;placeholder&gt;&gt; would say "You get to sit at the grownups' table."

## Installation

1. Use the [AI Dungeon website](https://aidungeon.com/) on PC (or view as desktop if mobile-only)
2. Open the edit page for your scenario
3. Go to the `DETAILS` tab at the top of the edit page
4. Scroll to the bottom and select `EDIT SCRIPTS`
5. Select the `Input` tab on the left
6. Delete all code within said tab
7. Open the Input code in a new browser tab:
    - basic Input code: [link](../src/input.js)
    - if you use it with [LewdLeah's Inner Self](https://github.com/LewdLeah/Inner-Self): [link](../src/input-is.js)
    - if you use it with [LewdLeah's LoLa + Auto-Cards](https://github.com/LewdLeah/Localized-Languages): [link](../src/input-lola.js)
8. Copy the *full* code from the page above and paste into your `Input` tab
9. Select the `Context` tab on the left
10. Delete all code within said tab
11. Open the Context code in a new browser tab:
    - basic Input code: [link](../src/context.js)
    - if you use it with [Inner Self](https://github.com/LewdLeah/Inner-Self): [link](../src/context-is.js)
    - if you use it with [LoLa + Auto-Cards](https://github.com/LewdLeah/Localized-Languages): [link](../src/context-lola.js)
12. Copy the *full* code from the page above and paste into your `Context` tab
13. Select the `Library` tab on the left
14. Open the Library code in a new browser tab: [link](./src/library.js)
15. Copy the *full* code from the page above and paste into the bottom of your `Library` tab
16. Click the big yellow `SAVE` button in the top right corner

## Writing guide

See the [writing guide](writing-guide.md) for how to use &lt;&lt;placeholders&gt;&gt; in your plot components.

## Advanced and niche setup

See the [advanced setup guide](advanced-setup.md) for some advanced and niche options.

## Links

- [An interactive demo scenario](https://play.aidungeon.com/scenario/mFJy0uk4C4gT/placeholder-plus-script). There is an example scenario opening, and you can use "Story" actions to write text containing &lt;&lt;placeholders&gt;&gt;, and see how Placeholder Plus displays the end result.
- [Placeholder Plus thread](https://discord.com/channels/903327676884979802/1458785960517963945) on the official [AI Dungeon Discord server](https://discord.gg/aggzkkKXjk)
