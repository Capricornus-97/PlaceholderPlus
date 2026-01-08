/////////////////////////////////////////////////////////////////
// Start of Placeholder Plus
/////////////////////////////////////////////////////////////////

const INTEGER_REGEX = /^\s*\d+\s*$/

/**
 * Parse 'yes', 'no', 'y', 'n', and 'true', 'false'. Case insensitive.
 * @param {string} x
 * @returns {boolean}
 */
function yesNo(x) {
    x = x.trim().toLowerCase()
    if (['yes', 'true', 'y'].includes(x)) {
        return true
    } else if (['no', 'false', 'n'].includes(x)) {
        return false
    } else {
        return null
    }
}

/**
 * Pick a random element from an array.
 * @template T
 * @param {T[]} options
 * @param {number[]?} weights The weight of being chosen for each option. 1 if not specified for that element.
 * @returns {T}
 */
function choice(options, weights) {
    weights = (weights ?? []).slice(0, options.length)
    const cumWeights = [0]
    for (let i = 0; i < options.length; i++) {
        cumWeights.push((weights[i] ?? 1) + cumWeights)
    }
    const rand = Math.random() * options.length
    let i = 0
    while (cumWeights[i + 1] < rand) {
        i++
    }
    return options[i]
}

/**
 * Generate a random decimal number in a given range.
 * @param {number} from_
 * @param {number} to
 * @param {number} decimalPlaces 0 by default, hence integers.
 * @returns number
 */
function randDec(from_, to, decimalPlaces) {
    const stepSize = 10 ** (decimalPlaces ?? 0)
    const nSteps = Math.floor((to - from_) / stepSize) + 1
    const step = Math.floor(Math.random() * nSteps)
    return from_ + step * stepSize
}

/**
 * Capitalize the first character in a string.
 * @param {string} s
 * @returns {string}
 */
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * Given a string and options, return an option specified by the string.
 * The string may directly spell out the option, or a 1-based index.
 * @param {string} s
 * @param {string[]} options
 * @returns {string?}
 */
function evalEnum(s, options) {
    options = options.map(s => s.toLowerCase())
    s = s.trim().toLowerCase()
    if (options.includes(s)) {
        return s
    } else if (s.match(INTEGER_REGEX)) {
        const idx = parseInt(s) - 1
        return options[idx]
    } else {
        return null
    }
}

/**
 * Parse a number up to a fixed decimal place, with the specified rounding method.
 * @param {string} s
 * @param {number?} places 0 by default, hence integer.
 * @param {'round' | 'ceil' | 'floor'} rounding
 * @returns {number}
 */
function parseDecimal(s, places, rounding) {
    const scale = 10 ** (places ?? 0)
    const roundFunc = Math[rounding ?? 'round']
    return roundFunc(parseFloat(s) * scale) / scale
}

/**
 * Constrain a number within a given range, rounding to the boundary value if the number lies outside of it.
 * @param {number} val
 * @param {number?} from_
 * @param {number?} to
 * @returns {number}
 */
function clamp(val, from_, to) {
    if (from_ != null) {
        val = Math.max(from_, val)
    }
    if (to != null) {
        val = Math.min(to, val)
    }
    return val
}

/////////////////////////////////////////////////////////////////
// Pronoun support utilities
/////////////////////////////////////////////////////////////////

BUILTIN_PRONOUN_SETS = {
    "he": ["he", "him", "his", "his", "himself"],
    "she": ["she", "her", "her", "hers", "herself"],
    "they": ["they", "them", "their", "theirs", "themself"],
    "it": ["it", "it", "its", "its", "itself"],
}

PRONOUN_REGEX = /\(\s*(\w[\w']*(?:\s*\/\s*\w[\w']*){0,4})\s*\)/i
HE_GENDER_REGEX = /(?<!\w)(?:(?:trans|demi|para|libra)[-\s]?)?(?:boy|dude|guy|male|man|masc(?:uline)?)(?:[-\s]?flux)?/i
SHE_GENDER_REGEX = /(?<!\w)(?:(?:trans|demi|para|libra)[-\s]?)?(?:female|girl|woman|fem(?:inine)?)(?:[-\s]?flux)?/i

