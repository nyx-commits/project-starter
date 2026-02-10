#!/usr/bin/env node

import chalk from "chalk";
import fs from "fs-extra";
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.join(__dirname, "../templates");

async function copyTemplate(src, dest) {
  if (!(await fs.pathExists(dest))) {
    await fs.copy(src, dest);
    console.log(chalk.green(`✔ Created ${path.basename(dest)}`));
  } else {
    console.log(chalk.gray(`↷ Skipped ${path.basename(dest)} (already exists)`));
  }
}

async function main() {
  console.log(chalk.cyan("\n🚀 ProjectStarter\n"));

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "language",
      message: "Select a language template:",
      choices: ["Node", "None"]
    },
    {
      type: "confirm",
      name: "vscode",
      message: "Generate VSCode settings?",
      default: true
    },
    {
      type: "confirm",
      name: "extensions",
      message: "Add recommended VSCode extensions?",
      default: true
    },
    {
      type: "confirm",
      name: "env",
      message: "Create .env.example file?",
      default: true
    },
    {
      type: "confirm",
      name: "readme",
      message: "Create README.md template?",
      default: true
    }
  ]);

  const targetDir = process.cwd();
  console.log(chalk.yellow("\n📁 Generating project files...\n"));

  // Common
  await copyTemplate(
    path.join(templatesDir, "common/gitignore"),
    path.join(targetDir, ".gitignore")
  );

  await copyTemplate(
    path.join(templatesDir, "common/editorconfig"),
    path.join(targetDir, ".editorconfig")
  );

  if (answers.env) {
    await copyTemplate(
      path.join(templatesDir, "common/env.example"),
      path.join(targetDir, ".env.example")
    );
  }

  // VSCode
  if (answers.vscode) {
    const vscodeDir = path.join(targetDir, ".vscode");
    await fs.ensureDir(vscodeDir);

    await copyTemplate(
      path.join(templatesDir, "vscode/settings.json"),
      path.join(vscodeDir, "settings.json")
    );

    if (answers.extensions) {
      await copyTemplate(
        path.join(templatesDir, "vscode/extensions.json"),
        path.join(vscodeDir, "extensions.json")
      );
    }
  }

  // Node
  if (answers.language === "Node") {
    await copyTemplate(
      path.join(templatesDir, "node/package.json"),
      path.join(targetDir, "package.json")
    );

    await copyTemplate(
      path.join(templatesDir, "node/index.js"),
      path.join(targetDir, "index.js")
    );

    if (answers.readme) {
      await copyTemplate(
        path.join(templatesDir, "node/README.md"),
        path.join(targetDir, "README.md")
      );
    }
  }

  console.log(chalk.green("\n✅ Project setup complete!\n"));
}

main();
