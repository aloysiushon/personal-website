import { registerBlock } from "@personal-website/engine";
import { HeroBlock } from "./HeroBlock";
import { AboutBlock } from "./AboutBlock";
import { SkillsBlock } from "./SkillsBlock";
import { ProjectsBlock } from "./ProjectsBlock";
import { ContactBlock } from "./ContactBlock";
import { NavbarBlock } from "./NavbarBlock";
import { FooterBlock } from "./FooterBlock";

// ============================================================
// BLOCK REGISTRATION — registers all blocks into the engine
// ============================================================

export function registerAllBlocks(): void {
  registerBlock("hero", HeroBlock);
  registerBlock("about", AboutBlock);
  registerBlock("skills", SkillsBlock);
  registerBlock("projects", ProjectsBlock);
  registerBlock("contact", ContactBlock);
  registerBlock("navbar", NavbarBlock);
  registerBlock("footer", FooterBlock);
}