/**
 * Parse a pronoun set specification separated by slashes.
 * @param {string} pronouns
 * @returns {[string, string, string, string, string]}
 */
function parsePronounSet(pronouns) {
    let pronounSet = pronouns.split('/').map(s => s.trim())

    // cases with 3-5 pronouns
    if (pronounSet.length === 3) {
        pronounSet.push(
            pronounSet[2] + (pronounSet[2].endsWith('s') ? '' : 's')
        )
    }
    if (pronounSet.length === 4) {
        pronounSet.push(pronounSet[1] + 'self')
    }
    if (pronounSet.length === 5) {
        return pronounSet
    }
    if (pronounSet.length > 5) {
        return null
    }

    // cases with 1-2 pronouns: take the first non-any choice, default to 'they'
    const nominativePronoun = pronounSet[0] === 'any' ? pronounSet[1] ?? 'they' : pronounSet[0]
    return BUILTIN_PRONOUN_SETS[nominativePronoun]
}

/**
 * Attempt to get a pronoun set from gender information.
 * The gender info may contain a pronoun specification in parentheses.
 * @param {string} genderInfo
 * @returns {[string, string, string, string, string]}
 */
function getPronounSet(genderInfo) {
    const match = genderInfo.match(PRONOUN_REGEX)
    if (match) {
        const pronounSet = parsePronounSet(match[1])
        if (!pronounSet) {
            throw new RangeError(`Unable to parse pronoun set '${match[1]}'.`)
        }
        return pronounSet
    }
    const matchHe = genderInfo.match(HE_GENDER_REGEX)
    const matchShe = genderInfo.match(SHE_GENDER_REGEX)
    if (matchHe && !matchShe) {
        return BUILTIN_PRONOUN_SETS['he']
    } else if (matchShe && !matchHe) {
        return BUILTIN_PRONOUN_SETS['she']
    } else {
        return BUILTIN_PRONOUN_SETS['they']
    }
}

/**
 * A person with a name, gender, and pronoun-related fields.
 */
class Person {
    #genderInfo

    /**
     * @param {string} name
     */
    constructor(name) {
        this.name = name
    }

    /**
     * The person's gender. Assigning to this auto-generates pronoun-related fields.
     * @param {string} genderInfo
     */
    set gender(genderInfo) {
        this.#genderInfo = genderInfo

        if (genderInfo == null) {
            return
        }

        const pronounSet = getPronounSet(genderInfo)
        const THEY_PRONOUN_SET = BUILTIN_PRONOUN_SETS['they']
        // generate the pronoun variables themselves
        pronounSet.forEach((pronoun, idx) => {
            this[THEY_PRONOUN_SET[idx]] = pronoun
            this[capitalize(THEY_PRONOUN_SET[idx])] = capitalize(pronoun)
        })
        this.isThey = pronounSet[0] === THEY_PRONOUN_SET[0]
        this.s = this.isThey ? '' : 's'
        this.es = this.isThey ? '' : 'es'
        this.have = this.isThey ? 'have' : 'has'
        this.Have = this.isThey ? 'Have' : 'Has'
        this.are = this.isThey ? 'are' : 'is'
        this.Are = this.isThey ? 'Are' : 'Is'
        this.theyre = this.isThey ? "they're" : this.they + "'s"
        this.Theyre = this.isThey ? "They're" : this.They + "'s"
        this.theyve = this.isThey ? "they've" : this.they + "'s"
        this.Theyve = this.isThey ? "They've" : this.They + "'s"
        this.were = this.isThey ? 'were' : 'was'
        this.Were = this.isThey ? 'Were' : 'Was'
    }

    get gender() {
        return this.#genderInfo
    }

    toString() {
        return this.name
    }

    toJSON() {
        return {
            ...this,
            gender: this.#genderInfo
        }
    }
}

/////////////////////////////////////////////////////////////////
// Template variable loading
/////////////////////////////////////////////////////////////////

const VARIABLE_STORY_CARD_TYPE = 'Placeholder Plus Variables'

/**
 * Build a `random` transformation: choose a random element if input is null.
 * @template T
 * @param {(T | number)[]} args
 * @return {function(T?): T}
 */
