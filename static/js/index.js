(()=>{"use strict";var e={876:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.base=t.EXPLOSION_KEYS=t.mapTileInfo=t.COUNT_TILES=t.TILES=t.SCALE_RATIO=t.GRAVITY=t.VELOCITY_BASE=t.SWAP_OFFSET=t.SWAP_DURATION=t.MATCH_4_POINT=t.GAIN_TURN=t.TILE_OFFSET=t.TILE_SIZE=t.SCREEN_SIZE=t.CELL_SIZE=t.MAP_WIDTH_1=t.MAP_WIDTH=t.BOARD_COLORS=t.APP_NAME=void 0,t.APP_NAME="Loạn 12 Sứ Quân",t.BOARD_COLORS=["#3e3226","#554933"],t.MAP_WIDTH=8,t.MAP_WIDTH_1=t.MAP_WIDTH-1,t.CELL_SIZE=60,t.SCREEN_SIZE=t.MAP_WIDTH*t.CELL_SIZE,t.TILE_SIZE=54,t.TILE_OFFSET=Math.floor((t.CELL_SIZE-t.TILE_SIZE)/2),t.GAIN_TURN=3,t.MATCH_4_POINT=50,t.SWAP_DURATION=10,t.SWAP_OFFSET=t.CELL_SIZE/t.SWAP_DURATION,t.VELOCITY_BASE=2,t.GRAVITY=.4,t.SCALE_RATIO=t.TILE_SIZE/22,t.TILES={SWORD:0,HEART:1,GOLD:2,ENERGY:3,MANA:4,EXP:5,SWORDRED:6},t.COUNT_TILES=Object.keys(t.TILES).length,t.mapTileInfo={[t.TILES.SWORD]:{compatible:[t.TILES.SWORDRED],probability:100,point:10,texture:null,explosions:[]},[t.TILES.HEART]:{compatible:[],probability:100,point:9,texture:null,explosions:[]},[t.TILES.GOLD]:{compatible:[],probability:100,point:6,texture:null,explosions:[]},[t.TILES.ENERGY]:{compatible:[],probability:100,point:7,texture:null,explosions:[]},[t.TILES.MANA]:{compatible:[],probability:100,point:8,texture:null,explosions:[]},[t.TILES.EXP]:{compatible:[],probability:100,point:6,texture:null,explosions:[]},[t.TILES.SWORDRED]:{compatible:[t.TILES.SWORD],probability:10,point:30,texture:null,explosions:[]}},t.EXPLOSION_KEYS=["SWORD","HEART","GOLD","ENERGY","MANA","EXP"],t.base={}},367:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Game=void 0;const o=a(876),s=a(555),l={IDLE:{render:()=>{},update:()=>{}},SELECT:{render:e=>{const t=e.tSwap*o.SWAP_OFFSET,{x:a,y:s,value:l}=e.selected,{x:i,y:n,value:p}=e.swapped||e.selected;e.swapped?o.base.context.drawImage(o.mapTileInfo[p].texture,i*o.CELL_SIZE+o.TILE_OFFSET+(a-i)*t,n*o.CELL_SIZE+o.TILE_OFFSET+(s-n)*t):(o.base.context.lineWidth=4,o.base.context.strokeStyle="cyan",o.base.context.strokeRect(e.selected.x*o.CELL_SIZE+2,e.selected.y*o.CELL_SIZE+2,o.CELL_SIZE-4,o.CELL_SIZE-4)),o.base.context.drawImage(o.mapTileInfo[l].texture,a*o.CELL_SIZE+o.TILE_OFFSET+(i-a)*t,s*o.CELL_SIZE+o.TILE_OFFSET+(n-s)*t)},update:e=>{if(!e.swapped)return;if(e.tSwap+=1,e.tSwap<=o.SWAP_DURATION)return;e.tSwap=o.SWAP_DURATION;const{x:t,y:a,value:l}=e.selected,{x:i,y:n,value:p}=e.swapped;if(o.base.map[a][t]=l,o.base.map[n][i]=p,e.swap(t,a,i,n),e.reswap)e.reswap=!1,e.selected=e.swapped=null,e.state="IDLE";else{const{matched:l,tiles:p}=e.matchPosition(t,a),{matched:E,tiles:r}=e.matchPosition(i,n);if(l||E)e.selected=e.swapped=null,e.explodedTiles=(0,s.combine)([p,r]),e.explosions=[],e.explodedTiles.forEach((({x:t,y:a})=>{e.explosions.push({x:t,y:a,value:o.base.map[a][t]}),o.base.map[a][t]=-1})),e.state="EXPLODE";else{o.base.map[a][t]=-1,o.base.map[n][i]=-1;const s=e.selected.x,l=e.selected.y;e.selected.x=e.swapped.x,e.selected.y=e.swapped.y,e.swapped.x=s,e.swapped.y=l,e.reswap=!0,e.tSwap=0}}}},EXPLODE:{render:e=>{e.explosions.forEach((({x:t,y:a,value:s})=>{const l=o.mapTileInfo[s].explosions[e.tExplode];o.base.context.drawImage(l,t*o.CELL_SIZE+Math.floor((o.CELL_SIZE-l.width)/2),a*o.CELL_SIZE+Math.floor((o.CELL_SIZE-l.height)/2))}))},update:e=>{e.tExplode2+=1,e.tExplode2%2==0&&(e.tExplode+=1,4===e.tExplode&&(e.tExplode=0,e.state="FALL",e.fall={},e.explodedTiles.forEach((({x:t,y:a})=>{o.base.map[a][t]=-1,e.fall[t]?!e.fall[t].list.find((({x:e,y:o})=>e===t&&o===a))&&e.fall[t].list.push({x:t,y:a,v:0,offset:0,value:-1}):e.fall[t]={list:[{x:t,y:a,v:0,offset:0,value:-1}],below:-1}})),(0,s.getKeys)(e.fall).forEach((t=>{e.fall[t].below=(0,s.findBelow)(e.fall[t].list);const a=e.fall[t].list.length;e.fall[t].list=[],t=Number(t);for(let a=e.fall[t].below;a>=0;a-=1)-1!==o.base.map[a][t]&&(e.fall[t].list.push({x:t,y:a,v:o.VELOCITY_BASE,offset:0,value:o.base.map[a][t]}),o.base.map[a][t]=-1);for(let l=0;l<a;l+=1)e.fall[t].list.push({x:t,y:-1-l,v:o.VELOCITY_BASE,offset:0,value:(0,s.randomTile)()})}))))}},FALL:{render:e=>{(0,s.getKeys)(e.fall).forEach((t=>{e.fall[t].list.forEach((({x:e,y:t,value:a,offset:s})=>{o.base.context.drawImage(o.mapTileInfo[a].texture,e*o.CELL_SIZE+o.TILE_OFFSET,t*o.CELL_SIZE+o.TILE_OFFSET+s)}))}))},update:e=>{let t=!1;if((0,s.getKeys)(e.fall).forEach((a=>{const s=e.fall[a];a=Number(a);let l=!1;s.list.forEach(((e,t)=>{e.v+=o.GRAVITY,e.offset+=e.v;const i=e.y+Math.floor((e.offset+6)/o.CELL_SIZE);0===t?i>=s.below&&(l=!0,o.base.map[s.below][a]=e.value,s.below-=1):(e.offset>=s.list[t-1].offset-6||i>=s.below-t+1)&&(e.v=o.VELOCITY_BASE,e.offset=Math.floor(e.offset/o.CELL_SIZE)*o.CELL_SIZE)})),l&&s.list.shift(),s.list.length&&(t=!0)})),t)return;const a=[];for(let t=0;t<o.MAP_WIDTH;t+=1)for(let s=0;s<o.MAP_WIDTH;s+=1){const{matched:o,tiles:l}=e.matchPosition(s,t);o&&a.push(l)}a.length?(e.explodedTiles=(0,s.combine)(a),e.explosions=[],e.explodedTiles.forEach((({x:t,y:a})=>{e.explosions.push({x:t,y:a,value:o.base.map[a][t]}),o.base.map[a][t]=-1})),e.state="EXPLODE"):e.state="IDLE"}}};t.Game=class{state;selected;swapped;reswap;fall;explosions;explodedTiles;tSwap;tExplode;tExplode2;constructor(){}init(){o.base.map=(0,s.generateMap)(),this.state="IDLE",this.selected=null,this.swapped=null,this.reswap=!1,this.fall={},this.explosions=[],this.tSwap=0,this.tExplode=0,this.tExplode2=0}matchPosition(e,t){let a,l,i=[],n=[];const p=o.base.map[t][e],E=o.mapTileInfo[p].compatible;for(a=e-1;a>=0;){const e=o.base.map[t][a];if(!(0,s.check)(e,p,E))break;i.push({x:a,y:t,point:o.mapTileInfo[e].point}),a-=1}for(a=e+1;a<o.MAP_WIDTH;){const e=o.base.map[t][a];if(!(0,s.check)(e,p,E))break;i.push({x:a,y:t,point:o.mapTileInfo[e].point}),a+=1}for(l=t-1;l>=0;){const t=o.base.map[l][e];if(!(0,s.check)(t,p,E))break;n.push({x:e,y:l,point:o.mapTileInfo[t].point}),l-=1}for(l=t+1;l<o.MAP_WIDTH;){const t=o.base.map[l][e];if(!(0,s.check)(t,p,E))break;n.push({x:e,y:l,point:o.mapTileInfo[t].point}),l+=1}let r=!0,I=!0;i.length<2&&(i=[],r=!1),n.length<2&&(n=[],I=!1);const c=r||I,d=c?[...i,...n,{x:e,y:t,point:o.mapTileInfo[o.base.map[t][e]].point}]:[];return{matched:c,tiles:d,point:d.reduce(((e,t)=>e+t.point),0)+(i.length>=o.GAIN_TURN?o.MATCH_4_POINT:0)+(n.length>=o.GAIN_TURN?o.MATCH_4_POINT:0),turn:Number(i.length>=o.GAIN_TURN)+Number(n.length>=o.GAIN_TURN)}}swap(e,t,a,s){const l=o.base.map[t][e];o.base.map[t][e]=o.base.map[s][a],o.base.map[s][a]=l}addMatchedPosition(e,t,a,o,s){this.swap(t,a,o,s);const{matched:l,point:i}=this.matchPosition(t,a),{matched:n,point:p}=this.matchPosition(o,s);(l||n)&&e.push({x0:t,y0:a,x1:o,y1:s,point:i+p}),this.swap(t,a,o,s)}findAllMatchedPositions(){const e=[];for(let t=0;t<o.MAP_WIDTH_1;t+=1)for(let a=0;a<o.MAP_WIDTH_1;a+=1)this.addMatchedPosition(e,a,t,a+1,t),this.addMatchedPosition(e,a,t,a,t+1);for(let t=0;t<o.MAP_WIDTH_1;t+=1)this.addMatchedPosition(e,o.MAP_WIDTH_1,t,o.MAP_WIDTH_1,t+1);for(let t=0;t<o.MAP_WIDTH_1;t+=1)this.addMatchedPosition(e,t,o.MAP_WIDTH_1,t+1,o.MAP_WIDTH_1);return e.sort(((e,t)=>e.point<t.point?1:-1)),e}onClick(e){if("IDLE"!==this.state&&"SELECT"!==this.state)return;const t=o.base.canvas,a=Math.floor(e.offsetX*t.width/t.clientWidth/o.CELL_SIZE),s=Math.floor(e.offsetY*t.height/t.clientHeight/o.CELL_SIZE);if(!(a<0||a>=o.MAP_WIDTH||s<0||s>=o.MAP_WIDTH)){if(this.tSwap=0,!this.selected)return this.selected={x:a,y:s,value:o.base.map[s][a]},o.base.map[s][a]=-1,void(this.state="SELECT");if(Math.abs(a-this.selected.x)+Math.abs(s-this.selected.y)!==1){const{x:e,y:t,value:a}=this.selected;return o.base.map[t][e]=a,this.selected=null,void(this.state="IDLE")}this.swapped={x:a,y:s,value:o.base.map[s][a]},o.base.map[s][a]=-1}}render(){for(let e=0;e<o.MAP_WIDTH;e+=1)for(let t=0;t<o.MAP_WIDTH;t+=1){o.base.context.fillStyle=o.BOARD_COLORS[(e+t)%2];const a=t*o.CELL_SIZE,s=e*o.CELL_SIZE;o.base.context.fillRect(a,s,o.CELL_SIZE,o.CELL_SIZE),-1!==o.base.map[e][t]&&o.base.context.drawImage(o.mapTileInfo[o.base.map[e][t]].texture,a+o.TILE_OFFSET,s+o.TILE_OFFSET)}l[this.state].render(this)}update(){l[this.state].update(this)}}},555:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.combine=t.getKey=t.findBelow=t.initImages=t.check=t.generateMap=t.randomTile=t.random=t.getImageSrc=t.getKeys=t.getAppName=void 0;const o=a(876);t.getAppName=()=>o.APP_NAME,t.getKeys=Object.keys,t.getImageSrc=(e,t="png")=>`/static/images/${e}.${t}`,t.random=(e,t)=>Math.floor(Math.random()*(t-e))+e;let s=0;const l=Array.from({length:o.COUNT_TILES}).map(((e,t)=>{const a=o.mapTileInfo[t].probability;return s+=a,s}));t.randomTile=()=>{const e=(0,t.random)(0,s);for(let t=0;t<o.COUNT_TILES;t+=1)if(e<=l[t])return t;return-1},t.generateMap=()=>{const e=Array.from({length:o.MAP_WIDTH}).map((()=>Array.from({length:o.MAP_WIDTH}).map(t.randomTile))),a=(t,a,o,s)=>{const l=e[a][t];return l===o||s.includes(l)},s=(t,s)=>{let l=0,i=0;const n=e[s][t],p=o.mapTileInfo[n].compatible;let E=t+1;for(;E<o.MAP_WIDTH&&a(E,s,n,p);)l+=1,E+=1;if(l>=2)return!0;let r=s+1;for(;r<o.MAP_WIDTH&&a(t,r,n,p);)i+=1,r+=1;return i>=2};let l=!0;for(;l;){l=!1;for(let a=0;a<o.MAP_WIDTH;a+=1)for(let i=0;i<o.MAP_WIDTH;i+=1)s(i,a)&&(l=!0,e[a][i]=(0,t.randomTile)())}return e},t.check=(e,t,a)=>e===t||a.includes(e),t.initImages=async()=>{o.base.context.imageSmoothingEnabled=!1,await Promise.all((0,t.getKeys)(o.TILES).map((e=>((e,a)=>{const s=new Image;return s.src=(0,t.getImageSrc)(`tiles/${a}`),new Promise((t=>s.onload=()=>{const a=document.createElement("canvas");a.width=o.TILE_SIZE,a.height=o.TILE_SIZE;const l=a.getContext("2d");l.imageSmoothingEnabled=!1,l.drawImage(s,0,0,o.TILE_SIZE,o.TILE_SIZE);const i=new Image;i.src=a.toDataURL("image/png"),i.onload=()=>{o.mapTileInfo[e].texture=i,t(null)}}))})(o.TILES[e],e.toLowerCase())))),await Promise.all(o.EXPLOSION_KEYS.map((e=>((e,a)=>{const s=new Image;return s.src=(0,t.getImageSrc)(`explosions/${a}`),new Promise((t=>s.onload=()=>{o.mapTileInfo[e].explosions=[];for(let a=0;a<4;a+=1){const l=Math.floor(s.width/4*o.SCALE_RATIO),i=Math.floor(s.height*o.SCALE_RATIO),n=document.createElement("canvas");n.width=l,n.height=i;const p=n.getContext("2d");p.imageSmoothingEnabled=!1,p.drawImage(s,s.width/4*a,0,Math.floor(s.width/4),s.height,0,0,l,i);const E=new Image;E.src=n.toDataURL("image/png"),E.onload=()=>{o.mapTileInfo[e].explosions[a]=E,t(null)}}}))})(o.TILES[e],e.toLowerCase())))),o.mapTileInfo[o.TILES.SWORDRED].explosions=o.mapTileInfo[o.TILES.SWORD].explosions},t.findBelow=e=>e.reduce(((e,t)=>e<t.y?t.y:e),-1),t.getKey=(e,t)=>t*o.MAP_WIDTH+e,t.combine=e=>{const a=[],o={};return e.forEach((e=>{e.forEach((e=>{const{x:s,y:l}=e,i=(0,t.getKey)(s,l);o[i]||(o[i]=!0,a.push(e))}))})),a}}},t={};function a(o){var s=t[o];if(void 0!==s)return s.exports;var l=t[o]={exports:{}};return e[o](l,l.exports,a),l.exports}(()=>{const e=a(876),t=a(367),o=a(555),s=new t.Game,l=(e=0)=>{requestAnimationFrame(l),s.update(),s.render()};(async()=>{(()=>{const t=document.getElementById("canvas"),a=t.getContext("2d");t.width=t.height=e.SCREEN_SIZE,e.base.canvas=t,e.base.context=a})(),await(0,o.initImages)(),s.init(),document.addEventListener("click",(e=>{s.onClick(e)})),l()})()})()})();
//# sourceMappingURL=index.js.map