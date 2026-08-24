import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

async function exportedNames(file, visited = new Set()) {
  const absoluteFile = path.resolve(file);
  if (visited.has(absoluteFile)) return new Set();
  visited.add(absoluteFile);

  const source = await fs.readFile(absoluteFile, 'utf8');
  const sourceFile = ts.createSourceFile(absoluteFile, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const names = new Set();

  for (const statement of sourceFile.statements) {
    const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
    const isExported = modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
    if (isExported && 'name' in statement && statement.name && ts.isIdentifier(statement.name)) {
      names.add(statement.name.text);
    }

    if (!ts.isExportDeclaration(statement)) continue;
    if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) names.add(element.name.text);
      continue;
    }

    if (statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) {
      const target = path.resolve(path.dirname(absoluteFile), `${statement.moduleSpecifier.text}.ts`);
      for (const name of await exportedNames(target, visited)) names.add(name);
    }
  }

  return names;
}

export async function assertSourceExports(entryFile, expectedNames) {
  const names = await exportedNames(entryFile);
  const missing = expectedNames.filter((name) => !names.has(name));
  if (missing.length) throw new Error(`${entryFile} does not export: ${missing.join(', ')}`);
}