function randomTransform(...args) {
    const options = []
    const weights = []
    for (let i = 0; i < args.length; i++) {
        if (args[i + 1] != null) {
            options.push(args[i])
            options.push(args[i + 1])
        }
    }
    return (val) => {
        if (val == null || val.trim?.() === '' || isNaN(v)) {
            return choice(options, weights)
        } else {
            return val
        }
    }
}

/**
 * Build a `randDec` transformation: generate a random decimal number in a given range if input is null.
 * @param {number} from_
 * @param {number} to
 * @param {number?} decimalPlaces 0 by default, hence integer.
 * @return {function(number?): number}
 */
function randDecTransform(from_, to, decimalPlaces) {
    return (val) => {
        if (val == null || val.trim?.() === '' || isNaN(v)) {
            return randDec(from_, to, decimalPlaces)
        } else {
            return val
        }
    }
}

const VAR_DEF_TRANSFORMS = {
    "trim": () => (s => s.trim()),
    "capitalize": () => capitalize,
    "lower": () => (s => s.toLowerCase()),
    "number": () => parseFloat,
    "decimal": (places, rounding) => (val => parseDecimal(val, places, rounding)),
    "integer": (rounding) => (val => parseDecimal(val, 0, rounding)),
    "enum": (...options) => (val => evalEnum(val, options)),
    "range": (from_, to) => (val => clamp(val, from_, to)),
    "yesNo": () => yesNo,
    "default": d => (v => (v == null || v.trim?.() === '' || isNaN(v)) ? d : v),
    "random": randomTransform,
    "randNum": randDecTransform,
    "person": () => (s => new Person(s)),
}

const COMMENT_REGEX = /^\s*\/\//
const DEF_REGEX = /^\s*((?:[A-Za-z_\$][\w\$]*(?:\((?:"(?:[^"\\]|\\.)*"|[^)="])*\))?\s+)*)([A-Za-z_\$][\w\$]*(?:\.[A-Za-z_\$][\w\$]*)*)\s*=(.*)$/
const TRANSFORM_REGEX = /([A-Za-z_\$][\w\$]*)(?:\(((?:"(?:[^"\\]|\\.)*"|[^)="])*)\))?/g
const TRANSFORM_ARG_REGEX = /"(?:[^"\\]|\\.)*"|[^,"]*/
const VAR_REGEX = /^[A-Za-z_\$][\w\$]*(?:\.[A-Za-z_\$][\w\$]*)*/

/**
 * Build a chain of variable definition transformations.
 * @param {string} transformSpec
 * @param {object} vars
 * @returns {(function(any): any)[]}
 */
function buildTransforms(transformSpec, vars) {
    const transformExprs = transformSpec.matchAll(TRANSFORM_REGEX)
    const transforms = []
    for (const [_, transformName, argList] of transformExprs) {
        if (!(transformName in VAR_DEF_TRANSFORMS)) {
            throw new ReferenceError(`Unsupported transform '${transformName}'`)
        }
        const argVals = []
        if (argList) {
            const argExprs = argList.matchAll(TRANSFORM_ARG_REGEX)
            for (let [argExpr] of argExprs) {
                argExpr = argExpr.trim()
                if (argExpr.match(VAR_REGEX)) {
                    const varPath = argExpr.split('.')
                    const val = varPath.reduce((obj, key) => obj[key], vars)
                    argVals.push(val)
                } else {
                    argVals.push(JSON.parse(argExpr))
                }
            }
        }
        transforms.push(VAR_DEF_TRANSFORMS[transformName](...argVals))
    }
    transforms.reverse()
    return transforms
}

/**
 * Execute a variable definition statement.
 * @param {string} line
 * @param {object} vars
 * @returns {void}
 */
function execVarDef(line, vars) {
    const match = line.match(DEF_REGEX)
    if (!match) {
        throw new SyntaxError(`Invalid variable definition syntax: ${line}`)
    }
    const [_, transformSpec, varPath, rawValue] = match
    const transforms = buildTransforms(transformSpec, vars)

    const varPathKeys = varPath.split('.')
    const value = transforms.reduce(
        (val, transform) => transform(val),
        rawValue,
    )
    const parentObj = varPathKeys.slice(0, -1).reduce((obj, key) => obj[key], vars)
    parentObj[varPathKeys.at(-1)] = value
}

