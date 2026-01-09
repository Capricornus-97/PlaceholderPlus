# Placeholder Plus writing guide

There are two basic concepts to understand about Placeholder Plus:
- &lt;&lt;placeholders&gt;&gt;
- variable definition card

For differentiating between Placeholder Plus' placeholders and AI Dungeon's built-in placeholders, we write it as Placeholder Plus' &lt;&lt;placeholders&gt;&gt; vs AI Dungeon's built-in ${placeholders}.

## Variable definition card

In order for Placeholder Plus to access things that players enter into ${placeholders}, we need a special story card where you can give a name to each of those things that the player enters. These are known as **variables**, and the story card is called the **variable definition card**.

![](var-def-card.png)

The card's Type must be "Placeholder Plus Variables".

A basic variable definition card's entry may look like this:

    // this just defines `greeting` as "Hello!":
    greeting=Hello!

    // this will ask the player for a starting location, like a standard ${placeholder} does,
    //   and then it will define `start_location` to be whatever the player enters:
    start_location=${Where are you at the start of the story?}

Three of the above lines start with `//`. This is known as a "comment". Placeholder Plus doesn't do anything with comments, they are just a way for you to keep notes for yourself.

Each of the other two lines is a variable definition. The basic format for definitions is `variable_name=value`.
- `greeting=Hello!` simply defines `greeting` to be "Hello!".
- `start_location=${Where are you at the start of the story?}` defines `start_location` to be whatever the player enters into the placeholder `${Where are you at the start of the story?}`. This is how Placeholder Plus accesses what the player enters.

## Simple &lt;&lt;placeholder&gt;&gt; usage

Now that we have the `greeting` and `start_location` variables defined, we can use them in plot components. You can write the following scenario opening:

> &lt;&lt;greeting&gt;&gt; The scenario has started. You are currently in &lt;&lt;start_location&gt;&gt;.

Suppose the player entered `the calculus lecture hall` into the placeholder `${Where are you at the start of the story?}`, when they start the adventure, they will see the opening displayed like this:

> **Hello!** The scenario has started. You are currently in **the calculus lecture hall**.

### Where can you use &lt;&lt;placeholders&gt;&gt;?

For these, &lt;&lt;placeholders&gt;&gt; are filled in at the start of the adventure:
- opening
- story cards - title, entry, trigger, notes

For these, players would see the raw &lt;&lt;placeholders&gt;&gt; rather than normal text, but the AI would see them filled in:
- plot essentials
- author's notes
- story summary: you technically could, but it would probably not work very well

For plot essentials and author's notes, it might be a good idea to stick to ${placeholders} unless you really need &lt;&lt;placeholders&gt;&gt;.

## Pronoun utilities

Placeholder Plus provides utilities to make it easy to adapt your plot components for different pronouns.

To start using these utilities, create a Person object by applying the `person` modifier to a variable definition. (We will discuss more on modifiers in the next section.) You can optionally give it the person's name. Here are three different examples:

    person player=${Your name:}
    person alex=Alex
    person anonymous=

You can access the person's name this way:

> Your name is &lt;&lt;player.name&gt;&gt;. &lt;&lt;alex.name&gt;&gt; is a friend of yours.

