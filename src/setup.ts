import { getCloudSDKFolder, isWindows } from './utils';
import { resolve } from 'path';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { execSync } from 'child_process';
import { readdirSync } from 'fs';

export async function setup() {
  const installScriptExtension = isWindows() ? 'bat' : 'sh';
  const installScript = resolve(
    getCloudSDKFolder(),
    `install.${installScriptExtension}`,
  );
  const args = [
    '--usage-reporting=false',
    '--command-completion=false',
    '--path-update=true',
    '--usage-reporting=false',
    '--quiet',
  ];

  if (core.getInput('components')) {
    args.push('--additional-components=' + core.getInput('components'));
  }

  if (isWindows()) {
    // @actions/exec does not exit on windows
    execSync(`"${installScript}" ${args.join(' ')}`, { stdio: 'inherit' });
  } else {
    await exec.exec(installScript, args);
  }

  const binPath = resolve(getCloudSDKFolder(), 'bin');
  core.addPath(binPath);
}