/**
 * Run a variable definition script.
 * @param {string} script
 * @returns {object} An object containing the variables defined.
 */
function runVarDefs(script) {
    const vars = {}
    for (const line of script.split('\n')) {
        if (line.trim() && !line.match(COMMENT_REGEX)) {
            execVarDef(line, vars)
        }
    }
    return vars
}

/**
 * Run the variable manipulation script.
 * @param {string} script Must be valid JS code.
 * @param {object} vars
 * @return {void}
 */
function runScript(script, vars) {
    const func = new ([].filter.constructor)('vars', script)
    func.call(undefined, vars)
}

/**
 * Load variables by running the variable definition and manipulation scripts.
 * @param storyCards
 * @param state
 * @param {boolean} useCache Whether to use `state` for caching the variables.
 * @param {(function(object): void)?} onLoad
 * @returns {object} An object containing the variables loaded.
 */
function loadVariables(storyCards, state, useCache, onLoad) {
    let vars
    if (state.ppVars == null || useCache === false) {
        const configCard = storyCards.find(({ type }) => type === VARIABLE_STORY_CARD_TYPE)
        if (!configCard) {
            return {}
        }
        vars = runVarDefs(configCard.entry)
        runScript(configCard.description, vars)
        // simplify it into a JSON object form, makes sure serialization doesn't change it
        vars = JSON.parse(JSON.stringify(vars))
        if (useCache !== false) {
            state.ppVars = vars
        }
    } else {
        vars = state.ppVars
    }
    onLoad?.(vars)
    return vars
}

/////////////////////////////////////////////////////////////////
// Template rendering
/////////////////////////////////////////////////////////////////

