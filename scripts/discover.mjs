import {readFileSync,writeFileSync} from 'node:fs';
const OUTPUT='public/discoveries.json';
const AGENT='AI-Workflow-Atlas/1.0 (public research signals; no account data)';
const feeds=[
 {id:'hn',label:'Hacker News',url:'https://hn.algolia.com/api/v1/search_by_date?query=AI%20agent&tags=story&hitsPerPage=40'},
 {id:'hnwork',label:'Hacker News',url:'https://hn.algolia.com/api/v1/search_by_date?query=AI%20workflow&tags=story&hitsPerPage=40'}
];
const terms=/\b(ai|agentic|agents|llm|generative|open.source|workflow|text.to.video|image.to.video|automation)\b/i;
const cutoff=Date.now()-14*86400000;
const norm=u=>{try{let o=new URL(u);if(!/^https?:$/.test(o.protocol))return null;o.hash='';for(let k of [...o.searchParams.keys()])if(/^utm_|^ref$|^source$/i.test(k))o.searchParams.delete(k);return o.toString()}catch{return null}};
const current=JSON.parse(readFileSync(OUTPUT,'utf8'));
const seen=new Map();
for(const feed of feeds){try{
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
 let res;try{res=await fetch(feed.url,{headers:{'User-Agent':AGENT},signal:controller.signal})}finally{clearTimeout(timer)}
 if(!res.ok)throw Error('HTTP '+res.status);
 const data=await res.json();if(!Array.isArray(data.hits))throw Error('Missing hits');
 for(const hit of data.hits){let title=String(hit.title||'').trim(),url=norm(hit.url),posted=Date.parse(hit.created_at||'');if(!title||!url||!terms.test(title)||!Number.isFinite(posted)||posted<cutoff)continue;
 if(seen.has(url))continue;
 seen.set(url,{title:title.slice(0,180),url,source:feed.label,discoveredAt:new Date(posted).toISOString(),status:'unverified',note:'Community-submitted link; check the original source before using.'});
 }
}catch(e){console.error('Feed error',feed.id,String(e))}}
if(!seen.size){console.log('No fresh results; preserving existing file');process.exit(0)}
const items=[...seen.values()].sort((a,b)=>b.discoveredAt.localeCompare(a.discoveredAt)).slice(0,35);
const identical=JSON.stringify(items)===JSON.stringify(current.items);
if(identical){console.log('No new findings');process.exit(0)}
const output={updatedAt:new Date().toISOString(),method:'Public Hacker News submissions surfaced by Algolia; not independently verified',reviewRequired:true,items};
writeFileSync(OUTPUT,JSON.stringify(output,null,2)+'\n');
console.log('Updated discovery feed:',items.length);