Now that you have a Person object, you can define the person's gender like this:

    alex.gender=${Alex's gender ("Alex is ___."), optional pronouns in parentheses.}

This will automatically create a bunch of pronoun-related variables, most of which named after the they/them pronoun set. You can use them like this:

> &lt;&lt;alex.They&gt;&gt; &lt;&lt;alex.are&gt;&gt; a top student at your university. You are really impressed with &lt;&lt;alex.them&gt;&gt;. &lt;&lt;alex.They&gt;&gt; seem&lt;&lt;alex.s&gt;&gt; to really like you too!

If the player enters Alex's gender as "woman", the plot component will end up looking like this:

> **She** **is** a top student at your university. You are really impressed with **her**. **She** seem**s** to really like you too!

The player may also specify pronouns in parentheses. E.g. "male (they / them)":

> **They** **are** a top student at your university. You are really impressed with **them**. **They** seem to really like you too!

Here is the full list of pronoun-related variables:

|Variable|Description|
|--------|-----------|
|_.they  |E.g. he, she, they, it|
|_.They  |E.g. He, She, They, It|
|_.them  |E.g. him, her, them, it|
|_.Them  |E.g. Him, Her, Them, It|
|_.their |E.g. his, her, their, its|
|_.Their |E.g. His, Her, Their, Its|
|_.theirs|E.g. his, hers, theirs, its|
|_.Theirs|E.g. His, Hers, Theirs, Its|
|_.s     |Singluar verb '-s' suffix if applicable. Empty '' for they/them pronouns, 's' for all others.|
|_.es    |Singular verb '-es' suffix if applicable. Empty '' for they/them pronouns, 'es' for all others.|
|_.have  |"have" for they/them pronouns, "has" for all others.|
|_.Have  |"Have" for they/them pronouns, "Has" for all others.|
|_.are   |"are" for they/them pronouns, "is" for all others.|
|_.Are   |"Are" for they/them pronouns, "Is" for all others.|
|_.were  |"were" for they/them pronouns, "was" for all others.|
|_.Were  |"Were" for they/them pronouns, "Was" for all others.|
|_.theyre|E.g. "he's", "she's", "they're".|
|_.Theyre|E.g. "He's", "She's", "They're".|
|_.theyve|E.g. "he's", "she's", "they've".|
|_.Theyve|E.g. "He's", "She's", "They've".|
|_.isThey|Whether the pronoun set is they/them, hence whether you should use plural verbs. Either `true` or `false`. Useful when the above are not sufficient, e.g. for verbs with irregular singlar forms.|

<details>

<summary>(Click to expand) Pronoun parsing details / rules</summary>

If no pronoun is specified, Placeholder Plus tries to find a default based on the given gender, using several built-in words:
- he/him: boy / dude / guy / male / man / masc(uline), optionally prefixed with trans / demi / para / libra, suffixed with flux
- she/her: female / fem(inine) / girl / woman, optionally prefixed with trans / demi / para / libra, suffixed with flux
- if neither or both of those are matched, default to they/them, e.g. non-binary / agender / genderfluid default to they/them

The system does not expect the input to be strictly the gender, it only checks if the built-in gender words are contained in the gender information, so "a man with grey hair" and "an old woman" are detected with "man" and "woman" just fine.

The trans / demi / para / libra prefixes and flux suffix can be directly attached to the gender word, hyphenated, or separated with a single space. E.g. "transfeminine", "demi boy", "girl-flux".

If the player does specify pronouns, it has to be in one of two formats:
- nominative pronoun format, e.g. "he/any", "she", "she/they"
   - lists 1 or 2 pronoun sets in the nominative (i.e. subject) form
   - can only be "any", "it", "he", "she", or "they"
   - the system will prefer the 1st listed pronoun that isn't "any". If there is only "any", then it will default to "they".
- pronoun set format, e.g. they/them/their/theirs/themself
   - lists a single pronoun set in its 5 different forms
   - at 3-5 pronouns must be given
   - the 4th item can be automatically generated by taking the 3rd item + 's' (if it doesn't already end in an s)
   - the 5th item can be automatically generated by taking the 2nd item + 'self'
- if the given pronouns do not fit either of the two formats, the script throws an error

</details>

## Modifiers

In the previous section, we saw the use of the `person` modifier:

    person alex=Alex

Early on, we mentioned that the basic format for variable definitions is `variable_name=value`. The full format is actually `optional_modifiers variable_name=value`.

Modifiers modify the value in various ways before it is used to define the variable.

Modifiers may have "arguments", which are additional information you give it to tell it how to modify the value. For example:

    default("25") age=${How old are you?}

The `default` modifier is given the argument `"25"`, which tells it that if the player does not enter an age, it shouold set it to a default age of "25". Argument values may be text (written in double quotes, e.g. `"apple"`), numbers (e.g. `42`), booleans (`true` or `false`), or `null` (a sort of "empty" value, representing that no value is given).

Arguments may also be previously defined variables. For example, if you are writing a scenario with a dorm roommate, one may assume that the roommate is of the same gender as the player by default, so you could define `roommate.gender` like this:

    person player=${Your name:}
    player.gender=${Your gender ("You are ___."), optional pronouns in parentheses.}
    person roommate=${Your roommate's name:}

    // since `player.gender` is already defined, you can use it as the default:
    default(player.gender) roommate.gender=${Your roommate's gender (same as yours if left empty)}

<details>

<summary>(Click to expand) List of modifiers and their details.</summary>

#### trim

Remove leading or trailing spaces.

Example:

    trim player_name=${What is your name?}

If the player enters `Alex ` (with a space ` ` at the end), it will be removed automatically, and `player_name` will be defined as just "Alex".

#### capitalize

Capitalize the first letter.

Example:

    capitalize fav_food=${What is your favorite food?}

If the player enters `pizza`, it will be capitalized, and `fav_food` will be defined as "Pizza".

This is useful for when you're gonna use it at the start of the sentence, e.g. `<<fav_food>> is your favorite food.` You can also use it to make sure the first letter in a name is capitalized.

#### lower

Convert the text to full lowercase.

    lower fav_food=${What is your favorite food?}

If the player enters `Pizza`, it will be lowercased, and `fav_food` will be defined as "pizza".

This is useful for when you're gonna use it at the middle or end of the sentence, e.g. `You are enjoying <<fav_food>>.`

#### number

Read the value as a number rather than just as text. You need this to do math.

    number age=${How old are you?}

If the value cannot be parsed (e.g. if it is formatted weird, or not a number at all), it will give you `NaN`.

With this, you can do math with `age`: `Only <<18 - age>> years left until you're an adult!`

Math will be discussed in a later section.

#### decimal

Read the value as a number up to a given decimal place.

Arguments:
- `places`: number of decimal places
- `rounding` (optional): can be `"round"` (round to the nearest, default), `"floor"` (round down), or `"ceil"` (round up)

    decimal(2) apple_price=${How much do you sell an apple for in dollars?}

#### integer

Read the value as an integer.

Arguments:
- `rounding` (optional): can be `"round"` (round to the nearest, default), `"floor"` (round down), or `"ceil"` (round up)

    integer("floor") age=${How old are you?}

#### enum

Given a list of options, make sure that the value is one of the listed options. Alternatively, if the value is a number n, pick the nth option. If both fails, give a `null` value instead. Case insensitive, ignores leading or trailing spaces.

Arguments:
- `options` (any number)

    enum("apple", "orange", "banana") fruit=${Pick a fruit to eat (apple, orange, or banana)}

If the player enters "apple ", this keeps the value as `"apple"`. If the player enters " 2", this gives the value `"orange"`. If the player enters "5" or "strawberry", this gives the value `null`.

#### range

Constrain a number into a given range. If the number is smaller than `from`, make it the same as `from`. If it is larger than `to`, make it the same as `to`. Use `null` to mean no limit.

Arguments:
- `from`
- `to`

    range(0, null) age=${How old are you?}

Constrain the player's age to be at least 0, with no upper limit, since negative age doesn't make sense.

#### yesNo

Read the value as a boolean (`true` or `false` value). Can understand yes / no / y / n / true / false. Case insensitive, ignores leading or trailing spaces. Anything else gives a `null` value.

    yesNo has_cat=${Do you have a pet cat? 🐈 (yes / no)}

If the player enters "I do", it will end up as a `null` value.

#### default

If the given value is empty (either empty text `""`, text with only spaces, `null`, or `NaN`), give it a default value.

Arguments:
- `default_value`

    default(25) age=${How old are you?}

If the player does not enter a number, the age is set to 25 by default.

#### random

If the given value is empty (either empty text `""`, text with only spaces, `null`, or `NaN`), give it a random choice of one of the options.

Arguments: an alternating list of options and probability weights.

    random("strawberry", 1, "apple", 1, "banana", 2) fruit=${What fruit are you eating? (random 🍓🍎🍌 if left empty)}

If the player does not enter anything, this would pick a random fruit among `"strawberry"`, `"apple"`, and `"banana"`, with `"banana"` being twice as likely as any of the other two.

If you just want a random choice that the player doesn't get to choose at all, simply set the variable to be empty:

    random("strawberry", 1, "apple", 1, "banana", 2) fruit=

#### randNum

If the given value is empty (either empty text `""`, text with only spaces, `null`, or `NaN`), generate a random number in a given range.

Arguments:
- `from`: smallest value that can be generated
- `to`: largest value that can be generated
- `places` (optional): the number of decimal places for the generated number, 0 by default (i.e. generates integers by default)

    randNum(20, 29) player_age=${Your age (random 20-29 if left empty)}

This would generate a random age between 20 and 29 if the player doesn't enter an age.

If you just want a random number that the player doesn't get to choose at all, simply set the variable to be empty:

    randNum(1, 6) dice_roll=

#### person

Create a Person object with the given value as their name. This is the entrypoint to Placeholder Plus' pronoun utilities. See the [Pronoun utilities](#pronoun-utilities) section for more details. Both the name and the gender have leading and trailing spaces trimmed automatically.

Arguments:
- `name`: the person's name

</details>

There can be zero, one, or more modifiers for the same variable definition. When there is more than one, they are applied right-to-left, i.e. the rightmost one gets applied first, the leftmost one gets applied last. For example:

    range(0, null) default(25) integer('floor') player_age=${How old are you?}

1. `integer('floor')` is applied first to read the player's input as an integer, rounded down, e.g. "25.5" would be read as `25`. If the player doesn't enter a number, this will produce `NaN` (which is a special value that stands for "not a number").
2. `default(25)` is applied next so that if the previous step gives `NaN` (i.e. the player doesn't enter a number), the age is set to a default of `25`.
3. `range(0, null)` is applied last to make sure the age entered is set to be at least `0`, with no upper limit, because negative age doesn't make sense.

Another example would be:

    random("warrior", 1, "archer", 1, "mage", 1) enum("warrior", "archer", "mage") player_class=${What is your character class? (warrior, archer, or mage)}

Here, `enum` makes sure that the player can only choose from one of the three pre-defined classes, or otherwise it gets converted to a `null` value. Then, `random` modifier makes sure that if it is indeed a `null` value, a random one will be chosen for the player automatically.

## Swapping plot elements — conditional &lt;&lt;placeholders&gt;&gt;

We have seen that simple &lt;&lt;placeholders&gt;&gt; can be used to insert variables into your plot components. There are more complex forms of &lt;&lt;placeholders&gt;&gt;.

### Matching values — switch-case &lt;&lt;placeholders&gt;&gt;

A switch-case &lt;&lt;placeholder&gt;&gt; looks like this: `<<match_value; case1 -> display_value1; case2 -> display_value2; (any number of cases here); default_display_value>>`

When you do this, you give Placeholder Plus a `match_value`. It will then find the first `case` that equals that `match_value`, and the &lt;&lt;placeholder&gt;&gt; will display the corresponding `display_value` for said `case`. If no matching `case` is found, the &lt;&lt;placeholder&gt;&gt; will display `default_display_value`.

For example, suppose you are writing a fantasy scenario with three classes: warrior, archer, and mage. You could define the variable like so:

    player_class=${What is your class? (warrior, archer, or mage)}

In your plot components, you can change the player's weapon like so:

> Your weapon is a &lt;&lt;player_class; "warrior" -> "sword"; "archer" -> "bow"; "mage" -> "staff"; "unknown"&gt;&gt;!

Placeholder Plus checks the variable `player_class`, and see if it matches one of the cases you have given on the right. If it matches `warrior`, the &lt;&lt;placeholder&gt;&gt; will end up saying `sword`. If it matches `archer`, the &lt;&lt;placeholder&gt;&gt; will say `bow`. If it matches `mage`, the &lt;&lt;placeholder&gt;&gt; will say `staff`. If it hasn't matched any of those so far, it will say `unknown`.

`default_display_value` is optional. When you don't specify it, it is assumed to be empty text `""`:

> Your weapon is a &lt;&lt;player_class; "warrior" -> "sword"; "archer" -> "bow"; "mage" -> "staff"&gt;&gt;!

In this case if the player enters "rogue", your plot component would look like:

> Your weapon is a !

### Checking conditions / rules — if-else &lt;&lt;placeholders&gt;&gt;

An if-else &lt;&lt;placeholder&gt;&gt; looks like this: `<<; condition1 -> display_value1; condition2 -> display_value2; (any number of conditions here); default_display_value>>`

Suppose you are writing a slice-of-life scenario, where the player can choose whether they have a pet cat:

> You sit in the couch in your living room. The familiar hum of the refrigerator rings in the background. &lt;&lt;; has_cat -> "Your cat sleeps lazily under the coffee table."&gt;&gt;

This checks if the `has_cat` variable is `true`, which would display "Your cat sleeps lazily under the coffee table." If `has_cat` is `false`, this entire sentence doesn't display at all, because no default display value is specified so it is assumed to be empty text `""`.

An example with a non-empty default display value would be:

> It's Thanksgiving Day. &lt;&lt;; player_age < 18 -> "You got assigned to the kids' table."; "You get to sit at the grownups' table."&gt;&gt;

If `player_age` is less than 18 (`player_age < 18`), the &lt;&lt;placeholder&gt;&gt; displays "You got assigned to the kids' table." Otherwise, it displays "You get to sit at the grownups' table."

## Intermediate &lt;&lt;placeholder&gt;&gt; usage

Sometimes, a variable isn't enough, and you need to do some things with it to achieve what you want. We've seen just a bit of math used inside &lt;&lt;placeholders&gt;&gt;> with `player_age < 18`, where instead of just using `player_age` directly, you are comparing it to `18`, which would give you a `true` or `false` value of whether they are younger than 18. So what else can we do with variables inside &lt;&lt;placeholders&gt;&gt;?

There are mainly three types of things you can do with a variable: operations, function calls, and method calls.

### Operations

These are what we did in `player_age < 18`. What are some common operators available?

|Operator|Description|Example|
|--------|-----------|-------|
|+|Addition. When used with text, it connects two pieces of text together.| `"bat" + "man"` gives "batman" |
|-|Subtraction||
|*|Multiplication||
|/|Division||
|%|Remainder, i.e. perform division but get the remainder instead of the quotient.||
|**|Power.|`2 ** 3` gives `8`|
|<|Less than||
|<=|Less than or equal to||
|>|Greater than||
|>=|Greater than or equal to||
|===|Equal to||
|!==|Not equal to||
|!|Not. Turns a `true` into a `false` and vice versa.|`!has_cat` means "doesn't have a cat"|
|&&|Logical and. Whether both things are two.|`has_cat && has_dog` means "you have a cat AND you have a dog"|
|\|\||Logical or. Whether at least one of two things is two, could be both.|`has_cat \|\| has_dog` means "you have a cat, a dog, or both"|
|?:|Ternary operator. Similar to "=IF()" in spreadsheets.|`player_rich ? "golden staff" : "wooden staff"`|

You can also use parentheses to group operations together, just like in math:

> It's hot outside, the weather station says it's &lt;&lt;temp&gt;&gt; degrees. But alas you don't understand Fahrenheit, so you ask Google and it tells you that that's equal to &lt;&lt;(temp - 32) * 5 / 9&gt;&gt; degrees Celsius.

### Function calls

If you are familiar with spreadsheet formulas, you already understand functions.

With the example above, you may want to make sure that the temperature in Celsius doesn't come with a bunch of decimal digits. You can do it like this:

> It's hot outside, the weather station says it's &lt;&lt;temp&gt;&gt; degrees. But alas you don't understand Fahrenheit, so you ask Google and it tells you that that's equal to &lt;&lt;Math.round((temp - 32) * 5 / 9)&gt;&gt; degrees Celsius.

Here, you used the function `Math.round` on the mathematical expression `(temp - 32) * 5 / 9`. This function rounds numbers to the nearest integer.

Some available functions are:

|Function  |Description|Example|
|----------|-----------|-------|
|Math.round|Round to the nearest integer.||
|Math.floor|Round down to the nearest smaller integer.||
|Math.ceil |Round up to the nearest greater integer.||
|Math.min  |Find the smallest among a set of numbers.|`Math.min(age1, age2, age3)`, find the age of the youngest person among three people.|
|Math.max  |Find the greatest among a set of numbers.|`Math.max(age1, age2, age3)`, find the age of the oldest person among three people.|
|isNaN     |Check if a number is `NaN`.|`isNaN(NaN)` would give `true`|

There are also a few modifiers that have function versions:

|Function  |Modifier version|Example|
|----------|----------------|-------|
|parseFloat|`number`|`parseFloat("3.14")` would give `3.14`.|
|parseDecimal|`decimal`|`parseDecimal("2.72")` would give `3`, `parseDecimal("2.72", 1)` would give `2.7`.|
|yesNo     |`yesNo`||
|capitalize|`capitalize`||
|evalEnum  |`enum`|`evalEnum(2, ["apple", "orange", "banana"])` would give `"orange"`|
|clamp     |`range`|`clamp(player_age, 0, null)` would give `0` if `player_age` is negative, or otherwise keep `player_age` as is.|

### Method calls

Method calls are like function calls, but written in a slightly different format. Suppose you asked the player for a list of fruits:

    list_of_fruits=${Enter a list of fruits you want to eat.}

You can use a the `.includes` method to check if `list_of_fruits` contains the text "apple", giving either `true` or `false`:

> You only have apples. You &lt;&lt;; list_of_fruits.includes("apple") -> "do"; "do not"&gt;&gt; want to eat apples.

Here are some available methods that you can use with text values:

|Method  |Description|Example|
|--------|-----------|-------|
|text.at |Get the character at the given position. The first character is at position 0, second one is 1, and so on. Negative number counts from the last character, with -1 being the last character.|`"apple".at(-1)` would be `"e"`|
|text.startsWith|Check whether the text starts with another piece of text.|`"Magic".startsWith("Mag")` is `true`|
|text.endsWith|Check whether the text ends with another piece of text.|`"Magic".endsWith("gic")` is `true`|
|text.includes|Check whether the text contains another piece of text.|`"Magic".includes("agi")` is `true`|
|text.replaceAll|Replace all occurences of a piece of text with another.|`"Magnifique".replaceAll("i", "*")` is `"Magn*f*que"`|
|text.toLowerCase|Convert the text to full lowercase.||
|text.toUpperCase|Convert the text to FULL UPPERCASE.||
|text.trim|Remove leading and trailing spaces and newlines.|`"  oopsie ".trim()` is `"oopsie"`|
|text.trimStart|Remove only leading spaces and newlines.||
|text.trimEnd|Remove only trailing spaces and newlines.||

As a bonus, there is also a way to check a text value's length — `text.length`:

> You say "&lt;&lt;player_self_intro&gt;&gt;".
>
> Alex says "&lt;&lt;; player_self_intro.length > 100 -> "Wow that was long."; player_self_intro.length < 20 -> "Oh that's brief."&gt;&gt; Hello, nice to meet you too."

## Whitespace collapsing

Now we know how to display something or not display anything with a &lt;&lt;placeholder&gt;&gt; depending on various conditions. But sometimes this can mess with the spacing of things. Take the above example:

> Alex says "&lt;&lt;; player_self_intro.length > 100 -> "Wow that was long."; player_self_intro.length < 20 -> "Oh that's brief."&gt;&gt; Hello, nice to meet you too."

If the player's self-introduction is indeed between 20 and 100 characters long, the &lt;&lt;placeholder&gt;&gt; would not display text, and the end result would look like:

> Alex says " Hello, nice to meet you too."

Now there is an awkward space between the opening double-quote `"` and the word `Hello`.

One solution to this is to move that extra space so that it is part of the &lt;&lt;placeholder&gt;&gt;:

> Alex says "&lt;&lt;; player_self_intro.length > 100 -> "Wow that was long. "; player_self_intro.length < 20 -> "Oh that's brief. "&gt;&gt;Hello, nice to meet you too."

But Placeholder Plus provides an alternative solution: use the &lt;&lt;~placeholder&gt;&gt; format. The tilde `~` tells Placeholder Plus to perform "whitespace collapsing" if its contents happen to be empty, which automatically removes awkward spaces like these. If the contents are not empty, it doesn't do anything different. So now you can avoid the awkward space like this:

> Alex says "&lt;&lt;~; player_self_intro.length > 100 -> "Wow that was long."; player_self_intro.length < 20 -> "Oh that's brief."&gt;&gt; Hello, nice to meet you too."

Whitespace collapsing works for single newlines and double newlines as well:

> The quick brown fox jumps over the lazy dog.  
> &lt;&lt;~ false; true -> "This line will never be shown."&gt;&gt;  
> Woodchucks don't actually chuck wood.
> 
> &lt;&lt;~ false; true -> "This paragraph will never be shown."&gt;&gt;
>
> This is a whole new paragraph.

Since both of these &lt;&lt;placeholders&gt;&gt; end up empty and use the `~` flag, the end result will look like:

> The quick brown fox jumps over the lazy dog.  
> Woodchucks don't actually chuck wood.
> 
> This is a whole new paragraph.

<details>

<summary>(Click to expand) Details for how whitespace collapsing decides what spaces to remove.</summary>

Placeholder Plus looks to an empty placeholder's left and right to find spaces and newlines. There are three things it could potentially remove: a single space, a single newline, or a double newline. A single space is preferred, and then a single newline, and the double newline is the least preferred.

So for example, let's say you are at the start of a new line or a new paragraph, to your left you have one or two newlines. To your right you have a space. Whitespace collapsing is going to prefer removing the space on the right. Example:

> Previous paragraph.
> 
> &lt;&lt;~; display_optional_sent -> "Optional first sentence for this paragraph."&gt;&gt; The rest of the paragraph...

</details>

## "Script disabled" notice

If the player has scripts disabled, or uses a model that doesn't support scripts, the &lt;&lt;placeholders&gt;&gt; will not work. In such situations, you can display a notice by including the following line in your opening:

> &lt;&lt;~"⚠️ If you are reading this, this may mean you have disabled scripts, or are using a model that does not support scripts. This scenario may not work properly without scripts. Please enable scripts or switch to a model that supports scripts, and then restart the scenario. ⚠️"&&""&gt;&gt;

If scripts are running normally, this notice should disappear automatically, as the `&&""` part at the end ensures that this &lt;&lt;placeholder&gt;&gt; always ends up being empty.

If you are only using &lt;&lt;placeholders&gt;&gt; in the opening and story cards, which are filled in at the start of the adventure, you may use the following instead:

> &lt;&lt;~"⚠️ If you are reading this, this may mean you have disabled scripts, or are using a model that does not support scripts. This scenario needs to run scripts on the first turn only. Please enable scripts or switch to a model that supports scripts, and then restart the scenario. Once the scenario is successfully started, you may disable scripts again and use any model you wish. ⚠️"&&""&gt;&gt;

## Variable definition scripting

If the modifiers and placeholders are not powerful enough for what you want to do, or if you find yourself repeating the same &lt;&lt;placeholders&gt;&gt; quite a bit, you may want to do a little bit of simple scripting right in the variable definition card.

You can write JavaScript in the **Notes** section of the variable definition card to create new "convenience" variables, modify the player's inputs further, or add a couple simple rules to your scenario.

Let's say you keep using `(temp - 32) * 5 / 9` in your &lt;&lt;placeholders&gt;&gt;, you can create a variable `temp_c` once and for all:

```js
vars.temp_c = (vars.temp - 32) * 5 / 9
```

And now you can just use `temp_c` in your placeholders instead of using `(temp - 32) * 5 / 9` every time.

## For the technically inclined: JavaScript &lt;&lt;placeholder&gt;&gt; syntax

We have seen that &lt;&lt;placeholder&gt;&gt; syntax looks like this: `<<expression; expression -> expression; expression -> expression; ...; expression>>`

If you are familiar with JavaScript, by now you have probably noticed that the syntax for these expressions is really just JavaScript syntax. The big caveat is that because Placeholder Plus uses semicolons `;` for the &lt;&lt;placeholder&gt;&gt; syntax, these JavaScript expressions themselves cannot contain semicolons. An exception is made for semicolons contained in single-quoted and double-quoted strings, which are easy to parse. There are a few things whose functionality may be impacted by this:
- template strings
- regexes
- arrow functions with blocks
- function expressions
- class expressions

If you really need to use these things while having semicolons inside them, you may put them in the script in the Notes section of the variable definition card instead.
