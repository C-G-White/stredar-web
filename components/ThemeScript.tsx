export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var t=localStorage.getItem('stredar-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`,
      }}
    />
  )
}
