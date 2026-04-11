export interface Feedback {
  type: 'success' | 'error' | 'info';
  titleEN: string;
  titleKIN: string;
  explanationEN: string;
  explanationKIN: string;
  fix?: string;
  category: 'syntax' | 'runtime' | 'logic' | 'general';
}

interface ErrorPattern {
  id: string;
  match: (error: string, code: string) => boolean;
  build: (error: string, code: string) => Feedback;
}

const patterns: ErrorPattern[] = [
  // 1. Undefined variable
  {
    id: 'undefined_variable',
    match: (err) => /ReferenceError: (\w+) is not defined/.test(err),
    build: (err) => {
      const name = err.match(/ReferenceError: (\w+) is not defined/)?.[1] ?? 'variable';
      return {
        type: 'error',
        titleEN: 'Variable Not Declared',
        titleKIN: 'Umuhindagurika Utashyizweho',
        explanationEN: `You're using '${name}' before declaring it. Variables must be declared with let, const, or var before use.`,
        explanationKIN: `Uragerageza gukoresha '${name}' ariko ntiwawushyizeho mbere. Umuhindagurika ugomba gushyirwaho na 'let', 'const', cyangwa 'var' mbere yo kuwukoresha.`,
        fix: `const ${name} = /* your value here */;`,
        category: 'runtime'
      };
    }
  },

  // 2. Not a function
  {
    id: 'not_a_function',
    match: (err) => /TypeError: .+ is not a function/.test(err),
    build: (err) => {
      const name = err.match(/TypeError: (.+) is not a function/)?.[1] ?? 'it';
      return {
        type: 'error',
        titleEN: 'Called Something That Is Not a Function',
        titleKIN: 'Wahamagaye Ikintu Kitari Fonction',
        explanationEN: `${name} is not a function. Check that you defined it with 'function' or as an arrow function, and that you're calling it correctly with ().`,
        explanationKIN: `${name} ntabwo ari fonction. Genzura ko wayishyizeho na 'function' kandi uyihamagara neza na ().`,
        category: 'runtime'
      };
    }
  },

  // 3. Cannot read property of undefined/null
  {
    id: 'null_property',
    match: (err) => /TypeError: Cannot read propert/.test(err) || /TypeError: .+ is (null|undefined)/.test(err),
    build: (err) => {
      return {
        type: 'error',
        titleEN: 'Accessing Property of Undefined Value',
        titleKIN: 'Ugeze ku Kintu Kidafite Agaciro',
        explanationEN: 'You are trying to access a property or method on something that is undefined or null. Check that the variable has a value before using it.',
        explanationKIN: 'Uragerageza kugera ku kintu cyangwa uburyo bw\'ikintu kitafite agaciro (undefined cyangwa null). Genzura ko umuhindagurika ufite agaciro mbere yo kuwukoresha.',
        category: 'runtime'
      };
    }
  },

  // 4. Unexpected token / syntax error
  {
    id: 'syntax_error',
    match: (err) => /SyntaxError/.test(err),
    build: (err) => {
      const detail = err.replace('SyntaxError: ', '');
      return {
        type: 'error',
        titleEN: 'Syntax Error',
        titleKIN: 'Ikosa ryo Kwandika Kode',
        explanationEN: `There is a writing mistake in your code: ${detail}. Check for missing brackets, parentheses, or semicolons.`,
        explanationKIN: `Hari ikosa mu kwandika kode yawe: ${detail}. Genzura niba habura ')', '}', ']', cyangwa ';'.`,
        category: 'syntax'
      };
    }
  },

  // 5. Uncaught RangeError (stack overflow / invalid array length)
  {
    id: 'range_error',
    match: (err) => /RangeError/.test(err),
    build: (err) => {
      const isStack = err.includes('stack');
      return {
        type: 'error',
        titleEN: isStack ? 'Infinite Recursion (Stack Overflow)' : 'Value Out of Range',
        titleKIN: isStack ? 'Kwiyitira Bikabije (Stack Overflow)' : 'Umubare Uri Hanze y\'Ingano',
        explanationEN: isStack
          ? 'Your function is calling itself too many times. Make sure your recursive function has a base case that stops it.'
          : err.replace('RangeError: ', '') + '. Check that your numbers and array sizes are within valid limits.',
        explanationKIN: isStack
          ? 'Fonction yawe yiyitira kenshi cyane. Genzura ko yihagarika ku gihe.'
          : 'Genzura ko imibare n\'ingano z\'arrays iri mu mipaka ishoboka.',
        category: 'runtime'
      };
    }
  },

  // 6. Assignment to constant
  {
    id: 'const_assignment',
    match: (err) => /TypeError: Assignment to constant variable/.test(err),
    build: () => ({
      type: 'error',
      titleEN: 'Cannot Change a Constant',
      titleKIN: 'Ntushobora Guhindura Constant',
      explanationEN: "You're trying to change a variable declared with 'const'. Use 'let' instead if you need to change the value.",
      explanationKIN: "Uragerageza guhindura umuhindagurika washyizweho na 'const'. Koresha 'let' niba ugomba guhindura agaciro.",
      category: 'runtime'
    })
  },

  // 7. Undefined is not iterable
  {
    id: 'not_iterable',
    match: (err) => /TypeError: .+ is not iterable/.test(err),
    build: () => ({
      type: 'error',
      titleEN: 'Trying to Loop Over a Non-Array',
      titleKIN: 'Uragerageza Gukora Loop ku Kintu Kitari Array',
      explanationEN: "You're trying to loop over something that isn't an array or list. Make sure the variable is an array before using for...of or forEach.",
      explanationKIN: "Uragerageza gukora loop ku kintu kitari array. Genzura ko umuhindagurika ari array mbere yo gukoresha for...of cyangwa forEach.",
      category: 'runtime'
    })
  },

  // 8. Maximum call stack
  {
    id: 'max_call_stack',
    match: (err) => /Maximum call stack size exceeded/.test(err),
    build: () => ({
      type: 'error',
      titleEN: 'Infinite Loop or Recursion',
      titleKIN: 'Loop Idahera cyangwa Kwiyitira Bidahera',
      explanationEN: 'Your code is running in circles forever. Check your loops and recursive functions — make sure they have a stopping condition.',
      explanationKIN: 'Kode yawe irota mu nzira zidahera. Genzura loops n\'imikorere yiyitira — genzura ko zifite uburyo bwo guhagarika.',
      category: 'logic'
    })
  },

  // 9. JSON parse error
  {
    id: 'json_parse',
    match: (err) => /JSON/.test(err) && /parse/.test(err),
    build: () => ({
      type: 'error',
      titleEN: 'Invalid JSON Format',
      titleKIN: 'Imiterere ya JSON Itari Nziza',
      explanationEN: "The text you're trying to parse as JSON is not valid. Make sure it uses double quotes and correct JSON syntax.",
      explanationKIN: "Inyandiko uragerageza gusesengura nka JSON ntabwo ari yo. Genzura ko ikoresha imvugo nziza ya JSON hamwe na quotes zikurikiranye.",
      category: 'runtime'
    })
  },

  // 10. Division by zero (produces Infinity, not error — detect in output)
  {
    id: 'division_zero',
    match: (_, code) => /\/\s*0(?!\.)/.test(code) && !/\/\//.test(code.split('/0')[0].split('\n').pop() ?? ''),
    build: () => ({
      type: 'info',
      titleEN: 'Division by Zero',
      titleKIN: 'Kugabanya na Zero',
      explanationEN: "Dividing by zero in JavaScript gives 'Infinity', not an error. This is usually a logic mistake. Check your denominator.",
      explanationKIN: "Kugabanya na zero muri JavaScript bitanga 'Infinity', si ikosa. Ibi bikunze kuba ikosa ryo gupanga. Genzura umubare ugabanywa.",
      category: 'logic'
    })
  },

  // 11. Using = instead of == or ===
  {
    id: 'assignment_in_condition',
    match: (_, code) => /if\s*\([^)]*[^=!<>]=[^=][^)]*\)/.test(code),
    build: () => ({
      type: 'info',
      titleEN: 'Assignment Inside a Condition?',
      titleKIN: 'Gushyiraho Agaciro mu Ndangagaciro?',
      explanationEN: "You may have used '=' (assignment) inside an if statement instead of '===' (comparison). This is a common mistake.",
      explanationKIN: "Ushobora gukoresha '=' (gushyiraho agaciro) mu ndangagaciro ya if aho gutumanahura '===' (kugereranya). Iki ni ikosa risanzwe.",
      category: 'logic'
    })
  },

  // 12. console.log not called (missing parentheses)
  {
    id: 'missing_parens',
    match: (err, code) => err.includes('is not a function') && /console\.log\s+[^(]/.test(code),
    build: () => ({
      type: 'error',
      titleEN: 'Missing Parentheses on Function Call',
      titleKIN: 'Habura Inzitizi kuri Fonction',
      explanationEN: "You wrote the function name but forgot the parentheses (). Functions must be called with () to run.",
      explanationKIN: "Wanditse izina rya fonction ariko wibagiwe inzitizi (). Fonctions zigomba guhamagarwa na () kugirango zikorere.",
      category: 'syntax'
    })
  },

  // 13. Missing return statement (function returns undefined)
  {
    id: 'missing_return',
    match: (_, code) => {
      const hasFunction = /function\s+\w+\s*\(/.test(code);
      const hasReturn = /return\s+/.test(code);
      const outputsUndefined = code.includes('console.log') && !hasReturn && hasFunction;
      return outputsUndefined;
    },
    build: () => ({
      type: 'info',
      titleEN: 'Function May Be Missing a Return Statement',
      titleKIN: 'Fonction Ishobora Kubura Return',
      explanationEN: "Your function doesn't seem to return a value. If you're trying to use the result, add 'return' before the value.",
      explanationKIN: "Fonction yawe ntabwo isubiza agaciro. Niba ushaka gukoresha ibisubizo, ongeraho 'return' mbere y'agaciro.",
      category: 'logic'
    })
  },

  // 14. String concatenation with number giving wrong result
  {
    id: 'string_number_concat',
    match: (_, code) => /["']\s*\+\s*\d/.test(code) || /\d\s*\+\s*["']/.test(code),
    build: () => ({
      type: 'info',
      titleEN: 'Mixing Strings and Numbers',
      titleKIN: 'Guhwanisha Strings n\'Imibare',
      explanationEN: "Adding a number to a string with '+' gives a string result, not a sum. Use Number() or parseInt() to convert first.",
      explanationKIN: "Kongeranya umubare na string na '+' bitanga string, si umubare. Koresha Number() cyangwa parseInt() mbere yo guhwanisha.",
      category: 'logic'
    })
  },

  // 15. Unreachable code after return
  {
    id: 'code_after_return',
    match: (_, code) => /return[^;]*;[\s\S]*\S/.test(code.replace(/\/\/.*/g, '')),
    build: () => ({
      type: 'info',
      titleEN: 'Code After Return Will Never Run',
      titleKIN: 'Kode Inyuma ya Return Ntizigera Ikora',
      explanationEN: "You have code written after a 'return' statement. That code will never execute because the function stops at 'return'.",
      explanationKIN: "Ufite kode inyuma ya 'return'. Iyo kode ntizigera ikorwa kuko fonction ihagarara kuri 'return'.",
      category: 'logic'
    })
  }
];

// Success messages
const successMessages = {
  en: [
    'Your code runs correctly! All output looks good.',
    'Great work! The code executed without any errors.',
    'Nice! Your code ran successfully.'
  ],
  kin: [
    'Kode yawe ikora neza! Ibisubizo ni byiza.',
    'Akazi keza! Kode yakoze nta makosa.',
    'Byiza! Kode yawe yakoze neza.'
  ]
};

export function analyzeFeedback(
  error: string | null,
  code: string,
  output: string,
  language: 'EN' | 'KIN'
): Feedback[] {
  const results: Feedback[] = [];
  const isKin = language === 'KIN';

  // No error — success
  if (!error) {
    const msgs = isKin ? successMessages.kin : successMessages.en;
    const msg = msgs[Math.floor(Math.random() * msgs.length)];

    results.push({
      type: 'success',
      titleEN: 'Code Ran Successfully',
      titleKIN: 'Kode Yakoze Neza',
      explanationEN: msg,
      explanationKIN: msg,
      category: 'general'
    });

    // Additional logic hints even on success
    for (const p of patterns) {
      if (p.id === 'division_zero' || p.id === 'assignment_in_condition' ||
          p.id === 'missing_return' || p.id === 'string_number_concat') {
        if (p.match(error ?? '', code)) {
          results.push(p.build(error ?? '', code));
        }
      }
    }

    return results;
  }

  // Match error patterns
  let matched = false;
  for (const p of patterns) {
    if (p.match(error, code)) {
      results.push(p.build(error, code));
      matched = true;
      break;
    }
  }

  // No pattern matched — generic fallback
  if (!matched) {
    results.push({
      type: 'error',
      titleEN: 'An Error Occurred',
      titleKIN: 'Habaye Ikosa',
      explanationEN: `Error: ${error}. Read the error message carefully — it tells you what went wrong and on which line.`,
      explanationKIN: `Ikosa: ${error}. Soma ubutumwa bw'ikosa neza — bukubwira ikibazo n'inzitizi iryo.`,
      category: 'general'
    });
  }

  return results;
}

export function formatFeedbackForUI(
  feedbacks: Feedback[],
  language: 'EN' | 'KIN'
): Array<{ type: 'success' | 'error' | 'info'; message: string }> {
  const isKin = language === 'KIN';

  return feedbacks.map(f => ({
    type: f.type,
    message: isKin
      ? `${f.titleKIN}\n\n${f.explanationKIN}${f.fix ? '\n\n' + (isKin ? 'Igisubizo:' : 'Fix:') + '\n' + f.fix : ''}`
      : `${f.titleEN}\n\n${f.explanationEN}${f.fix ? '\n\nSuggested fix:\n' + f.fix : ''}`
  }));
}
