// Type declaration for CSS/SCSS modules
declare module "*.module.scss" {
  const classes: Record<string, string>;
  export default classes;
}
