// Build a static, interactive review copy from the exact homepage components.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const {renderToString} = require('react-dom/server');
const {webpack} = require('next/dist/compiled/webpack/webpack');
const root=path.resolve(__dirname,'..');
const out=path.resolve(process.argv[2] || path.join(root,'.next/homepage-review'));
const temp=path.join(root,'node_modules/.cache/homepage-preview');
fs.mkdirSync(temp,{recursive:true});fs.mkdirSync(out,{recursive:true});
const files=['lib/home-catalog.ts','components/SiteHeader.tsx','components/SiteFooter.tsx','components/home/HomeTools.tsx','components/home/HomeContent.tsx'];
for(const file of files){
 let input=fs.readFileSync(path.join(root,file),'utf8').replace(/(['"])@\/([^'"]+)\1/g,(_,q,p)=>q+path.join(temp,p)+q);
 // Keep homepage anchors and assets local; every product/inquiry route opens the established site.
 input=input.replace(/(['"])(\/(?:products|resources|applications|request-a-quote|custom-process|about-us|contact-us|custom-accessories|product-families|blog)(?:[^'"\n]*))\1/g,(_,q,p)=>q+'https://www.kakapatches.com'+p+q).replace(/(['"])\/#[^'"]*\1/g,m=>m.replace('/#','#'));
 const target=path.join(temp,file.replace(/\.tsx?$/,'.js'));fs.mkdirSync(path.dirname(target),{recursive:true});
 fs.writeFileSync(target,ts.transpileModule(input,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2019,esModuleInterop:true}}).outputText);
}
const appCode=`const React=require('react');const Header=require('./components/SiteHeader').default;const Home=require('./components/home/HomeContent').default;const Footer=require('./components/SiteFooter').default;module.exports=function Review(){return React.createElement(React.Fragment,null,React.createElement(Header),React.createElement('div',{id:'main-content',tabIndex:-1},React.createElement(Home)),React.createElement(Footer));};`;
fs.writeFileSync(path.join(temp,'App.js'),appCode);
const App=require(path.join(temp,'App.js'));
const markup=renderToString(React.createElement(App));
const css=`*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:white;color:#142a46;font-family:Arial,Helvetica,sans-serif}a{color:inherit}button,input,select{font:inherit}h1,h2,h3{margin:0}button{color:inherit}dialog:not([open]){display:none}\n`+fs.readFileSync(path.join(root,'app/home-redesign.css'),'utf8');
fs.writeFileSync(path.join(out,'styles.css'),css);
fs.writeFileSync(path.join(out,'index.html'),'<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>KaKa Patches — Homepage Redesign Preview</title><meta name="description" content="Review the redesigned KaKa Patches homepage: find your patch, explore applications and start a custom quote."><link rel="icon" href="/images/brand/kaka-patches-logo.svg"><link rel="stylesheet" href="/styles.css"></head><body><div id="root">'+markup+'</div><script src="/app.js" defer></script></body></html>');
fs.cpSync(path.join(root,'public/images/home'),path.join(out,'images/home'),{recursive:true});fs.cpSync(path.join(root,'public/images/brand'),path.join(out,'images/brand'),{recursive:true});
fs.writeFileSync(path.join(temp,'entry.js'),"const React=require('react');const {hydrateRoot}=require('react-dom/client');const App=require('./App');hydrateRoot(document.getElementById('root'),React.createElement(App));");
webpack({mode:'production',entry:path.join(temp,'entry.js'),output:{path:out,filename:'app.js'},resolve:{modules:[path.join(root,'node_modules'),'node_modules']},optimization:{minimize:false},devtool:false},async (err,stats)=>{if(err||stats.hasErrors()){console.error(err||stats.toString({all:false,errors:true}));process.exitCode=1;return;}const terser=require('next/dist/compiled/terser');const result=await terser.minify(fs.readFileSync(path.join(out,'app.js'),'utf8'));if(result.code)fs.writeFileSync(path.join(out,'app.js'),result.code);console.log('Interactive homepage preview built:',out);console.log(stats.toString({all:false,assets:true,errors:true,warnings:true}));});
