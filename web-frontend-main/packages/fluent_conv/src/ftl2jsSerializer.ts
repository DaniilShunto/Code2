import {
  Attribute,
  Entry,
  Identifier,
  Pattern,
  FunctionReference,
  CallArguments,
  NamedArgument,
  TextElement,
  TermReference,
  Variant,
  Expression,
} from '@fluent/syntax';

interface SerializeOutput {
  key: string;
  value: string;
  comment?: SerializeOutput;
  attributes?: Array<SerializeOutput>;
}

type StringNode =
  | Expression
  | Identifier
  | FunctionReference
  | TermReference
  | TextElement
  | Pattern
  | CallArguments
  | NamedArgument
  | Variant;

const parseString = (item: StringNode, plain?: boolean): string => {
  switch (item.type) {
    case 'FunctionReference':
      return `${item.id.name}(${parseString(item.arguments)})`;
    case 'TermReference':
      return `-${item.id.name}`;
    case 'Identifier':
      return item.name;
    case 'StringLiteral':
    case 'NumberLiteral':
    case 'TextElement':
      return item.value;
    case 'Pattern':
      return item.elements.map((placeable) => parseString(placeable)).join('');
    case 'CallArguments': {
      const positionals = item.positional.map((positional) => parseString(positional, true)).join(' ');
      const nameds = item.named.map((named) => parseString(named)).join(', ');
      return `$${positionals}${nameds.length ? `, ${nameds}` : ''}`;
    }
    case 'NamedArgument':
      return `${parseString(item.name)}: "${parseString(item.value)}"`;
    case 'SelectExpression': {
      const id = parseString(item.selector, true);
      const variants = item.variants.map((variant) => parseString(variant));
      return [`$${id} ->`, ...variants].join('\n ') + '\n';
    }
    case 'VariableReference':
    case 'MessageReference': {
      const reference = parseString(item.id);
      return plain ? reference : `$${reference}`;
    }
    case 'Variant': {
      const name = item.key.name ? item.key.name : item.key.value;
      const pattern = parseString(item.value);
      return `${item.default ? '*' : ' '}[${name}] ${pattern}`;
    }
    case 'Placeable': {
      const result = `{ ${parseString(item.expression)} }`;
      return result.replace(/\n\s+}$/g, '\n}');
    }
    default:
      throw new Error(`unknown item: ${JSON.stringify(item)}`);
  }
};

export const serialize = (item: Entry | Attribute): SerializeOutput => {
  switch (item.type) {
    case 'Comment':
    case 'GroupComment':
    case 'ResourceComment':
      return { key: 'comment', value: item.content };
    case 'Message':
      return {
        key: parseString(item.id),
        value: item.value ? parseString(item.value) : '',
        comment: (item.comment && serialize(item.comment)) || undefined,
        attributes: item.attributes.map(serialize),
      };
    case 'Attribute':
      return {
        key: parseString(item.id),
        value: parseString(item.value),
      };
    case 'Term':
      return {
        key: `-${parseString(item.id)}`,
        value: parseString(item.value),
        comment: item.comment ? serialize(item.comment) : undefined,
        attributes: item.attributes.map(serialize),
      };
    case 'Junk': {
      const parts = item.content.split('=');
      const key = parts.shift()?.trim() || '';
      const value = parts
        .join('=')
        .trim()
        .replace(/\n {3}/g, '\n ')
        .replace(/\n {2}}/g, '\n}');
      return { key, value };
    }
    default:
      throw new Error(`unknown item: ${JSON.stringify(item)}`);
  }
};
