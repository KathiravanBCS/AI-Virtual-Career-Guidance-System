/**
 * Empty component. Main purpose is to load fonts-zh.css
 */
const FontsZh = () => {
  // Load fonts via public path
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/fonts/fonts-zh.css';
  if (document.head && !document.head.querySelector('link[href="/fonts/fonts-zh.css"]')) {
    document.head.appendChild(link);
  }
  return <></>;
};
export default FontsZh;