const PLACEHOLDER_REGEX = /<<(~)?((?:(?!>>).)*)>>/
const PLACEHOLDER_BODY_REGEX = /^((?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^;"'])*)(;.*)?$/
const CASE_REGEX = /;(?:((?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^;"'])*)->)?((?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^;"'])+)/

/**
 * @param {string} template
 * @returns {{type: "placeholder" | "static", body: string, collapseWhitespace: boolean}[]}
 */
function parseTemplate(template) {
    const rawSplit = template.split(PLACEHOLDER_REGEX)
    const fragments = []
    for (let i = 0; i < rawSplit.length; i++) {
        if (i % 3 === 1) {
            continue
        }
        fragments.push({
            type: i % 3 ? "placeholder" : "static",
            body: rawSplit[i],
            collapseWhitespace: !!(i % 3) && !!rawSplit[i - 1],
        })
    }
    return fragments
}

/**
 * Evaluate an expression inside a placeholder.
 * We support any JS expression syntax that does not contain a semicolon, except inside single- or double-quoted strings.
 * @param {string} expr
 * @param {object} vars
 * @returns {any}
 */
function evalExpr(expr, vars) {
    const paramNames = []
    const paramVals = []
    for (const k in vars) {
        paramNames.push(k)
        paramVals.push(vars[k])
    }
    const func = new ([].filter.constructor)(...paramNames, "return " + expr)
    return func.apply(undefined, paramVals)
}

/**
 * Evaluate a placeholder.
 * @param {string} placeholderBody
 * @param {object} vars
 * @returns {any}
 */
function evalPlaceholder(placeholderBody, vars) {
    const match = placeholderBody.match(PLACEHOLDER_BODY_REGEX)
    // simple placeholder case
    if (!match[2]) {
        return evalExpr(placeholderBody, vars)
    }
    // switch placeholder case
    const [_, switchVarExpr, casesClause] = match
    const switchVarVal = switchVarExpr.trim() ? evalExpr(switchVarExpr, vars) : true
    const caseExprs = casesClause.split(CASE_REGEX)
    for (let i = 1; i < caseExprs.length; i += 3) {
        if (!(caseExprs[i]?.trim()) || switchVarVal === evalExpr(caseExprs[i], vars)) {
            return evalExpr(caseExprs[i + 1], vars)
        }
    }
    return ""
}

/**
 * Return whitespace collapsing priority level for a string.
 * @param {string} s
 * @param {'left' | 'right'} side
 */
function collapseLevel(s, side) {
    s = side === 'left' ? s.slice(-2) : s.slice(0, 2)
    if (s === '\n\n') {
        return 1
    } else if (s.at(side === 'left' ? -1 : 0) === '\n') {
        return 2
    } else if (s.at(side === 'left' ? -1 : 0) === ' ') {
        return 3
    } else {
        return 0    // never gets trimmed
    }
}

/**
 * @param {string} template
 * @param {object} vars
 * @returns string
 */
function renderTemplate(template, vars) {
    const parse = parseTemplate(template)
    const fragments = parse.map((fragment) => {
        let body
        if (fragment.type === 'static') {
            body = fragment.body
        } else {
            body = String(evalPlaceholder(fragment.body, vars))
        }
        return { ...fragment, body }
    })
    for (let i = 1; i < fragments.length; i += 2) {
        if (fragments[i].body === '' && fragments[i].collapseWhitespace) {
            const leftCollapseLevel = collapseLevel(fragments[i - 1].body, 'left')
            const rightCollapseLevel = collapseLevel(fragments[i + 1].body, 'right')
            if (leftCollapseLevel > rightCollapseLevel) {
                fragments[i - 1].body = fragments[i - 1].body.slice(0, leftCollapseLevel === 1 ? -2 : -1)
            } else if (rightCollapseLevel > 0) {
                fragments[i + 1].body = fragments[i + 1].body.slice(rightCollapseLevel === 1 ? 2 : 1)
            }
        }
    }
    return fragments.map(frag => frag.body).join('')
}

/**
 * Render plot components for the input hook: input text and story cards.
 * @param {string} text Input text
 * @param storyCards
 * @param state
 * @param info
 * @param {(boolean | 'keys-only')?} prerenderCards If false, turns off card rendering. If 'keys-only', only render the key field.
 * @param {boolean?} interactiveMode Allows for updating variables. Turns off caching and card rendering. Always renders.
 * @param {(function(object): void)?} onVarLoad
 * @returns {string}
 */
function renderInput(text, storyCards, state, info, prerenderCards, interactiveMode, onVarLoad) {
    if (info.actionCount !== 0 && !interactiveMode) {
        return text
    }
    const templateVars = loadVariables(storyCards, state, !interactiveMode, onVarLoad)
    if (prerenderCards !== false && !interactiveMode) {
        storyCards.forEach(card => {
            if (card.type === VARIABLE_STORY_CARD_TYPE) {
                return
            }
            card.keys = renderTemplate(card.keys, templateVars)
            if (prerenderCards !== 'keys-only') {
                card.title = renderTemplate(card.title, templateVars)
                card.entry = renderTemplate(card.entry, templateVars)
                card.description = renderTemplate(card.description, templateVars)
            }
        })
    }
    return renderTemplate(text, templateVars)
}

const RECENT_STORY_MARKER = "\nRecent Story:\n"
/**
 * Truncate recent story to fit into max context length.
 * @param {string} context 
 * @param {number} maxLength 
 * @returns {string}
 */
function fitContext(context, maxLength) {
    const lengthToCut = Math.max(context.length - maxLength, 0)
    if (lengthToCut) {
        const startIdx = context.indexOf(RECENT_STORY_MARKER) + RECENT_STORY_MARKER.length
        return context.slice(0, startIdx) + context.slice(startIdx + lengthToCut)
    }
    return context
}

/**
 * Render plot components for the context hook: context text.
 * @param {string} text
 * @param storyCards
 * @param state
 * @param info
 * @param {boolean?} interactiveMode Allows for updating variables. Turns off caching.
 * @param {(function(object): void)?} onVarLoad
 * @returns {string}
 */
function renderContext(text, storyCards, state, info, interactiveMode, onVarLoad) {
    const templateVars = loadVariables(storyCards, state, !interactiveMode, onVarLoad)
    return fitContext(renderTemplate(text, templateVars), info.maxChars)
}

/////////////////////////////////////////////////////////////////
// End of Placeholder Plus
/////////////////////////////////////////////////////////////////
