import { createRequire } from 'node:module';

/** @internal */
export function loadBindings<Addon>(
  moduleUrl: string,
  moduleName: string,
): Addon {
  const require = createRequire(moduleUrl);
  const pathsToTry: string[] = [];
  for (const dir of ['.', '..']) {
    for (const subdir of ['', 'build/Release', 'build/Debug']) {
      for (const filename of [
        withTuple(moduleName),
        withExtendedTuple(moduleName),
        moduleName,
      ]) {
        const pathToTry = modulePath(joinPath(dir, subdir), filename);
        pathsToTry.push(pathToTry);
      }
    }
  }

  for (const pathToTry of pathsToTry) {
    try {
      return require(pathToTry);
      // eslint-disable-next-line
    } catch (e) {}
  }

  throw new Error(
    `No native build was found for ${moduleName}, imported from ${moduleUrl}. Checked paths:
${pathsToTry.join('\n')}`,
  );
}

function joinPath(...parts: string[]): string {
  return parts.filter((p) => p != '').join('/');
}

function modulePath(dir: string, moduleName: string): string {
  return joinPath(dir, `${moduleName}.node`);
}

function withTuple(name: string): string {
  return `${name}.${process.platform}-${process.arch}`;
}

function withExtendedTuple(name: string): string {
  // we are not supporting alpine for now
  let tag: string;
  switch (process.platform) {
    case 'linux':
      tag = '-gnu';
      break;
    case 'win32':
      tag = '-msvc';
      break;
    default:
      tag = '';
      break;
  }
  return `${name}.${process.platform}-${process.arch}${tag}`;
}
