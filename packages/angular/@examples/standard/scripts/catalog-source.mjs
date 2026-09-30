// Inspect the registry without executing Angular or maintaining another route list.
// TypeScript is supplied by the enclosing Angular workspace's tooling dependencies.
import assert from 'node:assert/strict';
import ts from 'typescript';

function unwrap(node) {
  while (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)) {
    node = node.expression;
  }
  return node;
}

function properties(node, label) {
  assert(ts.isObjectLiteralExpression(node), `${label} must be an object literal`);
  const result = new Map();
  for (const property of node.properties) {
    assert(ts.isPropertyAssignment(property), `${label}: unsupported property (no spreads/shorthand)`);
    assert(ts.isIdentifier(property.name) || ts.isStringLiteral(property.name), `${label}: nonliteral property name`);
    const name = property.name.text;
    assert(!result.has(name), `${label}: duplicate property ${name}`);
    result.set(name, unwrap(property.initializer));
  }
  return result;
}

function text(node, label) {
  assert(node && ts.isStringLiteralLike(node) && node.text.trim(), `${label} must be a nonempty literal string`);
  return node.text;
}

function unique(values, label) {
  assert.equal(new Set(values).size, values.length, `${label}: duplicate values`);
}

export function readCatalogSource(source) {
  const file = ts.createSourceFile('catalog.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  assert.equal(file.parseDiagnostics.length, 0, 'catalog.ts contains syntax errors');
  const declarations = new Map();
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue;
      assert(!declarations.has(declaration.name.text), `Duplicate declaration ${declaration.name.text}`);
      declarations.set(declaration.name.text, unwrap(declaration.initializer));
    }
  }
  const pathsNode = declarations.get('CATALOG_KIND_PATHS');
  assert(pathsNode, 'Missing CATALOG_KIND_PATHS');
  const pathProperties = properties(pathsNode, 'CATALOG_KIND_PATHS');
  assert.deepEqual([...pathProperties.keys()].sort(), ['component', 'example'], 'Unexpected catalog kinds');
  const kindPaths = Object.fromEntries([...pathProperties].map(([kind, value]) => [kind, text(value, kind)]));
  unique(Object.values(kindPaths), 'kind paths');
  for (const value of Object.values(kindPaths)) assert(/^[a-z][a-z0-9-]*$/.test(value), 'Invalid kind path');

  const array = declarations.get('CATALOG_ENTRIES');
  assert(array && ts.isArrayLiteralExpression(array), 'CATALOG_ENTRIES must be an array literal');
  const entries = array.elements.map((element, index) => {
    const label = `CATALOG_ENTRIES[${index}]`;
    const props = properties(unwrap(element), label);
    const entry = Object.fromEntries(
      ['slug', 'title', 'category', 'description', 'kind'].map((key) => [key, text(props.get(key), `${label}.${key}`)]),
    );
    assert(/^[a-z][a-z0-9-]*$/.test(entry.slug), `${label}: invalid slug`);
    assert(Object.hasOwn(kindPaths, entry.kind), `${label}: unknown kind ${entry.kind}`);
    assert(props.has('icon'), `${label}: missing icon`);
    const loader = props.get('load');
    assert(loader && ts.isArrowFunction(loader), `${label}: load must be an arrow function`);
    const imports = [];
    function visit(node) {
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        assert.equal(node.arguments.length, 1, `${label}: expected one import argument`);
        imports.push(text(node.arguments[0], `${label}.load import`));
      }
      ts.forEachChild(node, visit);
    }
    visit(loader);
    const expected = `../pages/${kindPaths[entry.kind]}/${entry.slug}/${entry.slug}`;
    assert.deepEqual(imports, [expected], `${label}: loader must import its feature route ${expected}`);
    return { ...entry, module: imports[0], link: `/${kindPaths[entry.kind]}/${entry.slug}` };
  });
  for (const field of ['slug', 'title', 'link'])
    unique(
      entries.map((entry) => entry[field]),
      `catalog ${field}`,
    );
  const baselines = {};
  for (const kind of Object.keys(kindPaths)) {
    const name = `REVIEWED_${kind.toUpperCase()}_BASELINE`;
    const node = declarations.get(name);
    assert(node && ts.isNumericLiteral(node), `Missing numeric ${name}`);
    const baseline = Number(node.text);
    assert(Number.isInteger(baseline) && baseline > 0, `Invalid ${name}`);
    assert(
      entries.filter((entry) => entry.kind === kind).length >= baseline,
      `${kind} count below baseline ${baseline}`,
    );
    baselines[kind] = baseline;
  }
  return { entries, kindPaths, baselines };
}
